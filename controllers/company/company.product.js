const db = require('../../config/db');
exports.getProducts = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    const category = req.query.category;
    const stock = req.query.stock;

    let where = `WHERE p.verification_status = 'approved'`;
    let params = [];

    // 🔍 filters
    if (search) {
      where += ` AND p.name LIKE ?`;
      params.push(`%${search}%`);
    }

    if (category) {
      where += ` AND p.category_id = ?`;
      params.push(category);
    }

    if (stock === 'in') {
      where += ` AND p.stock > 0`;
    } else if (stock === 'out') {
      where += ` AND p.stock = 0`;
    } else if (stock === 'low') {
      where += ` AND p.stock BETWEEN 1 AND 50`;
    }

    // 🔥 MAIN QUERY
    const query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.moq,
        p.stock,
        p.icon,
        p.moq,
        c.name AS category,
        s.business_name AS supplier,
        MAX(sa.state) AS state,
        MAX(sa.country) AS country,
        ROUND(COALESCE(AVG(pr2.rating), 0), 1) AS rating,
        COUNT(DISTINCT pr2.id) AS reviews
      FROM products p
      JOIN categories c ON c.id = p.category_id
      JOIN suppliers s ON s.id = p.supplier_id
      LEFT JOIN supplier_address sa ON s.id = sa.supplier_id
      LEFT JOIN products p2 ON p2.supplier_id = s.id
      LEFT JOIN product_reviews pr2 ON pr2.product_id = p2.id
      ${where}
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [products] = await db.query(query, [...params, limit, offset]);

    // 🔥 COUNT QUERY (must match filters)
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM products p
      ${where}
    `;

    const [[{ total }]] = await db.query(countQuery, params);

    const totalPages = Math.ceil(total / limit);

    res.json({
      currentPage: page,
      products,
      totalPages,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
