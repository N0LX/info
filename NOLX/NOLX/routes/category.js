const express = require("express");
const cors = require("cors");
const router = express.Router();
const { CATEGORY_TABLE } = require("../config");
const pool = require("../db");
const utils = require("../utils");

router.use(cors()); // Enable CORS globally

// ✅ GET: Fetch all categories
router.get("/all", async (req, res) => {
    try {
        const [results] = await pool.execute(`SELECT * FROM ${CATEGORY_TABLE}`);
        if (results.length === 0) {
            return res.status(404).json(utils.createError("No categories found"));
        }
        console.log("✅ Categories Retrieved:", results);
        res.json(utils.createSuccess(results));
    } catch (err) {
        console.error("❌ Error executing query:", err.message);
        res.status(500).json(utils.createError(err.message));
    }
});

// ✅ GET: Search category by name
router.get("/name/:name", async (req, res) => {
    try {
        const { name } = req.params;
        console.log("Searching for category:", name);

        const [result] = await pool.execute(
            `SELECT * FROM ${CATEGORY_TABLE} WHERE category_name LIKE ?`,
            [`%${name}%`]
        );

        if (result.length === 0) {
            return res.status(404).json(utils.createError("No category found"));
        }

        res.json(utils.createSuccess(result));
    } catch (err) {
        res.status(500).json(utils.createError(err.message));
    }
});

// ✅ POST: Add a new category
router.post("/add", async (req, res) => {
    try {
        const { category_name } = req.body;

        if (!category_name) {
            return res.status(400).json(utils.createError("Category name is required"));
        }

        await pool.execute(
            `INSERT INTO ${CATEGORY_TABLE} (category_name) VALUES (?)`,
            [category_name]
        );

        res.json(utils.createSuccess("Category added successfully."));
    } catch (err) {
        res.status(500).json(utils.createError(err.message));
    }
});

// ✅ PUT: Update category
router.put("/update/:category_id", async (req, res) => {
    try {
        const { category_id } = req.params;
        const { category_name } = req.body;

        const [result] = await pool.execute(
            `UPDATE ${CATEGORY_TABLE} SET category_name = ? WHERE category_id = ?`,
            [category_name, category_id]
        );

        if (result.affectedRows > 0) {
            res.json(utils.createSuccess("Category updated successfully."));
        } else {
            res.status(404).json(utils.createError("Category not found."));
        }
    } catch (err) {
        res.status(500).json(utils.createError(err.message));
    }
});

// ✅ DELETE: Delete category
router.delete("/delete/:category_id", async (req, res) => {
    try {
        const { category_id } = req.params;

        const [result] = await pool.execute(
            `DELETE FROM ${CATEGORY_TABLE} WHERE category_id = ?`,
            [category_id]
        );

        if (result.affectedRows > 0) {
            res.json(utils.createSuccess("Category deleted successfully."));
        } else {
            res.status(404).json(utils.createError("Category not found."));
        }
    } catch (err) {
        res.status(500).json(utils.createError(err.message));
    }
});

module.exports = router;
