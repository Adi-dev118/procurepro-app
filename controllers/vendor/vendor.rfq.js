const db = require('../../config/db');

exports.getRFQStats = async (req, res) => {
  try {
    const vendorId = req.session.user.vendorId;
    const [rows] = await db.query(
      `
        SELECT

          COUNT(*) AS quotesSubmitted,

          SUM(
            CASE
              WHEN status = 'won'
              THEN 1
              ELSE 0
            END
          ) AS quotesWon,

          ROUND(

            SUM(
              CASE
                WHEN status = 'won'
                THEN 1
                ELSE 0
              END
            ) * 100.0

            / NULLIF(COUNT(*), 0),

            1

          ) AS successRate,

          (
            SELECT COUNT(*)

            FROM rfqs

            WHERE status = 'active'

            AND deadline >= CURDATE()
          ) AS activeRFQs

        FROM rfq_quotes

        WHERE supplier_id = ?
        `,
      [vendorId],
    );

    const stats = rows[0];

    res.status(200).json({
      status: 'success',
      stats: {
        quotesSubmitted: Number(stats.quotesSubmitted),
        quotesWon: Number(stats.quotesWon),
        successRate: Number(stats.successRate || 0),
        activeRFQs: Number(stats.activeRFQs),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'fail',
      message: 'Failed to load RFQ stats',
    });
  }
};


exports.getRFQs = async (req, res) => {
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


exports.getQuoteById = async (req, res) => {
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
