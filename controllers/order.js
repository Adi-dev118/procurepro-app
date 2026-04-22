const db = require('./../config/db');
exports.newOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const userId = req.params.id;
    const [row] = await connection.query(`SELECT id FROM carts WHERE user_id = ? `, [userId]);

    const [result] = await db.query(`SELECT role FROM users WHERE id = ?`, [userId]);
    if (result.length === 0) {
      await connection.rollback();
      return res.status(500).json({
        status: 'Failed',
        message: "The user doesn't exist",
      });
    }
    const user = result[0];

    if (user.role !== 'customer') {
      await connection.rollback();
      return res.status(500).json({
        status: 'Failed',
        message: 'Only customers can order',
      });
    }

    if (row.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        status: 'Failed',
        message: 'The cart is empty',
      });
    }
    const cartId = row[0].id;

    const [cartItems] = await connection.query(
      `SELECT product_id, quantity, price FROM cart_items WHERE cart_id = ?`,
      [cartId],
    );
    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        status: 'Failed',
        message: 'The cart is empty',
      });
    }
    // console.log(cartItems)
    const productIds = cartItems.map((el) => el.product_id);

    const [check] = await connection.query(`SELECT id, stock, name FROM products WHERE id IN (?)`, [
      productIds,
    ]);

    if (check.length !== cartItems.length) {
      throw new Error('Some Products no Longer Exits');
    }

    const nameMap = new Map(check.map((p) => [p.id, p.name]));

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = cartItems.map((items) => {
      const name = nameMap.get(items.product_id);
      const qty = items.quantity;
      const o = {
        item: name,
        quantity: qty,
      };
      return o;
    });

    const [next] = await connection.query(
      `INSERT INTO orders (user_id, total_amount, created_at) VALUES (?, ?, ?)`,
      [userId, totalPrice, new Date()],
    );

    const orderId = next.insertId;
    const values = cartItems.map((items) => [
      orderId,
      items.product_id,
      items.quantity,
      items.price,
      items.price * items.quantity,
    ]);

    await connection.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, subtotal) VALUES ?`,
      [values],
    );

    for (const items of cartItems) {
      const [result] = await connection.query(
        `UPDATE products SET stock= stock - ? WHERE id = ? AND stock >= ?`,
        [items.quantity, items.product_id, items.quantity],
      );
      if (result.affectedRows === 0) {
        throw new Error('Stock Insufficient');
      }
    }

    await connection.query(`DELETE from cart_items WHERE cart_id =? `, [cartId]);

    await connection.commit();

    res.status(201).json({
      status: 'Success',
      message: 'The order was Successfully Placed',
      data: {
        order,
        totalPrice,
      },
    });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({
      status: 'Failed',
      message: error.message,
    });
  } finally {
    connection.release();
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const userId = req.params.id;

    const [orders] = await db.query(
      `SELECT o.id AS OrderID, o.total_amount AS total, JSON_ARRAYAGG(
    JSON_OBJECT(
    'name', p.name,
    'quantity', oi.quantity,
    'price', oi.price_at_purchase,
    'subtotal', oi.subtotal)) AS items FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN products p ON p.id = oi.product_id WHERE user_id =? GROUP BY o.id, o.total_amount`,
      [userId],
    );

    orders.forEach((order) => {
      if (typeof order.items === 'string') {
        order.items = JSON.parse(order.items);
      }
    });
    if (orders.length === 0) {
      throw new Error('The user has not placed any update');
    }
    res.status(200).json({
      status: 'Success',
      data: {
        orders,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message,
    });
  }
};

exports.getOrderManagement = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const status = req.query.status;
    const payment = req.query.payment;
    const dateRange = req.query.dateRange;

    function applyDateFilter(q) {
      if (dateRange === 'today') return q + ` AND DATE(o.created_at) = CURDATE()`;
      if (dateRange === '7days') return q + ` AND o.created_at >= NOW() - INTERVAL 7 DAY`;
      if (dateRange === '30days') return q + ` AND o.created_at >= NOW() - INTERVAL 30 DAY`;
      if (dateRange === 'month')
        return (
          q + ` AND MONTH(o.created_at) = MONTH(CURDATE()) AND YEAR(o.created_at) = YEAR(CURDATE())`
        );
      return q;
    }

    let query = `
SELECT 
  o.id,
  CONCAT('#ORD-', o.id) AS orderId,

  u.name AS customer,
  u.email,

  DATE_FORMAT(o.created_at, '%Y-%m-%d') AS date,
  DATE_FORMAT(o.created_at, '%h:%i %p') AS time,

  o.status,
  o.payment_status,

  CASE 
    WHEN o.rfq_id IS NOT NULL THEN 'RFQ'
    ELSE 'Direct'
  END AS orderType,

  COALESCE(SUM(oi.quantity), 0) AS items,

  o.total_amount AS total

FROM orders o
LEFT JOIN users u ON u.id = o.user_id
LEFT JOIN order_items oi ON oi.order_id = o.id

WHERE 1=1
`;
    // Add this test case
    let params = [];

    // 🔍 Search (by order id or customer name)
    if (search) {
      query += ` AND (o.id LIKE ? OR u.name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    // 📦 Order Status Filter
    if (status) {
      query += ` AND o.status = ?`;
      params.push(status);
    }

    // 💳 Payment Status Filter
    if (payment) {
      query += ` AND o.payment_status = ?`;
      params.push(payment);
    }
    // Date
    applyDateFilter(query);
    query += ` GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [orders] = await db.query(query, params);

    // ================= COUNT QUERY =================
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      WHERE 1=1
    `;

    let countParams = [];

    if (search) {
      countQuery += ` AND (o.id LIKE ? OR u.name LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      countQuery += ` AND o.status = ?`;
      countParams.push(status);
    }

    if (payment) {
      countQuery += ` AND o.payment_status = ?`;
      countParams.push(payment);
    }

    applyDateFilter(countQuery);
    const [countResult] = await db.query(countQuery, countParams);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      orders,
      currentPage: page,
      total,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
    });
  }
};

exports.getVendorOrderManagement = async (req, res) => {
  try {
    const vendorId = req.session.user.vendorId;
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const dateRange = req.query.dateRange;

    function applyDateFilter(q) {
      if (dateRange === 'today') return q + ` AND DATE(o.created_at) = CURDATE()`;
      if (dateRange === '7days') return q + ` AND o.created_at >= NOW() - INTERVAL 7 DAY`;
      if (dateRange === '30days') return q + ` AND o.created_at >= NOW() - INTERVAL 30 DAY`;
      if (dateRange === 'month') {
        return (
          q + ` AND MONTH(o.created_at) = MONTH(CURDATE()) AND YEAR(o.created_at) = YEAR(CURDATE())`
        );
      }
      return q;
    }
    let query = `
  SELECT 
    o.id,
    u.name,
    u.email,
    o.created_at AS date,
    COUNT(DISTINCT oi.id) AS items,
    o.total_amount AS total,
    o.status
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  JOIN products p ON p.id = oi.product_id
  JOIN users u ON o.user_id = u.id
  WHERE p.supplier_id = ?
`;

    let params = [vendorId];

    // 🔍 Search
    if (search) {
      query += ` AND (o.id LIKE ? OR u.name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    // 📦 Status
    if (status) {
      query += ` AND o.status = ?`;
      params.push(status);
    }

    // 📅 Date filter
    query = applyDateFilter(query);

    // FINAL
    query += `
  GROUP BY o.id
  ORDER BY o.created_at DESC
  LIMIT ? OFFSET ?
`;

    params.push(limit, offset);
    const [orders] = await db.query(query, params);

    // ================= COUNT QUERY =================
    let countQuery = `
  SELECT COUNT(DISTINCT o.id) AS total
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  JOIN products p ON p.id = oi.product_id
  JOIN users u ON o.user_id = u.id
  WHERE p.supplier_id = ?
`;

    let countParams = [vendorId];

    if (search) {
      countQuery += ` AND (o.id LIKE ? OR u.name LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      countQuery += ` AND o.status = ?`;
      countParams.push(status);
    }

    countQuery = applyDateFilter(countQuery);
    const [countResult] = await db.query(countQuery, countParams);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      orders,
      currentPage: page,
      total,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
    });
  }
};


exports.getCompanyOrders = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const userId = req.session.user.id;

    const status = req.query.status;
    const payment = req.query.payment;

    let where = `WHERE o.user_id = ?`;
    let params = [userId];

    if (search) {
      where += ` AND (o.id LIKE ? OR s.business_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      where += ` AND o.status = ?`;
      params.push(status);
    }

    if (payment) {
      where += ` AND o.payment_status = ?`;
      params.push(payment);
    }

    // 🔥 MAIN QUERY
    const query = `
      SELECT 
        o.id,
        o.status,
        o.payment_status,
        o.total_amount,
        o.created_at,

        -- 👇 supplier (from products)
        MAX(s.business_name) AS supplier,

        -- 👇 ratings
        ROUND(COALESCE(AVG(pr.rating),0),1) AS rating,

        -- 👇 items summary (IMPORTANT)
        GROUP_CONCAT(
          DISTINCT CONCAT(p.name, ' (', oi.quantity, ' units)')
          SEPARATOR ', '
        ) AS items

      FROM orders o

      JOIN order_items oi ON oi.order_id = o.id
      JOIN products p ON p.id = oi.product_id
      JOIN suppliers s ON s.id = p.supplier_id

      LEFT JOIN product_reviews pr ON pr.product_id IN (
  SELECT id FROM products WHERE supplier_id = s.id
)
      ${where}

      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [orders] = await db.query(query, [...params, limit, offset]);

    // 🔥 COUNT QUERY (IMPORTANT: DISTINCT)
    const countQuery = `
      SELECT COUNT(DISTINCT o.id) as total
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      JOIN products p ON p.id = oi.product_id
      JOIN suppliers s ON s.id = p.supplier_id
      ${where}
    `;

    const [[{ total }]] = await db.query(countQuery, params);

    res.json({
      orders,
      totalOrders: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
