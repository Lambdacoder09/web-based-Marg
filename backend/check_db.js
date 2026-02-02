const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'pharmacy.db');
const db = new Database(dbPath);

try {
    const drugs = db.prepare('SELECT COUNT(*) as count FROM drug').get();
    const net_stock = db.prepare('SELECT SUM(total_quantity) as total FROM net_stock').get();
    const sales = db.prepare('SELECT SUM(total_price) as total FROM sales').get();
    const stock = db.prepare('SELECT COUNT(*) as count FROM stock').get();

    console.log('Database Snapshot:');
    console.log('Total Drugs:', drugs.count);
    console.log('Total Net Stock:', net_stock.total);
    console.log('Total Sales Amount:', sales.total);
    console.log('Total Stock Batches:', stock.count);
} catch (err) {
    console.error('Database query failed:', err.message);
}
process.exit();
