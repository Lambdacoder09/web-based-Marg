import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role, onLogout }) => {
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['Manager', 'Pharmacist'] },
        { name: 'Inventory', icon: Package, path: '/inventory', roles: ['Manager'] },
        { name: 'Sales', icon: ShoppingCart, path: '/sales', roles: ['Manager', 'Pharmacist'] },
    ];

    return (
        <aside className="w-64 bg-primary text-slate-300 flex flex-col">
            <div className="p-6 text-2xl font-bold text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">PMS</span>
                </div>
                HealthGate
            </div>

            <nav className="flex-1 px-4 py-6">
                <ul className="space-y-2">
                    {menuItems.filter(item => item.roles.includes(role)).map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'hover:bg-secondary'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-700/50">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-slate-400"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
