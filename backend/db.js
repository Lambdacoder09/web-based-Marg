const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'pharmacy.db');
const db = new Database(dbPath);

// Initialize Tables
const schema = `
CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK(role IN ('Manager', 'Pharmacist')) NOT NULL,
    contact TEXT,
    photo BLOB,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS drug (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    form TEXT, -- e.g., Tablet, Syrup
    unit_price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS supplier (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    address TEXT
);

CREATE TABLE IF NOT EXISTS stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    drug_id INTEGER,
    supplier_id INTEGER,
    batch_number TEXT,
    buying_price REAL,
    selling_price REAL,
    quantity INTEGER,
    expiry_date DATE,
    received_date DATE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(drug_id) REFERENCES drug(id),
    FOREIGN KEY(supplier_id) REFERENCES supplier(id)
);

CREATE TABLE IF NOT EXISTS net_stock (
    drug_id INTEGER PRIMARY KEY,
    total_quantity INTEGER DEFAULT 0,
    FOREIGN KEY(drug_id) REFERENCES drug(id)
);

CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    drug_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY(drug_id) REFERENCES drug(id)
);

CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    serial_number TEXT NOT NULL,
    drug_id INTEGER,
    quantity INTEGER,
    unit_price REAL,
    total_price REAL,
    pharmacist_id INTEGER,
    sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(drug_id) REFERENCES drug(id),
    FOREIGN KEY(pharmacist_id) REFERENCES staff(id)
);

CREATE TABLE IF NOT EXISTS debtor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    amount_due REAL,
    amount_paid REAL DEFAULT 0,
    due_date DATE,
    sale_id INTEGER,
    FOREIGN KEY(sale_id) REFERENCES sales(id)
);

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES staff(id)
);
`;

db.exec(schema);

// Seed Data
const seedStaff = db.prepare('INSERT OR IGNORE INTO staff (username, password, full_name, role) VALUES (?, ?, ?, ?)');
seedStaff.run('admin', '$2a$10$xV.0.P.Y.Z.X.1.2.3.4.5.6.7.8.9.0.1.2.3.4.5.6.7.8.9.0', 'System Manager', 'Manager');

const seedSupplier = db.prepare('INSERT OR IGNORE INTO supplier (id, name, contact_person) VALUES (?, ?, ?)');
seedSupplier.run(1, 'General Supplier', 'Internal');

module.exports = db;
