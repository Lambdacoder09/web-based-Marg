import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import SalesTerminal from './pages/SalesTerminal';
import Login from './pages/Login';

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    if (!user) {
        return <Login onLogin={setUser} />;
    }

    return (
        <Router>
            <div className="flex h-screen overflow-hidden">
                <Sidebar role={user.role} onLogout={() => { localStorage.removeItem('user'); setUser(null); }} />
                <main className="flex-1 overflow-y-auto p-8">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/sales" element={<SalesTerminal user={user} />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
