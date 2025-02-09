const express = require("express");
const router = express.Router();
const pool = require("../db");
const utils = require("../utils");
const { USER_TABLE } = require("../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET_KEY = "aditya";

// Login API
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const statement = `SELECT * FROM ${USER_TABLE} WHERE email = ?`;

    pool.query(statement, [email], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }

        if (results.length > 0) {
            const user = results[0];

            // Compare hashed password
            bcrypt.compare(password, user.password, (err, match) => {
                if (err) return res.status(500).json({ success: false, message: "Error comparing passwords" });

                if (match) {
                    const token = jwt.sign({ email: user.email, id: user.user_id }, SECRET_KEY, { expiresIn: "1h" });
                    return res.json({ success: true, token, user });
                } else {
                    return res.status(401).json({ success: false, message: "Invalid credentials" });
                }
            });
        } else {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    });
});

// Register API
router.post("/register", (req, res) => {
    const { name, password, email, phone, role, location } = req.body;

    if (!name || !password || !email || !phone || !location) {
        return res.status(400).json(utils.createError("All fields are required"));
    }

    // Hash password before saving
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json(utils.createError("Error hashing password"));

        const statement = `INSERT INTO ${USER_TABLE} (name, password, email, phone, role, location) VALUES (?, ?, ?, ?, ?, ?)`;

        pool.query(statement, [name, hash, email, phone, role || "User", location], (err, result) => {
            if (err) return res.status(500).json(utils.createError(err.message));
            return res.json(utils.createSuccess("Registered successfully."));
        });
    });
});

// Get User by ID
router.get("/:id", (req, res) => {
    const userId = req.params.id;
    const statement = `SELECT * FROM ${USER_TABLE} WHERE user_id = ?`;

    pool.query(statement, [userId], (err, result) => {
        if (err) return res.status(500).json(utils.createError(err.message));

        if (result.length > 0) {
            return res.json(utils.createSuccess(result[0]));
        } else {
            return res.status(404).json(utils.createError("User not found."));
        }
    });
});

// Update User API
router.put("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, password, email, phone, role, location } = req.body;

        // Check if at least one field is provided for update
        if (!name && !password && !email && !phone && !role && !location) {
            return res.status(400).json(utils.createError("No update fields provided."));
        }

        // Hash password only if a new one is provided
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

        pool.query(
            statement,
            [name, updatePassword, email, phone, role, location, userId],
            (err, result) => {
                if (err) {
                    console.error("Database Update Error:", err);
                    return res.status(500).json(utils.createError("Database update failed."));
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json(utils.createError("User not found."));
                }
                return res.json(utils.createSuccess("User details updated successfully."));
            }
        );
    } catch (error) {
        console.error("Update User API Error:", error);
        return res.status(500).json(utils.createError("Internal server error."));
    }
});

// Delete User API
router.delete("/:id", (req, res) => {
    const userId = req.params.id;
    const statement = `DELETE FROM ${USER_TABLE} WHERE user_id = ?`;

    pool.query(statement, [userId], (err, result) => {
        if (err) return res.status(500).json(utils.createError(err.message));

        if (result.affectedRows > 0) {
            return res.json(utils.createSuccess("User deleted successfully."));
        } else {
            return res.status(404).json(utils.createError("User not found."));
        }
    });
});

// Middleware to Authenticate Token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extract Bearer token

    if (!token) return res.status(401).json({ success: false, message: "Access Denied" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: "Invalid token" });

        req.user = user;
        next();
    });
};

router.post("/verify-password", authenticateToken, (req, res) => {
    const { userId, password } = req.body;

    if (!userId || !password) {
        return res.status(400).json({ success: false, message: "User ID and password are required" });
    }

    const statement = `SELECT password FROM ${USER_TABLE} WHERE user_id = ?`;

    pool.query(statement, [userId], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        if (result.length > 0) {
            const hashedPassword = result[0].password;

            bcrypt.compare(password, hashedPassword, (err, match) => {
                if (err) return res.status(500).json({ success: false, message: "Error comparing passwords" });

                if (match) {
                    return res.json({ success: true, message: "Password verified" });
                } else {
                    return res.status(401).json({ success: false, message: "Invalid password" });
                }
            });
        } else {
            return res.status(404).json({ success: false, message: "User not found" });
        }
    });
});


module.exports = router;
