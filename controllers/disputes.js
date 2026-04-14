const db = require('./../config/db');

exports.getDisputes = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const priority = req.query.priority;
    const type = req.query.type;
    const status = req.query.status;

    let query = `
      SELECT 
        d.id,
        CONCAT('#DSP', d.id) AS disputeId,
        d.order_id,
        CONCAT('#Ord', d.order_id) AS orderId,
        d.type,
        DATE_FORMAT(d.created_at, '%Y-%m-%d') AS date,
        DATE_FORMAT(d.created_at, '%h:%i %p') AS time,
        d.status,
        d.priority,
        u.name,
        s.business_name,
        p.name AS product_name

      FROM disputes d
      LEFT JOIN users u ON d.customer_id = u.id
      LEFT JOIN suppliers s ON d.supplier_id = s.id
      LEFT JOIN products p ON d.product_id = p.id

      WHERE 1=1
    `;

    let params = [];

    if (search) {
      query += ` AND (u.name LIKE ? OR s.business_name LIKE ? OR d.type LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (priority) {
      query += ` AND d.priority = ?`;
      params.push(priority);
    }

    if (type) {
      query += ` AND d.type = ?`;
      params.push(type);
    }
    if (status) {
      query += ` AND d.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY d.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [disputes] = await db.query(query, params);

    // ✅ Count Query
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM disputes d
      LEFT JOIN users u ON d.customer_id = u.id
      LEFT JOIN suppliers s ON d.supplier_id = s.id
      LEFT JOIN products p ON d.product_id = p.id
      WHERE 1=1
    `;

    let countParams = [];

    if (search) {
      countQuery += ` AND (u.name LIKE ? OR s.business_name LIKE ? OR d.type LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (priority) {
      countQuery += ` AND d.priority = ?`;
      countParams.push(priority);
    }

    if (type) {
      countQuery += ` AND d.type = ?`;
      countParams.push(type);
    }
    if (status) {
      countQuery += ` AND d.status = ?`;
      countParams.push(status);
    }

    const [count] = await db.query(countQuery, countParams);

    const total = count[0].total;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      currentPage: page,
      totalPages,
      disputes,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error',
    });
  }
};
