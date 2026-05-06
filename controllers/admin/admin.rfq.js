const db = require('./../../config/db');

exports.getAllRfqs = async (req, res) => {
  try {
    const query = `
      SELECT 
        r.id,
        r.user_id,
        r.title,
        r.budget_min,
        r.budget_max,
        r.quantity,
        r.deadline,
        r.location,
        r.priority,
        r.status,
        r.created_at,
        u.name AS buyer,
        COUNT(q.id) AS quote_count
      FROM rfqs r
      LEFT JOIN rfq_quotes q ON r.id = q.rfq_id
      LEFT JOIN users u ON r.user_id = u.id
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `;

    const [rows] = await db.execute(query);

    res.status(200).json({
      status: 'success',
      results: rows.length,
      rfqs: rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch RFQs',
    });
  }
};

// controllers/rfqController.js

exports.getRfqItems = async (req, res) => {
  try {
    const rfqId = req.params.id;

    const query = `
      SELECT 
        id,
        rfq_id,
        product_name,
        quantity,
        specifications
      FROM rfq_items
      WHERE rfq_id = ?
      ORDER BY id ASC
    `;

    const [rows] = await db.execute(query, [rfqId]);

    res.status(200).json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch RFQ items'
    });
  }
};

// controllers/rfqController.js

exports.getRfqQuotes = async (req, res) => {
  try {
    const rfqId = req.params.id;

    const query = `
      SELECT 
        id,
        rfq_id,
        supplier_id,
        price,
        message,
        delivery_days,
        warranty,
        payment_terms,
        status,
        created_at
      FROM rfq_quotes
      WHERE rfq_id = ?
      ORDER BY created_at DESC
    `;

    const [rows] = await db.execute(query, [rfqId]);

    res.status(200).json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch RFQ quotes'
    });
  }
};

exports.getRfqSpecifications = async (req, res) => {
  try {
    const rfqId = req.params.id;

    const query = `
      SELECT 
        id,
        rfq_id,
        spec_name,
        spec_value
      FROM rfq_specifications
      WHERE rfq_id = ?
      ORDER BY id ASC
    `;

    const [rows] = await db.execute(query, [rfqId]);

    res.status(200).json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch RFQ specifications'
    });
  }
};