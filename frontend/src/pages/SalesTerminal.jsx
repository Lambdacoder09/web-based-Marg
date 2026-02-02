import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Search, Trash2, CheckCircle, Printer } from 'lucide-react';

const SalesTerminal = ({ user }) => {
    const [drugs, setDrugs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [sessionId] = useState(`sess-${Math.random().toString(36).substr(2, 9)}`);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchDrugs();
    }, []);

    const fetchDrugs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/inventory/stock/net');
            setDrugs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredDrugs = drugs.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) && d.quantity > 0
    );

    const addToCart = (drug) => {
        const existing = cart.find(item => item.id === drug.id);
        if (existing) {
            if (existing.qty >= drug.quantity) return;
            setCart(cart.map(item => item.id === drug.id ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, { ...drug, qty: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const total = cart.reduce((sum, item) => sum + (item.price || 10) * item.qty, 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        try {
            // First, add to backend cart (simplified for demo)
            for (const item of cart) {
                await axios.post('http://localhost:5000/api/sales/cart/add', {
                    drug_id: item.id,
                    quantity: item.qty,
                    price: 10,
                    session_id: sessionId
                });
            }

            const res = await axios.post('http://localhost:5000/api/sales/checkout', {
                session_id: sessionId,
                pharmacist_id: user.id,
                serial_number: `INV-${Date.now()}`
            });

            if (res.data.success) {
                setSuccess(true);
                setCart([]);
                fetchDrugs();
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            alert('Checkout failed');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="glass p-6 rounded-3xl">
                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            className="w-full pl-14 pr-6 py-4 bg-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                            placeholder="Search drug by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDrugs.map((drug) => (
                        <div key={drug.id} className="glass p-5 rounded-2xl flex justify-between items-center hover:shadow-lg transition-all group">
                            <div>
                                <h4 className="font-bold text-slate-800">{drug.name}</h4>
                                <p className="text-sm text-slate-500">{drug.form} • {drug.quantity} in stock</p>
                            </div>
                            <button
                                onClick={() => addToCart(drug)}
                                className="p-3 bg-accent/5 text-accent rounded-xl hover:bg-accent hover:text-white transition-all"
                            >
                                <ShoppingCart size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div className="glass p-8 rounded-3xl sticky top-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <ShoppingCart className="text-accent" size={22} />
                        Current Session
                    </h2>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2">
                        {cart.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                                Cart is empty
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-50">
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-700">{item.name}</p>
                                        <p className="text-xs text-slate-400">Qty: {item.qty} × $10.00</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-slate-800">${(item.qty * 10).toFixed(2)}</span>
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border-t border-slate-100 pt-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Subtotal</span>
                            <span className="font-bold">${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xl">
                            <span className="text-slate-800 font-bold">Total</span>
                            <span className="text-accent font-black">${total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${cart.length > 0 ? 'bg-accent text-white shadow-xl shadow-accent/30 hover:bg-blue-600' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            <CheckCircle size={22} />
                            Finalize Sale
                        </button>
                    </div>
                </div>
            </div>

            {success && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-10 rounded-[40px] text-center shadow-2xl animate-scale-in max-w-sm mx-4">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Printer size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Sale Completed!</h2>
                        <p className="text-slate-500 mb-8">Printing receipt and updating inventory record...</p>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-full animate-progress-fast"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesTerminal;
