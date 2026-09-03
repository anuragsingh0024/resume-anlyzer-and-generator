import React from 'react';
import { GitBranch, Globe, Share2, Mail, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-surface/90 border-t border-white/5 pt-16 pb-12 px-6 relative">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                {/* Brand Column */}
                <div className="space-y-4 md:col-span-1">
                    <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight text-text-primary">
                        <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-background text-sm font-bold">
                            <Sparkles size={16} />
                        </span>
                        <span>RESUME<span className="text-primary font-light">.AI</span></span>
                    </Link>
                    <p className="text-text-secondary text-sm leading-relaxed">
                        Revolutionizing the way developers optimize resumes and land dream tech roles.
                    </p>
                    <div className="flex space-x-3 pt-2">
                        <a href="https://github.com/anuragsingh0024" target="_blank" rel="noreferrer" title="GitHub" className="p-2.5 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-xl transition-all">
                            <GitBranch size={18} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="Network" className="p-2.5 bg-white/5 hover:bg-secondary/20 hover:text-secondary rounded-xl transition-all">
                            <Globe size={18} />
                        </a>
                        <a href="mailto:support@resumeai.com" title="Support Email" className="p-2.5 bg-white/5 hover:bg-accent/20 hover:text-accent rounded-xl transition-all">
                            <Mail size={18} />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-text-primary mb-5">Product</h4>
                    <ul className="space-y-3 text-sm text-text-secondary">
                        <li><a href="/#home" className="hover:text-primary transition">Resume Scanner</a></li>
                        <li><a href="/#how-it-works" className="hover:text-primary transition">ATS Algorithm</a></li>
                        <li><a href="/#about" className="hover:text-primary transition">Skill Matcher</a></li>
                    </ul>
                </div>

                {/* Platform */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-text-primary mb-5">Platform</h4>
                    <ul className="space-y-3 text-sm text-text-secondary">
                        <li><Link to="/login" className="hover:text-primary transition">Sign In</Link></li>
                        <li><Link to="/dashboard" className="hover:text-primary transition">User Dashboard</Link></li>
                        <li><a href="/#contact" className="hover:text-primary transition">Feedback</a></li>
                    </ul>
                </div>

                {/* Support & Status */}
                <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-text-primary mb-5">System Status</h4>
                    <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl w-fit">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="font-semibold text-xs">Gemini 2.5 API Operational</span>
                    </div>
                    <p className="text-xs text-text-secondary">
                        Queries answered 24/7 with zero latency.
                    </p>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-xs text-text-secondary gap-4">
                <p>© 2026 RESUME.AI. Built for developers & engineers.</p>
                <p className="flex items-center gap-1.5">
                    Made with <Heart size={14} className="text-rose-500 fill-rose-500" /> by Anurag Singh
                </p>
            </div>
        </footer>
    );
};

export default Footer;