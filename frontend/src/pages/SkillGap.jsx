import { useState } from 'react';
import API from '../api/axios';

export default function SkillGap() {
    const [form, setForm] = useState({ skills: '', targetRole: '', experienceLevel: 'beginner' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const { data } = await API.post('/ai/skill-gap', form);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    const priorityStyle = (p) => {
        if (p === 'high') return 'text-red-600 bg-red-50 border-red-200';
        if (p === 'medium') return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-gray-500 bg-gray-50 border-gray-200';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-8 py-12">
                <div className="mb-10">
                    <p className="text-teal-600 text-sm font-medium uppercase tracking-widest mb-2">Skill Gap</p>
                    <h1 className="font-display text-4xl text-gray-900">Skill Gap Roadmap</h1>
                    <p className="text-gray-500 mt-2">Get a personalized learning roadmap to reach your target role.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-8 mb-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="md:col-span-2">
                            <label className="text-gray-700 text-sm font-medium block mb-2">Your Current Skills</label>
                            <textarea value={form.skills}
                                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                                className="w-full bg-gray-50 text-gray-900 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 text-sm h-28 resize-none transition-all"
                                placeholder="e.g. Python, HTML, CSS, JavaScript, Excel..." required />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-700 text-sm font-medium block mb-2">Target Role</label>
                                <input type="text" value={form.targetRole}
                                    onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                                    className="w-full bg-gray-50 text-gray-900 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 text-sm transition-all"
                                    placeholder="e.g. Full Stack Developer" required />
                            </div>
                            <div>
                                <label className="text-gray-700 text-sm font-medium block mb-2">Experience Level</label>
                                <select value={form.experienceLevel}
                                    onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                                    className="w-full bg-gray-50 text-gray-900 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-400 text-sm">
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button type="submit" disabled={loading}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-medium text-sm transition-colors disabled:opacity-50 shadow-lg shadow-teal-100">
                        {loading ? 'Building your roadmap...' : 'Generate Roadmap'}
                    </button>
                </form>

                {result && (
                    <div className="space-y-5">
                        {/* Readiness */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-teal-600 text-xs font-semibold uppercase tracking-widest mb-2">Readiness Score</p>
                                    <p className="text-7xl font-display text-teal-500">
                                        {result.readiness_score}
                                        <span className="text-3xl text-gray-300">%</span>
                                    </p>
                                    <p className="text-gray-400 text-sm mt-2">Estimated timeline: <span className="text-gray-600 font-medium">{result.estimated_timeline}</span></p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 max-w-xs">
                                    <p className="text-gray-600 text-sm leading-relaxed">{result.summary}</p>
                                </div>
                            </div>
                        </div>

                        {/* Skill Gaps */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <p className="text-red-500 text-xs font-semibold uppercase tracking-widest mb-4">Skill Gaps to Address</p>
                            <div className="space-y-3">
                                {result.skill_gaps?.map((gap, i) => (
                                    <div key={i} className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0">
                                        <span className={`text-xs font-semibold border px-2.5 py-1 rounded-full whitespace-nowrap ${priorityStyle(gap.priority)}`}>
                                            {gap.priority}
                                        </span>
                                        <div>
                                            <p className="text-gray-800 text-sm font-semibold">{gap.skill}</p>
                                            <p className="text-gray-400 text-xs mt-0.5">{gap.reason}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Roadmap */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <p className="text-teal-600 text-xs font-semibold uppercase tracking-widest mb-6">Learning Roadmap</p>
                            <div className="space-y-6">
                                {result.roadmap?.map((week, i) => (
                                    <div key={i} className="flex gap-5">
                                        <div className="flex flex-col items-center">
                                            <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-teal-100">
                                                {i + 1}
                                            </div>
                                            {i < result.roadmap.length - 1 && (
                                                <div className="w-0.5 flex-1 bg-teal-100 mt-2"></div>
                                            )}
                                        </div>
                                        <div className="pb-6 flex-1">
                                            <p className="text-teal-600 text-xs font-semibold uppercase tracking-wider mb-1">{week.week}</p>
                                            <p className="text-gray-800 text-sm font-semibold mb-2">{week.focus}</p>
                                            <ul className="space-y-1 mb-3">
                                                {week.tasks?.map((task, j) => (
                                                    <li key={j} className="text-gray-500 text-xs flex gap-2">
                                                        <span className="text-teal-400">→</span> {task}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="flex flex-wrap gap-2">
                                                {week.resources?.map((r, j) => (
                                                    <span key={j} className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">{r}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Checklist */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">Job-Ready Checklist</p>
                            <ul className="space-y-2">
                                {result.job_ready_checklist?.map((item, i) => (
                                    <li key={i} className="text-gray-600 text-sm flex gap-3 py-2 border-b border-gray-50 last:border-0">
                                        <span className="w-5 h-5 border-2 border-gray-200 rounded flex-shrink-0 mt-0.5"></span>
                                        {item}
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