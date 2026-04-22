const db = require('./../config/db');

// company dashboard
// fetch company
exports.companyDashboard = async (req, res) => {
  try {
    const companyId = req.session.user.id;

    const [[[name]], [[stats]], [recentActivities], [recentRFQs]] = await Promise.all([
      // Company name
      db.query(
        `SELECT name 
         FROM users 
         WHERE id = ?`,
        [companyId],
      ),

      // Dashboard statistics
      db.query(
        `
        SELECT

        -- Total Spend
        (SELECT IFNULL(SUM(total_amount),0)
         FROM orders
         WHERE user_id = ?
         AND status='delivered'
         AND MONTH(created_at)=MONTH(CURRENT_DATE())
         AND YEAR(created_at)=YEAR(CURRENT_DATE())
        ) AS totalSpend,

        -- Active RFQs
        (SELECT COUNT(*)
         FROM rfqs
         WHERE user_id = ?
         AND status='active'
        ) AS activeRFQs,

        -- Pending Quotes
        (SELECT COUNT(*)
         FROM rfq_quotes q
         JOIN rfqs r ON r.id = q.rfq_id
         WHERE r.user_id = ?
         AND q.status = 'submitted'
        ) AS pendingQuotes,

        -- Active Orders
        (SELECT COUNT(*)
         FROM orders
         WHERE user_id = ?
         AND status IN ('pending','processing','shipped')
        ) AS activeOrders;
        `,
        [companyId, companyId, companyId, companyId],
      ),

      // Recent activity
      db.query(
        `
        SELECT 
          'orders' AS type,
          o.id,
          CONCAT('Order #ORD-',LPAD(o.id,4,'0'),' for ',p.name) AS message,
          o.created_at
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        JOIN products p ON p.id = oi.product_id
        WHERE o.user_id = ?

        UNION ALL

        SELECT 
          'rfqs' AS type,
          r.id,
          CONCAT('RFQ #RFQ-',LPAD(r.id,3,'0'),' created') AS message,
          r.created_at
        FROM rfqs r
        WHERE r.user_id = ?

        UNION ALL

        SELECT 
          'rfq_quotes' AS type,
          q.id,
          CONCAT('New quote from ',s.business_name) AS message,
          q.created_at
        FROM rfq_quotes q
        JOIN suppliers s ON s.id = q.supplier_id
        JOIN rfqs r ON r.id = q.rfq_id
        WHERE r.user_id = ?

        ORDER BY created_at DESC
        LIMIT 5
        `,
        [companyId, companyId, companyId],
      ),

      // Recent RFQs
      db.query(
        `
        SELECT 
          r.id,
          r.title,
          c.name AS category,
          DATE_FORMAT(r.deadline,'%Y-%m-%d') AS deadline,
          COUNT(q.id) AS bids,
          r.status
        FROM rfqs r
        LEFT JOIN rfq_quotes q ON q.rfq_id = r.id
        LEFT JOIN categories c ON c.id = r.category_id
        WHERE r.user_id = ?
        GROUP BY r.id
        ORDER BY r.created_at DESC
        LIMIT 5
        `,
        [companyId],
      ),
    ]);
    // TODO: Fix Quicklinks
    res.render('company/dashboard', {
      name,
      stats,
      recentActivities,
      recentRFQs,
    });
  } catch (error) {
    console.error('Company dashboard error:', error);
    res.status(500).send('Server Error');
  }
};

// marketplace dashboard
// products purchase
exports.marketplaceDashboard = async (req, res) => {
  try {
    const companyId = 3;

    const [[[name]], [products]] = await Promise.all([
      // user name
      db.query(`SELECT name FROM users WHERE id = ?`, [companyId]),

      // fetch products
      db.query(`SELECT 
p.id,
p.name,
p.description,
p.price,
p.moq,
p.stock,
p.icon,
c.name AS category,
s.business_name AS supplier,
MAX(sa.state) AS state,
MAX(sa.country) AS country,
ROUND(AVG(pr.rating),1) AS rating,
COUNT(DISTINCT pr.id) AS reviews
FROM products p
JOIN categories c ON c.id = p.category_id
JOIN suppliers s ON s.id = p.supplier_id
LEFT JOIN supplier_address sa ON s.id = sa.supplier_id
LEFT JOIN product_reviews pr ON pr.product_id = p.id
WHERE p.verification_status = 'approved'
GROUP BY p.id
ORDER BY p.created_at DESC
LIMIT 12;`),
    ]);
    // TODO: Add pagination for product listings
    // TODO: Add category and price filters
    res.render('company/marketplace', {
      name,
      products,
    });
  } catch (error) {
    console.error('Company marketplace error:', error);
    res.status(500).send('Server Error');
  }
};
// Company Orders Dashboard
// Fetch user order statistics and recent order history
exports.ordersDashboard = async (req, res) => {
  try {
const companyId = req.session.user.id;
    const [[[name]], [[orderStats]], [orderHistory]] = await Promise.all([
      //company user name
      db.query(`SELECT name FROM users WHERE id = ?`, [companyId]),
      // fetch order stats- (total , pending, shipped, completed orders)
      db.query(
        `SELECT 
COUNT(*) AS totalOrders,

SUM(CASE 
    WHEN status = 'pending' THEN 1 
    ELSE 0 
END) AS pendingOrders,

SUM(CASE 
   WHEN status IN ('processing','shipped') = 'shipped' THEN 1 
    ELSE 0 
END) AS inTransitOrders,

SUM(CASE 
    WHEN status = 'delivered' THEN 1 
    ELSE 0 
END) AS completedOrders

FROM orders
WHERE user_id = ?`,
        [companyId],
      ),
      // order history
      db.query(
        `SELECT 
o.id,

ANY_VALUE(o.created_at) AS created_at,
ANY_VALUE(o.total_amount) AS total_amount,
ANY_VALUE(o.status) AS status,
ANY_VALUE(o.payment_status) AS payment_status,

ANY_VALUE(s.business_name) AS supplier,

ROUND(AVG(pr.rating),1) AS rating,

GROUP_CONCAT(
DISTINCT CONCAT(p.name,' (',oi.quantity,' units)')
SEPARATOR ', '
) AS items,
ANY_VALUE(r.id) AS rfq_id

FROM orders o

JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
JOIN suppliers s ON s.id = p.supplier_id

LEFT JOIN product_reviews pr ON pr.product_id = p.id
LEFT JOIN rfqs r ON r.id = o.rfq_id

WHERE o.user_id = ?

GROUP BY o.id
ORDER BY created_at DESC
LIMIT 10`,
        [companyId],
      ),
    ]);
    // TODO: add order tracking
    // TODO: add invoice details
    res.render('company/orders', {
      name,
      orderStats,
      orderHistory,
    });
  } catch (error) {
    console.error('Company orderdashboard error:', error);
    res.status(500).send('Server Error');
  }
};


// company rfqs dashboard
// rfq stats - active, pending, closed, new 

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
}