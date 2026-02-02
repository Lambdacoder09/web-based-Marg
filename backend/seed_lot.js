const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'pharmacy.db');
const db = new Database(dbPath);

const drugs = [
    { name: 'Amoxicillin 500mg', form: 'Capsule', price: 12.5 },
    { name: 'Ciprofloxacin 500mg', form: 'Tablet', price: 25.0 },
    { name: 'Azithromycin 250mg', form: 'Tablet', price: 18.0 },
    { name: 'Paracetamol 500mg', form: 'Tablet', price: 5.0 },
    { name: 'Ibuprofen 400mg', form: 'Tablet', price: 8.5 },
    { name: 'Cetirizine 10mg', form: 'Tablet', price: 15.0 },
    { name: 'Loratadine 10mg', form: 'Tablet', price: 12.0 },
    { name: 'Omeprazole 20mg', form: 'Capsule', price: 30.0 },
    { name: 'Metformin 500mg', form: 'Tablet', price: 10.0 },
    { name: 'Atorvastatin 20mg', form: 'Tablet', price: 45.0 },
    { name: 'Amlodipine 5mg', form: 'Tablet', price: 20.0 },
    { name: 'Salbutamol Inhaler', form: 'Inhalation', price: 55.0 },
    { name: 'Insulin Glargine', form: 'Injection', price: 120.0 },
    { name: 'Hydrocortisone Cream', form: 'Cream', price: 18.5 },
    { name: 'Clotrimazole Cream', form: 'Cream', price: 14.0 },
    { name: 'Guaifenesin Syrup', form: 'Syrup', price: 12.0 },
    { name: 'Dextromethorphan Syrup', form: 'Syrup', price: 15.5 },
    { name: 'Chlorphenamine Syrup', form: 'Syrup', price: 9.0 },
    { name: 'Vitamin C 500mg', form: 'Tablet', price: 22.0 },
    { name: 'Multivitamin Syrup', form: 'Syrup', price: 28.0 },
    { name: 'Diclofenac Gel', form: 'Cream', price: 16.5 },
    { name: 'Prednisolone 5mg', form: 'Tablet', price: 35.0 },
    { name: 'Losartan 50mg', form: 'Tablet', price: 25.0 },
    { name: 'Ranitidine 150mg', form: 'Tablet', price: 12.0 },
    { name: 'Furosemide 40mg', form: 'Tablet', price: 8.0 }
];

const suppliers = ['Global Pharma', 'MedLife Distributing', 'Elite Medical', 'Swift Delivery Ph'];

db.transaction(() => {
    // Clear existing to normalize
    db.prepare('DELETE FROM sale_items').run();
    db.prepare('DELETE FROM sales').run();
    db.prepare('DELETE FROM stock').run();
    db.prepare('DELETE FROM net_stock').run();
    db.prepare('DELETE FROM drug').run();
    db.prepare('DELETE FROM supplier').run();

    // Insert Suppliers
    suppliers.forEach(s => {
        db.prepare('INSERT INTO supplier (name, contact, address) VALUES (?, ?, ?)').run(s, '555-0199', 'Medical Industrial Zone');
    });

    // Insert Drugs and Stock
    drugs.forEach((d, idx) => {
        const drugResult = db.prepare('INSERT INTO drug (name, form, unit_price) VALUES (?, ?, ?)').run(d.name, d.form, d.price);
        const drugId = drugResult.lastInsertRowid;
        const supplierId = (idx % suppliers.length) + 1;

        // Add 2 random batches per drug
        for (let i = 0; i < 2; i++) {
            const batchNum = `BCH-${Math.floor(Math.random() * 9000) + 1000}`;
            const qty = Math.floor(Math.random() * 100);
            const buyingPrice = d.price * 0.7;
            const expiry = i === 0 ? '2026-12-31' : '2024-05-15'; // One far, one near/expired

            db.prepare(`
                INSERT INTO stock (drug_id, supplier_id, batch_number, buying_price, selling_price, quantity, expiry_date)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(drugId, supplierId, batchNum, buyingPrice, d.price, qty, expiry);

            // Update net stock
            db.prepare(`
                INSERT INTO net_stock (drug_id, total_quantity)
                VALUES (?, ?)
                ON CONFLICT(drug_id) DO UPDATE SET total_quantity = total_quantity + ?
            `).run(drugId, qty, qty);
        }

        // Add some random sales for the dashboard
        if (idx < 10) {
            const saleDate = new Date().toISOString();
            const salePrice = d.price * 2;
            const saleResult = db.prepare('INSERT INTO sales (pharmacist_id, total_price, sale_date) VALUES (?, ?, ?)').run(1, salePrice, saleDate);
            db.prepare('INSERT INTO sale_items (sale_id, drug_id, quantity, unit_price) VALUES (?, ?, ?, ?)').run(saleResult.lastInsertRowid, drugId, 2, d.price);
        }
    });

    console.log('Seeded 25 drugs with multiple batches and sales!');
})();

process.exit();
