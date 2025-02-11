const express = require("express");
const router = express.Router();
const pool = require("../db");  
const { PAYMENT_TABLE } = require("../config");

// Get payment details by transaction_id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [payment] = await pool.query(`SELECT * FROM ${PAYMENT_TABLE} WHERE transaction_id = ?`, [id]); 
    if (payment.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Payment not found' });
    }
    res.status(200).json({ status: 'success', data: payment[0] });
  } catch (error) {
    console.error('Error fetching payment:', error.stack);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

// Add a new payment
router.post('/add', async (req, res) => {
  console.log("Received payment request:", req.body);

  const { method, amount, upi_id, card_id } = req.body;
  
  if (!method || !amount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
      const query = `INSERT INTO ${PAYMENT_TABLE} (payment_method, amount, upi_id, card_id, payment_status) VALUES (?, ?, ?, ?, ?)`;
      const values = [method, amount, upi_id || null, card_id || null, "Pending"];

      const [result] = await pool.query(query, values); // ✅ Now this will work
      console.log("Inserted Payment:", result);

      res.status(201).json({ success: true, transaction_id: result.insertId });
  } catch (error) {
      console.error("Database Error:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
