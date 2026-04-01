import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await API.post('/auth/login', form);
            login(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 bg-teal-600 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full -translate-y-32 translate-x-32 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-700 rounded-full translate-y-48 -translate-x-48 opacity-30"></div>

                <div className="relative flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                            <path d="M2 13 L2 7 L5 4.5 L8 7 L8 13" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                            <path d="M8 13 L8 9 L14 9 L14 13" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                            <line x1="1" y1="13" x2="15" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <span className="text-white text-lg font-semibold">CareerAI</span>
                </div>

                <div className="relative">
                    <h1 className="font-display text-5xl text-white leading-tight mb-6">
                        Accelerate your<br />
                        <span className="italic text-teal-200">career journey</span><br />
                        with AI
                    </h1>
                    <p className="text-teal-100 text-lg font-light leading-relaxed max-w-md">
                        Analyze resumes, match jobs, identify skill gaps and ace interviews — all powered by Google Gemini AI.
                    </p>
                </div>

                <div className="relative flex gap-10">
                    {[['Resume', 'ATS Analysis'], ['Skills', 'Gap Roadmap'], ['Interview', 'Preparation']].map(([val, label]) => (
                        <div key={label}>
                            <p className="text-white text-xl font-semibold">{val}</p>
                            <p className="text-teal-200 text-xs uppercase tracking-wider mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="font-display text-3xl text-gray-900 mb-2">Welcome back</h2>
                        <p className="text-gray-500">Sign in to your career dashboard</p>
                    </div>

                    {error && (
                        <div className="border border-red-200 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-gray-700 text-sm font-medium block mb-1.5">Email Address</label>
                            <input type="email" value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full bg-white text-gray-900 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all text-sm"
                                placeholder="your@email.com" required />
                        </div>
                        <div>
                            <label className="text-gray-700 text-sm font-medium block mb-1.5">Password</label>
                            <input type="password" value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full bg-white text-gray-900 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all text-sm"
                                placeholder="••••••••" required />
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-medium text-sm transition-colors disabled:opacity-50 shadow-lg shadow-teal-100">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-gray-400 text-sm mt-6 text-center">
                        No account?{' '}
                        <Link to="/register" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}