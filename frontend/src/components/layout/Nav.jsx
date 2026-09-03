import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, LayoutDashboard, LogIn, ArrowRight } from 'lucide-react';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const { token } = useSelector((state) => state.auth);
    const isLoggedIn = !!(token && token !== "null" && token !== "undefined");

    const navLinks = [
        { name: 'Home', href: '/#home' },
        { name: 'How it Works', href: '/#how-it-works' },
        { name: 'Features', href: '/#about' },
        { name: 'Contact', href: '/#contact' },
    ];

    return (
        <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-background/80 backdrop-blur-2xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight text-text-primary group">
                    <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-background shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                        <Sparkles size={20} className="font-bold" />
                    </span>
                    <span>RESUME<span className="text-primary font-light">.AI</span></span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-text-secondary">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="hover:text-primary transition-colors duration-200 py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-primary after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Desktop Action Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                    {!isLoggedIn ? (
                        <Link
                            to="/login"
                            className="px-5 py-2.5 text-sm border border-border-muted/80 text-text-primary rounded-xl font-bold hover:border-primary hover:text-primary hover:bg-primary/5 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                        >
                            <LogIn size={16} /> Sign In
                        </Link>
                    ) : (
                        <Link
                            to="/dashboard"
                            className="px-5 py-2.5 text-sm border border-primary/30 bg-primary/10 text-primary rounded-xl font-bold hover:bg-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                        >
                            <LayoutDashboard size={16} /> Dashboard
                        </Link>
                    )}
                    <a
                        href="/#home"
                        className="px-5 py-2.5 text-sm bg-primary text-background font-black rounded-xl hover:scale-105 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        Analyze Free <ArrowRight size={14} />
                    </a>
                </div>

                {/* Mobile Hamburger Toggle */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 text-text-secondary hover:text-white rounded-lg focus:outline-none cursor-pointer"
                    aria-label="Toggle Navigation"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Dropdown Drawer */}
            {mobileOpen && (
                <div className="md:hidden bg-surface/95 border-b border-border-muted/50 px-6 py-5 space-y-4 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
                    <div className="flex flex-col space-y-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="text-text-secondary hover:text-primary py-2 text-base font-medium"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                        {!isLoggedIn ? (
                            <Link
                                to="/login"
                                onClick={() => setMobileOpen(false)}
                                className="w-full py-3 text-center border border-border-muted text-text-primary rounded-xl font-bold hover:bg-surface"
                            >
                                Sign In
                            </Link>
                        ) : (
                            <Link
                                to="/dashboard"
                                onClick={() => setMobileOpen(false)}
                                className="w-full py-3 text-center bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold"
                            >
                                Go to Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;