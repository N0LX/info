const express = require("express");
const router = express.Router();
const pool = require("../db");
const utils = require("../utils")
const { Cart } = require("../config");
const { Product } = require("../config");
const { ProductDetails } = require("../config");
const { Users } = require("../config");

router.post('/add', (req, res) => {
    const { price_charge, transport_medium, transaction_id } = req.body;

    if (!price_charge || !transport_medium) {
        return res.status(400).json({
            status: 'error',
            message: 'Price Charge and Transport Medium are required'
        });
    }
    const statement = `INSERT INTO TransportServices (price_charge, transport_medium, transaction_id)
        VALUES (?, ?, ?);    `;
    pool.execute(statement, [price_charge, transport_medium, transaction_id || null], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        } else {
            res.status(201).json({
                status: 'success',
                message: 'Transport service added successfully',
                service_id: result.insertId
            });
        }
    });
});

router.get('/all', (req, res) => {
    const statement = `
        SELECT * FROM TransportServices;
    `;

    pool.execute(statement, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        } else {
            res.status(200).json({
                status: 'success',
                data: results
            });
        }
    });
});

router.put('/update/:id', (req, res) => {
    const serviceId = req.params.id;
    const { price_charge, transport_medium, transaction_id } = req.body;

    const statement = `UPDATE TransportServices SET price_charge = ?,transport_medium = ?,transaction_id = ?
        WHERE transport_services_id = ?;`;

    pool.execute(statement,[price_charge, transport_medium, transaction_id || null, serviceId],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({
                    status: 'error',
                    message: 'Internal server error'
                });
            } else {
                if (result.affectedRows > 0) {
                    res.status(200).json({
                        status: 'success',
                        message: 'Transport service updated successfully'
                    });
                } else {
                    res.status(404).json({
                        status: 'error',
                        message: 'Transport service not found'
                    });
                }
            }
        }
    );
});

router.delete('/remove/:id', (req, res) => {
    const serviceId = req.params.id;

    const statement = `DELETE FROM TransportServices WHERE transport_services_id = ?;
    `;

    pool.execute(statement, [serviceId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        } else {
            if (result.affectedRows > 0) {
                res.status(200).json({
                    status: 'success',
                    message: 'Transport service removed successfully'
                });
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'Transport service not found'
                });
            }
        }
    });
});


module.exports = router;