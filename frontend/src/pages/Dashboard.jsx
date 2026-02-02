import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, TrendingUp, AlertCircle, ShoppingBag } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalDrugs: 0,
        lowStock: 0,
        todaySales: 0,
        expiredSoon: 0
    });

    const cards = [
        { title: 'Total Inventory', value: stats.totalDrugs, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Today\'s Sales', value: `$${stats.todaySales}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { title: 'Low Stock Alerts', value: stats.lowStock, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
        { title: 'Expiring Soon', value: stats.expiredSoon, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">System Overview</h1>
                <p className="text-slate-500">Real-time performance metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.title} className="glass p-6 rounded-3xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-slate-500 font-medium text-sm mb-1">{card.title}</p>
                                    <h3 className="text-2xl font-bold text-slate-800">{card.value}</h3>
                                </div>
                                <div className={`${card.bg} p-3 rounded-2xl`}>
                                    <Icon className={card.color} size={24} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                <div className="glass p-8 rounded-3xl min-h-[400px]">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Transactions</h2>
                    <div className="text-slate-400 text-center py-20">No data available for today</div>
                </div>
                <div className="glass p-8 rounded-3xl min-h-[400px]">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Top Selling Drugs</h2>
                    <div className="text-slate-400 text-center py-20">No data available for today</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
