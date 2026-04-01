import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const cards = [
    {
        title: 'Resume Analyzer',
        desc: 'Upload your resume and get an ATS score, strengths, weaknesses and actionable improvement suggestions.',
        link: '/resume',
        tag: 'ATS Score',
        icon: '📄',
        color: 'border-teal-200 hover:border-teal-400 hover:bg-teal-50',
        tagColor: 'bg-teal-100 text-teal-700',
    },
    {
        title: 'Job Description Matcher',
        desc: 'Paste a job description and see exactly how well your profile matches with detailed gap analysis.',
        link: '/job-match',
        tag: 'Match Score',
        icon: '🎯',
        color: 'border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50',
        tagColor: 'bg-cyan-100 text-cyan-700',
    },
    {
        title: 'Skill Gap Roadmap',
        desc: 'Enter your skills and target role to get a personalized week-by-week learning plan with resources.',
        link: '/skill-gap',
        tag: 'Roadmap',
        icon: '🗺️',
        color: 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50',
        tagColor: 'bg-emerald-100 text-emerald-700',
    },
    {
        title: 'Interview Preparation',
        desc: 'Get 10 tailored interview questions with expert tips and sample answers for your target role.',
        link: '/interview',
        tag: 'Questions',
        icon: '💬',
        color: 'border-sky-200 hover:border-sky-400 hover:bg-sky-50',
        tagColor: 'bg-sky-100 text-sky-700',
    },
];

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-8 py-12">

                {/* Header */}
                <div className="mb-12">
                    <p className="text-teal-600 text-sm font-medium uppercase tracking-widest mb-2">Dashboard</p>
                    <h1 className="font-display text-4xl text-gray-900 mb-3">
                        Good to see you, <span className="text-teal-600">{user?.name?.split(' ')[0]}</span>
                    </h1>
                    <p className="text-gray-500 text-lg">What would you like to work on today?</p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    {cards.map((card) => (
                        <Link key={card.title} to={card.link}
                            className={`group bg-white border-2 rounded-2xl p-7 transition-all duration-200 ${card.color}`}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-2xl">{card.icon}</span>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${card.tagColor}`}>
                                            {card.tag}
                                        </span>
                                    </div>
                                    <h2 className="text-gray-900 text-lg font-semibold mb-2">{card.title}</h2>
                                    <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                                </div>
                                <span className="text-gray-300 group-hover:text-teal-500 transition-colors text-xl ml-4 mt-1">→</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* History */}
                <Link to="/history"
                    className="group flex items-center justify-between bg-white border-2 border-gray-100 hover:border-gray-200 rounded-2xl p-6 transition-all duration-200">
                    <div className="flex items-center gap-4">
                        <span className="text-2xl">📋</span>
                        <div>
                            <h2 className="text-gray-900 font-semibold">Analysis History</h2>
                            <p className="text-gray-400 text-sm">Review all your past analyses and results</p>
                        </div>
                    </div>
                    <span className="text-gray-300 group-hover:text-teal-500 transition-colors text-xl">→</span>
                </Link>
            </div>
        </div>
    );
}