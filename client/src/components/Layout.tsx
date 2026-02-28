import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="l-layout">
            <Navbar />
            <main className="l-layout__main">
                {children}
            </main>
            <footer className="l-layout__footer">
                <p>&copy; 2026 CipherSQLStudio</p>
            </footer>
        </div>
    );
};

export default Layout;
