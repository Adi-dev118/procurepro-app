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
