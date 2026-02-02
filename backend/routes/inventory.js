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
    const { name, form, unit_price, user_id } = req.body;
    const result = db.prepare('INSERT INTO drug (name, form, unit_price) VALUES (?, ?, ?)')
        .run(name, form, unit_price);

    // Log Registration
    db.prepare('INSERT INTO events (user_id, action, details) VALUES (?, ?, ?)')
        .run(user_id || null, 'medication_added', `Registered new medication: ${name}`);

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
    const final_supplier_id = supplier_id || 1; // Default to General Supplier

    const info = db.transaction(() => {
        // Insert into stock
        const stockResult = db.prepare(`
            INSERT INTO stock (drug_id, supplier_id, batch_number, buying_price, selling_price, quantity, expiry_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(drug_id, final_supplier_id, batch_number, buying_price, selling_price, quantity, expiry_date);

        // Update net_stock
        db.prepare(`
            INSERT INTO net_stock (drug_id, total_quantity) 
            VALUES (?, ?) 
            ON CONFLICT(drug_id) DO UPDATE SET total_quantity = total_quantity + ?
        `).run(drug_id, quantity, quantity);

        // Log Activity
        const drug = db.prepare('SELECT name FROM drug WHERE id = ?').get(drug_id);
        const action = quantity > 0 ? 'stock_increase' : 'stock_adjustment';
        const msg = quantity > 0 ? `Restocked ${quantity} units of ${drug.name}` : `Adjusted ${drug.name} stock by ${quantity} units`;

        db.prepare('INSERT INTO events (user_id, action, details) VALUES (?, ?, ?)')
            .run(req.body.user_id || null, action, msg);

        return stockResult;
    })();

    res.json({ id: info.lastInsertRowid });
});

// Dashboard Stats
router.get('/stats', (req, res) => {
    try {
        const totalDrugs = db.prepare('SELECT COUNT(*) as count FROM drug').get().count;
        const lowStock = db.prepare(`
            SELECT COUNT(*) as count 
            FROM drug d 
            LEFT JOIN net_stock ns ON d.id = ns.drug_id 
            WHERE COALESCE(ns.total_quantity, 0) < 10
        `).get().count;
        const todaySales = db.prepare("SELECT SUM(total_price) as total FROM sales WHERE date(sale_date) = date('now')").get().total || 0;
        const expiredSoon = db.prepare("SELECT COUNT(*) as count FROM stock WHERE expiry_date <= date('now', '+3 months')").get().count;

        res.json({ totalDrugs, lowStock, todaySales, expiredSoon });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
