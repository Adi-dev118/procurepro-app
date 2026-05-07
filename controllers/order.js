const db = require('./../config/db');

exports.newOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const userId = req.params.id;
    const [row] = await connection.query(`SELECT id FROM carts WHERE user_id = ? `, [userId]);

    const [result] = await db.query(`SELECT role FROM users WHERE id = ?`, [userId]);
    if (result.length === 0) {
      await connection.rollback();
      return res.status(500).json({
        status: 'Failed',
        message: "The user doesn't exist",
      });
    }
    const user = result[0];

    if (user.role !== 'customer') {
      await connection.rollback();
      return res.status(500).json({
        status: 'Failed',
        message: 'Only customers can order',
      });
    }

    if (row.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        status: 'Failed',
        message: 'The cart is empty',
      });
    }
    const cartId = row[0].id;

    const [cartItems] = await connection.query(
      `SELECT product_id, quantity, price FROM cart_items WHERE cart_id = ?`,
      [cartId],
    );
    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        status: 'Failed',
        message: 'The cart is empty',
      });
    }
    // console.log(cartItems)
    const productIds = cartItems.map((el) => el.product_id);

    const [check] = await connection.query(`SELECT id, stock, name FROM products WHERE id IN (?)`, [
      productIds,
    ]);

    if (check.length !== cartItems.length) {
      throw new Error('Some Products no Longer Exits');
    }

    const nameMap = new Map(check.map((p) => [p.id, p.name]));

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = cartItems.map((items) => {
      const name = nameMap.get(items.product_id);
      const qty = items.quantity;
      const o = {
        item: name,
        quantity: qty,
      };
      return o;
    });

    const [next] = await connection.query(
      `INSERT INTO orders (user_id, total_amount, created_at) VALUES (?, ?, ?)`,
      [userId, totalPrice, new Date()],
    );

    const orderId = next.insertId;
    const values = cartItems.map((items) => [
      orderId,
      items.product_id,
      items.quantity,
      items.price,
      items.price * items.quantity,
    ]);

    await connection.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, subtotal) VALUES ?`,
      [values],
    );

    for (const items of cartItems) {
      const [result] = await connection.query(
        `UPDATE products SET stock= stock - ? WHERE id = ? AND stock >= ?`,
        [items.quantity, items.product_id, items.quantity],
      );
      if (result.affectedRows === 0) {
        throw new Error('Stock Insufficient');
      }
    }

    await connection.query(`DELETE from cart_items WHERE cart_id =? `, [cartId]);

    await connection.commit();

    res.status(201).json({
      status: 'Success',
      message: 'The order was Successfully Placed',
      data: {
        order,
        totalPrice,
      },
    });
  } catch (error) {
    await connection.rollback();
    return res.status(500).json({
      status: 'Failed',
      message: error.message,
    });
  } finally {
    connection.release();
  }
};
