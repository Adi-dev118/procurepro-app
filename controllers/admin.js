const db = require('./../config/db');

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

// Admin Dashboard
// Fetch platform order statistics, platform stats and recent activities

exports.adminDashboard = async (req, res) => {
  try {
    const [[[ordersStats]], [[platformStats]], [activities]] = await Promise.all([
      // Fetch order statistics such as revenue, commission and pending shipments

      db.query(`
      SELECT 
      COUNT(*) AS totalOrders,

      SUM(CASE WHEN status='delivered' THEN total_amount ELSE 0 END) AS totalRevenue,

      SUM(CASE WHEN status='delivered' THEN commission ELSE 0 END) AS totalCommission,

      SUM(CASE WHEN status='processing' THEN 1 ELSE 0 END) AS pendingShipments
      FROM orders
    `),
      // Fetch user and disputes statistics such as total Users, Suppliers and Disputes
      db.query(`
      SELECT
      (SELECT COUNT(*) 
      FROM users) AS totalUsers,

      (SELECT COUNT(*) 
      FROM suppliers) AS totalSuppliers,

      (SELECT COUNT(*) 
       FROM disputes 
       WHERE status IN ('open','in progress','closed')) AS totalDisputes
       `),
      // Fetch Recent user activity stored in table user_activity_logs
      db.query(`
      SELECT 
      user_name,
      activity,
      detail,
      status,
      DATE_FORMAT(created_at,'%h:%i %p') AS time
      FROM user_activity_logs
      ORDER BY created_at DESC
      LIMIT 5
    `),
    ]);

    res.render('admin/dashboard', {
      ordersStats,
      platformStats,
      activities,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

// User Dashboard
// Fetch Users, and seperate them in buyers, suppliers with their status of approval
// and recent activities

exports.userDashboard = async (req, res) => {
  try {
    const [
      [[userStats]],
      [usersData],
      [suppliersData],
      [suspendedData],
      [pendingData],
      [activityLogs],
    ] = await Promise.all([
      // Fetch User Stats such as suppliers, buyers, active or pending
      db.query(`SELECT
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
WHERE verification_status='pending') AS pendingSuppliers;`),

      // Fetch buyers data to list them on dashboard
      db.query(`SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
u.status,
u.registration_date AS registrationDate,
COUNT(o.id) AS totalOrders,
IFNULL(SUM(o.total_amount),0) AS totalSpent
FROM users u
LEFT JOIN orders o 
ON u.id = o.user_id 
AND o.status IN ('paid','delivered')
GROUP BY u.id
ORDER BY u.id ASC
LIMIT 5;`),
      // Fetch vendors data to list them on dashboard
      db.query(
        `SELECT
        u.id,
        u.name,
u.email,
u.role,
u.status,
u.registration_date,
s.business_name AS company,
s.mobile_no AS contact,

COUNT(DISTINCT p.id) AS totalProducts,

GROUP_CONCAT(DISTINCT sd.document_type SEPARATOR ' | ') AS documents,

ROUND(AVG(pr.rating),1) AS avgRating,
COUNT(pr.id) AS totalReviews

FROM users u

LEFT JOIN suppliers s 
    ON u.id = s.user_id

    LEFT JOIN products p 
    ON s.id = p.supplier_id
    
    LEFT JOIN supplier_documents sd 
    ON s.id = sd.supplier_id

    LEFT JOIN product_reviews pr 
    ON p.id = pr.product_id

WHERE u.role = 'supplier'

GROUP BY 
u.id,
u.name,
u.email,
u.role,
u.status,
u.registration_date,
s.business_name,
s.mobile_no

LIMIT 10;`,
      ),
      // Fetch Suspended Users data
      db.query(
        `SELECT 
      id, 
      name, 
      role, 
      suspended_on AS supendedDate, 
      suspend_reason AS reason 
      FROM users WHERE status= 'suspended' LIMIT 5`,
      ),
      // Fetch pending admin approval users
      db.query(`
SELECT 
u.id,
u.name,
s.business_name AS company,
u.role,
u.registration_date AS date,
GROUP_CONCAT(sd.document_type SEPARATOR ' | ') AS documents
FROM users u
LEFT JOIN suppliers s 
    ON u.id = s.user_id
LEFT JOIN supplier_documents sd 
    ON s.id = sd.supplier_id
WHERE u.status = 'pending'
GROUP BY u.id, s.business_name LIMIT 5
`),
      // Fetch recent activity logs from user_activity_logs table
      db.query(
        `SELECT 
      created_at AS timeStamp, 
      user_name AS name, 
      ip_address AS address, 
      activity AS log, 
      status 
      FROM user_activity_logs ORDER BY created_at DESC LIMIT 5`,
      ),
    ]);

    res.render('admin/users', {
      stats: userStats,
      usersData,
      suppliersData,
      suspendedData,
      pendingData,
      activityLogs,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Fetch supplier statistics:
// total suppliers, active suppliers, pending suppliers
// and overall average supplier rating
exports.supplierDashboard = async (req, res) => {
  try {
    const [[[stats]], [supplierData]] = await Promise.all([
      // Fetch all suppliers statistic data such as total , active, suppliers along with
      // average rating of all suppliers with pending approvals
      db.query(`
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
      `),
      // Fetch supplier data to show on dashboard
      db.query(`
        SELECT 
s.id,
s.business_name AS company,
s.mobile_no AS mobile,
s.business_type AS type,
s.description,
DATE_FORMAT(s.created_at, '%e %M, %Y') AS date,
s.verification_status AS status,
u.email,
s.commission_rate AS commission,

MAX(
CONCAT(
sa.address_line1, ', ',
sa.address_line2, ', ',
sa.city, ', ',
sa.state, ' - ',
sa.pincode, ', ',
sa.country
)
) AS address,

COUNT(DISTINCT p.id) AS products,

IFNULL(SUM(oi.quantity * oi.price_at_purchase),0) AS totalSales,

ROUND(AVG(pr.rating),1) AS avgRating,

COUNT(DISTINCT pr.id) AS totalRatings

FROM suppliers s

LEFT JOIN users u 
ON u.id = s.user_id

LEFT JOIN products p 
ON p.supplier_id = s.id

LEFT JOIN product_reviews pr 
ON p.id = pr.product_id

LEFT JOIN order_items oi 
ON p.id = oi.product_id

LEFT JOIN supplier_address sa 
ON s.id = sa.supplier_id

WHERE u.role = 'supplier'

GROUP BY s.id

LIMIT 5;
      `),
    ]);

    // TODO: Implement dynamic rendering for flagged/inappropriate product listings

    res.render('admin/suppliers', {
      supplierData,
      stats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Product Dashboard
// Fetch product statistics, recent product listings, and product categories
exports.productDashboard = async (req, res) => {
  try {
    const [[[stats]], [productData], [categories]] = await Promise.all([
      // products statistics- total products, active, inactive listing, avg price
      db.query(`
        SELECT
        COUNT(*) AS totalProducts,

        SUM(CASE WHEN verification_status='approved' THEN 1 ELSE 0 END) AS approved,

        SUM(CASE WHEN verification_status IN ('pending','rejected') THEN 1 ELSE 0 END) AS inactive,

        ROUND(AVG(price),2) AS avgPrice

        FROM products
      `),
      // Fetch product data for dashboard
      db.query(`
        SELECT 
        p.id,
        p.name,
        p.description,
        p.sku,
        c.name AS category,
        c.badge_color AS color,
        s.business_name AS supplier,
        p.price,
        p.icon,
        p.stock,
        p.verification_status AS status

        FROM products p
        JOIN categories c ON c.id = p.category_id
        JOIN suppliers s ON s.id = p.supplier_id

        ORDER BY p.id
        LIMIT 5
      `),
      // Fetch existing product categories from category table
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
    //TODO:- Add Search function to products
    //TODO:- Add recent product complains dynamically
    res.render('admin/products', {
      products: stats.totalProducts,
      approved: stats.approved,
      inactive: stats.inactive,
      avgPrice: stats.avgPrice,
      productData,
      categories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Order dashboard
// Fetch order statistics- total, pending, processing and delivered
// All order details
exports.orderDashboard = async (req, res) => {
  try {
    const [[[stats]], [orders], [ordersActivity]] = await Promise.all([
      // order statistics- total, pending, processing and delivered
      db.query(`
        SELECT
        COUNT(*) AS totalOrders,

        SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) AS pendingOrders,

        SUM(CASE WHEN status='processing' THEN 1 ELSE 0 END) AS processingOrders,

        SUM(CASE WHEN status='delivered' THEN 1 ELSE 0 END) AS completedOrders

        FROM orders
      `),
      // order history in reverse order
      db.query(`
        SELECT 
        o.id,
        o.total_amount,
        o.status,
        o.created_at,
        o.payment_status AS paymentStatus,
        u.name AS customer,
        u.email,
        COUNT(oi.id) AS items

        FROM orders o
        JOIN users u ON u.id = o.user_id
        LEFT JOIN order_items oi ON oi.order_id = o.id

        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT 10
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
    res.render('admin/orders', {
      totalOrders: stats.totalOrders,
      pendingOrders: stats.pendingOrders,
      processingOrders: stats.processingOrders,
      completedOrders: stats.completedOrders,
      orders,
      activities,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Disputes Dashboard
// Fetch dispute statistics (total, open, in progress, resolved)
// and recent dispute logs
exports.disputedDashboard = async (req, res) => {
  try {
    const [[[disputeStats]], [disputesData]] = await Promise.all([
      // fetch total, open, pending, resolved disputes stats
      db.query(`
  SELECT
    COUNT(*) AS totalDisputes,

    SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS openDisputes,

    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS inProgressDisputes,

    SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolvedDisputes

  FROM disputes
`),
      // fetch dispute logs
      db.query(`SELECT 
d.id AS disputeId,
d.order_id AS orderId,
p.name AS productName,
u.name AS customerName,
s.business_name AS supplierName,
d.type,
d.created_at AS date,
d.priority,
d.status
FROM disputes d
JOIN orders o ON d.order_id = o.id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
JOIN users u ON u.id = d.customer_id
JOIN suppliers s ON s.id = d.supplier_id
ORDER BY d.id DESC
LIMIT 5;`),
    ]);

    // TODO: Dynamically render tabs for open, in progress, resolved and escalated disputes
    // TODO: Add search functionality for disputes

    res.render('admin/disputes', {
      total: disputeStats.totalDisputes,
      open: disputeStats.openDisputes,
      inProgress: disputeStats.inProgressDisputes,
      resolved: disputeStats.resolvedDisputes,
      disputesData,
    });
  } catch (error) {
    console.error('Dispute dashboard error:', error);
    res.status(500).send('Server Error');
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    const query = `
      SELECT 
        created_at AS timeStamp,
        user_name AS name,
        ip_address AS address,
        activity AS log,
        status
      FROM user_activity_logs
      ORDER BY created_at DESC
      LIMIT 5
    `;

    const [activities] = await db.query(query);

    res.status(200).json({ activities });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
    });
  }
};

exports.getAllActivities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        created_at AS timeStamp,
        user_name AS name,
        ip_address AS address,
        activity AS log,
        status
      FROM user_activity_logs
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [activities] = await db.query(query, [limit, offset]);

    const [[{ total }]] = await db.query(`
      SELECT COUNT(*) AS total
      FROM user_activity_logs
    `);

    const totalPages = Math.ceil(total / limit);

    res.json({
      activities,
      currentPage: page,
      totalPages,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.adminSettings = (req, res) => {
  res.render('admin/settings');
};
