# Pharmacy Management System (PMS)
## 📸 Project Screenshots

Screenshots showing the Pharmacy Management System in action (dashboard, inventory, sales, login, etc.) are available here:

👉 **[View screenshots](./images)**

> The images demonstrate real working flows of the application, including inventory updates, sales processing, and authentication.

A full-stack web application for managing pharmacy inventory, sales, and stock levels.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Express.js + SQLite3
- **Authentication**: JWT
- **Database**: better-sqlite3

## Prerequisites

- Node.js (v14+)
- npm or yarn

## Project Structure

```
├── backend/              # Express.js server
│   ├── routes/          # API routes (auth, inventory, sales, events)
│   ├── server.js        # Main server file
│   ├── db.js            # Database setup
│   └── package.json
├── frontend/            # React Vite application
│   ├── src/
│   │   ├── pages/       # Dashboard, Inventory, Sales, Login
│   │   ├── components/  # Reusable components
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

## Running the Project

### Start Backend (Terminal 1)

```bash
cd backend
npm start
```

The backend server will run on `http://localhost:5000`

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## Default Credentials (Testing)

For initial login and testing:

- **Username**: `admin`
- **Password**: `admin`

⚠️ **Warning**: Change these credentials before deploying to production!

## Available Scripts

### Backend
- `npm start` - Start the Express.js server

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Configuration

The backend uses a `.env` file for configuration:

```
PORT=5000
JWT_SECRET=super_secret_pharmacy_key_2024
DATABASE_URL=./pharmacy.db
```

## Features

- **Dashboard**: Overview of pharmacy metrics
- **Inventory Management**: Track medications and stock levels
- **Sales Terminal**: Process customer transactions
- **Restock Management**: Handle medication restocking
- **User Authentication**: Login system with JWT
- **Notifications**: Real-time event notifications

## Database

The application uses SQLite3 with the following setup:
- Database file: `pharmacy.db` (auto-created)
- Initialization scripts available:
  - `seed_data.js` - Seed initial data
  - `seed_lot.js` - Seed lot information
  - `check_db.js` - Verify database integrity
  - `fix_stock.js` - Fix stock levels
  - `check_low_stock.js` - Check low stock items

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/inventory/*` - Inventory management
- `/api/sales/*` - Sales transactions
- `/api/events/*` - Event notifications

## Troubleshooting

- **Port already in use**: Change PORT in `.env` or backend code
- **Database errors**: Run `node check_db.js` in backend directory
- **Module not found**: Ensure all dependencies are installed with `npm install`

## License

This project is part of a pharmacy management system.
