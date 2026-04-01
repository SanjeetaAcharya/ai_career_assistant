import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Resume from './pages/Resume';
import JobMatch from './pages/JobMatch';
import SkillGap from './pages/SkillGap';
import Interview from './pages/Interview';
import History from './pages/History';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return children;
};

function AppRoutes() {
    const { user } = useAuth();
    const authPages = ['/login', '/register'];
    const hideNavbar = authPages.includes(window.location.pathname);

    return (
        <>
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
                <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/resume" element={<ProtectedRoute><Resume /></ProtectedRoute>} />
                <Route path="/job-match" element={<ProtectedRoute><JobMatch /></ProtectedRoute>} />
                <Route path="/skill-gap" element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
                <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            </Routes>
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}