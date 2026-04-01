import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { to: '/dashboard', label: 'Overview' },
        { to: '/resume', label: 'Resume' },
        { to: '/job-match', label: 'Job Match' },
        { to: '/skill-gap', label: 'Skill Gap' },
        { to: '/interview', label: 'Interview' },
        { to: '/history', label: 'History' },
    ];

    return (
        <nav className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M2 13 L2 7 L5 4.5 L8 7 L8 13" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                            <path d="M8 13 L8 9 L14 9 L14 13" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                            <line x1="1" y1="13" x2="15" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <span className="text-gray-900 text-base font-semibold">CareerAI</span>
                </Link>

                {user && (
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-1">
                            {navLinks.map(({ to, label }) => (
                                <Link key={to} to={to}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        location.pathname === to
                                            ? 'bg-teal-50 text-teal-600'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                    }`}>
                                    {label}
                                </Link>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 border-l border-gray-100 pl-8">
                            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                                <span className="text-teal-700 text-xs font-semibold">{user.name?.charAt(0).toUpperCase()}</span>
                            </div>
                            <span className="text-gray-500 text-sm">{user.name}</span>
                            <button onClick={handleLogout}
                                className="text-xs text-red-400 hover:text-red-500 transition-colors font-medium">
                                Sign out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}