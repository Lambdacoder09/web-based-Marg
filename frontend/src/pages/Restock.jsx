import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Layers, ArrowLeft, Save, Package, Calendar, Tag, DollarSign, PlusSquare } from 'lucide-react';

const Restock = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [drug, setDrug] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adjType, setAdjType] = useState('add'); // 'add' | 'remove'
    const [restockData, setRestockData] = useState({
        batch_number: '',
        buying_price: '',
        selling_price: '',
        quantity: '',
        expiry_date: ''
    });

    useEffect(() => {
        const fetchDrug = async () => {
            try {
                const res = await axios.get('/api/inventory/stock/net');
                const found = res.data.find(d => d.id === parseInt(id));
                if (found) {
                    setDrug(found);
                    setRestockData(prev => ({ ...prev, selling_price: found.unit_price }));
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchDrug();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/inventory/stock', {
                drug_id: id,
                ...restockData,
                quantity: adjType === 'add' ? restockData.quantity : -Math.abs(restockData.quantity)
            });
            navigate('/inventory');
        } catch (err) {
            alert('Failed to update stock');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
    );

    if (!drug) return (
        <div className="max-w-7xl mx-auto p-8 text-center">
            <h1 className="text-2xl font-black text-slate-900">Medication Not Found</h1>
            <button onClick={() => navigate('/inventory')} className="mt-4 text-brand-600 font-bold hover:underline flex items-center gap-2 mx-auto">
                <ArrowLeft size={16} /> Back to Registry
            </button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto animate-fade-in py-10 px-4 lg:px-0">
            {/* Header Area */}
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate('/inventory')}
                        className="group flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-6 font-bold text-sm uppercase tracking-widest"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Registry
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shadow-sm ring-1 ring-brand-100">
                            <Layers size={28} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Restock Inventory</h1>
                            <p className="text-slate-500 font-semibold text-lg">Batch update for <span className="text-brand-600 font-bold">{drug.name}</span></p>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block">
                    <div className="px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Balance</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">{drug.quantity} Units</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-10 shadow-elevated border border-slate-50 space-y-8">
                        {/* Adjustment Type Toggle */}
                        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 mb-2">
                            <button
                                type="button"
                                onClick={() => setAdjType('add')}
                                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${adjType === 'add' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Stock Addition
                            </button>
                            <button
                                type="button"
                                onClick={() => setAdjType('remove')}
                                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${adjType === 'remove' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Stock Subtraction
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-wider ml-1">
                                    <PlusSquare size={16} className={adjType === 'add' ? 'text-brand-500' : 'text-rose-500'} />
                                    {adjType === 'add' ? 'Quantity to Add' : 'Quantity to Remove'}
                                </label>
                                <input
                                    type="number"
                                    className="input-field"
                                    placeholder="e.g. 50"
                                    value={restockData.quantity}
                                    onChange={(e) => setRestockData({ ...restockData, quantity: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-wider ml-1">
                                    <Tag size={16} className="text-brand-500" />
                                    Batch Reference
                                </label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="BATCH-2024-001"
                                    value={restockData.batch_number}
                                    onChange={(e) => setRestockData({ ...restockData, batch_number: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-wider ml-1">
                                    <DollarSign size={16} className="text-brand-500" />
                                    Unit Acquisition Cost
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 group-focus-within:text-brand-500 transition-colors">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="input-field pl-12"
                                        placeholder="0.00"
                                        value={restockData.buying_price}
                                        onChange={(e) => setRestockData({ ...restockData, buying_price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-wider ml-1">
                                    <DollarSign size={16} className="text-brand-500" />
                                    Unit Selling Target
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 group-focus-within:text-brand-500 transition-colors">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="input-field pl-12"
                                        placeholder="0.00"
                                        value={restockData.selling_price}
                                        onChange={(e) => setRestockData({ ...restockData, selling_price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-wider ml-1">
                                <Calendar size={16} className="text-brand-500" />
                                Batch Expiry Date
                            </label>
                            <input
                                type="date"
                                className="input-field cursor-pointer"
                                value={restockData.expiry_date}
                                onChange={(e) => setRestockData({ ...restockData, expiry_date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="pt-6 border-t border-slate-50 flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/inventory')}
                                className="flex-1 py-5 bg-slate-50 text-slate-500 font-bold rounded-[1.5rem] hover:bg-slate-100 transition-all active:scale-95"
                            >
                                Cancel Update
                            </button>
                            <button
                                type="submit"
                                className="flex-[2] btn-gradient py-5 font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-brand-200 active:scale-95"
                            >
                                <Save size={20} />
                                {adjType === 'add' ? 'Commit Inventory Batch' : 'Apply Stock Adjustment'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Section */}
                <div className="space-y-8">
                    <div className={adjType === 'add' ? 'bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl' : 'bg-rose-900 rounded-[2.5rem] p-8 text-white shadow-2xl transition-colors duration-500'}>
                        <h3 className="text-lg font-black mb-6 tracking-tight">{adjType === 'add' ? 'Stock Analysis' : 'Adjustment Summary'}</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-slate-400 text-sm font-bold">Transaction Type</span>
                                <span className={adjType === 'add' ? 'font-black text-emerald-400' : 'font-black text-rose-400'}>
                                    {adjType === 'add' ? 'ADDITION' : 'SUBTRACTION'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <span className="text-slate-400 text-sm font-bold">Projected Net Change</span>
                                <span className="font-black">
                                    {adjType === 'add' ? '+' : '-'}{restockData.quantity || 0} Units
                                </span>
                            </div>
                            {adjType === 'add' && (
                                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                    <span className="text-slate-400 text-sm font-bold">Current Margin</span>
                                    <span className="font-black text-brand-400">
                                        {restockData.buying_price && restockData.selling_price
                                            ? `${(((restockData.selling_price - restockData.buying_price) / restockData.buying_price) * 100).toFixed(1)}%`
                                            : '0%'}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm font-bold">
                                    {adjType === 'add' ? 'Projected Cost Value' : 'Adjustment Total'}
                                </span>
                                <span className="font-black">
                                    ${(Number(restockData.quantity || 0) * Number(adjType === 'add' ? restockData.buying_price || 0 : restockData.selling_price || 0)).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {adjType === 'add' ? (
                        <div className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100">
                            <div className="flex items-center gap-3 mb-4 text-emerald-700">
                                <Package size={20} />
                                <h4 className="font-black text-sm uppercase tracking-widest">Inventory Health</h4>
                            </div>
                            <p className="text-emerald-700/70 text-sm leading-relaxed font-semibold">
                                Updating stock levels will immediately reflect in the Sales Terminal. Please ensure batch numbers are accurate for compliance tracking.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-rose-50 rounded-[2.5rem] p-8 border border-rose-100">
                            <div className="flex items-center gap-3 mb-4 text-rose-700">
                                <Package size={20} />
                                <h4 className="font-black text-sm uppercase tracking-widest">Adjustment Warning</h4>
                            </div>
                            <p className="text-rose-700/70 text-sm leading-relaxed font-semibold">
                                Decreasing stock is an irreversible action used for damages or errors. Please verify the quantity before committing.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Restock;
