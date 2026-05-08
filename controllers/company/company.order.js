const db = require('../../config/db');

exports.getOrderStats = async (req, res) => {
  try {
    const companyId = req.session.user.id;

    const [rows] = await db.query(
      `
        SELECT 

          COUNT(*) AS totalOrders,

          SUM(
            CASE
              WHEN status = 'pending'
              THEN 1
              ELSE 0
            END
          ) AS pendingOrders,

          SUM(
            CASE
              WHEN status IN (
                'processing',
                'shipped'
              )
              THEN 1
              ELSE 0
            END
          ) AS inTransitOrders,

          SUM(
            CASE
              WHEN status = 'delivered'
              THEN 1
              ELSE 0
            END
          ) AS completedOrders

        FROM orders

        WHERE user_id = ?
        `,
      [companyId],
    );

    const stats = rows[0];

    res.status(200).json({
      status: 'success',

      stats: {
        totalOrders: Number(stats.totalOrders),

        pendingOrders: Number(stats.pendingOrders),

        inTransitOrders: Number(stats.inTransitOrders),

        completedOrders: Number(stats.completedOrders),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'fail',

      message: 'Failed to load order stats',
    });
  }
};
exports.getOrders = async (req, res) => {
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
