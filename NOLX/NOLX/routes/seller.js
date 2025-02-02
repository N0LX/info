const express = require("express");
const router = express.Router();
const pool = require("../db");
const utils = require("../utils");
const { SELLER_TABLE, USER_TABLE } = require("../config");

// POST: Seller Registration
router.post("/register", (req, res) => {
    const { user_id } = req.body;

    const statement = `
        INSERT INTO ${SELLER_TABLE} (user_id)
        VALUES (?);
    `;

    pool.execute(statement, [user_id], (err, result) => {
        if (err) {
            res.send(utils.createError(err.message));
        } else {
            res.send(utils.createSuccess("Seller registered successfully."));
        }
    });
});

// GET: Fetch All Sellers (Admin Only functionality)
router.get("/sellers", (req, res) => {
    const statement = `
        SELECT s.seller_id, u.name, u.email, u.phone
        FROM ${SELLER_TABLE} s
        JOIN ${USER_TABLE} u ON s.user_id = u.user_id;
    `;

    pool.execute(statement, [], (err, results) => {
        if (err) {
            res.send(utils.createError(err.message));
        } else {
            res.send(utils.createSuccess(results));
        }
    });
});

// DELETE: Delete a seller by user_id
router.delete("/:user_id", (req, res) => {
    const user_id = req.params.user_id;

    // Debugging log to check the value of user_id
    console.log(`Deleting seller with user_id: ${user_id}`);

    if (user_id === undefined) {
        res.send(utils.createError("user_id is required"));
        return;
    }

    const statement = `
        DELETE FROM ${SELLER_TABLE}
        WHERE user_id = ?;
    `;

    console.log(`Executing SQL: ${statement}`); // Debug log to check the SQL statement

    pool.execute(statement, [user_id], (err, result) => {
        if (err) {
            res.send(utils.createError(err.message));
        } else {
            if (result.affectedRows > 0) {
                res.send(utils.createSuccess("Seller deleted successfully."));
            } else {
                res.send(utils.createError("Seller not found for the provided user_id."));
            }
        }
    });
});

module.exports = router;
