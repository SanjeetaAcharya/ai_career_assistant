import { useEffect, useState } from 'react';
import API from '../api/axios';

const typeConfig = {
    resume: { label: 'Resume Analysis', color: 'text-teal-700 bg-teal-50 border-teal-200', icon: '📄' },
    jobmatch: { label: 'Job Match', color: 'text-purple-700 bg-purple-50 border-purple-200', icon: '🎯' },
    skillgap: { label: 'Skill Gap', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: '🗺️' },
    interview: { label: 'Interview Prep', color: 'text-sky-700 bg-sky-50 border-sky-200', icon: '💬' },
};

export default function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get('/history')
            .then(({ data }) => setHistory(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this analysis?')) return;
        try {
            await API.delete(`/history/${id}`);
            setHistory(history.filter(h => h._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const getScore = (item) => {
        if (item.type === 'resume') return `ATS Score: ${item.result?.ats_score}/100`;
        if (item.type === 'jobmatch') return `Match: ${item.result?.match_score}%`;
        if (item.type === 'skillgap') return `Readiness: ${item.result?.readiness_score}%`;
        if (item.type === 'interview') return `${item.result?.questions?.length || 0} questions generated`;
        return '';
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Loading records...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-8 py-12">
                <div className="mb-10">
                    <p className="text-teal-600 text-sm font-medium uppercase tracking-widest mb-2">Records</p>
                    <h1 className="font-display text-4xl text-gray-900">Analysis History</h1>
                </div>

                {history.length === 0 ? (
                    <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                        <span className="text-4xl">📋</span>
                        <p className="text-gray-400 text-sm mt-4">No analyses yet. Start with a resume analysis or job match!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((item) => {
                            const config = typeConfig[item.type] || { label: item.type, color: 'text-gray-500 bg-gray-50 border-gray-200', icon: '📋' };
                            return (
                                <div key={item._id} className="bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-5 transition-colors shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xl">{config.icon}</span>
                                            <span className={`text-xs font-semibold border px-2.5 py-1 rounded-full ${config.color}`}>
                                                {config.label}
                                            </span>
                                            <span className="text-gray-700 text-sm font-medium">{getScore(item)}</span>
                                            <span className="text-gray-300 text-xs">
                                                {new Date(item.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <button onClick={() => handleDelete(item._id)}
                                            className="text-xs text-gray-300 hover:text-red-400 transition-colors font-medium">
                                            Delete
                                        </button>
                                    </div>
                                    {item.input?.targetRole && (
                                        <p className="text-gray-400 text-xs mt-2 ml-10">Target: {item.input.targetRole}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}