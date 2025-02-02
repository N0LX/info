const express = require("express");
const router = express.Router();
const pool = require("../db");
const utils = require("../utils");
const { CATEGORY_TABLE } = require("../config");

// Search category by name
router.get("/:name", (request, response) => {
    const { name } = request.query;

    console.log("Searching for category with name:", name);

    const statement = `SELECT * FROM ${CATEGORY_TABLE} WHERE category_name LIKE ?`;

    pool.execute(statement, [`%${name}%`], (err, result) => {
        if (err) {
            response.send(utils.createError(err.message));
        } else {
            console.log("Query result:", result);

            if (result.length === 0) {
                response
                    .status(404)
                    .send(utils.createError("No category found with this name"));
            } else {
                response.send(utils.createSuccess(result));
            }
        }
    });
});

// POST: Add a new category
router.post("/add", (req, res) => {
    const { category_name, product_id } = req.body;

    const statement = `
        INSERT INTO ${CATEGORY_TABLE} (category_name, product_id)
        VALUES (?, ?);
    `;

    pool.execute(statement, [category_name, product_id], (err, result) => {
        if (err) {
            res.send(utils.createError(err.message));
        } else {
            res.send(utils.createSuccess("Category added successfully."));
        }
    });
});

// GET: Fetch categories by product_id
router.get("/", (req, res) => {
    const { product_id } = req.query;

    let statement = `SELECT * FROM ${CATEGORY_TABLE}`;
    const params = [];

    if (product_id) {
        statement += " WHERE product_id = ?";
        params.push(product_id);
    }

    pool.execute(statement, params, (err, results) => {
        if (err) {
            res.send(utils.createError(err.message));
        } else {
            res.send(utils.createSuccess(results));
        }
    });
});

// PUT: Update category details
router.put("/update/:category_id", (req, res) => {
    const category_id = req.params.category_id;
    const { category_name, product_id } = req.body;

    const statement = `
        UPDATE ${CATEGORY_TABLE}
        SET category_name = ?, product_id = ?
        WHERE category_id = ?;
    `;

    pool.execute(
        statement,
        [category_name, product_id, category_id],
        (err, result) => {
            if (err) {
                res.send(utils.createError(err.message));
            } else {
                if (result.affectedRows > 0) {
                    res.send(utils.createSuccess("Category updated successfully."));
                } else {
                    res.send(utils.createError("Category not found or unauthorized action."));
                }
            }
        }
    );
});

// DELETE: Delete a category
router.delete("/delete/:category_id", (req, res) => {
    const category_id = req.params.category_id;

    const statement = `
        DELETE FROM ${CATEGORY_TABLE}
        WHERE category_id = ?;
    `;

    pool.execute(statement, [category_id], (err, result) => {
        if (err) {
            res.send(utils.createError(err.message));
        } else {
            if (result.affectedRows > 0) {
                res.send(utils.createSuccess("Category deleted successfully."));
            } else {
                res.send(utils.createError("Category not found or unauthorized action."));
            }
        }
    });
});

// GET: Get all categories
router.get("/all", (req, res) => {
    const statement = `SELECT * FROM ${CATEGORY_TABLE}`;

    pool.execute(statement, [], (err, results) => {
        if (err) {
            res.send(utils.createError(err.message));
        } else {
            res.send(utils.createSuccess(results));
        }
    });
});


module.exports = router;
