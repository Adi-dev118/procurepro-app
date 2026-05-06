const db = require('./../../config/db');

exports.getOrders = async (req, res) => {
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


exports.getOrderProducts = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const query = `
      SELECT 
        p.id,
        p.name AS product_name,
        c.name AS category_name,
        oi.quantity,
        oi.price_at_purchase AS price,
        oi.subtotal,
        s.business_name,
        o.status,
        o.total_amount,
        o.created_at,
        o.payment_status
      FROM orders o

      LEFT JOIN order_items oi
        ON o.id = oi.order_id

      LEFT JOIN products p
        ON oi.product_id = p.id

      LEFT JOIN categories c
        ON p.category_id = c.id

      LEFT JOIN suppliers s
        ON p.supplier_id = s.id

      WHERE o.id = ?

      ORDER BY p.id ASC
    `;

    const [orderProducts] = await db.query(query, [orderId]);

    res.status(200).json({
      orderProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error',
    });
  }
};
