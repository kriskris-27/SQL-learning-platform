import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Database, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="c-navbar">
            <Link to="/" className="c-navbar__brand">
                <Database size={24} />
                <span>CipherSQL</span>
            </Link>

            <ul className="c-navbar__links">
                <li>
                    <Link to="/" className={`c-navbar__link ${location.pathname === '/' ? 'c-navbar__link--active' : ''}`}>
                        Assignments
                    </Link>
                </li>
                {isAuthenticated && (
                    <>
                        <li>
                            <Link to="/progress" className={`c-navbar__link ${location.pathname === '/progress' ? 'c-navbar__link--active' : ''}`}>
                                My Progress
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="c-navbar__link c-navbar__link--logout">
                                <LogOut size={18} />
                                Logout
                            </button>
                        </li>
                    </>
                )}
                {!isAuthenticated && (
                    <li>
                        <Link to="/login" className={`c-navbar__link ${location.pathname === '/login' ? 'c-navbar__link--active' : ''}`}>
                            Login
                        </Link>
                    </li>
                )}
            </ul>

            <button className="c-navbar__mobile-toggle">
                <Menu size={24} />
            </button>
        </nav>
    );
};

export default Navbar;
