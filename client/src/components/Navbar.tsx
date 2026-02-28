import React from 'react';
import { Database, Menu } from 'lucide-react';

const Navbar: React.FC = () => {
    return (
        <nav className="c-navbar">
            <div className="c-navbar__brand">
                <Database size={24} />
                <span>CipherSQL</span>
            </div>

            <ul className="c-navbar__links">
                <li><a href="/" className="c-navbar__link c-navbar__link--active">Assignments</a></li>
                <li><a href="/progress" className="c-navbar__link">My Progress</a></li>
                <li><a href="/login" className="c-navbar__link">Login</a></li>
            </ul>

            <button className="c-navbar__mobile-toggle">
                <Menu size={24} />
            </button>
        </nav>
    );
};

export default Navbar;
