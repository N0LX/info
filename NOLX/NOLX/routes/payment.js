const express = require("express");
const router = express.Router();
const pool = require("../db2");  
const { PAYMENT_TABLE } = require("../config");


// Get a specific transaction by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [payment] = await pool.query('SELECT * FROM payment WHERE transaction_id = ?', [id]); 
    if (payment.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Payment not found' });
    }
    res.status(200).json({ status: 'success', data: payment[0] });
  } catch (error) {
    console.error('Error fetching payment:', error.stack);
    res.status(500).send('Server error');
  }
});


router.post('/add', async (req, res) => {
  const { payment_method, payment_status, amount } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO payment (payment_method, payment_status, amount) VALUES (?, ?, ?)',
      [payment_method, payment_status, amount]
    );
    res.status(201).json({ transaction_id: result.insertId });
  } catch (error) {
    console.error('Error:', error.stack);  // More detailed error logging
    res.status(500).send('Server error');
  }
});




module.exports = router;
