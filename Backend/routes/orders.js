const express = require("express");
const router = express.Router();
const pool = require("../db2");  // Correctly using pool to access db
const { ORDERS_TABLE } = require("../config");

// Get all orders
router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM Orders');  // Use pool.query instead of db.query
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Get a specific order by ID
router.get('/:id', async (req, res) => {
  try {
    const [order] = await pool.query('SELECT * FROM Orders WHERE order_id = ?', [req.params.id]);  // Use pool.query
    if (order.length === 0) return res.status(404).send('Order not found');
    res.json(order[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}); 

// Create a new order
router.post('/add', async (req, res) => {
  const { user_id, product_id, tracking_details_id, transaction_id, order_date } = req.body;
  try {
    const [result] = await pool.query(  // Use pool.query
      'INSERT INTO Orders (user_id, product_id, tracking_details_id, transaction_id, order_date) VALUES (?, ?, ?, ?, ?)',
      [user_id, product_id, tracking_details_id, transaction_id, order_date]
    );
    res.status(201).json({ order_id: result.insertId });
  } catch (error) {
    console.error('Error inserting order:', error.message);
    res.status(500).send('Server error');
  }
});

// Delete an order by ID
router.delete('/:id', async (req, res) => {
  const orderId = req.params.id;
  try {
    // First, delete related entries in the DispatchedOrders table
    await pool.query('DELETE FROM DispatchedOrders WHERE order_id = ?', [orderId]);

    // Then, delete the order from the Orders table
    const [result] = await pool.query('DELETE FROM Orders WHERE order_id = ?', [orderId]);
    if (result.affectedRows === 0) return res.status(404).send('Order not found');

    res.send('Order and related dispatched orders deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
