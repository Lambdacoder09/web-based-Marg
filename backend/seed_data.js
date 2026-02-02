const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'pharmacy.db');
const db = new Database(dbPath);

console.log('--- Starting Seeding Process ---');

const drugs = [
    { name: 'Paracetamol 500mg', form: 'Tablet', price: 0.50 },
    { name: 'Amoxicillin 250mg', form: 'Capsule', price: 1.20 },
    { name: 'Cetirizine 10mg', form: 'Tablet', price: 0.80 },
    { name: 'Ibuprofen 400mg', form: 'Tablet', price: 0.75 },
    { name: 'Metformin 500mg', form: 'Tablet', price: 1.50 },
    { name: 'Amlodipine 5mg', form: 'Tablet', price: 0.90 },
    { name: 'Atorvastatin 20mg', form: 'Tablet', price: 2.10 },
    { name: 'Omeprazole 20mg', form: 'Capsule', price: 1.10 },
    { name: 'Salbutamol Inhaler', form: 'Inhaler', price: 15.00 },
    { name: 'Insulin Glargine', form: 'Injection', price: 45.00 },
    { name: 'Cough Syrup (Guaifenesin)', form: 'Syrup', price: 5.50 },
    { name: 'Azithromycin 500mg', form: 'Tablet', price: 3.20 },
    { name: 'Loratadine 10mg', form: 'Tablet', price: 0.60 },
    { name: 'Vitamin C 500mg', form: 'Tablet', price: 0.25 },
    { name: 'ORS (Oral Rehydration Salts)', form: 'Sachet', price: 0.40 },
    { name: 'Dexamethasone 4mg', form: 'Tablet', price: 1.80 },
    { name: 'Furosemide 40mg', form: 'Tablet', price: 0.70 },
    { name: 'Ciprofloxacin 500mg', form: 'Tablet', price: 2.50 },
    { name: 'Losartan 50mg', form: 'Tablet', price: 1.30 },
    { name: 'Prednisolone 5mg', form: 'Tablet', price: 0.55 }
];

const insertDrug = db.prepare('INSERT INTO drug (name, form, unit_price) VALUES (?, ?, ?)');
const insertStock = db.prepare('INSERT INTO stock (drug_id, supplier_id, batch_number, buying_price, selling_price, quantity, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?)');
const insertSale = db.prepare('INSERT INTO sales (serial_number, drug_id, quantity, unit_price, total_price, pharmacist_id) VALUES (?, ?, ?, ?, ?, ?)');

db.transaction(() => {
    // Clear existing data for a clean seed? (Optional, let's just add)
    // db.prepare('DELETE FROM sales').run();
    // db.prepare('DELETE FROM stock').run();
    // db.prepare('DELETE FROM drug').run();

    for (const d of drugs) {
        const result = insertDrug.run(d.name, d.form, d.price);
        const drugId = result.lastInsertRowid;

        // Add 2 batches for each drug
        const qty1 = Math.floor(Math.random() * 100) + 20;
        const bPrice = d.price * 0.7;
        const expiry1 = new Date();
        expiry1.setMonth(expiry1.getMonth() + Math.floor(Math.random() * 24) + 6);

        insertStock.run(drugId, 1, `BCH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, bPrice, d.price, qty1, expiry1.toISOString().split('T')[0]);

        const qty2 = Math.floor(Math.random() * 50);
        const expiry2 = new Date();
        expiry2.setMonth(expiry2.getMonth() + Math.floor(Math.random() * 12) - 3); // some expiring soon or expired

        insertStock.run(drugId, 1, `BCH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, bPrice, d.price, qty2, expiry2.toISOString().split('T')[0]);

        // Add some dummy sales
        for (let i = 0; i < 3; i++) {
            const saleQty = Math.floor(Math.random() * 5) + 1;
            insertSale.run(
                `SALE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                drugId,
                saleQty,
                d.price,
                saleQty * d.price,
                1 // Admin
            );
        }
    }
})();

console.log('--- Seeding Completed Successfully ---');
db.close();
