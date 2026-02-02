import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Plus, Search, Layers, Calendar, ChevronRight } from 'lucide-react';

const Inventory = () => {
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newDrug, setNewDrug] = useState({ name: '', form: 'Tablet', unit_price: '' });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/inventory/stock/net');
            setDrugs(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddDrug = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/inventory/drugs', newDrug);
            setShowAddModal(false);
            setNewDrug({ name: '', form: 'Tablet', unit_price: '' });
            fetchInventory();
        } catch (err) {
            alert('Failed to add drug');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Drug Registry</h1>
                    <p className="text-slate-500">Manage products and stock levels</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2 py-3 px-6 shadow-lg shadow-accent/20"
                >
                    <Plus size={20} />
                    Register New Drug
                </button>
            </div>

            <div className="glass rounded-[32px] overflow-hidden border-none">
                <div className="p-6 border-b border-slate-100 bg-white/50 flex justify-between items-center">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm"
                            placeholder="Filter by name or form..."
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition-all">Export Excel</button>
                        <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition-all">Print List</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-sm uppercase tracking-wider">
                                <th className="px-8 py-5 font-bold">Drug Name</th>
                                <th className="px-8 py-5 font-bold">Form</th>
                                <th className="px-8 py-5 font-bold">Net Stock</th>
                                <th className="px-8 py-5 font-bold">Status</th>
                                <th className="px-8 py-5 font-bold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {drugs.map((drug) => (
                                <tr key={drug.id} className="hover:bg-slate-50/80 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-accent/10 group-hover:text-accent transition-all">
                                                <Package size={20} />
                                            </div>
                                            <span className="font-bold text-slate-700">{drug.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-slate-500 font-medium">{drug.form}</td>
                                    <td className="px-8 py-5">
                                        <span className="font-bold text-slate-800">{drug.quantity}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        {drug.quantity > 20 ? (
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-tighter">In Stock</span>
                                        ) : drug.quantity > 0 ? (
                                            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold uppercase tracking-tighter">Low Stock</span>
                                        ) : (
                                            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-tighter">Out of Stock</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5">
                                        <button className="p-2 text-slate-400 hover:text-accent transition-colors">
                                            <ChevronRight size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {drugs.length === 0 && !loading && (
                        <div className="py-20 text-center text-slate-400">No drugs registered in the system yet.</div>
                    )}
                </div>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl">
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Register Drug</h2>
                        <p className="text-slate-500 mb-8">Add a new product to the central registry</p>

                        <form onSubmit={handleAddDrug} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-accent"
                                    value={newDrug.name}
                                    onChange={(e) => setNewDrug({ ...newDrug, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Form</label>
                                    <select
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-accent"
                                        value={newDrug.form}
                                        onChange={(e) => setNewDrug({ ...newDrug, form: e.target.value })}
                                    >
                                        <option>Tablet</option>
                                        <option>Syrup</option>
                                        <option>Injection</option>
                                        <option>Cream</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Base Price</label>
                                    <input
                                        type="number"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-accent"
                                        value={newDrug.unit_price}
                                        onChange={(e) => setNewDrug({ ...newDrug, unit_price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary py-4 font-bold">Register Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
