const express = require("express");
const router = express.Router();
const pool = require("../db");
const utils = require("../utils");
const { WISHLIST_TABLE } = require("../config");

// POST operation: Add to Wishlist
router.post("/add", (request, response) => {
    const { user_id, product_id } = request.body;

    // Check if the user exists
    const userCheckStatement = `SELECT * FROM Users WHERE user_id = ?`;
    
    pool.execute(userCheckStatement, [user_id], (err, userResult) => {
        if (err) {
            return response.send(utils.createError(err.message));
        }
        
        if (userResult.length === 0) {
            return response.send(utils.createError("User  does not exist."));
        }

        // Proceed to add to wishlist if user exists
        const statement = `INSERT INTO ${WISHLIST_TABLE} (user_id, product_id) VALUES (?, ?)`;

        pool.execute(statement, [user_id, product_id], (err, result) => {
            if (err) {
                response.send(utils.createError(err.message));
            } else {
                response.send(utils.createSuccess("Added to wishlist successfully."));
            }
        });
    });
});

// GET operation: Fetch Wishlist
router.get("/user/:userId", (request, response) => {
    const userId = request.params.userId;

    const statement = `SELECT * FROM ${WISHLIST_TABLE} WHERE user_id = ?`;

    pool.execute(statement, [userId], (err, result) => {
        if (err) {
            response.send(utils.createError(err.message));
        } else {
            response.send(utils.createSuccess(result));
        }
    });
});
// DELETE operation: Delete from Wishlist
router.delete("/remove", (request, response) => {
    const product_id = request.body.product_id;
    const user_id = request.body.user_id;
    const statement = `DELETE FROM ${WISHLIST_TABLE} WHERE user_id = ? AND product_id = ?`;

    pool.execute(statement, [user_id,product_id], (err, result) => {
        if (err) {
            response.send(utils.createError(err.message));
        } else {
            if (result.affectedRows > 0) {
                response.send(utils.createSuccess("Removed from wishlist successfully."));
            } else {
                response.send(utils.createError("Wishlist item not found."));
            }
        }
    });
});

// Fetch wishlist items using JOIN
router.get('/list/:userId', async (req, res) => {
    const userId = req.params.userId; // Fetch userId from URL params (e.g., /list/1)

    if (!userId) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'User ID is required' 
      });
    }

    try {
      const query = `
        SELECT p.product_id, p.product_name, p.price, p.image_url
        FROM product p
        INNER JOIN wishlist w ON p.product_id = w.product_id
        WHERE w.user_id = ?;
      `;
  
      // Execute query using your DB connection pool
      pool.execute(query, [userId], (err, rows) => {
        if (err) {
          console.error("Error fetching wishlist details:", err);
          return res.status(500).json({ 
            status: 'error', 
            message: 'Internal server error' 
          });
        }
  
        if (rows.length === 0) {
          return res.status(404).json({ 
            status: 'error', 
            message: 'No items found in wishlist' 
          });
        }
  
        // Send response with product data
        res.json({
          status: 'success',
          data: rows.map(row => ({
            product_id: row.product_id,
            product_name: row.product_name,
            price: row.price,
            image_url: row.image_url
          }))
        });
      });
    } catch (error) {
      console.error("Error fetching wishlist details:", error);
      res.status(500).json({ 
        status: 'error', 
        message: 'Internal server error' 
      });
    }
});


  
module.exports = router;