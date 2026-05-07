const db = require('./../config/db');

// Vendor Dashboard
// vendor stats-(sales, orders, products, average rating, pending payout, customer)
// stock alerts, recent order activity, rfqs

exports.vendorDashboard = async (req, res) => {
  try {
    // const userId = req.session.user.vendorId;
    // const [row] = await db.query('SELECT id FROM suppliers WHERE user_id = ?', [userId]);
    const vendorId = req.session.user.vendorId;
    console.log(vendorId);

    const [
      [vendor],
      [[stats]],
      [[rating]],
      [activities],
      [stocks],
      [[stockAlerts]],
      [[pendingPayout]],
    ] = await Promise.all([
      // Vendor info
      db.query(
        `SELECT s.business_name AS name, 
                s.verification_status AS status, 
                u.email  
         FROM suppliers s 
         LEFT JOIN users u 
         ON s.user_id = u.id
         WHERE s.id = ?`,
        [vendorId],
      ),

      // Combined statistics
      db.query(
        `
        SELECT
          COUNT(DISTINCT o.id) AS totalOrders,
          COUNT(DISTINCT o.user_id) AS newCustomers,
          IFNULL(SUM(oi.subtotal),0) AS totalEarned,

          (
            SELECT COUNT(*)
            FROM products
            WHERE supplier_id = ?
            AND verification_status = 'approved'
          ) AS totalProducts

        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        JOIN products p ON p.id = oi.product_id

        WHERE p.supplier_id = ?
        AND o.status = 'delivered'
      `,
        [vendorId, vendorId],
      ),

      // Vendor rating
      db.query(
        `
        SELECT
          ROUND(AVG(pr.rating),1) AS avgRating,
          COUNT(pr.id) AS totalReviews
        FROM products p
        LEFT JOIN product_reviews pr
          ON p.id = pr.product_id
        WHERE p.supplier_id = ?
      `,
        [vendorId],
      ),

      // Recent activity
      db.query(
        `
        SELECT
          o.id,
          u.name AS customer,
          DATE_FORMAT(o.created_at,'%Y-%m-%d') AS date,
          SUM(oi.subtotal) AS amount,
          o.status
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN order_items oi ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE p.supplier_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT 5
      `,
        [vendorId],
      ),

      // Low stock products
      db.query(
        `
        SELECT
          name,
          sku,
          stock,
          CASE
            WHEN stock = 0 THEN 'out_of_stock'
            WHEN stock < 50 THEN 'low_stock'
          END AS stock_status
        FROM products
        WHERE supplier_id = ?
        AND stock < 50
        ORDER BY stock ASC
        LIMIT 5
      `,
        [vendorId],
      ),

      // Stock alert count
      db.query(
        `
        SELECT COUNT(*) AS total
        FROM products
        WHERE supplier_id = ?
        AND stock < 50
      `,
        [vendorId],
      ),
      // pending payout
      db.query(
        `SELECT IFNULL(SUM(amount),0) AS total
FROM payouts
WHERE supplier_id = ?
AND status = 'pending'`,
        [vendorId],
      ),
    ]);

    // console.log(pendingPayout);
    res.render('vendor/dashboard', {
      name: vendor[0].name,
      email: vendor[0].email,
      status: vendor[0].status,
      totalEarned: stats.totalEarned,
      totalOrders: stats.totalOrders,
      totalProducts: stats.totalProducts,
      newCustomers: stats.newCustomers,
      alerts: stockAlerts.total,
      rating,
      pendingPayout,
      stocks,
      activities,
    });
    // TODO: Dynamically connect active rfqs
  } catch (error) {
    console.error('Vendor dashboard error:', error);
    res.status(500).send('Server Error');
  }
};

exports.financeDashboard = async (req, res) => {
  try {
    const vendorId = req.session.user.vendorId;

    const [[vendorName], [[financeStats]], [[payoutStats]], [transactions], [payouts], [[stats]]] =
      await Promise.all([
        // Vendor name
        db.query(
          `SELECT s.business_name AS name, 
                s.verification_status AS status, 
                u.email  
         FROM suppliers s 
         LEFT JOIN users u 
         ON s.user_id = u.id
         WHERE s.id = ?`,
          [vendorId],
        ),

        // Revenue and platform commission
        db.query(
          `
        SELECT 
          IFNULL(SUM((oi.price_at_purchase - (p.final_price - p.price)) * oi.quantity),0) AS totalRevenue,
          IFNULL(SUM((p.final_price - p.price) * oi.quantity),0) AS commissionFees
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON p.id = oi.product_id
        WHERE o.status = 'delivered'
        AND p.supplier_id = ?
      `,
          [vendorId],
        ),

        // Payout stats
        db.query(
          `
        SELECT
          IFNULL(SUM(CASE WHEN status='pending' THEN amount ELSE 0 END),0) AS pendingPayout,
          IFNULL(SUM(CASE WHEN status='paid' THEN amount ELSE 0 END),0) AS paidPayout
        FROM payouts
        WHERE supplier_id = ?
      `,
          [vendorId],
        ),

        // Transaction history
        db.query(
          `
        SELECT 
          CONCAT('#TXN-', o.id) AS transaction_id,
          o.created_at AS date,
          CONCAT('#ORD-', o.id) AS reference,
          'Sale' AS type,
          SUM(p.price * oi.quantity) AS amount,
          'Completed' AS status
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON p.id = oi.product_id
        WHERE o.status='delivered'
        AND p.supplier_id = ?
        GROUP BY o.id

        UNION ALL

        SELECT
          CONCAT('#PAY-', id),
          created_at,
          CONCAT('#PAY-', id),
          'Payout',
          amount * -1,
          status
        FROM payouts
        WHERE supplier_id = ?

        ORDER BY date DESC
      `,
          [vendorId, vendorId],
        ),

        // Payout history
        db.query(
          `
        SELECT
          CONCAT('#PAY-', LPAD(id,3,'0')) AS payout_id,
          created_at AS date,
          amount,
          'Bank Transfer' AS method,
          status
        FROM payouts
        WHERE supplier_id = ?
        ORDER BY created_at DESC
      `,
          [vendorId],
        ),

        // Revenue statistics
        db.query(
          `
        SELECT 

          IFNULL(SUM(
            CASE 
              WHEN MONTH(o.created_at)=MONTH(CURRENT_DATE())
              AND YEAR(o.created_at)=YEAR(CURRENT_DATE())
              THEN p.price * oi.quantity
              ELSE 0
            END
          ),0) AS thisMonth,

          IFNULL(SUM(
            CASE 
              WHEN MONTH(o.created_at)=MONTH(CURRENT_DATE() - INTERVAL 1 MONTH)
              AND YEAR(o.created_at)=YEAR(CURRENT_DATE() - INTERVAL 1 MONTH)
              THEN p.price * oi.quantity
              ELSE 0
            END
          ),0) AS lastMonth,

          IFNULL(ROUND(AVG(p.price * oi.quantity),2),0) AS avgOrderValue

        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON p.id = oi.product_id
        WHERE o.status='delivered'
        AND p.supplier_id = ?
      `,
          [vendorId],
        ),
      ]);

    const pending = payoutStats.pendingPayout;
    const paid = payoutStats.paidPayout;
    const availableBalance = financeStats.totalRevenue - pending - paid;

    res.render('vendor/finance', {
      name: vendorName[0].name,
      email: vendorName[0].email,
      revenue: financeStats.totalRevenue,
      commission: financeStats.commissionFees,
      thisMonth: stats.thisMonth,
      lastMonth: stats.lastMonth,
      avgOrder: stats.avgOrderValue,
      pending,
      availableBalance,
      transactions,
      payouts,
    });
  } catch (error) {
    console.error('Finance dashboard error:', error);
    res.status(500).send('Server Error');
  }
};

exports.profileDashboard = async (req, res) => {
  try {
    const vendorId = req.session.user.vendorId;

    const [[vendorName], [company], [contact], [teamMembers], [bank], [logistics], [[rating]]] =
      await Promise.all([
        // Vendor name
        db.query(
          `SELECT s.business_name AS name, 
                s.verification_status AS status, 
                u.email  
         FROM suppliers s 
         LEFT JOIN users u 
         ON s.user_id = u.id
         WHERE s.id = ?`,
          [vendorId],
        ),

        // Company details
        db.query(
          `SELECT 
          business_name AS name,
          business_type AS type,
          tax_id,
          verification_status AS status,
          business_registration,
          year_established,
          employee_count,
          description
         FROM suppliers
         WHERE id = ?`,
          [vendorId],
        ),

        // Contact details and address
        db.query(
          `SELECT 
          s.id AS supplier_id,
          u.name AS contact,
          s.mobile_no,
          s.website,
          u.email,
          sa.address_line1,
          sa.address_line2,
          sa.city,
          sa.state,
          sa.pincode,
          sa.country
         FROM suppliers s
         LEFT JOIN users u ON s.user_id = u.id
         LEFT JOIN supplier_address sa ON s.id = sa.supplier_id
         WHERE s.id = ?`,
          [vendorId],
        ),

        // Team members
        db.query(
          `SELECT 
          id,
          name,
          email,
          role,
          permissions,
          status
         FROM supplier_team
         WHERE supplier_id = ?`,
          [vendorId],
        ),

        // Bank details
        db.query(
          `SELECT 
          bank_name,
          account_holder,
          account_number,
          routing_number,
          swift_code,
          payment_methods
         FROM supplier_bank_details
         WHERE supplier_id = ?`,
          [vendorId],
        ),

        // Logistics information
        db.query(
          `SELECT 
          primary_warehouse,
          warehouse_size,
          shipping_carriers,
          processing_time,
          shipping_regions,
          return_policy,
          additional_warehouses
         FROM supplier_logistics
         WHERE supplier_id = ?`,
          [vendorId],
        ),

        // Supplier rating
        db.query(
          `SELECT 
          ROUND(AVG(pr.rating),1) AS avgRating,
          COUNT(pr.id) AS totalReviews
         FROM products p
         LEFT JOIN product_reviews pr 
           ON p.id = pr.product_id
         WHERE p.supplier_id = ?`,
          [vendorId],
        ),
      ]);

    res.render('vendor/profile', {
      name: vendorName[0].name,
      email: vendorName[0].email,
      supplier: company[0],
      contact: contact[0],
      bank: bank[0],
      logistics: logistics[0],
      rating,
      teamMembers,
    });
  } catch (error) {
    console.error('Vendor profile dashboard error:', error);
    res.status(500).send('Server Error');
  }
};
