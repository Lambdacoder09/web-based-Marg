import React from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ChevronRight, Bell, Cloud } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user = {}, onLogout, onOpenNotifs }) => {
    const role = user?.role || 'Guest';
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/', roles: ['Manager', 'Pharmacist'] },
        { name: 'Inventory', icon: Package, path: '/inventory', roles: ['Manager'] },
        { name: 'Sales Terminal', icon: ShoppingCart, path: '/sales', roles: ['Manager', 'Pharmacist'] },
    ];

    return (
        <aside className="w-80 bg-white border-r border-slate-100 flex flex-col relative z-20">
            <div className="p-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-100 ring-4 ring-brand-50">
                    <Cloud className="text-white" size={24} strokeWidth={3} />
                </div>
                <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none italic">Cloud-E</h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Healthcare Solutions</p>
                </div>
            </div>

            <div className="flex-1 px-6 space-y-12">
                <nav>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 mb-6">Main Navigation</p>
                    <ul className="space-y-2">
                        {menuItems.filter(item => item.roles.includes(role)).map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className={`nav-link group ${isActive ? 'nav-link-active' : 'nav-link-inactive'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-brand-600 text-white shadow-md shadow-brand-200' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'}`}>
                                            <Icon size={18} strokeWidth={isActive ? 3 : 2} />
                                        </div>
                                        <span className="flex-1 tracking-tight">{item.name}</span>
                                        {isActive && <div className="w-1.5 h-1.5 bg-brand-600 rounded-full" />}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 mb-6">User Account</p>
                    <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 relative group overflow-hidden">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-sm">
                                {role ? role[0] : '?'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-black text-slate-800 truncate leading-none">{user.full_name}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-wider">{role}</p>
                            </div>
                            <button
                                onClick={onOpenNotifs}
                                className="text-slate-300 hover:text-brand-600 transition-colors relative"
                            >
                                <Bell size={18} />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-500 rounded-full animate-pulse shadow-sm" />
                            </button>
                        </div>
                        {/* Subtle bg hover effect */}
                        <div className="absolute inset-0 bg-brand-50 translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-20" />
                    </div>
                </div>
            </div>

            <div className="p-8">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-all font-bold group"
                >
                    <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                    <span className="tracking-tight text-slate-600 group-hover:text-rose-600 transition-colors">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
