import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, TrendingUp, AlertCircle, ShoppingBag, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalDrugs: 0,
        lowStock: 0,
        todaySales: 0,
        expiredSoon: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/inventory/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch stats', err);
            }
        };
        fetchStats();
        // Refresh stats every minute
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, []);

    const cards = [
        { title: 'Total Inventory', value: stats.totalDrugs, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+4% from last week', trendUp: true },
        { title: 'Today\'s Revenue', value: `$${stats.todaySales.toLocaleString()}`, icon: TrendingUp, color: 'text-brand-600', bg: 'bg-brand-50', trend: '+12% from yesterday', trendUp: true },
        { title: 'Low Stock Alerts', value: stats.lowStock, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-2 since morning', trendUp: false },
        { title: 'Expiring Soon', value: stats.expiredSoon, icon: ShoppingBag, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Critical action needed', trendUp: false },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-in p-4 lg:p-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Main Dashboard</h1>
                    <p className="text-slate-500 font-semibold mt-1">Good morning! Here's what's happening today.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">Generate Report</button>
                    <button className="px-6 py-3 btn-gradient rounded-2xl text-sm font-bold">Add Inventory</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={card.title} className={`card-premium p-8 group cursor-default`} style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="flex items-start justify-between mb-6">
                                <div className={`${card.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                                    <Icon className={card.color} size={28} />
                                </div>
                                <button className="text-slate-300 hover:text-slate-500 transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                            <div className="space-y-1">
                                <p className="text-slate-600 font-bold text-xs uppercase tracking-widest leading-none">{card.title}</p>
                                <h3 className="text-3xl font-black text-slate-900">{card.value}</h3>
                            </div>
                            <div className="mt-6 flex items-center gap-2">
                                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${card.trendUp ? 'bg-brand-50 text-brand-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {card.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                </div>
                                <span className="text-[11px] font-bold text-slate-500">{card.trend}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card-premium p-10">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black text-slate-900">Recent Transactions</h2>
                        <button className="text-sm font-bold text-brand-600 hover:text-brand-700 hover:underline">View All Sales</button>
                    </div>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-brand-500 transition-colors">
                                        <ShoppingCartIcon size={22} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 font-black">INV-2024-{1000 + i}</p>
                                        <p className="text-xs font-semibold text-slate-500">Items: Acetaminophen, Ibuprofen</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-900">$120.50</p>
                                    <p className="text-[10px] font-bold text-brand-500 uppercase">Completed</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card-premium p-10 flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Inventory Health</h2>
                        <p className="text-slate-500 font-semibold text-sm mb-10">Stock status across categories</p>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-black uppercase text-slate-500 tracking-wider">
                                    <span>Essential Drugs</span>
                                    <span className="text-slate-700">85%</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-500 w-[85%] rounded-full shadow-sm shadow-brand-200"></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-black uppercase text-slate-500 tracking-wider">
                                    <span>Emergency Kit</span>
                                    <span className="text-slate-700">42%</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 w-[42%] rounded-full shadow-sm shadow-amber-200"></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-black uppercase text-slate-500 tracking-wider">
                                    <span>Antibiotics</span>
                                    <span className="text-slate-700">92%</span>
                                </div>
                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[92%] rounded-full shadow-sm shadow-indigo-200"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-brand-50 rounded-3xl border border-brand-100">
                        <p className="text-xs font-bold text-brand-700 mb-2">System Performance</p>
                        <p className="text-xs text-brand-600/70 leading-relaxed font-semibold">Your inventory turnover increased by <span className="text-brand-800 font-black">15%</span> compared to last month.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal icon component for simplified code block
const ShoppingCartIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
);

export default Dashboard;
