const db = require('./../../config/db');

exports.getProfile = async (req, res) => {
  const vendorId = req.session.user.vendorId;

  const [result] = await db.query(
    `SELECT s.business_name AS name, 
                s.verification_status AS status, 
                u.email  
         FROM suppliers s 
         LEFT JOIN users u 
         ON s.user_id = u.id
         WHERE s.id = ?`,
    [vendorId],
  );
  const profile = result[0];
  res.json({
    profile,
  });
};

exports.vendorStats = async (req, res) => {
  try {
    const vendorId = req.session.user.vendorId;

    const [rows] = await db.query(
      `
      SELECT

        /* =========================
           ORDER STATS
        ========================== */

        COUNT(DISTINCT o.id) AS totalOrders,

        COUNT(DISTINCT o.user_id) AS totalCustomers,

        IFNULL(SUM(oi.subtotal), 0) AS totalEarned,

        /* =========================
           PRODUCT STATS
        ========================== */

        (
          SELECT COUNT(*)
          FROM products
          WHERE supplier_id = ?
          AND verification_status = 'approved'
        ) AS totalProducts,

        /* =========================
           REVIEW STATS
        ========================== */

        (
          SELECT ROUND(AVG(pr.rating), 1)
          FROM products p2

          LEFT JOIN product_reviews pr
            ON p2.id = pr.product_id

          WHERE p2.supplier_id = ?
        ) AS avgRating,

        (
          SELECT COUNT(pr.id)
          FROM products p3

          LEFT JOIN product_reviews pr
            ON p3.id = pr.product_id

          WHERE p3.supplier_id = ?
        ) AS totalReviews,

        /* =========================
           PENDING PAYOUT
        ========================== */

        (
          SELECT IFNULL(SUM(oi2.subtotal), 0)

          FROM orders o2

          JOIN order_items oi2
            ON oi2.order_id = o2.id

          JOIN products p4
            ON p4.id = oi2.product_id

          WHERE p4.supplier_id = ?
          AND o2.status = 'processing'
        ) AS pendingPayout

      FROM orders o

      JOIN order_items oi
        ON oi.order_id = o.id

      JOIN products p
        ON p.id = oi.product_id

      WHERE p.supplier_id = ?
      AND o.status = 'delivered'
      `,
      [vendorId, vendorId, vendorId, vendorId, vendorId],
    );

    const stats = rows[0];

    res.status(200).json({
      status: 'success',

      stats: {
        totalOrders: Number(stats.totalOrders),

        totalCustomers: Number(stats.totalCustomers),

        totalEarned: Number(stats.totalEarned),

        totalProducts: Number(stats.totalProducts),

        avgRating: Number(stats.avgRating || 0),

        totalReviews: Number(stats.totalReviews),

        pendingPayout: Number(stats.pendingPayout),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'fail',
      message: 'Failed to load dashboard stats',
    });
  }
};

exports.getRecentOrders = async (req, res) => {
  try {
    const vendorId = req.session.user.vendorId;

    const [orders] = await db.query(
      `
        SELECT

          o.id,

          u.name AS customer,

          DATE_FORMAT(
            o.created_at,
            '%Y-%m-%d'
          ) AS date,

          SUM(oi.subtotal) AS amount,

          o.status

        FROM orders o

        JOIN users u
          ON o.user_id = u.id

        JOIN order_items oi
          ON oi.order_id = o.id

        JOIN products p
          ON oi.product_id = p.id

        WHERE p.supplier_id = ?

        GROUP BY o.id

        ORDER BY o.created_at DESC

        LIMIT 5
        `,
      [vendorId],
    );

    res.status(200).json({
      status: 'success',

      results: orders.length,

      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to load recent activities',
    });
  }
};

exports.getRatingAndStatus = async (req, res) => {
  try {
    const vendorId = req.session.user.vendorId;

    const [rows] = await db.query(
      `
      SELECT
        s.verification_status AS status,
        ROUND(AVG(pr.rating), 1) AS avgRating,
        COUNT(pr.id) AS totalReviews

      FROM suppliers s

      LEFT JOIN products p
        ON s.id = p.supplier_id

      LEFT JOIN product_reviews pr
        ON p.id = pr.product_id

      WHERE s.id = ?

      GROUP BY s.id
      `,
      [vendorId],
    );

    res.status(200).json({
      status: 'success',
      data: rows[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong',
    });
  }
};
