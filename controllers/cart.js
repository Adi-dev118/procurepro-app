const db = require("./../config/db");


exports.addItems = async (req, res) => {
  // Getting Independent Connection to DB

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Getting User Id and Product Id with Quantity
    const userId = req.params.id;

    const { productId, quantity } = req.body;

    // Validatating Quantity

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({
        status: "Failed",
        message: "The quantity doesn't exist",
      });
    }

    // Checking if Product is Available from ID

    const [rows] = await connection.query(
      `SELECT id, price, stock FROM products WHERE id = ?`,
      [productId],
    );
    console.log(rows);
    if (rows.length === 0) {
      throw new Error("Product not Found");
    }
    const product = rows[0];

    if (quantity > product.stock) {
      throw new Error("The product is not in Stock");
    }

    // Check if Cart exits if not create for that user

    let cartId;

    const [cartRows] = await connection.query(
      `SELECT id FROM carts WHERE user_id= ?`,
      [userId],
    );

    const [row] = await connection.query(`SELECT role FROM users WHERE id = ?`, [
      userId,
    ]);
    if (row.length === 0) {
      await connection.rollback();
      return res.status(500).json({
        status: "Failed",
        message: "The user doesn't exist",
      });
    }
    const user = row[0];

    if (user.role !== "customer") {
      await connection.rollback();
      return res.status(500).json({
        status: "Failed",
        message: "Only customers can order",
      });
    }
    if (cartRows.length > 0) {
      cartId = cartRows[0].id;
    } else {
      const [result] = await connection.query(
        `INSERT INTO carts (user_id, created_at) VALUES (?, ?)`,
        [userId, new Date()],
      );
      cartId = result.insertId;
    }

    // Now add products to the cart

    const [cartProduct] = await connection.query(
      `SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ? FOR UPDATE`,
      [cartId, productId],
    );

    if (cartProduct.length > 0) {
      //1. if product already exits
      const oldQuantity = cartProduct[0].quantity;
      const newQuantity = qty + oldQuantity;
      if (newQuantity > product.stock) {
        throw new Error("Stock Exceeded");
      }
      await connection.query(
        `UPDATE cart_items SET quantity= ? WHERE cart_id = ? AND product_id = ?`,
        [newQuantity, cartId, productId],
      );
    } else {
      //2. If products doesn't exits
      await connection.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
        [cartId, productId, qty, product.price],
      );
    }

    const [finalCart] = await connection.query(
      `SELECT * FROM cart_items WHERE cart_id =?`,
      [cartId],
    );

    await connection.commit();

    res.status(201).json({
      status: "Success",
      data: {
        cart: finalCart,
      },
    });
  } catch (error) {
    await connection.rollback();
    return res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  } finally {
    connection.release();
  }
};

exports.getCartItems = async (req, res) => {
  try {
    const userId = req.params.id;

    const [cart] = await db.query(
      `SELECT p.name, ci.quantity, ci.price FROM carts c JOIN cart_items ci ON c.id = ci.cart_id JOIN products p ON p.id = ci.product_id WHERE c.user_id = ?`,
      [userId],
    );
      const [row] = await db.query(`SELECT role FROM users WHERE id = ?`, [
      userId,
    ]);
    const user = row[0];
    
    if (user.role !== "customer") {
      return res.status(500).json({
        status: "Failed",
        message: "Only customers can have cart",
      });
    }

    res.status(200).json({
      status: "Success",
      data: {
        cart,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid product or quantity",
      });
    }
    const [row] = await db.query(`SELECT id FROM carts WHERE user_id=?`, [
      userId,
    ]);
    if (row.length === 0) {
      return res.status(404).json({
        status: "Failed",
        message: "Cart not found",
      });
    }
    const cartId = row[0].id;
    // console.log(cartId[0].id)
    const [result] = await db.query(
      `UPDATE cart_items SET quantity = quantity - ? WHERE cart_id =? AND product_id = ? AND quantity >= ?`,
      [quantity, cartId, productId, quantity],
    );
    if (result.affectedRows === 0) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid update or insufficient quantity",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Cart was updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};
