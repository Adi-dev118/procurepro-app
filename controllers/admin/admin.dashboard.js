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
