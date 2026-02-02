import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Package, Plus, Search, Filter, Download, MoreVertical, Layers, ArrowUpRight, ChevronRight, X } from 'lucide-react';

const Inventory = () => {
    const navigate = useNavigate();
    const [drugs, setDrugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [category, setCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [statusFilters, setStatusFilters] = useState({ low: false, out: false, expiring: false });
    const [newDrug, setNewDrug] = useState({ name: '', form: 'Tablet', unit_price: '' });

    const filteredDrugs = drugs.filter(drug => {
        const matchesSearch = drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            drug.id.toString().includes(searchTerm);

        const matchesCategory = category === 'All' ||
            (category === 'Tablets' && drug.form === 'Tablet') ||
            (category === 'Syrups' && drug.form === 'Syrup') ||
            (category === 'Injections' && drug.form === 'Injection') ||
            (category === 'Antibiotics' && drug.name.toLowerCase().includes('anti'));

        const matchesStatus = (!statusFilters.low || drug.quantity < 10) &&
            (!statusFilters.out || drug.quantity === 0);

        return matchesSearch && matchesCategory && matchesStatus;
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(drugs.map(drug => ({
            'Medication Name': drug.name,
            'Medical Code': `HG-${100 + Number(drug.id)}`,
            'Formulation': drug.form,
            'Current Stock': drug.quantity,
            'Retail Price ($)': drug.unit_price,
            'Status': drug.quantity < 10 ? 'Low Stock' : 'In Stock'
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
        XLSX.writeFile(workbook, `Cloud-E-Healthcare_Inventory_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const fetchInventory = async () => {
        try {
            const res = await axios.get('/api/inventory/stock/net');
            setDrugs(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddDrug = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/inventory/drugs', newDrug);
            setShowAddModal(false);
            setNewDrug({ name: '', form: 'Tablet', unit_price: '' });
            fetchInventory();
        } catch (err) {
            alert('Failed to add drug');
        }
    };

    const categories = ['All', 'Tablets', 'Syrups', 'Injections', 'Antibiotics'];

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-fade-in p-4 lg:p-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-8 bg-brand-500 rounded-full"></div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Drug Registry</h1>
                    </div>
                    <p className="text-slate-600 font-semibold ml-4">Efficient pharmacopoeia and inventory management.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-gradient flex items-center gap-2 py-4 px-8 rounded-2xl font-black text-sm"
                >
                    <Plus size={20} strokeWidth={3} />
                    Register New Medication
                </button>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                {categories.map((c) => (
                    <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`px-6 py-2.5 rounded-full text-xs font-black transition-all border shrink-0 ${category === c
                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200'
                            : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                            }`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            <div className="card-premium overflow-hidden border-none p-2 bg-slate-50/30">
                <div className="p-8 bg-white rounded-[1.8rem] flex flex-col md:flex-row justify-between items-center gap-6 mb-2">
                    <div className="relative w-full max-w-md group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-500 transition-colors" size={20} />
                        <input
                            type="text"
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-bold transition-all"
                            placeholder="Search by medication name, batch or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={handleExport}
                            className="flex-1 md:flex-none px-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <Download size={16} />
                            Export data
                        </button>
                        <div className="relative flex-1 md:flex-none">
                            <button
                                onClick={() => setShowFilterMenu(!showFilterMenu)}
                                className={`w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all ${showFilterMenu ? 'ring-4 ring-brand-500/10 border-brand-500 text-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Filter size={16} />
                                Filters
                            </button>

                            {showFilterMenu && (
                                <div className="absolute top-full mt-3 right-0 w-64 bg-white rounded-[1.5rem] shadow-elevated border border-slate-100 p-6 z-30 animate-scale-in">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Stock Status</h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded-lg border-slate-200 text-brand-500 focus:ring-brand-500 transition-all"
                                                checked={statusFilters.low}
                                                onChange={(e) => setStatusFilters({ ...statusFilters, low: e.target.checked })}
                                            />
                                            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Low Stock only</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded-lg border-slate-200 text-brand-500 focus:ring-brand-500 transition-all"
                                                checked={statusFilters.out}
                                                onChange={(e) => setStatusFilters({ ...statusFilters, out: e.target.checked })}
                                            />
                                            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Out of Stock</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded-lg border-slate-200 text-brand-500 focus:ring-brand-500 transition-all"
                                                checked={statusFilters.expiring}
                                                onChange={(e) => setStatusFilters({ ...statusFilters, expiring: e.target.checked })}
                                            />
                                            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Expiring Soon</span>
                                        </label>
                                    </div>
                                    <div className="flex gap-2 mt-6">
                                        <button
                                            onClick={() => {
                                                setStatusFilters({ low: false, out: false, expiring: false });
                                                setCategory('All');
                                                setSearchTerm('');
                                            }}
                                            className="flex-1 py-3 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            onClick={() => setShowFilterMenu(false)}
                                            className="flex-[2] py-3 bg-brand-50 text-brand-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-100 transition-colors"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-[1.8rem]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="px-10 py-6">Product Details</th>
                                <th className="px-10 py-6 text-center">Formulation</th>
                                <th className="px-10 py-6 text-center">Net Inventory</th>
                                <th className="px-10 py-6 text-center">Stock Status</th>
                                <th className="px-10 py-6 text-right pr-14">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredDrugs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-40">
                                            <Search size={48} />
                                            <p className="font-bold text-lg">No medications match your search</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredDrugs.map((drug) => (
                                <tr key={drug.id} className="hover:bg-slate-50/50 transition-all group cursor-pointer">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-brand-50 group-hover:text-brand-500 transition-all duration-500">
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 leading-none mb-1 text-base">{drug.name}</p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Code: HG-{100 + Number(drug.id)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-tight">{drug.form}</span>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <span className="text-xl font-black text-slate-900 tracking-tight">{drug.quantity}</span>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        {drug.quantity > 50 ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-tighter ring-1 ring-emerald-100">
                                                Normal
                                            </span>
                                        ) : drug.quantity > 0 ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-tighter ring-1 ring-amber-100">
                                                Attention
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-tighter ring-1 ring-rose-100">
                                                Depleted
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-10 py-6 text-right pr-14 flex justify-end gap-2">
                                        <button
                                            onClick={() => navigate(`/restock/${drug.id}`)}
                                            className="h-10 px-4 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center gap-2 hover:bg-brand-600 hover:text-white transition-all duration-300 font-bold text-xs"
                                        >
                                            <Layers size={16} />
                                            Restock
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all">
                                            <ChevronRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {drugs.length === 0 && !loading && (
                        <div className="py-24 text-center flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                                <Layers size={40} />
                            </div>
                            <p className="font-bold text-slate-500">No medication data found in the registry.</p>
                            <button onClick={() => setShowAddModal(true)} className="mt-4 text-brand-600 font-black text-sm hover:underline">Add first item</button>
                        </div>
                    )}
                </div>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 lg:p-8">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 lg:p-10 shadow-elevated relative animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="absolute top-6 right-6 w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors z-20"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Register Product</h2>
                        <p className="text-slate-600 font-semibold mb-8 text-xs uppercase tracking-wider opacity-60">Medication Registry Entry</p>

                        <form onSubmit={handleAddDrug} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-slate-800 ml-1 uppercase tracking-wider">Product Description</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. Paracetamol 500mg Extra"
                                    value={newDrug.name}
                                    onChange={(e) => setNewDrug({ ...newDrug, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-800 ml-1 uppercase tracking-wider">Formulation Type</label>
                                    <select
                                        className="input-field appearance-none cursor-pointer"
                                        value={newDrug.form}
                                        onChange={(e) => setNewDrug({ ...newDrug, form: e.target.value })}
                                    >
                                        <option>Tablet</option>
                                        <option>Syrup</option>
                                        <option>Injection</option>
                                        <option>Cream</option>
                                        <option>Capsule</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-slate-800 ml-1 uppercase tracking-wider">Base Retail Price</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                                        <input
                                            type="number"
                                            className="input-field pl-10"
                                            placeholder="0.00"
                                            value={newDrug.unit_price}
                                            onChange={(e) => setNewDrug({ ...newDrug, unit_price: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-5 text-slate-500 font-black hover:bg-slate-50 rounded-2xl transition-all text-sm">Discard Changes</button>
                                <button type="submit" className="flex-1 btn-gradient py-5 font-black text-base">Confirm Registration</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
