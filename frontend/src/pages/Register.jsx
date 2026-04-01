import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await API.post('/auth/register', form);
            login(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center p-8">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 p-10">
                <div className="flex items-center gap-2.5 mb-8">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                            <path d="M2 13 L2 7 L5 4.5 L8 7 L8 13" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                            <path d="M8 13 L8 9 L14 9 L14 13" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                            <line x1="1" y1="13" x2="15" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <span className="text-gray-900 font-semibold">CareerAI</span>
                </div>

                <h2 className="font-display text-3xl text-gray-900 mb-1">Create account</h2>
                <p className="text-gray-500 text-sm mb-8">Start your AI-powered career journey</p>

                {error && (
                    <div className="border border-red-200 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Sanjeeta Acharya' },
                        { label: 'Email Address', key: 'email', type: 'email', placeholder: 'your@email.com' },
                        { label: 'Password', key: 'password', type: 'password', placeholder: 'Minimum 6 characters' },
                    ].map(({ label, key, type, placeholder }) => (
                        <div key={key}>
                            <label className="text-gray-700 text-sm font-medium block mb-1.5">{label}</label>
                            <input type={type} value={form[key]}
                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                className="w-full bg-white text-gray-900 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all text-sm"
                                placeholder={placeholder} required />
                        </div>
                    ))}
                    <button type="submit" disabled={loading}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-medium text-sm transition-colors disabled:opacity-50 shadow-lg shadow-teal-100 mt-2">
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-gray-400 text-sm mt-6 text-center">
                    Already have an account?{' '}
                    <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">Sign in</Link>
                </p>
            </div>
        </div>
    );
}