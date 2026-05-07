const db = require('./../../config/db');

exports.getOrders = async (req, res) => {
  try {
    const vendorId = req.session.user.vendorId;
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const status = req.query.status;
    const dateRange = req.query.dateRange;

    function applyDateFilter(q) {
      if (dateRange === 'today') return q + ` AND DATE(o.created_at) = CURDATE()`;
      if (dateRange === '7days') return q + ` AND o.created_at >= NOW() - INTERVAL 7 DAY`;
      if (dateRange === '30days') return q + ` AND o.created_at >= NOW() - INTERVAL 30 DAY`;
      if (dateRange === 'month') {
        return (
          q + ` AND MONTH(o.created_at) = MONTH(CURDATE()) AND YEAR(o.created_at) = YEAR(CURDATE())`
        );
      }
      return q;
    }
    let query = `
  SELECT 
    o.id,
    u.name,
    u.email,
    o.created_at AS date,
    COUNT(DISTINCT oi.id) AS items,
    o.total_amount AS total,
    o.status
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  JOIN products p ON p.id = oi.product_id
  JOIN users u ON o.user_id = u.id
  WHERE p.supplier_id = ?
`;

    let params = [vendorId];

    // 🔍 Search
    if (search) {
      query += ` AND (o.id LIKE ? OR u.name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    // 📦 Status
    if (status) {
      query += ` AND o.status = ?`;
      params.push(status);
    }

    // 📅 Date filter
    query = applyDateFilter(query);

    // FINAL
    query += `
  GROUP BY o.id
  ORDER BY o.created_at DESC
  LIMIT ? OFFSET ?
`;

    params.push(limit, offset);
    const [orders] = await db.query(query, params);

    // ================= COUNT QUERY =================
    let countQuery = `
  SELECT COUNT(DISTINCT o.id) AS total
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.id
  JOIN products p ON p.id = oi.product_id
  JOIN users u ON o.user_id = u.id
  WHERE p.supplier_id = ?
`;

    let countParams = [vendorId];

    if (search) {
      countQuery += ` AND (o.id LIKE ? OR u.name LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      countQuery += ` AND o.status = ?`;
      countParams.push(status);
    }

    countQuery = applyDateFilter(countQuery);
    const [countResult] = await db.query(countQuery, countParams);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      orders,
      currentPage: page,
      total,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
    });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const vendorId = req.session.user.vendorId;

    const [rows] = await db.query(
      `
        SELECT 

          COUNT(
            DISTINCT CASE
              WHEN o.status = 'pending'
              THEN o.id
            END
          ) AS newOrders,

          COUNT(
            DISTINCT CASE
              WHEN o.status = 'processing'
              THEN o.id
            END
          ) AS processing,

          COUNT(
            DISTINCT CASE
              WHEN o.status = 'shipped'
              THEN o.id
            END
          ) AS shipped,

          COUNT(
            DISTINCT CASE
              WHEN o.status = 'delivered'
              THEN o.id
            END
          ) AS completed

        FROM orders o

        JOIN order_items oi
          ON oi.order_id = o.id

        JOIN products p
          ON p.id = oi.product_id

        WHERE p.supplier_id = ?
        `,
      [vendorId],
    );

    const stats = rows[0];

    res.status(200).json({
      status: 'success',

      stats: {
        newOrders: Number(stats.newOrders),

        processing: Number(stats.processing),

        shipped: Number(stats.shipped),

        completed: Number(stats.completed),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: 'fail',

      message: 'Failed to load order stats',
    });
  }
};
