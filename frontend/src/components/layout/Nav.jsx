import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'How it Works', href: '#how-it-works' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' },
    ];

    const { token } = useSelector((state) => state.auth)

    return (
        <nav className="fixed top-0 w-full z-[100] border-b border-border-muted bg-background/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                <Link to="/" className="text-2xl font-black tracking-tighter text-text-primary">
                    RESUME<span className="text-primary">.AI</span>
                </Link>

                <div className="hidden md:flex items-center space-x-10 text-sm font-medium text-text-secondary">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className="hover:text-primary transition-colors duration-300"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center space-x-4">
                    {!token ? (
                        <Link to="/login" className="hidden sm:block px-6 py-2.5 border border-border-muted text-text-primary rounded-xl font-bold hover:border-primary hover:text-primary focus:ring-2 focus:ring-primary/50 hover:bg-surface hover:scale-105 transition-all duration-300 text-center cursor-pointer">
                            Sign In
                        </Link>
                    ) : (
                        <Link to="/dashboard" className="hidden sm:block px-6 py-2.5 border border-border-muted text-text-primary rounded-xl font-bold hover:border-primary hover:text-primary focus:ring-2 focus:ring-primary/50 hover:bg-surface hover:scale-105 transition-all duration-300 text-center cursor-pointer">
                            Dashboard
                        </Link>
                    )}
                    <button className="px-6 py-2.5 bg-primary text-background rounded-xl font-bold hover:scale-105 focus:ring-2 focus:ring-primary/50 transition-all duration-300 cursor-pointer">
                        Get Started
                    </button>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;