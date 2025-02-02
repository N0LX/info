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

module.exports = router;