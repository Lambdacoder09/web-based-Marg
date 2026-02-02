import React, { useState } from 'react';
import axios from 'axios';
import { Cloud, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/login', { username, password });
            localStorage.setItem('user', JSON.stringify(res.data.user));
            onLogin(res.data.user);
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6 relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-50 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px]" />

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white card-premium overflow-hidden relative z-10 scale-in-center">
                {/* Left Side: Illustration & Branding */}
                <div className="bg-brand-600 p-12 lg:p-16 flex flex-col justify-between items-start text-white relative">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Cloud size={28} strokeWidth={3} />
                        </div>
                        <span className="text-2xl font-black tracking-tight italic">Cloud-E <span className="text-white/70 font-medium not-italic">Healthcare</span></span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl font-black leading-tight">Digital Pharmacy Management <br /> <span className="text-brand-200">Simplified.</span></h1>
                        <p className="text-lg text-brand-100/80 max-w-sm leading-relaxed">
                            Track inventory, manage sales, and generate reports with our state-of-the-art pharmaceutical platform.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="py-3 px-5 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <p className="text-xs text-white/60 font-medium uppercase tracking-widest mb-1">Active Users</p>
                            <p className="text-xl font-bold">1,240+</p>
                        </div>
                        <div className="py-3 px-5 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <p className="text-xs text-white/60 font-medium uppercase tracking-widest mb-1">Stock Vol.</p>
                            <p className="text-xl font-bold">45.2k</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-12 lg:p-16 flex flex-col justify-center">
                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-slate-800 mb-2">Account Login</h2>
                        <p className="text-slate-500 font-medium">Please enter your credentials to continue</p>
                    </div>

                    {error && (
                        <div className="bg-rose-50 text-rose-500 p-4 rounded-2xl mb-8 flex items-center gap-3 border border-rose-100 animate-fade-in">
                            < ShieldCheck size={18} className="rotate-180" />
                            <span className="text-sm font-bold">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
                            <div className="relative group">
                                <User size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                <input
                                    type="text"
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium"
                                    placeholder="e.g. jsmith_ph"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                            <div className="relative group">
                                <Lock size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                <input
                                    type="password"
                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500" />
                                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Keep me signed in</span>
                            </label>
                            <button type="button" className="text-xs font-bold text-brand-500 hover:text-brand-600 transition-colors">Forgot Password?</button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-gradient py-5 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 mt-4"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Enter Dashboard
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-12 text-center text-xs text-slate-400 font-medium">
                        Authorized Personnel Only. © 2024 Cloud-E-Healthcare Solutions
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
