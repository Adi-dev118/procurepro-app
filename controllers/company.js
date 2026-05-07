const db = require('./../config/db');

exports.rfqsDashboard = async (req, res) => {
  try {
    const companyId = req.session.user.id;
    const [[[name]], [currentRFQs], [specifications], [quotes], [rfqStats]] = await Promise.all([
      // Company user name
      db.query(`SELECT name FROM users WHERE id = ?`, [companyId]),

      // Current RFQs
      db.query(
        `
        SELECT 
          r.id,
          r.title,
          r.deadline,
          r.quantity,
          r.description,
          r.status,
          COUNT(DISTINCT i.supplier_id) AS suppliers_invited,
          COUNT(DISTINCT q.id) AS bids_received
        FROM rfqs r
        LEFT JOIN rfq_invitations i ON r.id = i.rfq_id
        LEFT JOIN rfq_quotes q ON r.id = q.rfq_id
        WHERE r.user_id = ?
        GROUP BY r.id
      `,
        [companyId],
      ),

      // Specifications for this company's RFQs only
      db.query(
        `
        SELECT rfq_id, spec_name, spec_value
        FROM rfq_specifications
        WHERE rfq_id IN (
          SELECT id FROM rfqs WHERE user_id = ?
        )
      `,
        [companyId],
      ),

      // Quotes only for this company's RFQs
      db.query(
        `
        SELECT 
          q.rfq_id,
          q.id AS quote_id,
          q.price,
          q.delivery_days,
          q.warranty,
          q.payment_terms,
          q.message,
          q.status,

          s.id AS supplier_id,
          s.business_name AS company,

          ROUND(AVG(pr.rating),2) AS rating,
          COUNT(pr.id) AS review_count,

          MAX(o.id) AS order_id

        FROM rfq_quotes q
        JOIN suppliers s ON q.supplier_id = s.id

        LEFT JOIN products p ON p.supplier_id = s.id
        LEFT JOIN product_reviews pr ON pr.product_id = p.id

        LEFT JOIN orders o 
        ON o.rfq_id = q.rfq_id 
        AND q.status = 'won'

        WHERE q.rfq_id IN (
          SELECT id FROM rfqs WHERE user_id = ?
        )

        GROUP BY q.id
      `,
        [companyId],
      ),

      // RFQ stats
      db.query(
        `
        SELECT 
          r.id,

          CASE
            WHEN r.status = 'closed' THEN 'closed'
            WHEN r.deadline < CURDATE() AND r.status = 'expired' THEN 'pending'
            ELSE 'active'
          END AS rfq_stage,

          COUNT(DISTINCT i.supplier_id) AS suppliers_invited,
          COUNT(DISTINCT q.id) AS bids_received

        FROM rfqs r
        LEFT JOIN rfq_invitations i ON r.id = i.rfq_id
        LEFT JOIN rfq_quotes q ON r.id = q.rfq_id

        WHERE r.user_id = ?

        GROUP BY r.id
        ORDER BY r.deadline ASC
      `,
        [companyId],
      ),
    ]);
    // specification mapping
    const specMap = {};
    specifications.forEach((spec) => {
      if (!specMap[spec.rfq_id]) specMap[spec.rfq_id] = [];
      specMap[spec.rfq_id].push(spec);
    });

    currentRFQs.forEach((rfq) => {
      rfq.specifications = specMap[rfq.id] || [];
    });
    // quotes mapping
    const quoteMap = {};
    quotes.forEach((q) => {
      if (!quoteMap[q.rfq_id]) quoteMap[q.rfq_id] = [];
      quoteMap[q.rfq_id].push(q);
    });

    currentRFQs.forEach((rfq) => {
      rfq.quotes = quoteMap[rfq.id] || [];
    });
    // rfqs status checking
    const activeRFQs = rfqStats.filter((r) => r.rfq_stage === 'active');
    const pendingRFQs = rfqStats.filter((r) => r.rfq_stage === 'pending');
    const closedRFQs = rfqStats.filter((r) => r.rfq_stage === 'closed');

    res.render('company/rfq', {
      name,
      currentRFQs,
      activeRFQs,
      pendingRFQs,
      closedRFQs,
    });

    //TODO: add rfqs stats at the end dynamically
    //TODO: make active, pending and draft tabs work
  } catch (error) {
    console.error('RFQ dashboard error:', error);
    res.status(500).send('Server Error');
  }
};

exports.profileDashboard = async (req, res) => {
  res.render('company/profile');
};
