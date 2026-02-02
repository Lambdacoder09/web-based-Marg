const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'pharmacy.db');
const db = new Database(dbPath);

const drugs = db.prepare('SELECT id, unit_price FROM drug LIMIT 5').all();

if (drugs.length === 0) {
    console.log("No drugs found. Please run the main seeder first.");
    process.exit(0);
}

const insertStock = db.prepare(`
    INSERT INTO stock (drug_id, supplier_id, batch_number, buying_price, selling_price, quantity, expiry_date) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const updateNetStock = db.prepare(`
    INSERT INTO net_stock (drug_id, total_quantity) 
    VALUES (?, ?) 
    ON CONFLICT(drug_id) DO UPDATE SET total_quantity = total_quantity + ?
`);

db.transaction(() => {
    for (const drug of drugs) {
        // Add a fresh batch
        const qtyAdd = Math.floor(Math.random() * 50) + 10;
        const bPrice = drug.unit_price * 0.8;
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 2);

        insertStock.run(drug.id, 1, `FIX-ADD-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, bPrice, drug.unit_price, qtyAdd, expiry.toISOString().split('T')[0]);
        updateNetStock.run(drug.id, qtyAdd, qtyAdd);

        // Add a subtraction (adjustment)
        const qtySub = -(Math.floor(Math.random() * 5) + 1);
        insertStock.run(drug.id, 1, `FIX-ADJ-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, 0, 0, qtySub, null);
        updateNetStock.run(drug.id, qtySub, qtySub);

        console.log(`Updated Drug ID ${drug.id}: Added ${qtyAdd}, Subtracted ${Math.abs(qtySub)}`);
    }
})();

console.log("Dummy stock adjustments injected successfully!");
process.exit(0);
