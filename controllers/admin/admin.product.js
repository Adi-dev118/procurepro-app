const db = require('./../../config/db');
exports.getProducts = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const status = req.query.status;
    const category = req.query.category;
    const stock = req.query.stock;

    let query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.icon,
        p.sku,
        p.final_price,
        p.stock,
        p.verification_status,
        c.name AS category,
        s.business_name AS company
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE 1=1
    `;

    let params = [];

    if (search) {
      query += ` AND p.name LIKE ?`;
      params.push(`%${search}%`);
    }

    if (status) {
      query += ` AND p.verification_status = ?`;
      params.push(status);
    }

    if (category) {
      query += ` AND p.category_id = ?`;
      params.push(category);
    }

    if (stock === 'in') {
      query += ` AND p.stock > 0`;
    } else if (stock === 'out') {
      query += ` AND p.stock = 0`;
    } else if (stock === 'low') {
      query += ` AND p.stock BETWEEN 1 AND 50`;
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [products] = await db.query(query, params);

    // COUNT QUERY
    let countQuery = `
      SELECT COUNT(*) AS total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE 1=1
    `;

    let countParams = [];

    if (search) {
      countQuery += ` AND p.name LIKE ?`;
      countParams.push(`%${search}%`);
    }

    if (status) {
      countQuery += ` AND p.verification_status = ?`;
      countParams.push(status);
    }

    if (category) {
      countQuery += ` AND p.category_id = ?`;
      countParams.push(category);
    }

    if (stock === 'in') {
      countQuery += ` AND p.stock > 50`;
    } else if (stock === 'out') {
      countQuery += ` AND p.stock = 0`;
    } else if (stock === 'low') {
      countQuery += ` AND p.stock BETWEEN 1 AND 50`;
    }
    const [[{ total }]] = await db.query(countQuery, countParams);

    const totalPages = Math.ceil(total / limit);
    const [categories] = await db.query(`
      SELECT id, name FROM categories
    `);
    res.status(200).json({
      currentPage: page,
      products,
      totalPages,
      total,
      categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
