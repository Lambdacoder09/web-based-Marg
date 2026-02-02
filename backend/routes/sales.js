const express = require('express');
const router = express.Router();
const db = require('../db');

// Cart Management (Session based simple implementation)
router.post('/cart/add', (req, res) => {
    const { drug_id, quantity, price, session_id } = req.body;
    db.prepare('INSERT INTO cart (session_id, drug_id, quantity, price) VALUES (?, ?, ?, ?)')
        .run(session_id, drug_id, quantity, price);
    res.json({ success: true });
});

// Finalize Sale
router.post('/checkout', (req, res) => {
    const { session_id, pharmacist_id, serial_number } = req.body;

    try {
        db.transaction(() => {
            const items = db.prepare('SELECT * FROM cart WHERE session_id = ?').all(session_id);

            for (const item of items) {
                // Record Sale
                db.prepare(`
                    INSERT INTO sales (serial_number, drug_id, quantity, unit_price, total_price, pharmacist_id) 
                    VALUES (?, ?, ?, ?, ?, ?)
                `).run(serial_number, item.drug_id, item.quantity, item.price, item.price * item.quantity, pharmacist_id);

                // Decrement Net Stock
                db.prepare('UPDATE net_stock SET total_quantity = total_quantity - ? WHERE drug_id = ?')
                    .run(item.quantity, item.drug_id);
            }

            // Clear Cart
            db.prepare('DELETE FROM cart WHERE session_id = ?').run(session_id);
        })();

        res.json({ success: true, serial_number });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Transaction failed' });
    }
});

module.exports = router;
