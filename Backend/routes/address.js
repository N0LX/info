const express = require("express");
const router = express.Router();
const pool = require("../db");
const utils = require("../utils");
const { ADDRESS_TABLE } = require("../config");

// GET: Fetch address by address_id
router.get("/:address_id", (req, res) => {
    const { address_id } = req.params;

    const statement = `SELECT * FROM ${ADDRESS_TABLE} WHERE address_id = ?`;

    pool.execute(statement, [address_id], (err, results) => {
        if (err) {
            res.send(utils.createError(err.message));
        } else {
            if (results.length === 0) {
                res.status(404).send(utils.createError("No address found with this ID"));
            } else {
                res.send(utils.createSuccess(results));
            }
        }
    });
});

// POST: Add a new address
router.post("/", (req, res) => {
    const { user_id, street_address, city, pin, country, landmarks, extra_directions } = req.body;

    const statement = `
        INSERT INTO ${ADDRESS_TABLE} 
        (user_id, street_address, city, pin, country, landmarks, extra_directions)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    pool.execute(
        statement,
        [user_id, street_address, city, pin, country, landmarks, extra_directions],
        (err, result) => {
            if (err) {
                res.send(utils.createError(err.message));
            } else {
                res.send(utils.createSuccess("Address added successfully."));
            }
        }
    );
});

// PUT: Update address by address_id
router.put("/:address_id", (req, res) => {
    const { address_id } = req.params;
    const { user_id, street_address, city, pin, country, landmarks, extra_directions } = req.body;

    const statement = `
        UPDATE ${ADDRESS_TABLE} 
        SET user_id = ?, street_address = ?, city = ?, pin = ?, country = ?, landmarks = ?, extra_directions = ?
        WHERE address_id = ?;
    `;

    pool.execute(
        statement,
        [user_id, street_address, city, pin, country, landmarks, extra_directions, address_id],
        (err, result) => {
            if (err) {
                res.send(utils.createError(err.message));
            } else {
                if (result.affectedRows > 0) {
                    res.send(utils.createSuccess("Address updated successfully."));
                } else {
                    res.send(utils.createError("Address not found or unauthorized action."));
                }
            }
        }
    );
});


// DELETE: Delete address by user_id
router.delete("/deleteByUser/:user_id", (req, res) => {
    const user_id = req.params.user_id;

    // Debugging log to check the value of user_id
    console.log(`Deleting address with user_id: ${user_id}`);

    if (user_id === undefined) {
        res.send(utils.createError("user_id is required"));
        return;
    }

    const statement = `
        DELETE FROM ${ADDRESS_TABLE}
        WHERE user_id = ?;
    `;

    console.log(`Executing SQL: ${statement}`); // Debug log to check the SQL statement

    pool.execute(statement, [user_id], (err, result) => {
        if (err) {
            res.send(utils.createError(err.message));
        } else {
            if (result.affectedRows > 0) {
                res.send(utils.createSuccess("Address deleted successfully."));
            } else {
                res.send(utils.createError("Address not found for the provided user_id."));
            }
        }
    });
});

module.exports = router;
