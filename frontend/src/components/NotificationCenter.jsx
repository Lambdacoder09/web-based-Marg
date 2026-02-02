import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Bell, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const NotificationCenter = ({ isOpen, onClose }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('/api/events');
            setEvents(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch events', err);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchEvents();
            const interval = setInterval(fetchEvents, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const getEventIcon = (action) => {
        switch (action) {
            case 'low_stock': return <AlertTriangle className="text-amber-500" size={18} />;
            case 'sale': return <CheckCircle className="text-emerald-500" size={18} />;
            case 'stock_increase': return <Info className="text-brand-500" size={18} />;
            case 'stock_adjustment': return <Clock className="text-rose-500" size={18} />;
            default: return <Bell className="text-slate-400" size={18} />;
        }
    };

    return (
        <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[100] transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="h-full flex flex-col">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Activity Feed</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Live Notifications & Logs</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-20">
                            <Bell size={40} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-500 font-bold">No recent activities found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {events.map((event) => (
                                <div key={event.id} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-brand-200 transition-colors group">
                                    <div className="flex gap-4">
                                        <div className="mt-1">{getEventIcon(event.action)}</div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900 leading-snug">{event.details}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{event.pharmacist_name || 'System'}</span>
                                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                <span className="text-[10px] font-bold text-slate-400">{new Date(event.timestamp).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-50 bg-slate-50/50 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End of Recent Activity</p>
                </div>
            </div>
        </div>
    );
};

export default NotificationCenter;
