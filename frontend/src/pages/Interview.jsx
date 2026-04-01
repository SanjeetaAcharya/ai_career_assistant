import { useState } from 'react';
import API from '../api/axios';

export default function Interview() {
    const [form, setForm] = useState({ targetRole: '', experienceLevel: 'mid-level', skills: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeQuestion, setActiveQuestion] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);
        setActiveQuestion(null);
        try {
            const { data } = await API.post('/ai/interview-prep', form);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate questions');
        } finally {
            setLoading(false);
        }
    };

    const categoryStyle = (cat) => {
        if (cat === 'technical') return 'text-blue-600 bg-blue-50 border-blue-200';
        if (cat === 'behavioral') return 'text-purple-600 bg-purple-50 border-purple-200';
        return 'text-amber-600 bg-amber-50 border-amber-200';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-8 py-12">
                <div className="mb-10">
                    <p className="text-teal-600 text-sm font-medium uppercase tracking-widest mb-2">Interview Prep</p>
                    <h1 className="font-display text-4xl text-gray-900">Interview Preparation</h1>
                    <p className="text-gray-500 mt-2">Get 10 tailored questions with expert tips and sample answers.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-8 mb-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="text-gray-700 text-sm font-medium block mb-2">Target Role</label>
                            <input type="text" value={form.targetRole}
                                onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                                className="w-full bg-gray-50 text-gray-900 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 text-sm transition-all"
                                placeholder="e.g. React Developer" required />
                        </div>
                        <div>
                            <label className="text-gray-700 text-sm font-medium block mb-2">Experience Level</label>
                            <select value={form.experienceLevel}
                                onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                                className="w-full bg-gray-50 text-gray-900 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 text-sm">
                                <option value="entry-level">Entry Level</option>
                                <option value="mid-level">Mid Level</option>
                                <option value="senior">Senior</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-gray-700 text-sm font-medium block mb-2">Your Skills (optional)</label>
                            <input type="text" value={form.skills}
                                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                                className="w-full bg-gray-50 text-gray-900 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 text-sm transition-all"
                                placeholder="e.g. React, Node.js" />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button type="submit" disabled={loading}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-medium text-sm transition-colors disabled:opacity-50 shadow-lg shadow-teal-100">
                        {loading ? 'Generating questions...' : 'Generate Interview Questions'}
                    </button>
                </form>

                {result && (
                    <div className="space-y-5">
                        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6">
                            <p className="text-teal-700 text-xs font-semibold uppercase tracking-widest mb-1">{result.role}</p>
                            <p className="text-teal-600 text-sm">{result.intro}</p>
                        </div>

                        {/* Questions */}
                        <div className="space-y-3">
                            {result.questions?.map((q) => (
                                <div key={q.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                    <button
                                        onClick={() => setActiveQuestion(activeQuestion === q.id ? null : q.id)}
                                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4 flex-1">
                                            <span className="text-gray-300 text-sm font-mono w-6 flex-shrink-0">{String(q.id).padStart(2, '0')}</span>
                                            <span className={`text-xs font-semibold border px-2.5 py-1 rounded-full flex-shrink-0 ${categoryStyle(q.category)}`}>
                                                {q.category}
                                            </span>
                                            <p className="text-gray-700 text-sm font-medium">{q.question}</p>
                                        </div>
                                        <span className="text-gray-300 ml-4 text-lg">{activeQuestion === q.id ? '−' : '+'}</span>
                                    </button>

                                    {activeQuestion === q.id && (
                                        <div className="px-5 pb-5 border-t border-gray-50">
                                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-teal-50 rounded-xl p-4">
                                                    <p className="text-teal-600 text-xs font-semibold uppercase tracking-wider mb-2">How to Answer</p>
                                                    <p className="text-gray-600 text-sm leading-relaxed">{q.tip}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Sample Structure</p>
                                                    <p className="text-gray-600 text-sm leading-relaxed">{q.sample_answer}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Tips */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">General Interview Tips</p>
                            <ul className="space-y-1">
                                {result.general_tips?.map((tip, i) => (
                                    <li key={i} className="text-gray-600 text-sm flex gap-2.5 py-2 border-b border-gray-50 last:border-0">
                                        <span className="text-teal-500 font-bold">→</span> {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Questions to ask */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <p className="text-emerald-600 text-xs font-semibold uppercase tracking-widest mb-4">Questions to Ask the Interviewer</p>
                            <ul className="space-y-1">
                                {result.questions_to_ask_interviewer?.map((q, i) => (
                                    <li key={i} className="text-gray-600 text-sm flex gap-2.5 py-2 border-b border-gray-50 last:border-0">
                                        <span className="text-emerald-400 font-bold">?</span> {q}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}