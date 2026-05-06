const db = require('./../config/db');

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

