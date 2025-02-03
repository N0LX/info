const express = require("express");
const router = express.Router();
const pool = require("../db");
const utils = require("../utils");

// GET all DispatchedOrders
router.get("/all", (req, res) => {
  const statement = `SELECT * FROM DispatchedOrders`;

  pool.execute(statement, (err, result) => {
    if (err) {
      return res.send(utils.createError(err.message));
    }
    res.send(utils.createSuccess(result));
  });
});

// POST: Add a new DispatchedOrder
router.post("/add", (req, res) => {
  const { order_id, seller_id, transport_services_id, dispatch_date } = req.body;

  // Validate required fields
  if (!order_id || !seller_id || !dispatch_date) {
    return res.send(utils.createError("Missing required fields: order_id, seller_id, or dispatch_date"));
  }

  const statement = `INSERT INTO DispatchedOrders (order_id, seller_id, transport_services_id, dispatch_date) 
                     VALUES (?, ?, ?, ?)`;

  pool.execute(
    statement,
    [order_id, seller_id, transport_services_id, dispatch_date],
    (err, result) => {
      if (err) {
        return res.send(utils.createError(err.message));
      }
      res.send(utils.createSuccess("DispatchedOrder added successfully."));
    }
  );
});

// PUT: Update an existing DispatchedOrder
router.put("/update/:id", (req, res) => {
  const dispatched_order_id = req.params.id;
  const { order_id, seller_id, transport_services_id, dispatch_date } = req.body;

  const updateFields = [];
  const updateValues = [];

  if (order_id !== undefined) {
    updateFields.push("order_id = ?");
    updateValues.push(order_id);
  }

  if (seller_id !== undefined) {
    updateFields.push("seller_id = ?");
    updateValues.push(seller_id);
  }

  if (transport_services_id !== undefined) {
    updateFields.push("transport_services_id = ?");
    updateValues.push(transport_services_id);
  }

  if (dispatch_date !== undefined) {
    updateFields.push("dispatch_date = ?");
    updateValues.push(dispatch_date);
  }

  if (updateFields.length === 0) {
    return res.send(utils.createError("No fields to update"));
  }

  const statement = `UPDATE DispatchedOrders SET ${updateFields.join(", ")} WHERE dispatched_order_id = ?`;

  updateValues.push(dispatched_order_id);

  pool.execute(statement, updateValues, (err, result) => {
    if (err) {
      return res.send(utils.createError(err.message));
    }

    if (result.affectedRows > 0) {
      res.send(utils.createSuccess("DispatchedOrder updated successfully."));
    } else {
      res.send(utils.createError("DispatchedOrder not found"));
    }
  });
});

module.exports = router;


