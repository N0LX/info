const express = require("express");
const router = express.Router();
const pool = require("../db");
const utils = require("../utils");
const { WISHLIST_TABLE, PRODUCT_TABLE } = require("../config");

// 🟢 POST: Add to Wishlist
router.post("/add", async (req, res) => {
    const { user_id, product_id } = req.body;
    if (!user_id || !product_id) {
        return res.status(400).json(utils.createError("User ID and Product ID are required"));
    }

    let conn;
    try {
        conn = await pool.getConnection();

        // Check if the product is already in the wishlist
        const [exists] = await conn.execute(
            `SELECT * FROM ${WISHLIST_TABLE} WHERE user_id = ? AND product_id = ?`,
            [user_id, product_id]
        );

        if (exists.length > 0) {
            return res.status(400).json(utils.createError("Product is already in wishlist"));
        }

        // Insert into wishlist
        await conn.execute(
            `INSERT INTO ${WISHLIST_TABLE} (user_id, product_id) VALUES (?, ?)`,
            [user_id, product_id]
        );

        return res.json(utils.createSuccess("Added to wishlist successfully."));
    } catch (err) {
        return res.status(500).json(utils.createError(err.message));
    } finally {
        if (conn) conn.release();
    }
});

// 🟢 GET: Fetch Wishlist by User ID
router.get("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json(utils.createError("User ID is required"));
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.execute(
            `SELECT * FROM ${WISHLIST_TABLE} WHERE user_id = ?`,
            [userId]
        );

        if (result.length === 0) {
            return res.status(404).json(utils.createError("No wishlist items found"));
        }

        return res.json(utils.createSuccess(result));
    } catch (err) {
        return res.status(500).json(utils.createError(err.message));
    } finally {
        if (conn) conn.release();
    }
});

// 🟢 DELETE: Remove from Wishlist
router.delete("/remove", async (req, res) => {
    const { user_id, product_id } = req.body;
    if (!user_id || !product_id) {
        return res.status(400).json(utils.createError("User ID and Product ID are required"));
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.execute(
            `DELETE FROM ${WISHLIST_TABLE} WHERE user_id = ? AND product_id = ?`,
            [user_id, product_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json(utils.createError("Wishlist item not found"));
        }

        return res.json(utils.createSuccess("Removed from wishlist successfully."));
    } catch (err) {
        return res.status(500).json(utils.createError(err.message));
    } finally {
        if (conn) conn.release();
    }
});

// 🟢 GET: Fetch Wishlist Items with Product Details (JOIN)
router.get("/list/:userId", async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json(utils.createError("User ID is required"));
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const [rows] = await conn.execute(
            `SELECT p.product_id, p.product_name, p.price, p.image_url 
             FROM ${PRODUCT_TABLE} p
             INNER JOIN ${WISHLIST_TABLE} w ON p.product_id = w.product_id
             WHERE w.user_id = ?`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json(utils.createError("No items found in wishlist"));
        }

        return res.json(utils.createSuccess(rows));
    } catch (err) {
        return res.status(500).json(utils.createError(err.message));
    } finally {
        if (conn) conn.release();
    }
});

module.exports = router;
