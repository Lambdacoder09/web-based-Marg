import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import SalesTerminal from './pages/SalesTerminal';
import Restock from './pages/Restock';
import Login from './pages/Login';

import NotificationCenter from './components/NotificationCenter';

function App() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    if (!user) {
        return <Login onLogin={setUser} />;
    }

    return (
        <Router>
            <div className="flex h-screen overflow-hidden">
                <Sidebar
                    user={user}
                    onLogout={() => { localStorage.removeItem('user'); setUser(null); }}
                    onOpenNotifs={() => setIsNotifOpen(true)}
                />
                <main className="flex-1 overflow-y-auto p-8 relative">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/sales" element={<SalesTerminal user={user} />} />
                        <Route path="/restock/:id" element={<Restock />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                    <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
                </main>
            </div>
        </Router>
    );
}

export default App;
