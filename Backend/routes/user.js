const express = require("express");
const router = express.Router();
const pool = require("../db");
const utils = require("../utils");
const { USER_TABLE } = require("../config");
const jwt = require('jsonwebtoken');
const Key = 'aditya';

// Login API
router.get('/login', (req, res) => {
    const { email, password } = req.body;
    const statement = `SELECT email, password FROM ${USER_TABLE} WHERE email = ? AND password = ?`;

    pool.query(statement, [email, password], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).send('Internal server error');
            return;
        }
        if (results.length > 0) {
            const token = jwt.sign({ email },{password}, Key);
            res.json({ isValid: true, token });
        } else {
            res.json({ isValid: false });
        }
    });
});

// Register API
router.post("/register", (request, response) => {
    const { name, password, email, phone, role, location } = request.body;

    if (!name || !password || !email || !phone || !location) {
        return response.send(utils.createError("All fields are required"));
    }

    const statement = `INSERT INTO ${USER_TABLE} (name, password, email, phone, role, location) VALUES (?, ?, ?, ?, ?, ?)`;

    pool.execute(
        statement,
        [name, password, email, phone, role || 'User', location],
        (err, result) => {
            if (err) response.send(utils.createError(err.message));
            else response.send(utils.createSuccess("Registered successfully."));
        }
    );
});

// Get User by ID
router.get("/:id", (request, response) => {
    const userId = request.params.id;

    const statement = `SELECT * FROM ${USER_TABLE} WHERE user_id = ?`;

    pool.execute(statement, [userId], (err, result) => {
        if (err) {
            response.send(utils.createError(err.message));
        } else {
            if (result.length > 0) {
                response.send(utils.createSuccess(result[0]));
            } else {
                response.send(utils.createError("User not found."));
            }
        }
    });
});

// Update User API
router.put("/:id", (request, response) => {
    const userId = request.params.id;
    const { name, password, email, phone, role, location } = request.body;

    const statement = `
        UPDATE ${USER_TABLE}
        SET name = COALESCE(?, name),
            password = COALESCE(?, password),
            email = COALESCE(?, email),
            phone = COALESCE(?, phone),
            role = COALESCE(?, role),
            location = COALESCE(?, location)
        WHERE user_id = ?;
    `;

    pool.execute(
        statement,
        [name, password, email, phone, role, location, userId],
        (err, result) => {
            if (err) {
                response.send(utils.createError(err.message));
            } else {
                response.send(utils.createSuccess("User details updated successfully."));
            }
        }
    );
});

// Delete User API
router.delete("/:id", (request, response) => {
    const userId = request.params.id;

    const statement = `DELETE FROM ${USER_TABLE} WHERE user_id = ?`;

    pool.execute(statement, [userId], (err, result) => {
        if (err) {
            response.send(utils.createError(err.message));
        } else {
            if (result.affectedRows > 0) {
                response.send(utils.createSuccess("User deleted successfully."));
            } else {
                response.send(utils.createError("User not found."));
            }
        }
    });
});

module.exports = router;
