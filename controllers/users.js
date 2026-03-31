const db = require('./../config/db');
exports.getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const { status = '', role = '' } = req.query;

    const limit = 5;
    const offset = (page - 1) * limit;

    // 🔥 MAIN QUERY (optimized with subqueries)
    let query = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.status,
        u.registration_date AS registrationDate,

        -- Orders count
        (
          SELECT COUNT(*) 
          FROM orders o 
          WHERE o.user_id = u.id 
            AND o.status IN ('paid','delivered')
        ) AS totalOrders,

        -- Total spent
        (
          SELECT IFNULL(SUM(o.total_amount),0)
          FROM orders o
          WHERE o.user_id = u.id
            AND o.status IN ('paid','delivered')
        ) AS totalSpent

      FROM users u
      WHERE (u.name LIKE ? OR u.email LIKE ?)
    `;

    let params = [`%${search}%`, `%${search}%`];

    // 🔥 Filters
    if (status) {
      query += ` AND u.status = ?`;
      params.push(status);
    }

    if (role) {
      query += ` AND u.role = ?`;
      params.push(role);
    }

    // 🔥 Pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [users] = await db.query(query, params);

    // 🔥 COUNT QUERY (lightweight, no joins)
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM users u
      WHERE (u.name LIKE ? OR u.email LIKE ?)
    `;

    let countParams = [`%${search}%`, `%${search}%`];

    if (status) {
      countQuery += ` AND u.status = ?`;
      countParams.push(status);
    }

    if (role) {
      countQuery += ` AND u.role = ?`;
      countParams.push(role);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const totalUsers = countResult[0].total;

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      users,
      currentPage: page,
      totalPages,
      totalUsers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server Error',
    });
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const status = req.query.status;

    const limit = 5;
    const offset = (page - 1) * limit;
    let query = `SELECT
  u.id,
  u.name,
  u.email,
  u.role,
  u.status,
  u.registration_date,

  s.business_name AS company,
  s.mobile_no AS contact,

  -- total products
  (
    SELECT COUNT(*)
    FROM products p
    WHERE p.supplier_id = s.id
  ) AS totalProducts,

  -- documents
  (
    SELECT GROUP_CONCAT(DISTINCT sd.document_type SEPARATOR ' | ')
    FROM supplier_documents sd
    WHERE sd.supplier_id = s.id
  ) AS documents,

  -- avg rating
  (
    SELECT IFNULL(ROUND(AVG(pr.rating), 1), 0)
    FROM products p
    LEFT JOIN product_reviews pr ON p.id = pr.product_id
    WHERE p.supplier_id = s.id
  ) AS avgRating,

  -- total reviews
  (
    SELECT COUNT(pr.id)
    FROM products p
    LEFT JOIN product_reviews pr ON p.id = pr.product_id
    WHERE p.supplier_id = s.id
  ) AS totalReviews

FROM users u
LEFT JOIN suppliers s ON u.id = s.user_id

WHERE u.role = 'supplier'`;
    let params = [];

    if (search) {
      query += ` AND s.business_name LIKE ?`;
      params.push(`%${search}%`);
    }

    // 🔥 Filters
    if (status) {
      query += ` AND s.verification_status = ?`;
      params.push(status);
    }
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [suppliers] = await db.query(query, params);

    // 🔥 COUNT QUERY (lightweight, no joins)
    let countQuery = `
      SELECT COUNT(*) as total
  FROM users u
  INNER JOIN suppliers s ON u.id = s.user_id
  WHERE u.role = 'supplier'`;

    let countParams = [];
    if (search) {
      countQuery += ` AND s.business_name LIKE ?`;
      countParams.push(`%${search}%`);
    }

    if (status) {
      countQuery += ` AND s.verification_status = ?`;
      countParams.push(status);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const totalSuppliers = countResult[0].total;

    const totalPages = Math.ceil(totalSuppliers / limit);
    res.status(200).json({
      suppliers,
      currentPage: page,
      totalPages,
      totalSuppliers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error',
    });
  }
};

exports.getPendingSuppliers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;

    const limit = 5;
    const offset = (page - 1) * limit;

    let query = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.registration_date,

        s.business_name AS company,
        s.mobile_no AS contact,

        (
          SELECT GROUP_CONCAT(DISTINCT sd.document_type SEPARATOR ' | ')
          FROM supplier_documents sd
          WHERE sd.supplier_id = s.id
        ) AS documents

      FROM users u
      INNER JOIN suppliers s ON u.id = s.user_id

      WHERE s.verification_status = 'pending'
    `;

    let params = [];

    // 🔍 Search
    if (search) {
      query += ` AND s.business_name LIKE ?`;
      params.push(`%${search}%`);
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [pendingSuppliers] = await db.query(query, params);

    // 🔢 Count query
    let countQuery = `
      SELECT COUNT(*) as total
      FROM suppliers s
      WHERE s.verification_status = 'pending'
    `;

    let countParams = [];

    if (search) {
      countQuery += ` AND s.business_name LIKE ?`;
      countParams.push(`%${search}%`);
    }

    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0].total;

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      pendingSuppliers,
      currentPage: page,
      totalPages,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error',
    });
  }
};

exports.getSuspendedUsers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const role = req.query.role;

    const limit = 5;
    const offset = (page - 1) * limit;

    // 🔥 MAIN QUERY
    let query = `
      SELECT 
        id,
        name,
        email,
        role,
        suspended_on,
        suspend_reason

      FROM users
      WHERE status = 'suspended'
    `;

    let params = [];

    // 🔍 Search
    if (search) {
      query += ` AND name LIKE ?`;
      params.push(`%${search}%`);
    }
    if (role) {
      query += ` AND role = ?`;
      params.push(role);
    }
    // 🔢 Pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [users] = await db.query(query, params);

    // 🔢 COUNT QUERY
    let countQuery = `
      SELECT COUNT(*) as total
      FROM users
      WHERE status = 'suspended'
    `;

    let countParams = [];

    if (search) {
      countQuery += ` AND name LIKE ?`;
      countParams.push(`%${search}%`);
    }
    if (role) {
      countQuery += ` AND role = ?`;
      countParams.push(role);
    }

    const [countResult] = await db.query(countQuery, countParams);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      users,
      currentPage: page,
      totalPages,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error',
    });
  }
};

exports.getSupplierManagement = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    let query = `SELECT 
      s.id,
      s.business_name AS company,
      s.mobile_no AS mobile,
      s.business_type AS type,
      s.description,
      DATE_FORMAT(s.created_at, '%e %M, %Y') AS date,
      s.verification_status AS status,
      u.email,
      s.commission_rate AS commission,

      sa.address,

      (SELECT COUNT(*) FROM products p WHERE p.supplier_id = s.id) AS products,

      (SELECT IFNULL(SUM(oi.quantity * oi.price_at_purchase), 0)
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE p.supplier_id = s.id) AS totalSales,

      (SELECT IFNULL(ROUND(AVG(pr.rating),1),0)
       FROM product_reviews pr
       JOIN products p ON p.id = pr.product_id
       WHERE p.supplier_id = s.id) AS avgRating,

      (SELECT COUNT(*)
       FROM product_reviews pr
       JOIN products p ON p.id = pr.product_id
       WHERE p.supplier_id = s.id) AS totalRatings

    FROM suppliers s
    LEFT JOIN users u ON u.id = s.user_id
    LEFT JOIN (
      SELECT supplier_id,
      CONCAT(address_line1, ', ', address_line2, ', ', city, ', ', state, ' - ', pincode, ', ', country) AS address
      FROM supplier_address
    ) sa ON sa.supplier_id = s.id

    WHERE u.role = 'supplier'`;

    let params = [];

    if (search) {
      query += ` AND s.business_name LIKE ?`;
      params.push(`%${search}%`);
    }

    if (status) {
      query += ` AND s.verification_status = ?`;
      params.push(status);
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [suppliers] = await db.query(query, params);

    // COUNT QUERY
    let countQuery = `SELECT COUNT(*) AS total
                      FROM suppliers s
                      LEFT JOIN users u ON u.id = s.user_id
                      WHERE u.role = 'supplier'`;

    let countParam = [];

    if (search) {
      countQuery += ` AND s.business_name LIKE ?`;
      countParam.push(`%${search}%`);
    }

    if (status) {
      countQuery += ` AND s.verification_status = ?`;
      countParam.push(status);
    }

    const [count] = await db.query(countQuery, countParam);

    const total = count[0].total;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      suppliers,
      currentPage: page,
      total,
      totalPages
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error',
    });
  }
};
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM users WHERE id = ?`;
  await db.query(sql, id);
  res.status(200).json({
    status: 'Success',
    message: 'The user was deleted',
  });
};
