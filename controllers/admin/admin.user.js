const db = require('./../../config/db');

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


exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM users WHERE id = ?`;
  await db.query(sql, id);
  res.status(200).json({
    status: 'Success',
    message: 'The user was deleted',
  });
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;

    // 🔹 1. USER
    const [userRows] = await db.query(
      `SELECT id, name, email, role 
       FROM users 
       WHERE id = ?`,
      [userId],
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userRows[0];

    // 🔹 2. ADDRESS (default one)
    const [addressRows] = await db.query(
      `SELECT full_name, phone, street, landmark, city, state, pincode 
       FROM addresses 
       WHERE user_id = ? AND is_default = 1 
       LIMIT 1`,
      [userId],
    );

    const address = addressRows[0] || null;

    // 🔹 3. ORDERS
    const [ordersRows] = await db.query(
      `SELECT id, total_amount AS amount, status, created_at 
       FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId],
    );

    // 🔹 4. ACTIVITY
    const [activityRows] = await db.query(
      `SELECT activity, detail, status, created_at 
       FROM user_activity_logs 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [userId],
    );

    // 🔥 FINAL RESPONSE
    res.json({
      ...user,
      address,
      orders: ordersRows,
      activity: activityRows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: 'Reason required' });
    }

    await db.query(
      `UPDATE users 
       SET status = 'suspended',
           suspend_reason = ?,
           suspended_on = NOW()
       WHERE id = ?`,
      [reason, userId],
    );

    res.json({ message: 'User suspended successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.activateUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    await db.query(
      `UPDATE users 
       SET status = 'active',
           suspend_reason = NULL,
           suspended_on = NULL
       WHERE id = ?`,
      [userId],
    );

    res.json({ message: 'User activated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    await db.query(`UPDATE users SET status = 'active' WHERE id = ?`, [userId]);

    res.json({ message: 'User approved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

