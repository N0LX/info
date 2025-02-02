const express = require("express");
const router = express.Router();
const pool = require("../db");
const utils = require("../utils");

// GET Cart items for a user
router.get('/:id', (req, res) => {
    const userId = req.params.id;
    console.log("UserId:", userId);

    const query = `
        SELECT 
            c.cart_id,
            u.name AS user_name,
            p.product_name AS product_name,
            p.description AS product_description,
            c.quantity AS cart_quantity
        FROM 
            Cart c
        JOIN 
            Product p ON c.product_id = p.product_id
        JOIN 
            Users u ON c.user_id = u.user_id
        WHERE 
            c.user_id = ?;
    `;

    pool.execute(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({ status: 'error', message: 'Internal server error' });
        } else {
            if (results.length > 0) {
                res.status(200).json({
                    status: 'success',
                    data: results
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'No cart items found for this user'
                });
            }
        }
    });
});

// POST Add Product to Cart
router.post('/add', (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    console.log("Adding to Cart - UserId:", user_id, "ProductId:", product_id, "Quantity:", quantity);  // Log for debugging

    // Basic validation
    if (!user_id || !product_id || !quantity || quantity <= 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid input: user_id, product_id, and quantity are required'
        });
    }

    // Query to check if the product is already in the user's cart
    const checkQuery = `
        SELECT * FROM Cart
        WHERE user_id = ? AND product_id = ?;
    `;

    pool.execute(checkQuery, [user_id, product_id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({ status: 'error', message: 'Internal server error' });
        } else {
            if (results.length > 0) {
                // Product already exists in cart, update quantity
                const updateQuery = `
                    UPDATE Cart
                    SET quantity = quantity + ?
                    WHERE user_id = ? AND product_id = ?;
                `;

                pool.execute(updateQuery, [quantity, user_id, product_id], (updateErr, updateResults) => {
                    if (updateErr) {
                        console.error(updateErr);
                        res.status(500).send({ status: 'error', message: 'Internal server error' });
                    } else {
                        res.status(200).json({
                            status: 'success',
                            message: 'Cart item quantity updated successfully'
                        });
                    }
                });
            } else {
                // Product not in cart, insert a new row
                const insertQuery = `
                    INSERT INTO Cart (user_id, product_id, quantity)
                    VALUES (?, ?, ?);
                `;

                pool.execute(insertQuery, [user_id, product_id, quantity], (insertErr, insertResults) => {
                    if (insertErr) {
                        console.error(insertErr);
                        res.status(500).send({ status: 'error', message: 'Internal server error' });
                    } else {
                        res.status(201).json({
                            status: 'success',
                            message: 'Product added to cart successfully'
                        });
                    }
                });
            }
        }
    });
});

// DELETE Cart Item
router.delete('/:cartId', (req, res) => {
    const cartId = req.params.cartId;

    const query = `
        DELETE FROM Cart
        WHERE cart_id = ?;
    `;

    pool.execute(query, [cartId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({ status: 'error', message: 'Internal server error' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({
                    status: 'success',
                    message: 'Cart item deleted successfully'
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'Cart item not found'
                });
            }
        }
    });
});

// PUT Update Cart Item
router.put('/:cartId', (req, res) => {
    const cartId = req.params.cartId;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid quantity'
        });
    }

    const query = `
        UPDATE Cart
        SET quantity = ?
        WHERE cart_id = ?;
    `;

    pool.execute(query, [quantity, cartId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({ status: 'error', message: 'Internal server error' });
        } else {
            if (results.affectedRows > 0) {
                res.status(200).json({
                    status: 'success',
                    message: 'Cart item updated successfully'
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'Cart item not found'
                });
            }
        }
    });
});

module.exports = router;
