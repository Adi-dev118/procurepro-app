// Admin Dashboard
const db = require('./../../config/db');

// helper functions
const formatDate = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

exports.adminStats = async (req, res) => {
  try {
    const [[[orderStats]], [[platformStats]], [[rfqStats]]] = await Promise.all([
      // =========================
      // 🟢 ORDER + BUSINESS STATS
      // =========================
      db.query(`
        SELECT 
          COUNT(*) AS totalOrders,

          SUM(CASE WHEN status='delivered' THEN total_amount ELSE 0 END) AS totalRevenue,

          SUM(CASE WHEN status='delivered' THEN commission ELSE 0 END) AS totalCommission,

          SUM(CASE WHEN status='processing' THEN 1 ELSE 0 END) AS pendingShipments,

          SUM(CASE WHEN status='delivered' THEN 1 ELSE 0 END) AS deliveredOrders
        FROM orders
      `),

      // =========================
      // 🟠 PLATFORM STATS
      // =========================
      db.query(`
        SELECT
          (SELECT COUNT(*) FROM users) AS totalUsers,
          (SELECT COUNT(*) FROM suppliers) AS totalSuppliers,

          (SELECT COUNT(*) 
           FROM disputes 
           WHERE status = 'open') AS pendingDisputes,

          (SELECT COUNT(*) 
           FROM disputes 
           WHERE status = 'closed') AS resolvedDisputes,

          (SELECT COUNT(*) FROM disputes) AS totalDisputes
      `),

      // =========================
      // 🟣 RFQ STATS
      // =========================
      db.query(`
        SELECT
          (SELECT COUNT(*) FROM rfqs) AS totalRfqs,

          (SELECT COUNT(*) 
           FROM rfqs 
           WHERE status = 'active') AS activeRfqs,

          (SELECT COUNT(*) FROM rfq_quotes) AS totalQuotes,

          (SELECT COUNT(*) 
           FROM orders 
           WHERE rfq_id IS NOT NULL) AS convertedRfqs,

          (SELECT AVG(q_count) FROM (
            SELECT COUNT(*) AS q_count
            FROM rfq_quotes
            GROUP BY rfq_id
          ) t) AS avgQuotesPerRfq,

          (SELECT AVG(TIMESTAMPDIFF(HOUR, r.created_at, q.created_at))
           FROM rfqs r
           JOIN rfq_quotes q ON r.id = q.rfq_id
          ) AS avgResponseTime
      `),
    ]);

    // =========================
    // 🧠 DERIVED METRICS
    // =========================

    const avgOrderValue =
      orderStats.totalOrders > 0 ? orderStats.totalRevenue / orderStats.totalOrders : 0;

    const completionRate =
      orderStats.totalOrders > 0 ? (orderStats.deliveredOrders / orderStats.totalOrders) * 100 : 0;

    const disputeResolutionRate =
      platformStats.totalDisputes > 0
        ? (platformStats.resolvedDisputes / platformStats.totalDisputes) * 100
        : 0;

    const conversionRate =
      rfqStats.totalRfqs > 0 ? (rfqStats.convertedRfqs / rfqStats.totalRfqs) * 100 : 0;

    // =========================
    // 📦 FINAL RESPONSE
    // =========================

    res.json({
      business: {
        totalRevenue: Number(orderStats.totalRevenue || 0),
        totalOrders: orderStats.totalOrders,
        totalUsers: platformStats.totalUsers,
        totalSuppliers: platformStats.totalSuppliers,
        avgOrderValue: Number(avgOrderValue.toFixed(2)),
        completionRate: Number(completionRate.toFixed(1)),
      },

      operations: {
        totalCommission: Number(orderStats.totalCommission || 0),
        pendingDisputes: platformStats.pendingDisputes,
        pendingShipments: orderStats.pendingShipments,
        avgDeliveryTime: Number(orderStats.avgDeliveryTime || 0),
        disputeResolutionRate: Number(disputeResolutionRate.toFixed(1)),
      },

      rfq: {
        totalRfqs: rfqStats.totalRfqs,
        activeRfqs: rfqStats.activeRfqs,
        totalQuotes: rfqStats.totalQuotes,
        conversionRate: Number(conversionRate.toFixed(1)),
        avgQuotesPerRfq: Number(rfqStats.avgQuotesPerRfq || 0),
        avgResponseTime: Number(rfqStats.avgResponseTime || 0),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.userStats = async (req, res) => {
  try {
    const [[userStats]] = await db.query(`SELECT
(SELECT COUNT(*) FROM users) AS totalUsers,

(SELECT COUNT(*) 
FROM users 
WHERE role='customer') AS totalBuyers,

(SELECT COUNT(*) 
FROM users
WHERE status='pending') AS pendingUsers,

(SELECT COUNT(*) 
FROM suppliers 
WHERE verification_status='approved') AS activeSuppliers,

(SELECT COUNT(*) 
FROM suppliers 
WHERE verification_status='pending') AS pendingSuppliers;`);

    res.json({
      stats: userStats,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Fetch supplier statistics

exports.vendorStats = async (req, res) => {
  try {
    const [[stats]] = await db.query(`
        SELECT 

COUNT(*) AS suppliers,

SUM(CASE WHEN verification_status='approved' THEN 1 ELSE 0 END) AS activeSuppliers,

SUM(CASE WHEN verification_status='pending' THEN 1 ELSE 0 END) AS pendingSuppliers,

(
SELECT ROUND(AVG(supplierRating),1)
FROM (
    SELECT AVG(pr.rating) AS supplierRating
    FROM suppliers s
    JOIN products p ON p.supplier_id = s.id
    JOIN product_reviews pr ON pr.product_id = p.id
    GROUP BY s.id
) ratings
) AS avgSupplierRating

FROM suppliers;
      `);

    // TODO: Implement dynamic rendering for flagged/inappropriate product listings

    res.json({
      stats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Product Dashboard
// Fetch product statistics, recent product listings, and product categories
exports.productStats = async (req, res) => {
  try {
    const [[[stats]], [categories]] = await Promise.all([
      // products statistics- total products, active, inactive listing, avg price
      db.query(`
        SELECT
        COUNT(*) AS totalProducts,

        SUM(CASE WHEN verification_status='approved' THEN 1 ELSE 0 END) AS approved,

        SUM(CASE WHEN verification_status IN ('pending','rejected') THEN 1 ELSE 0 END) AS inactive,

        ROUND(AVG(price),2) AS avgPrice

        FROM products
      `),
      db.query(`
        SELECT 
        c.id,
        c.name,
        c.description,
        c.status,
        COUNT(p.id) AS totalProducts

        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id

        GROUP BY c.id
        LIMIT 3
      `),
    ]);
    //TODO:- Add recent product complains dynamically
    res.json({
      products: stats.totalProducts,
      approved: stats.approved,
      inactive: stats.inactive,
      avgPrice: stats.avgPrice,
      categories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Order dashboard
// Fetch order statistics- total, pending, processing and delivered

exports.orderStats = async (req, res) => {
  try {
    const [[[stats]], [ordersActivity]] = await Promise.all([
      // order statistics- total, pending, processing and delivered
      db.query(`
        SELECT
        COUNT(*) AS totalOrders,

        SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) AS pendingOrders,

        SUM(CASE WHEN status='processing' THEN 1 ELSE 0 END) AS processingOrders,

        SUM(CASE WHEN status='delivered' THEN 1 ELSE 0 END) AS completedOrders

        FROM orders
      `),
      // recent order activity
      db.query(`
        SELECT 
        o.id,
        u.name,
        o.status,
        o.payment_status AS paymentStatus,
        o.created_at AS date
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 3
      `),
    ]);

    // decoding order status
    const newOrder = ordersActivity.find(
      (o) => o.status === 'pending' || o.status === 'processing',
    );
    const completedOrder = ordersActivity.find((o) => o.status === 'delivered');
    const paymentPending = ordersActivity.find((o) => o.paymentStatus === 'pending');
    const activities = [];

    if (newOrder) {
      activities.push({
        title: 'New Order',
        icon: 'bi-cart-plus',
        color: 'primary',
        message: `Order #ORD-${String(newOrder.id).padStart(4, '0')} placed by ${newOrder.name}`,
        date: formatDate(newOrder.date),
      });
    }

    if (completedOrder) {
      activities.push({
        title: 'Order Completed',
        icon: 'bi-check-circle',
        color: 'success',
        message: `Order #ORD-${String(completedOrder.id).padStart(4, '0')} marked as delivered`,
        date: formatDate(completedOrder.date),
      });
    }

    if (paymentPending) {
      activities.push({
        title: 'Payment Pending',
        icon: 'bi-clock-history',
        color: 'warning',
        message: `Order #ORD-${String(paymentPending.id).padStart(4, '0')} awaiting payment`,
        date: formatDate(paymentPending.date),
      });
    }
    // TODO: Implement order search functionality
    // TODO: Add activity block for cancelled or refunded orders
    res.json({
      totalOrders: stats.totalOrders,
      pendingOrders: stats.pendingOrders,
      processingOrders: stats.processingOrders,
      completedOrders: stats.completedOrders,
      activities,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Disputes Dashboard
// Fetch dispute statistics (total, open, in progress, resolved)

exports.disputeStats = async (req, res) => {
  try {
    const [[disputeStats]] = await db.query(`
  SELECT
    COUNT(*) AS totalDisputes,

    SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS openDisputes,

    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS inProgressDisputes,

    SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolvedDisputes

  FROM disputes
`);

    // TODO: Dynamically render tabs for open, in progress, resolved and escalated disputes
    // TODO: Add search functionality for disputes

    res.json({
      total: disputeStats.totalDisputes,
      open: disputeStats.openDisputes,
      inProgress: disputeStats.inProgressDisputes,
      resolved: disputeStats.resolvedDisputes,
    });
  } catch (error) {
    console.error('Dispute dashboard error:', error);
    res.status(500).send('Server Error');
  }
};
