const db = require('./../config/db');

exports.getVendorRFQs = async (req, res) => {
  try {
    const vendorId = req.session.user.vendorId;
    const status = req.query.status || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    let query = '';
    let countQuery = '';
    let params = [vendorId];
    let countParams = [vendorId];

    /* ================= STATUS LOGIC ================= */

    // 🔵 ACTIVE RFQs (not quoted yet)
    if (status === 'active') {
      query = `
        SELECT r.*
        FROM rfqs r
        LEFT JOIN rfq_quotes q 
          ON r.id = q.rfq_id AND q.supplier_id = ?
        WHERE q.id IS NULL 
        AND r.status = 'active'
        ORDER BY r.created_at DESC
      `;

      countQuery = `
        SELECT COUNT(*) AS total
        FROM rfqs r
        LEFT JOIN rfq_quotes q 
          ON r.id = q.rfq_id AND q.supplier_id = ?
        WHERE q.id IS NULL 
        AND r.status = 'active'
      `;
    }

    // 🟡 SUBMITTED QUOTES
    else if (status === 'submitted') {
      query = `
       SELECT 
  q.id AS quote_id,
  r.id AS rfq_id,
  r.title,
  q.price,
  q.status,
  q.created_at AS submitted_date
 FROM rfq_quotes q
 JOIN rfqs r ON r.id = q.rfq_id
 WHERE q.supplier_id = ?
 AND q.status = 'submitted'
 ORDER BY q.created_at DESC
      `;

      countQuery = `
        SELECT COUNT(*) AS total
FROM rfq_quotes q
WHERE q.supplier_id = ?
AND q.status = 'submitted'
      `;
    }

    // 🟢 WON QUOTES
    else if (status === 'won') {
      query = `
        SELECT 
          q.id AS quote_id,
          r.id AS rfq_id,
          r.title,
          q.price,
          q.created_at AS submitted_date
        FROM rfq_quotes q
        JOIN rfqs r ON r.id = q.rfq_id
        WHERE q.supplier_id = ?
        AND q.status = 'accepted'
        ORDER BY q.created_at DESC
      `;

      countQuery = `
        SELECT COUNT(*) AS total
        FROM rfq_quotes q
        WHERE q.supplier_id = ?
        AND q.status = 'accepted'
      `;
    }

    // 🔴 LOST QUOTES
    else if (status === 'lost') {
      query = `
        SELECT 
          q.id AS quote_id,
          r.id AS rfq_id,
          r.title,
          q.price,
          q.created_at AS submitted_date,
          q.status
        FROM rfq_quotes q
        JOIN rfqs r ON r.id = q.rfq_id
        WHERE q.supplier_id = ?
        AND q.status = 'lost'
        ORDER BY q.created_at DESC
      `;

      countQuery = `
        SELECT COUNT(*) AS total
        FROM rfq_quotes q
        WHERE q.supplier_id = ?
        AND q.status = 'lost'
      `;
    }

    // ⚫ EXPIRED RFQs (only relevant ones)
    else if (status === 'expired') {
      query = `
        SELECT r.*
        FROM rfqs r
        LEFT JOIN rfq_quotes q 
          ON r.id = q.rfq_id AND q.supplier_id = ?
        WHERE r.status = 'expired'
        ORDER BY r.created_at DESC
      `;

      countQuery = `
        SELECT COUNT(*) AS total
        FROM rfqs r
        LEFT JOIN rfq_quotes q 
          ON r.id = q.rfq_id AND q.supplier_id = ?
        WHERE r.status = 'expired'
      `;
    }

    // ⚪ DEFAULT (optional)
    else {
      query = `
        SELECT *
        FROM rfqs
        ORDER BY created_at DESC
      `;

      countQuery = `SELECT COUNT(*) AS total FROM rfqs`;
      params = [];
      countParams = [];
    }

    /* ================= PAGINATION ================= */

    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rfqs] = await db.query(query, params);
    const [[{ total }]] = await db.query(countQuery, countParams);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      rfqs,
      currentPage: page,
      totalPages,
      total,
    });
  } catch (error) {
    console.error('RFQ Controller Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getCompanyRFQs = async (req, res) => {
  try {
    const companyId = req.session.user.id;

    const [rfqs] = await db.query(
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
      ORDER BY r.created_at DESC
    `,
      [companyId],
    );

    // 🔥 attach specs + quotes
    for (let rfq of rfqs) {
      const [specs] = await db.query(
        `SELECT spec_name, spec_value FROM rfq_specifications WHERE rfq_id = ?`,
        [rfq.id],
      );

      const [quotes] = await db.query(
        `
        SELECT 
          q.id,
          q.price,
          q.delivery_days,
          q.warranty,
          q.payment_terms,
          q.message,
          q.status,
          s.business_name AS company,

          ROUND(COALESCE(AVG(pr.rating),0),1) AS rating,
          COUNT(DISTINCT pr.id) AS review_count,

          MAX(o.id) AS order_id

        FROM rfq_quotes q
        JOIN suppliers s ON s.id = q.supplier_id
        LEFT JOIN products p ON p.supplier_id = s.id
        LEFT JOIN product_reviews pr ON pr.product_id = p.id
        LEFT JOIN orders o 
          ON o.rfq_id = q.rfq_id AND q.status = 'accepted'

        WHERE q.rfq_id = ?
        GROUP BY q.id
      `,
        [rfq.id],
      );

      rfq.specifications = specs;
      rfq.quotes = quotes;
    }

    res.json({ rfqs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// controllers/rfq.js


exports.createRFQ = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // =========================
    // Buyer from session
    // =========================

    const buyerId = req.session.user.id;

    // =========================
    // Request Body
    // =========================

    const {
      title,
      description,
      categoryId,
      totalQuantity,
      budgetMin,
      budgetMax,
      deadline,
      location,
      priority,
      items,
      specifications,
      suppliers
    } = req.body;

    // =========================
    // Basic Validation
    // =========================

    if (
      !title ||
      !description ||
      !categoryId ||
      !totalQuantity ||
      !budgetMin ||
      !budgetMax ||
      !deadline ||
      !location ||
      !priority
    ) {
      await connection.rollback();

      return res.status(400).json({
        status: "Failed",
        message: "Required fields are missing"
      });
    }

    if (Number(budgetMin) > Number(budgetMax)) {
      await connection.rollback();

      return res.status(400).json({
        status: "Failed",
        message: "Minimum budget cannot exceed maximum budget"
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      await connection.rollback();

      return res.status(400).json({
        status: "Failed",
        message: "At least one RFQ item is required"
      });
    }

    // =========================
    // Insert Main RFQ
    // =========================

    const [rfqResult] = await connection.query(
      `
      INSERT INTO rfqs
      (
        user_id,
        title,
        description,
        quantity,
        category_id,
        budget_min,
        budget_max,
        deadline,
        location,
        priority,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        buyerId,
        title,
        description,
        totalQuantity,
        categoryId,
        budgetMin,
        budgetMax,
        deadline,
        location,
        priority,
        "active"
      ]
    );

    const rfqId = rfqResult.insertId;

    // =========================
    // Insert RFQ Items
    // =========================

    for (const item of items) {
      if (!item.productName || !item.quantity) continue;

      await connection.query(
        `
        INSERT INTO rfq_items
        (
          rfq_id,
          product_name,
          quantity,
          specifications
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          rfqId,
          item.productName,
          item.quantity,
          item.specifications || null
        ]
      );
    }

    // =========================
    // Insert Specifications
    // =========================

    if (specifications && Array.isArray(specifications)) {
      for (const spec of specifications) {
        if (!spec.specName || !spec.specValue) continue;

        await connection.query(
          `
          INSERT INTO rfq_specifications
          (
            rfq_id,
            spec_name,
            spec_value
          )
          VALUES (?, ?, ?)
          `,
          [
            rfqId,
            spec.specName,
            spec.specValue
          ]
        );
      }
    }

    // =========================
    // Insert Supplier Invitations
    // =========================

    if (suppliers && Array.isArray(suppliers)) {
      for (const supplierId of suppliers) {
        if (!supplierId) continue;

        await connection.query(
          `
          INSERT INTO rfq_invitations
          (
            rfq_id,
            supplier_id,
            status
          )
          VALUES (?, ?, ?)
          `,
          [
            rfqId,
            supplierId,
            "invited"
          ]
        );
      }
    }

    // =========================
    // Commit
    // =========================

    await connection.commit();

    return res.status(201).json({
      status: "Success",
      message: "RFQ created successfully",
      data: {
        rfqId
      }
    });

  } catch (error) {
    await connection.rollback();

    console.error(error);

    return res.status(500).json({
      status: "Failed",
      message: error.message
    });

  } finally {
    connection.release();
  }
};