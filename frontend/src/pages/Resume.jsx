import { useState } from 'react';
import API from '../api/axios';

export default function Resume() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return setError('Please upload a PDF resume');
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const formData = new FormData();
            formData.append('resume', file);
            const { data } = await API.post('/ai/analyze-resume', formData);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const scoreColor = (score) => {
        if (score >= 75) return 'text-emerald-600';
        if (score >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    const scoreBg = (score) => {
        if (score >= 75) return 'bg-emerald-500';
        if (score >= 50) return 'bg-amber-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-8 py-12">
                <div className="mb-10">
                    <p className="text-teal-600 text-sm font-medium uppercase tracking-widest mb-2">Resume Analysis</p>
                    <h1 className="font-display text-4xl text-gray-900">ATS Resume Analyzer</h1>
                    <p className="text-gray-500 mt-2">Upload your resume and get an instant ATS score with detailed feedback.</p>
                </div>

                {/* Upload */}
                <form onSubmit={handleSubmit} className="bg-white border-2 border-dashed border-gray-200 hover:border-teal-300 rounded-2xl p-8 mb-8 transition-colors">
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl">📄</span>
                        </div>
                        <p className="text-gray-700 font-medium">Upload your resume</p>
                        <p className="text-gray-400 text-sm mt-1">PDF format only</p>
                    </div>
                    <input type="file" accept=".pdf"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full text-gray-500 text-sm mb-4 file:mr-4 file:py-2 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-500 file:text-white hover:file:bg-teal-600 file:cursor-pointer" />
                    {file && <p className="text-teal-600 text-sm text-center mb-4">Selected: {file.name}</p>}
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                    <button type="submit" disabled={loading}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-medium text-sm transition-colors disabled:opacity-50 shadow-lg shadow-teal-100">
                        {loading ? 'Analyzing your resume...' : 'Analyze Resume'}
                    </button>
                </form>

                {result && (
                    <div className="space-y-5">
                        {/* ATS Score */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <p className="text-teal-600 text-xs font-semibold uppercase tracking-widest mb-2">ATS Score</p>
                                    <p className={`text-7xl font-display ${scoreColor(result.ats_score)}`}>
                                        {result.ats_score}
                                        <span className="text-3xl text-gray-300">/100</span>
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 max-w-xs">
                                    <p className="text-gray-600 text-sm leading-relaxed">{result.overall_summary}</p>
                                </div>
                            </div>

                            {result.section_scores && (
                                <div>
                                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">Section Breakdown</p>
                                    <div className="space-y-3">
                                        {Object.entries(result.section_scores).map(([section, score]) => (
                                            <div key={section} className="flex items-center gap-4">
                                                <span className="text-gray-500 text-sm capitalize w-36">{section.replace('_', ' ')}</span>
                                                <div className="flex-1 bg-gray-100 rounded-full h-2">
                                                    <div className={`h-2 rounded-full transition-all ${scoreBg(score)}`}
                                                        style={{ width: `${score}%` }} />
                                                </div>
                                                <span className={`text-sm font-semibold w-8 text-right ${scoreColor(score)}`}>{score}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Strengths & Weaknesses */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <p className="text-emerald-600 text-xs font-semibold uppercase tracking-widest mb-4">Strengths</p>
                                <ul className="space-y-2">
                                    {result.strengths?.map((s, i) => (
                                        <li key={i} className="text-gray-600 text-sm flex gap-2.5 py-1">
                                            <span className="text-emerald-500 font-bold mt-0.5">✓</span> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <p className="text-red-500 text-xs font-semibold uppercase tracking-widest mb-4">Weaknesses</p>
                                <ul className="space-y-2">
                                    {result.weaknesses?.map((w, i) => (
                                        <li key={i} className="text-gray-600 text-sm flex gap-2.5 py-1">
                                            <span className="text-red-400 font-bold mt-0.5">✗</span> {w}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Missing Keywords */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <p className="text-amber-600 text-xs font-semibold uppercase tracking-widest mb-4">Missing Keywords</p>
                            <div className="flex flex-wrap gap-2">
                                {result.missing_keywords?.map((kw, i) => (
                                    <span key={i} className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-medium">
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Suggestions */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">Improvement Suggestions</p>
                            <div className="space-y-3">
                                {result.suggestions?.map((s, i) => (
                                    <div key={i} className="flex gap-4 py-3 border-b border-gray-50 last:border-0">
                                        <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg h-fit whitespace-nowrap">{s.section}</span>
                                        <p className="text-gray-600 text-sm leading-relaxed">{s.suggestion}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}