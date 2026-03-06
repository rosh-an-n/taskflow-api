import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <span className="brand-icon">⚡</span>
                TaskFlow
            </Link>

            <div className="navbar-links">
                {isAuthenticated ? (
                    <div className="navbar-user">
                        <div className="navbar-user-info">
                            <div className="navbar-user-name">{user?.name}</div>
                            <div className="navbar-user-role">{user?.role}</div>
                        </div>
                        <button className="btn btn-ghost" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-ghost">Login</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
