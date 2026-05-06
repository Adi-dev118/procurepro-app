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
        COUNT(DISTINCT q.id) AS bids_received

      FROM rfqs r
      
      LEFT JOIN rfq_quotes q ON r.id = q.rfq_id

      WHERE r.user_id = ?

      GROUP BY r.id
      ORDER BY r.created_at DESC
    `,
      [companyId],
    );

    res.json({ rfqs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getQuotesByRFQ = async (req, res) => {
  try {
    const rfqId = req.params.rfqId;
    const userId = req.session.user.id;

    // 🔒 SECURITY: Check RFQ belongs to user
    const [[rfq]] = await db.query(`SELECT id FROM rfqs WHERE id = ? AND user_id = ?`, [
      rfqId,
      userId,
    ]);

    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }

    // 📦 GET QUOTES
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

        ROUND(COALESCE(AVG(pr.rating), 0), 1) AS rating,
        COUNT(DISTINCT pr.id) AS review_count

      FROM rfq_quotes q
      JOIN suppliers s ON s.id = q.supplier_id

      LEFT JOIN products p ON p.supplier_id = s.id
      LEFT JOIN product_reviews pr ON pr.product_id = p.id

      WHERE q.rfq_id = ?

      GROUP BY q.id

      ORDER BY 
        (q.status = 'accepted') DESC,
        q.price ASC
      `,
      [rfqId],
    );

    res.json({ quotes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// controllers/rfq.js

exports.acceptQuote = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const quoteId = req.params.quoteId;
    const userId = req.session.user.id;

    await connection.beginTransaction();

    // 1. Get RFQ ID and verify ownership
    const [[quote]] = await connection.query(
      `
      SELECT q.rfq_id
      FROM rfq_quotes q
      JOIN rfqs r ON r.id = q.rfq_id
      WHERE q.id = ? AND r.user_id = ?
      `,
      [quoteId, userId],
    );

    if (!quote) {
      await connection.rollback();
      return res.status(404).json({ message: 'Quote not found' });
    }

    const rfqId = quote.rfq_id;

    // 2. Accept selected quote
    await connection.query(`UPDATE rfq_quotes SET status = 'accepted' WHERE id = ?`, [quoteId]);

    // 3. Reject all other quotes
    await connection.query(
      `UPDATE rfq_quotes 
       SET status = 'rejected' 
       WHERE rfq_id = ? AND id != ?`,
      [rfqId, quoteId],
    );

    // 4. Close RFQ
    await connection.query(`UPDATE rfqs SET status = 'closed' WHERE id = ?`, [rfqId]);

    await connection.commit();

    res.json({ message: 'Quote accepted successfully' });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
};

exports.rejectQuote = async (req, res) => {
  try {
    const quoteId = req.params.quoteId;
    const userId = req.session.user.id;

    // Verify ownership
    const [[quote]] = await db.query(
      `
      SELECT q.id
      FROM rfq_quotes q
      JOIN rfqs r ON r.id = q.rfq_id
      WHERE q.id = ? AND r.user_id = ?
      `,
      [quoteId, userId],
    );

    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    await db.query(`UPDATE rfq_quotes SET status = 'rejected' WHERE id = ?`, [quoteId]);

    res.json({ message: 'Quote rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

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
        status: 'Failed',
        message: 'Required fields are missing',
      });
    }

    if (Number(budgetMin) > Number(budgetMax)) {
      await connection.rollback();

      return res.status(400).json({
        status: 'Failed',
        message: 'Minimum budget cannot exceed maximum budget',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      await connection.rollback();

      return res.status(400).json({
        status: 'Failed',
        message: 'At least one RFQ item is required',
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
        'active',
      ],
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
          quantity
        )
        VALUES (?, ?, ?)
        `,
        [rfqId, item.productName, item.quantity],
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
          [rfqId, spec.specName, spec.specValue],
        );
      }
    }
    // =========================
    // Commit
    // =========================

    await connection.commit();

    return res.status(201).json({
      status: 'Success',
      message: 'RFQ created successfully',
      data: {
        rfqId,
      },
    });
  } catch (error) {
    await connection.rollback();

    console.error(error);

    return res.status(500).json({
      status: 'Failed',
      message: error.message,
    });
  } finally {
    connection.release();
  }
};

exports.getRFQById = async (req, res) => {
  try {
    const rfqId = req.params.id;

    const [[rfq]] = await db.query(
      `SELECT r.* , c.name AS category FROM rfqs r LEFT JOIN categories c ON r.category_id = c.id WHERE r.id = ?`,
      [rfqId],
    );

    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }

    const [items] = await db.query(
      `SELECT product_name, quantity FROM rfq_items WHERE rfq_id = ?`,
      [rfqId],
    );

    const [specs] = await db.query(
      `SELECT spec_name, spec_value FROM rfq_specifications WHERE rfq_id = ?`,
      [rfqId],
    );

    rfq.items = items;
    rfq.specifications = specs;

    res.json({ rfq });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitQuote = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // =========================
    // Vendor from session
    // =========================
    const rfqId = req.params.rfqId;
    const vendorId = req.session.user.vendorId;

    // =========================
    // Request body
    // =========================
    const { price, message, deliveryDays, warranty, paymentTerms } = req.body;

    // =========================
    // Validation
    // =========================
    if (!rfqId || !price) {
      return res.status(400).json({
        success: false,
        message: 'RFQ ID and price are required',
      });
    }

    // =========================
    // Check if RFQ exists
    // =========================
    const [rfq] = await connection.query(`SELECT id FROM rfqs WHERE id = ?`, [rfqId]);

    if (rfq.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'RFQ not found',
      });
    }

    // =========================
    // Prevent duplicate quote
    // =========================
    const [existing] = await connection.query(
      `SELECT id FROM rfq_quotes 
       WHERE rfq_id = ? AND supplier_id = ?`,
      [rfqId, vendorId],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a quote for this RFQ',
      });
    }

    // =========================
    // Insert Quote
    // =========================
    const [result] = await connection.query(
      `INSERT INTO rfq_quotes 
      (rfq_id, supplier_id, price, message, status, delivery_days, warranty, payment_terms)
      VALUES (?, ?, ?, ?, 'submitted', ?, ?, ?)`,
      [
        rfqId,
        vendorId,
        price,
        message || null,
        deliveryDays || null,
        warranty || null,
        paymentTerms || null,
      ],
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Quote submitted successfully',
      quoteId: result.insertId,
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  } finally {
    connection.release();
  }
};

exports.getVendorQuoteById = async (req, res) => {
  const vendorId = req.session.user.vendorId;
  const quoteId = req.params.id;

  try {
    const [rows] = await db.query(
      `SELECT rq.*, r.title AS rfq_title
       FROM rfq_quotes rq
       JOIN rfqs r ON rq.rfq_id = r.id
       WHERE rq.id = ? AND rq.supplier_id = ?`,
      [quoteId, vendorId],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
    }

    res.json({
      success: true,
      quote: rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// controllers/rfqController.js

