const db = require('./../../config/db');

exports.getRecentActivities = async (req, res) => {
  try {
    const query = `
      SELECT 
        created_at AS timeStamp,
        user_name AS name,
        ip_address AS address,
        activity AS log,
        status
      FROM user_activity_logs
      ORDER BY created_at DESC
      LIMIT 5
    `;

    const [activities] = await db.query(query);

    res.status(200).json({ activities });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
    });
  }
};

exports.getAllActivities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        created_at AS timeStamp,
        user_name AS name,
        ip_address AS address,
        activity AS log,
        status
      FROM user_activity_logs
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [activities] = await db.query(query, [limit, offset]);

    const [[{ total }]] = await db.query(`
      SELECT COUNT(*) AS total
      FROM user_activity_logs
    `);

    const totalPages = Math.ceil(total / limit);

    res.json({
      activities,
      currentPage: page,
      totalPages,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
