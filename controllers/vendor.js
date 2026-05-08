const db = require('./../config/db');

// Vendor Dashboard
// vendor stats-(sales, orders, products, average rating, pending payout, customer)
// stock alerts, recent order activity, rfqs

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
