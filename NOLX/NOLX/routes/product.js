const express = require("express");
const router = express.Router();
const pool = require("../db");
const utils = require("../utils");
const { PRODUCT_TABLE, CATEGORY_TABLE } = require("../config");

// 🟢 GET: Fetch all products
router.get("/", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const [results] = await conn.query(`SELECT * FROM ${PRODUCT_TABLE}`);

        if (results.length === 0) {
            return res.status(404).json(utils.createError("No products found"));
        }

        return res.json(utils.createSuccess(results));
    } catch (err) {
        return res.status(500).json(utils.createError(err.message));
    } finally {
        if (conn) conn.release();
    }
});

// 🟢 GET: Search product by name
router.get("/name", async (req, res) => {
    const { name } = req.query;
    if (!name) return res.status(400).json(utils.createError("Product name is required"));

    let conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(
            `SELECT * FROM ${PRODUCT_TABLE} WHERE product_name LIKE ?`, 
            [`%${name}%`]
        );

        if (result.length === 0) {
            return res.status(404).json(utils.createError("No product found with this name"));
        }

        return res.json(utils.createSuccess(result));
    } catch (err) {
        return res.status(500).json(utils.createError(err.message));
    } finally {
        if (conn) conn.release();
    }
});

// 🟢 POST: Add a new product
router.post("/add", async (req, res) => {
    const { product_name, seller_id, category_id, description, stock, price, image_url } = req.body;
    if (!product_name || !seller_id || !category_id || !stock || !price) {
        return res.status(400).json(utils.createError("Missing required fields"));
    }

    let conn;
    try {
        conn = await pool.getConnection();

        // Check if category_id exists
        const [categoryResult] = await conn.query(
            `SELECT * FROM ${CATEGORY_TABLE} WHERE category_id = ?`,
            [category_id]
        );

        if (categoryResult.length === 0) {
            return res.status(404).json(utils.createError("Category does not exist"));
        }

        // Insert new product
        await conn.query(
            `INSERT INTO ${PRODUCT_TABLE} 
            (product_name, seller_id, category_id, description, stock, price, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [product_name, seller_id, category_id, description, stock, price, image_url]
        );

        return res.json(utils.createSuccess("Product added successfully."));
    } catch (err) {
        return res.status(500).json(utils.createError(err.message));
    } finally {
        if (conn) conn.release();
    }
});

// 🟢 GET: Fetch products by seller or category
router.get("/filter", async (req, res) => {
    const { seller_id, category_id } = req.query;
    if (!seller_id && !category_id) {
        return res.status(400).json(utils.createError("Either seller_id or category_id is required"));
    }

    let conn;
    try {
        conn = await pool.getConnection();
        let query = `SELECT * FROM ${PRODUCT_TABLE} WHERE `;
        const params = [];

        if (seller_id && category_id) {
            query += "seller_id = ? AND category_id = ?";
            params.push(seller_id, category_id);
        } else if (seller_id) {
            query += "seller_id = ?";
            params.push(seller_id);
        } else if (category_id) {
            query += "category_id = ?";
            params.push(category_id);
        }

        const [results] = await conn.query(query, params);

        if (results.length === 0) {
            return res.status(404).json(utils.createError("No products found"));
        }

        return res.json(utils.createSuccess(results));
    } catch (err) {
        return res.status(500).json(utils.createError(err.message));
    } finally {
        if (conn) conn.release();
    }
});

// 🟢 PUT: Update product details (by seller)
router.put("/update/:product_id", async (req, res) => {
    const { product_id } = req.params;
    const { product_name, description, stock, category_id, seller_id, price } = req.body;
    if (!product_id || !seller_id) {
        return res.status(400).json(utils.createError("Product ID and Seller ID are required"));
    }

    let conn;
    try {
        conn = await pool.getConnection();

        // If category_id is provided, ensure it exists
        if (category_id) {
            const [categoryCheck] = await conn.query(
                `SELECT * FROM ${CATEGORY_TABLE} WHERE category_id = ?`,
                [category_id]
            );

            if (categoryCheck.length === 0) {
                return res.status(404).json(utils.createError("Invalid category ID"));
            }
        }

        const statement = `
            UPDATE ${PRODUCT_TABLE}
            SET 
                product_name = COALESCE(?, product_name),
                description = COALESCE(?, description),
                stock = COALESCE(?, stock),
                category_id = COALESCE(?, category_id),
                price = COALESCE(?, price)
            WHERE product_id = ? AND seller_id = ?;
        `;

        const [result] = await conn.query(statement, [
            product_name, description, stock, category_id, price, product_id, seller_id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json(utils.createError("Product not found or unauthorized action"));
        }

        return res.json(utils.createSuccess("Product updated successfully."));
    } catch (error) {
        return res.status(500).json(utils.createError(error.message));
    } finally {
        if (conn) conn.release();
    }
});

// 🟢 DELETE: Delete a product (by seller)
router.delete("/delete/:product_id", async (req, res) => {
    const { product_id } = req.params;
    const { seller_id } = req.body;
    if (!seller_id) {
        return res.status(400).json(utils.createError("Seller ID is required"));
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(
            `DELETE FROM ${PRODUCT_TABLE} WHERE product_id = ? AND seller_id = ?`,
            [product_id, seller_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json(utils.createError("Product not found or unauthorized action"));
        }

        return res.json(utils.createSuccess("Product deleted successfully."));
    } catch (err) {
        return res.status(500).json(utils.createError(err.message));
    } finally {
        if (conn) conn.release();
    }
});

module.exports = router;
