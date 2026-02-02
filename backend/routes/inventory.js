const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all drugs
router.get('/drugs', (req, res) => {
    const drugs = db.prepare('SELECT * FROM drug').all();
    res.json(drugs);
});

// Add new drug
router.post('/drugs', (req, res) => {
    const { name, form, unit_price } = req.body;
    const result = db.prepare('INSERT INTO drug (name, form, unit_price) VALUES (?, ?, ?)')
        .run(name, form, unit_price);
    res.json({ id: result.lastInsertRowid });
});

// Get net stock (summarized)
router.get('/stock/net', (req, res) => {
    const stock = db.prepare(`
        SELECT d.id, d.name, d.form, COALESCE(ns.total_quantity, 0) as quantity 
        FROM drug d 
        LEFT JOIN net_stock ns ON d.id = ns.drug_id
    `).all();
    res.json(stock);
});

// Add stock batch
router.post('/stock', (req, res) => {
    const { drug_id, supplier_id, batch_number, buying_price, selling_price, quantity, expiry_date } = req.body;

    const info = db.transaction(() => {
        // Insert into stock
        const stockResult = db.prepare(`
            INSERT INTO stock (drug_id, supplier_id, batch_number, buying_price, selling_price, quantity, expiry_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(drug_id, supplier_id, batch_number, buying_price, selling_price, quantity, expiry_date);

        // Update net_stock
        db.prepare(`
            INSERT INTO net_stock (drug_id, total_quantity) 
            VALUES (?, ?) 
            ON CONFLICT(drug_id) DO UPDATE SET total_quantity = total_quantity + ?
        `).run(drug_id, quantity, quantity);

        return stockResult;
    })();

    res.json({ id: info.lastInsertRowid });
});

module.exports = router;
