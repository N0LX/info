const express = require("express");
const router = express.Router();
const pool = require("../db");
const utils = require("../utils");
const { USER_TABLE } = require("../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET_KEY = "aditya";

// Login API
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const statement = `SELECT * FROM ${USER_TABLE} WHERE email = ?`;
    let conn;

    try {
        conn = await pool.getConnection();
        const [results] = await conn.query(statement, [email]);

        if (results.length > 0) {
            const user = results[0];

            // Compare hashed password
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({ email: user.email, id: user.user_id }, SECRET_KEY, { expiresIn: "1h" });
                return res.json({ success: true, token, user });
            } else {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    } finally {
        if (conn) conn.release();
    }
});

// Register API
router.post("/register", async (req, res) => {
    const { name, password, email, phone, role, location } = req.body;

    if (!name || !password || !email || !phone || !location) {
        return res.status(400).json(utils.createError("All fields are required"));
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const hash = await bcrypt.hash(password, 10);
        const statement = `INSERT INTO ${USER_TABLE} (name, password, email, phone, role, location) VALUES (?, ?, ?, ?, ?, ?)`;
        await conn.query(statement, [name, hash, email, phone, role || "User", location]);

        return res.json(utils.createSuccess("Registered successfully."));
    } catch (err) {
        return res.status(500).json(utils.createError(err.message));
    } finally {
        if (conn) conn.release();
    }
});

// Get User by ID
router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    const statement = `SELECT * FROM ${USER_TABLE} WHERE user_id = ?`;
    let conn;

    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(statement, [userId]);
        if (result.length > 0) {
            return res.json(utils.createSuccess(result[0]));
        } else {
            return res.status(404).json(utils.createError("User not found."));
        }
    } catch (err) {
        return res.status(500).json(utils.createError(err.message));
    } finally {
        if (conn) conn.release();
    }
});

// Update User API
router.put("/:id", async (req, res) => {
    const userId = req.params.id;
    const { name, password, email, phone, role, location } = req.body;

    if (!name && !password && !email && !phone && !role && !location) {
        return res.status(400).json(utils.createError("No update fields provided."));
    }

    let conn;
    try {
        conn = await pool.getConnection();
        let updatePassword = password ? await bcrypt.hash(password, 10) : null;

        const statement = `
            UPDATE ${USER_TABLE}
            SET 
                name = COALESCE(?, name),
                password = COALESCE(?, password),
                email = COALESCE(?, email),
                phone = COALESCE(?, phone),
                role = COALESCE(?, role),
                location = COALESCE(?, location)
            WHERE user_id = ?;
        `;

        const [result] = await conn.query(statement, [name, updatePassword, email, phone, role, location, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json(utils.createError("User not found."));
        }

        return res.json(utils.createSuccess("User details updated successfully."));
    } catch (error) {
        return res.status(500).json(utils.createError("Internal server error."));
    } finally {
        if (conn) conn.release();
    }
});

// Delete User API
router.delete("/:id", async (req, res) => {
    const userId = req.params.id;
    const statement = `DELETE FROM ${USER_TABLE} WHERE user_id = ?`;
    let conn;

    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(statement, [userId]);
        if (result.affectedRows > 0) {
            return res.json(utils.createSuccess("User deleted successfully."));
        } else {
            return res.status(404).json(utils.createError("User not found."));
        }
    } catch (err) {
        return res.status(500).json(utils.createError(err.message));
    } finally {
        if (conn) conn.release();
    }
});

// Middleware to Authenticate Token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ success: false, message: "Access Denied" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: "Invalid token" });

        req.user = user;
        next();
    });
};

// Verify Password API
router.post("/verify-password", authenticateToken, async (req, res) => {
    const { userId, password } = req.body;

    if (!userId || !password) {
        return res.status(400).json({ success: false, message: "User ID and password are required" });
    }

    const statement = `SELECT password FROM ${USER_TABLE} WHERE user_id = ?`;
    let conn;

    try {
        conn = await pool.getConnection();
        const [result] = await conn.query(statement, [userId]);

        if (result.length > 0) {
            const hashedPassword = result[0].password;
            const match = await bcrypt.compare(password, hashedPassword);

            if (match) {
                return res.json({ success: true, message: "Password verified" });
            } else {
                return res.status(401).json({ success: false, message: "Invalid password" });
            }
        } else {
            return res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    } finally {
        if (conn) conn.release();
    }
});

module.exports = router;
