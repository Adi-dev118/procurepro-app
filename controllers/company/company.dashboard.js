const db = require('../../config/db');

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const [rows] = await db.query(
      `
        SELECT
          id,
          name,
          email,
          role
        FROM users
        WHERE id = ?
        `,
      [userId],
    );

    if (!rows.length) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }
    res.status(200).json({
      status: 'success',
      user: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to load user profile',
    });
  }
};

exports.companyStats = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const [rows] = await db.query(
      `
        SELECT
          /* =========================
             TOTAL SPEND
          ========================== */
          (
            SELECT IFNULL(
              SUM(total_amount),
              0
            )

            FROM orders

            WHERE user_id = ?

            AND status = 'delivered'

            AND MONTH(created_at)
              = MONTH(CURRENT_DATE())

            AND YEAR(created_at)
              = YEAR(CURRENT_DATE())
          ) AS totalSpend,

          /* =========================
             ACTIVE RFQS
          ========================== */

          (
            SELECT COUNT(*)

            FROM rfqs

            WHERE user_id = ?

            AND status = 'active'
          ) AS activeRFQs,

          /* =========================
             PENDING QUOTES
          ========================== */

          (
            SELECT COUNT(*)

            FROM rfq_quotes q

            JOIN rfqs r
              ON r.id = q.rfq_id

            WHERE r.user_id = ?

            AND q.status = 'submitted'
          ) AS pendingQuotes,

          /* =========================
             ACTIVE ORDERS
          ========================== */

          (
            SELECT COUNT(*)

            FROM orders

            WHERE user_id = ?

            AND status IN (
              'pending',
              'processing',
              'shipped'
            )
          ) AS activeOrders
        `,
      [userId, userId, userId, userId],
    );
    const stats = rows[0];
    res.status(200).json({
      status: 'success',
      stats: {
        totalSpend: Number(stats.totalSpend),
        activeRFQs: Number(stats.activeRFQs),
        pendingQuotes: Number(stats.pendingQuotes),
        activeOrders: Number(stats.activeOrders),
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
