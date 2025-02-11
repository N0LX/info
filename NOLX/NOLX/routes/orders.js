const express = require("express");
const router = express.Router();
const pool = require("../db");

// ✅ Get all orders
router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ Get orders of a specific user
router.get('/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const query = `
      SELECT o.order_id, o.order_date, o.order_status, 
             p.product_name, oi.quantity
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN product p ON oi.product_id = p.product_id
      WHERE o.user_id = ?`;

    const [orders] = await pool.query(query, [user_id]);

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    // Group items by order_id
    const ordersMap = {};
    orders.forEach(order => {
      const { order_id, order_date, order_status, product_name, quantity } = order;
      if (!ordersMap[order_id]) {
        ordersMap[order_id] = { order_id, order_date, order_status, items: [] };
      }
      ordersMap[order_id].items.push({ product_name, quantity });
    });

    res.json(Object.values(ordersMap));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// ✅ Create a new order with multiple products
router.post('/add', async (req, res) => {
  const { user_id, transaction_id, order_date, shipping_address, total_price, items } = req.body;

  if (!user_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [orderResult] = await conn.query(
      'INSERT INTO orders (user_id, transaction_id, order_date, shipping_address, total_price) VALUES (?, ?, ?, ?, ?)',
      [user_id, transaction_id, order_date, shipping_address, total_price]
    );

    const orderId = orderResult.insertId;

    const orderItemPromises = items.map(({ product_id, quantity, price }) =>
      conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, product_id, quantity, price]
      )
    );

    await Promise.all(orderItemPromises);
    await conn.commit();

    res.status(201).json({ success: true, message: "Order placed successfully", orderId });
  } catch (error) {
    await conn.rollback();
    console.error('Error inserting order:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    conn.release();
  }
});

// ✅ Delete an order
router.delete('/:id', async (req, res) => {
  const orderId = req.params.id;
  try {
    await pool.query('DELETE FROM order_items WHERE order_id = ?', [orderId]);
    const [result] = await pool.query('DELETE FROM orders WHERE order_id = ?', [orderId]);

    if (result.affectedRows === 0) return res.status(404).send('Order not found');

    res.send('Order and related items deleted');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ Get details of a specific order
router.get('/get/:order_id', async (req, res) => {
  try {
    const { order_id } = req.params;

    const query = `
      SELECT o.order_id, o.order_date, o.order_status, o.shipping_address, o.total_price, 
             p.product_name, oi.quantity, oi.price
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN product p ON oi.product_id = p.product_id
      WHERE o.order_id = ?`;

    const [orderDetails] = await pool.query(query, [order_id]);

    if (orderDetails.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Group items under the order
    const orderInfo = {
      order_id: orderDetails[0].order_id,
      order_date: orderDetails[0].order_date,
      order_status: orderDetails[0].order_status,
      shipping_address: orderDetails[0].shipping_address,
      total_price: orderDetails[0].total_price,
      items: orderDetails.map(({ product_name, quantity, price }) => ({
        product_name,
        quantity,
        price,
      })),
    };

    res.json(orderInfo);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;