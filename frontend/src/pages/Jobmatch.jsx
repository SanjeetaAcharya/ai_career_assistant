import { useState } from 'react';
import API from '../api/axios';

export default function JobMatch() {
    const [form, setForm] = useState({ resumeText: '', jobDescription: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const { data } = await API.post('/ai/match-job', form);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    const scoreColor = (score) => {
        if (score >= 75) return 'text-emerald-600';
        if (score >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-8 py-12">
                <div className="mb-10">
                    <p className="text-teal-600 text-sm font-medium uppercase tracking-widest mb-2">Job Match</p>
                    <h1 className="font-display text-4xl text-gray-900">Job Description Matcher</h1>
                    <p className="text-gray-500 mt-2">See how well your profile matches a job and what to improve.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-8 mb-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="text-gray-700 text-sm font-medium block mb-2">Your Resume Text</label>
                            <textarea value={form.resumeText}
                                onChange={(e) => setForm({ ...form, resumeText: e.target.value })}
                                className="w-full bg-gray-50 text-gray-900 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 text-sm h-56 resize-none transition-all"
                                placeholder="Paste your resume text here..." required />
                        </div>
                        <div>
                            <label className="text-gray-700 text-sm font-medium block mb-2">Job Description</label>
                            <textarea value={form.jobDescription}
                                onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
                                className="w-full bg-gray-50 text-gray-900 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 text-sm h-56 resize-none transition-all"
                                placeholder="Paste the job description here..." required />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button type="submit" disabled={loading}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-medium text-sm transition-colors disabled:opacity-50 shadow-lg shadow-teal-100">
                        {loading ? 'Analyzing match...' : 'Analyze Match'}
                    </button>
                </form>

                {result && (
                    <div className="space-y-5">
                        {/* Match Score */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-teal-600 text-xs font-semibold uppercase tracking-widest mb-2">Match Score</p>
                                    <p className={`text-7xl font-display ${scoreColor(result.match_score)}`}>
                                        {result.match_score}
                                        <span className="text-3xl text-gray-300">%</span>
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 max-w-xs">
                                    <p className="text-gray-600 text-sm leading-relaxed">{result.summary}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <p className="text-emerald-600 text-xs font-semibold uppercase tracking-widest mb-4">Matching Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {result.matching_skills?.map((s, i) => (
                                        <span key={i} className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <p className="text-red-500 text-xs font-semibold uppercase tracking-widest mb-4">Missing Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {result.missing_skills?.map((s, i) => (
                                        <span key={i} className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <p className="text-teal-600 text-xs font-semibold uppercase tracking-widest mb-4">Recommendations</p>
                            <ul className="space-y-1">
                                {result.recommendations?.map((r, i) => (
                                    <li key={i} className="text-gray-600 text-sm flex gap-2.5 py-2 border-b border-gray-50 last:border-0">
                                        <span className="text-teal-500 font-bold">→</span> {r}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">Cover Letter Tips</p>
                            <ul className="space-y-1">
                                {result.cover_letter_tips?.map((t, i) => (
                                    <li key={i} className="text-gray-600 text-sm flex gap-2.5 py-2 border-b border-gray-50 last:border-0">
                                        <span className="text-gray-300">•</span> {t}
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