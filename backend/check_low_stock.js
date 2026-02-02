const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'pharmacy.db');
const db = new Database(dbPath);

try {
    const rows = db.prepare('SELECT drug_id, total_quantity FROM net_stock').all();
    console.log('--- Net Stock Details ---');
    rows.forEach(row => {
        console.log(`Drug ID ${row.drug_id}: ${row.total_quantity} units`);
    });

    const lowStockCount = db.prepare('SELECT COUNT(*) as count FROM net_stock WHERE total_quantity < 10').get().count;
    console.log('\nCalculated Low Stock Count (< 10):', lowStockCount);

    const drugs = db.prepare('SELECT COUNT(*) as count FROM drug').get().count;
    console.log('Total Drugs:', drugs);

} catch (err) {
    console.error('Debug script failed:', err.message);
}
process.exit();
