const db = require('../../config/db');

exports.getProductStats = async (req, res) => {

  try {

    const vendorId =
      req.session.user.vendorId;

    const [rows] =
      await db.query(
        `
        SELECT

          COUNT(*) AS totalProducts,

          SUM(
            CASE
              WHEN verification_status = 'approved'
              THEN 1
              ELSE 0
            END
          ) AS activeProducts,

          SUM(
            CASE
              WHEN stock > 0
              AND stock <= 50
              THEN 1
              ELSE 0
            END
          ) AS lowStock,

          SUM(
            CASE
              WHEN stock = 0
              THEN 1
              ELSE 0
            END
          ) AS outOfStock

        FROM products

        WHERE supplier_id = ?
        `,
        [vendorId]
      );

    const stats = rows[0];

    res.status(200).json({

      status: 'success',
      stats: {
        totalProducts:
          Number(stats.totalProducts),
        activeProducts:
          Number(stats.activeProducts),
        lowStock:
          Number(stats.lowStock),
        outOfStock:
          Number(stats.outOfStock)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'fail',
      message:
        'Failed to load product stats'
    });
  }
};


exports.getProducts = async (req, res) => {
  try {
    const vendorId = req.session.user.vendorId; // 🔥 IMPORTANT

    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 4;
    const offset = (page - 1) * limit;

    const category = req.query.category;
    const status = req.query.status;
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
      WHERE p.supplier_id = ?  -- 🔥 MAIN FIX
    `;

    let params = [vendorId];

    if (search) {
      query += ` AND p.name LIKE ?`;
      params.push(`%${search}%`);
    }

    if (status === 'active') {
      query += ` AND p.verification_status = 'approved'`;
    } else if (status === 'inactive') {
      query += ` AND p.verification_status = 'suspended'`;
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
      WHERE p.supplier_id = ?   -- 🔥 SAME FIX
    `;

    let countParams = [vendorId];

    if (search) {
      countQuery += ` AND p.name LIKE ?`;
      countParams.push(`%${search}%`);
    }

    if (status === 'active') {
      countQuery += ` AND p.verification_status = 'approved'`;
    } else if (status === 'inactive') {
      countQuery += ` AND p.verification_status = 'suspended'`;
    }

    if (category) {
      countQuery += ` AND p.category_id = ?`;
      countParams.push(category);
    }

    if (stock === 'in') {
      countQuery += ` AND p.stock > 0`;
    } else if (stock === 'out') {
      countQuery += ` AND p.stock = 0`;
    } else if (stock === 'low') {
      countQuery += ` AND p.stock BETWEEN 1 AND 50`;
    }

    const [[{ total }]] = await db.query(countQuery, countParams);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
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
