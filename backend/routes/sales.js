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
            const items = db.prepare('SELECT cart.*, drug.name FROM cart JOIN drug ON cart.drug_id = drug.id WHERE session_id = ?').all(session_id);

            for (const item of items) {
                // Record Sale
                db.prepare(`
                    INSERT INTO sales (serial_number, drug_id, quantity, unit_price, total_price, pharmacist_id) 
                    VALUES (?, ?, ?, ?, ?, ?)
                `).run(serial_number, item.drug_id, item.quantity, item.price, item.price * item.quantity, pharmacist_id);

                // Decrement Net Stock
                db.prepare('UPDATE net_stock SET total_quantity = total_quantity - ? WHERE drug_id = ?')
                    .run(item.quantity, item.drug_id);

                // Log Activity
                db.prepare('INSERT INTO events (user_id, action, details) VALUES (?, ?, ?)')
                    .run(pharmacist_id, 'sale', `Sold ${item.quantity}x ${item.name} (${serial_number})`);

                // Check Low Stock
                const net = db.prepare('SELECT total_quantity FROM net_stock WHERE drug_id = ?').get(item.drug_id);
                if (net && net.total_quantity < 10) {
                    db.prepare('INSERT INTO events (user_id, action, details) VALUES (?, ?, ?)')
                        .run(pharmacist_id, 'low_stock', `${item.name} is running low (${net.total_quantity} left)`);
                }
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
