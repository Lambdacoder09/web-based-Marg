import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { ShoppingCart, Search, Trash2, CheckCircle, Printer, X, Plus, Minus, Tag, CreditCard, Package, ChevronRight } from 'lucide-react';

const SalesTerminal = ({ user = {} }) => {
    const [drugs, setDrugs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [sessionId] = useState(`sess-${Math.random().toString(36).substr(2, 9)}`);
    const [status, setStatus] = useState('idle'); // idle | processing | success
    const [lastTransaction, setLastTransaction] = useState(null);

    useEffect(() => {
        fetchDrugs();
    }, []);

    const fetchDrugs = async () => {
        try {
            const res = await axios.get('/api/inventory/stock/net');
            setDrugs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredDrugs = Array.isArray(drugs) ? drugs.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) && d.quantity > 0
    ) : [];

    const addToCart = (drug) => {
        const existing = cart.find(item => item.id === drug.id);
        if (existing) {
            if (existing.qty >= drug.quantity) return;
            setCart(cart.map(item => item.id === drug.id ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, { ...drug, qty: 1, price: drug.unit_price || 15.00 }]);
        }
    };

    const adjustQty = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, Math.min(item.qty + delta, item.quantity));
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price) * item.qty, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    const generateInvoice = (transactionData) => {
        const data = transactionData || lastTransaction;
        if (!data) return;

        const doc = new jsPDF();
        const margin = 20;
        let y = 30;

        // Header
        doc.setFontSize(22);
        doc.setTextColor(16, 185, 129); // Brand Green
        doc.text('Cloud-E-Healthcare', margin, y);

        doc.setFontSize(10);
        doc.setTextColor(100);
        y += 10;
        doc.text('Premium Healthcare Solutions', margin, y);
        y += 5;
        doc.text('Contact: +1 (555) 000-1234 | support@healthgate.com', margin, y);

        // Invoice Info
        y += 20;
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Invoice: ${data.serialNumber}`, margin, y);
        doc.text(`Date: ${new Date().toLocaleString()}`, 130, y);
        doc.text(`Pharmacist: ${user?.full_name || 'System'}`, margin, y + 7);

        // Table Header
        y += 20;
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, 170, 10, 'F');
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text('Description', margin + 5, y + 7);
        doc.text('Qty', margin + 90, y + 7);
        doc.text('Price', margin + 115, y + 7);
        doc.text('Total', margin + 145, y + 7);

        // Items
        y += 10;
        doc.setTextColor(0);
        data.items.forEach((item) => {
            y += 10;
            doc.text(item.name, margin + 5, y);
            doc.text(item.qty.toString(), margin + 90, y);
            doc.text(`$${item.price.toFixed(2)}`, margin + 115, y);
            doc.text(`$${(item.qty * item.price).toFixed(2)}`, margin + 145, y);

            // Draw a subtle line
            doc.setDrawColor(241, 245, 249);
            doc.line(margin, y + 3, margin + 170, y + 3);
        });

        // Totals
        y += 25;
        doc.setFontSize(11);
        doc.text('Subtotal:', 130, y);
        doc.text(`$${data.subtotal.toFixed(2)}`, 165, y);

        y += 7;
        doc.text('GST (5%):', 130, y);
        doc.text(`$${data.tax.toFixed(2)}`, 165, y);

        y += 10;
        doc.setFontSize(16);
        doc.setTextColor(16, 185, 129);
        doc.text('Total Amount:', 110, y);
        doc.text(`$${data.total.toFixed(2)}`, 165, y);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Thank you for choosing Cloud-E-Healthcare!', 105, 280, { align: 'center' });

        doc.save(`${data.serialNumber}_Receipt.pdf`);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setStatus('processing');
        try {
            for (const item of cart) {
                await axios.post('/api/sales/cart/add', {
                    drug_id: item.id,
                    quantity: item.qty,
                    price: item.price,
                    session_id: sessionId
                });
            }

            const res = await axios.post('/api/sales/checkout', {
                session_id: sessionId,
                pharmacist_id: user.id,
                serial_number: `INV-${Date.now()}`
            });

            if (res.data.success) {
                const serial = `INV-${Date.now()}`;
                const txnData = {
                    items: [...cart],
                    subtotal,
                    tax,
                    total,
                    serialNumber: serial
                };
                setLastTransaction(txnData);
                setStatus('success');
                setCart([]);
                fetchDrugs();
                setTimeout(() => setStatus('idle'), 30000); // Extended for user to print
            }
        } catch (err) {
            alert('Checkout failed');
            setStatus('idle');
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto h-[calc(100vh-120px)] flex flex-col lg:flex-row gap-10 animate-fade-in">
            {/* Left: Product Selection */}
            <div className="flex-1 flex flex-col gap-8 min-w-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sales Terminal</h1>
                        <p className="text-slate-600 font-bold text-xs uppercase tracking-[0.1em] mt-1">Pharmacist: {user?.full_name || 'System'}</p>
                    </div>
                    <div className="px-5 py-2.5 bg-brand-50 rounded-full border border-brand-100 flex items-center gap-2">
                        <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Live Inventory</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-[2.5rem] shadow-premium flex items-center gap-4 border border-slate-50">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors" size={24} />
                        <input
                            type="text"
                            className="w-full pl-16 pr-8 py-5 bg-slate-50 border-none rounded-3xl focus:ring-0 text-lg font-bold placeholder:text-slate-400"
                            placeholder="Scan barcode or type medication name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-5 bg-slate-100 text-slate-500 rounded-[1.5rem] hover:bg-slate-200 transition-colors">
                        <Tag size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 space-y-4 no-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                        {filteredDrugs.length > 0 ? filteredDrugs.map((drug) => (
                            <div
                                key={drug.id}
                                onClick={() => addToCart(drug)}
                                className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-brand-500/30 hover:shadow-elevated transition-all duration-300 group cursor-pointer relative overflow-hidden"
                            >
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors duration-500">
                                            <Package size={28} />
                                        </div>
                                        <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black tracking-widest uppercase">${(drug.unit_price || 15).toFixed(2)}</span>
                                    </div>
                                    <h4 className="font-black text-slate-900 text-xl leading-tight mb-2 group-hover:text-brand-600 transition-colors">{drug.name}</h4>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{drug.form} • <span className={drug.quantity < 10 ? 'text-rose-500 font-black' : 'text-brand-600 font-black'}>{drug.quantity} Unit(s)</span></p>
                                </div>
                                {/* Hover decoration */}
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-brand-50 rounded-full translate-x-12 translate-y-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute bottom-10 right-10 text-brand-500 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500">
                                    <Plus size={32} strokeWidth={3} />
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-32 text-center flex flex-col items-center justify-center">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8">
                                    <Search size={48} />
                                </div>
                                <p className="text-xl font-black text-slate-300">No matching medications found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Cart & Checkout */}
            <div className="w-full lg:w-[450px] flex flex-col">
                <div className="flex-1 bg-white rounded-[3rem] shadow-premium border border-slate-100 flex flex-col overflow-hidden">
                    <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <div className="p-2 bg-brand-50 text-brand-500 rounded-xl">
                                <ShoppingCart size={22} strokeWidth={3} />
                            </div>
                            Cart
                        </h2>
                        <span className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-xs font-black">{cart.length} Items</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                                    <ShoppingCart size={32} />
                                </div>
                                <p className="text-slate-500 font-bold max-w-[200px]">Your cart is currently empty. Select items to start sale.</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="group animate-fade-in">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <p className="font-black text-slate-900 truncate mb-1 text-base">{item.name}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">${(item.price || 0).toFixed(2)} / unit</p>
                                        </div>
                                        <p className="font-black text-slate-900">${((item.qty || 0) * (item.price || 0)).toFixed(2)}</p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center bg-slate-50 rounded-xl p-1 gap-1">
                                            <button onClick={() => adjustQty(item.id, -1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white hover:text-brand-500 transition-all">
                                                <Minus size={14} strokeWidth={4} />
                                            </button>
                                            <span className="w-10 text-center text-xs font-black text-slate-900">{item.qty}</span>
                                            <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white hover:text-brand-500 transition-all">
                                                <Plus size={14} strokeWidth={4} />
                                            </button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1">
                                            <X size={16} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-10 bg-slate-50/50 space-y-8 border-t border-slate-50">
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm font-bold text-slate-600">
                                <span>Subtotal</span>
                                <span className="text-slate-900 font-black">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-slate-600">
                                <span>GST (5%)</span>
                                <span className="text-slate-900 font-black">${tax.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Total Amount</span>
                                <span className="text-5xl font-black text-slate-900 tracking-tighter leading-none">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || status === 'processing'}
                            className="w-full btn-gradient py-6 rounded-[1.8rem] text-xl font-black flex items-center justify-center gap-4 relative overflow-hidden"
                        >
                            {status === 'processing' ? (
                                <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <CreditCard size={24} strokeWidth={3} />
                                    Charge Terminal
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {status === 'success' && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
                    <div className="bg-white p-8 lg:p-10 rounded-[3rem] text-center shadow-elevated max-w-md w-full relative overflow-hidden animate-scale-in">
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-500" />
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                            <CheckCircle size={32} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Transaction Successful!</h2>
                        <p className="text-slate-500 font-semibold mb-8 text-sm leading-relaxed">The receipt has been generated and inventory levels have been updated.</p>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => generateInvoice()}
                                className="py-4 px-6 bg-slate-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all outline-none"
                            >
                                <Printer size={16} />
                                Print Invoice
                            </button>
                            <button
                                onClick={() => setStatus('idle')}
                                className="py-4 px-6 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs active:scale-95 transition-all text-center"
                            >
                                New Sale
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesTerminal;
