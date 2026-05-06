const db = require('./../config/db');

exports.getSuppliers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const status = req.query.status;

    const limit = 5;
    const offset = (page - 1) * limit;
    let query = `SELECT
  u.id AS userId,
  u.name,
  u.email,
  u.role,
  u.registration_date,
  s.id AS supplierId,
  s.verification_status AS status,
  s.business_name AS company,
  s.mobile_no AS contact,

  -- total products
  (
    SELECT COUNT(*)
    FROM products p
    WHERE p.supplier_id = s.id
  ) AS totalProducts,

  -- documents
  (
    SELECT GROUP_CONCAT(DISTINCT sd.document_type SEPARATOR ' | ')
    FROM supplier_documents sd
    WHERE sd.supplier_id = s.id
  ) AS documents,

  -- avg rating
  (
    SELECT IFNULL(ROUND(AVG(pr.rating), 1), 0)
    FROM products p
    LEFT JOIN product_reviews pr ON p.id = pr.product_id
    WHERE p.supplier_id = s.id
  ) AS avgRating,

  -- total reviews
  (
    SELECT COUNT(pr.id)
    FROM products p
    LEFT JOIN product_reviews pr ON p.id = pr.product_id
    WHERE p.supplier_id = s.id
  ) AS totalReviews

FROM users u
LEFT JOIN suppliers s ON u.id = s.user_id

WHERE u.role = 'supplier'`;
    let params = [];

    if (search) {
      query += ` AND s.business_name LIKE ?`;
      params.push(`%${search}%`);
    }

    // 🔥 Filters
    if (status) {
      query += ` AND s.verification_status = ?`;
      params.push(status);
    }
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [suppliers] = await db.query(query, params);

    // 🔥 COUNT QUERY (lightweight, no joins)
    let countQuery = `
      SELECT COUNT(*) as total
  FROM users u
  INNER JOIN suppliers s ON u.id = s.user_id
  WHERE u.role = 'supplier'`;

    let countParams = [];
    if (search) {
      countQuery += ` AND s.business_name LIKE ?`;
      countParams.push(`%${search}%`);
    }

    if (status) {
      countQuery += ` AND s.verification_status = ?`;
      countParams.push(status);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const totalSuppliers = countResult[0].total;

    const totalPages = Math.ceil(totalSuppliers / limit);
    res.status(200).json({
      suppliers,
      currentPage: page,
      totalPages,
      totalSuppliers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error',
    });
  }
};

exports.getSupplierManagement = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    let query = `SELECT 
      s.id,
      s.business_name AS company,
      s.mobile_no AS mobile,
      s.business_type AS type,
      s.description,
      DATE_FORMAT(s.created_at, '%e %M, %Y') AS date,
      s.verification_status AS status,
      u.email,
      s.commission_rate AS commission,

      sa.address,

      (SELECT COUNT(*) FROM products p WHERE p.supplier_id = s.id) AS products,

      (SELECT IFNULL(SUM(oi.quantity * oi.price_at_purchase), 0)
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE p.supplier_id = s.id) AS totalSales,

      (SELECT IFNULL(ROUND(AVG(pr.rating),1),0)
       FROM product_reviews pr
       JOIN products p ON p.id = pr.product_id
       WHERE p.supplier_id = s.id) AS avgRating,

      (SELECT COUNT(*)
       FROM product_reviews pr
       JOIN products p ON p.id = pr.product_id
       WHERE p.supplier_id = s.id) AS totalRatings

    FROM suppliers s
    LEFT JOIN users u ON u.id = s.user_id
    LEFT JOIN (
      SELECT supplier_id,
      CONCAT(address_line1, ', ', address_line2, ', ', city, ', ', state, ' - ', pincode, ', ', country) AS address
      FROM supplier_address
    ) sa ON sa.supplier_id = s.id

    WHERE u.role = 'supplier'`;

    let params = [];

    if (search) {
      query += ` AND s.business_name LIKE ?`;
      params.push(`%${search}%`);
    }

    if (status) {
      query += ` AND s.verification_status = ?`;
      params.push(status);
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [suppliers] = await db.query(query, params);

    // COUNT QUERY
    let countQuery = `SELECT COUNT(*) AS total
                      FROM suppliers s
                      LEFT JOIN users u ON u.id = s.user_id
                      WHERE u.role = 'supplier'`;

    let countParam = [];

    if (search) {
      countQuery += ` AND s.business_name LIKE ?`;
      countParam.push(`%${search}%`);
    }

    if (status) {
      countQuery += ` AND s.verification_status = ?`;
      countParam.push(status);
    }

    const [count] = await db.query(countQuery, countParam);

    const total = count[0].total;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      suppliers,
      currentPage: page,
      total,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error',
    });
  }
};

exports.getRecentOrdersRFQS = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const [ordersResult, rfqResult] = await Promise.all([
      db.query(
        `
    SELECT 
      o.id,
      o.created_at,
      o.status,
      p.name
    FROM orders o
    JOIN
    order_items oi
    ON o.id = oi.order_id
    JOIN products p
    ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.id DESC
    LIMIT ? OFFSET ?
  `,
        [userId, limit, offset],
      ),

      db.query(
        `
    SELECT 
      r.id,
      r.title,
      r.deadline,
      r.status,
      c.name AS category,
      COUNT(rq.id) AS bid
    FROM rfqs r
    JOIN categories c
    ON r.category_id = c.id
    JOIN rfq_quotes rq
    ON r.id = rq.rfq_id
    WHERE r.user_id = ?
    GROUP BY r.id, r.title, r.deadline,  r.status, c.name 
    ORDER BY r.id DESC
    LIMIT ? OFFSET ?
  `,
        [userId, limit, offset],
      ),
    ]);

    const orders = ordersResult[0];
    const rfqs = rfqResult[0];

    res.json({
      orders,
      rfqs,
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.getSupplierById = async (req, res) => {
  try {
    const supplierId = req.params.supplierId;

    // 🔹 1. BASIC INFO
    const [supplierRows] = await db.query(
      `SELECT s.id, s.business_name,  u.email, s.verification_status, s.business_type, 
      s.business_registration, s.description, s.mobile_no, u.name AS owner_name
       FROM suppliers s
       LEFT JOIN users u
       ON s.user_id = u.id
       WHERE s.id = ?`,
      [supplierId],
    );

    if (supplierRows.length === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    const supplier = supplierRows[0];

    // 🔹 2. ADDRESS
    const [addressRows] = await db.query(
      `SELECT *
       FROM supplier_address
       WHERE supplier_id = ?
       `,
      [supplierId],
    );

    const address = addressRows[0] || null;

    // 🔹 3. PRODUCTS
    const [products] = await db.query(
      `SELECT id, name, final_price, stock
       FROM products
       WHERE supplier_id = ?`,
      [supplierId],
    );

    // 🔹 4. ORDERS
    const [orders] = await db.query(
      `SELECT  DISTINCT o.id, SUM(oi.quantity * oi.price_at_purchase) AS amount, o.status, o.created_at
       FROM orders o
       LEFT JOIN order_items oi
       ON o.id = oi.order_id
       LEFT JOIN products p
       ON oi.product_id = p.id
       LEFT JOIN suppliers s
       ON p.supplier_id = s.id
       WHERE s.id = ?
       GROUP BY o.id
       ORDER BY created_at DESC`,
      [supplierId],
    );

    // 🔹 5. STATS
    const stats = {
      total_products: products.length,
      total_orders: orders.length,
      total_earnings: orders.reduce((sum, o) => sum + Number(o.amount), 0),
    };

    // 🔥 FINAL RESPONSE
    res.json({
      ...supplier,
      address,
      products,
      orders,
      stats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.suspendSupplier = async (req, res) => {
  try {
    const supplierId = req.params.supplierId;
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: 'Reason required' });
    }

    await db.query(
      `UPDATE suppliers 
       SET verification_status = 'suspended', suspend_reason = ?, suspended_at = NOW() 
       WHERE id = ?`,
      [reason || null, supplierId],
    );

    res.json({ message: 'Supplier suspended successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to suspend supplier' });
  }
};

exports.activateSupplier = async (req, res) => {
  try {
    const supplierId = req.params.supplierId;

    await db.query(
      `UPDATE suppliers 
       SET verification_status = 'approved', suspend_reason = NULL 
       WHERE id = ?`,
      [supplierId],
    );

    res.json({ message: 'Supplier activated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to activate supplier' });
  }
};

exports.approveSupplier = async (req, res) => {
  try {
    const supplierId = req.params.supplierId;

    await db.query(`UPDATE suppliers SET verification_status = 'approved' WHERE id = ?`, [
      supplierId,
    ]);

    res.json({ message: 'supplier approved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
