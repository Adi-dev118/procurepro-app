const { off } = require('../app');
const db = require('./../config/db');

exports.newProduct = async (req, res) => {
  const sql = `INSERT INTO products (name, sku, price, stock, status) VALUES (?, ?, ?, ?, ?)`;
  const values = [req.body.name, req.body.sku, req.body.price, req.body.stock, 'Available'];

  const [result] = await db.query(sql, values);

  const [product] = await db.query(
    `SELECT name, sku, supplier_id, category_id, price, stock, status FROM products WHERE id=?`,
    result.insertId,
  );

  res.status(200).json({
    status: 'Success',
    data: {
      product: product[0],
    },
  });
};

exports.getAllProducts = async (req, res) => {
  const [product] = await db.query(`SELECT name, sku, price, stock, status FROM products`);
  res.status(200).json({
    status: 'Success',
    data: {
      product,
    },
  });
};

exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  const allowedFields = ['name', 'price', 'stock', 'status'];

  const validUpdates = Object.keys(updates).filter((key) => allowedFields.includes(key));
  if (validUpdates.length === 0) {
    return res.status(400).json({
      message: 'No valid fields to update',
    });
  }
  const setClause = validUpdates.map((field) => `${field} = ?`).join(', ');
  const values = validUpdates.map((field) => updates[field]);
  values.push(id);
  const sql = `UPDATE products SET ${setClause} WHERE id= ?`;

  await db.query(sql, values);

  const [product] = await db.query(
    `SELECT id, name, sku, price, stock, status FROM products WHERE id='${id}'`,
  );
  res.status(200).json({
    status: 'Success',
    data: {
      product,
    },
  });
};
exports.getProducts = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const status = req.query.status;
    const category = req.query.category;
    const stock = req.query.stock;

    let query = `SELECT 
  o.id,
  CONCAT('#ORD-', o.id) AS orderId,

  u.name AS customer,
  u.email,

  DATE_FORMAT(o.created_at, '%Y-%m-%d') AS date,
  DATE_FORMAT(o.created_at, '%h:%i %p') AS time,

  o.status,
  o.payment_status,

  -- 🔥 Order Type
  CASE 
    WHEN o.rfq_id IS NOT NULL THEN 'RFQ'
    ELSE 'Direct'
  END AS orderType,

  -- Items count
  COALESCE(SUM(oi.quantity), 0) AS items,

  -- Total
  o.total_amount AS total
FROM orders o
LEFT JOIN users u ON u.id = o.user_id
LEFT JOIN order_items oi ON oi.order_id = o.id

GROUP BY o.id;`;

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
