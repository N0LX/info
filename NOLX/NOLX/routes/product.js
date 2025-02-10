const express = require("express");
const router = express.Router();
const pool = require("../db");
const utils = require("../utils");
const { PRODUCT_TABLE, CATEGORY_TABLE } = require("../config");

// Search product by name
router.get("/name", (request, response) => {
    const { name } = request.query;

    console.log("Searching for product with name:", name);

    const statement = `SELECT * FROM ${PRODUCT_TABLE} WHERE product_name LIKE ?`;

    pool.execute(statement, [`%${name}%`], (err, result) => {
        if (err) {
            response.send(utils.createError(err.message));
        } else {
            console.log("Query result:", result);

            if (result.length === 0) {
                response
                    .status(404)
                    .send(utils.createError("No product found with this name"));
            } else {
                response.send(utils.createSuccess(result));
            }
        }
    });
});

// POST: Add a new product
router.post("/add", (req, res) => {
    const { product_name, seller_id, category_id, description, stock, price, image_url } = req.body;

    // Check if category_id exists in category table
    const categoryCheckStmt = `SELECT * FROM ${CATEGORY_TABLE} WHERE category_id = ?`;
    pool.execute(categoryCheckStmt, [category_id], (categoryErr, categoryResult) => {
        if (categoryErr) {
            res.send(utils.createError(categoryErr.message));
        } else {
            if (categoryResult.length === 0) {
                res.send(utils.createError("category_id does not exist"));
            } else {
                const statement = `
                    INSERT INTO ${PRODUCT_TABLE} (product_name, seller_id, category_id, description, stock, price, image_url)
                    VALUES (?, ?, ?, ?, ?, ?, ?);
                `;
                pool.execute(statement, [product_name, seller_id, category_id, description, stock, price, image_url], (err, result) => {
                    if (err) {
                        res.send(utils.createError(err.message));
                    } else {
                        res.send(utils.createSuccess("Product added successfully."));
                    }
                });
            }
        }
    });
});

// GET: Fetch products by seller or category_id
router.get("/", (req, res) => {
    const { seller_id, category_id } = req.query;

    let statement = `SELECT * FROM ${PRODUCT_TABLE}`;
    const params = [];

    if (seller_id) {
        statement += " WHERE seller_id = ?";
        params.push(seller_id);
    } else if (category_id) {
        statement += " WHERE category_id = ?";
        params.push(category_id);
    }

    pool.execute(statement, params, (err, results) => {
        if (err) {
            res.send(utils.createError(err.message));
        } else {
            res.send(utils.createSuccess(results));
        }
    });
});

// PUT: Update product details (by seller)
router.put("/update/:product_id", (req, res) => {
    const product_id = req.params.product_id;
    const { product_name, description, stock, category_id, seller_id, price } = req.body;

    const statement = `
        UPDATE ${PRODUCT_TABLE}
        SET product_name = ?, description = ?, stock = ?, category_id = ?, price = ?
        WHERE product_id = ? AND seller_id = ?;
    `;

    pool.execute(
        statement,
        [product_name, description, stock, category_id, price, product_id, seller_id],
        (err, result) => {
            if (err) {
                res.send(utils.createError(err.message));
            } else {
                if (result.affectedRows > 0) {
                    res.send(utils.createSuccess("Product updated successfully."));
                } else {
                    res.send(utils.createError("Product not found or unauthorized action."));
                }
            }
        }
    );
});

// DELETE: Delete a product (by seller)
router.delete("/delete/:product_id", (req, res) => {
    const product_id = req.params.product_id;
    const { seller_id } = req.body;

    const statement = `
        DELETE FROM ${PRODUCT_TABLE}
        WHERE product_id = ? AND seller_id = ?;
    `;

    pool.execute(statement, [product_id, seller_id], (err, result) => {
        if (err) {
            res.send(utils.createError(err.message));
        } else {
            if (result.affectedRows > 0) {
                res.send(utils.createSuccess("Product deleted successfully."));
            } else {
                res.send(utils.createError("Product not found or unauthorized action."));
            }
        }
    });
});

module.exports = router;
