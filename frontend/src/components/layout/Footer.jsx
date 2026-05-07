import React from 'react';
import { GitGraph } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-surface border-t border-border-muted pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                {/* Brand Column */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-black tracking-tighter">
                        RESUME<span className="text-primary">.AI</span>
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                        Revolutionizing the way you apply for jobs. Get scanned, get noticed, get hired.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="p-2 bg-background rounded-full hover:text-primary transition"><GitGraph size={18} /></a>
                        <a href="#" className="p-2 bg-background rounded-full hover:text-secondary transition"><GitGraph size={18} /></a>
                        <a href="#" className="p-2 bg-background rounded-full hover:text-accent transition"><GitGraph size={18} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-bold mb-6">Product</h4>
                    <ul className="space-y-4 text-sm text-text-secondary">
                        <li><a href="#home" className="hover:text-primary transition">Resume Scanner</a></li>
                        <li><a href="#" className="hover:text-primary transition">AI Builder</a></li>
                        <li><a href="#" className="hover:text-primary transition">Price Plans</a></li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h4 className="font-bold mb-6">Company</h4>
                    <ul className="space-y-4 text-sm text-text-secondary">
                        <li><a href="#about" className="hover:text-primary transition">About Us</a></li>
                        <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-primary transition">Terms of Service</a></li>
                    </ul>
                </div>

                {/* Contact info */}
                <div>
                    <h4 className="font-bold mb-6">Support</h4>
                    <div className="flex items-center space-x-3 text-sm text-text-secondary">
                        <GitGraph size={16} className="text-primary" />
                        <span>support@resumeai.com</span>
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-border-muted flex flex-col md:row justify-between items-center text-xs text-text-secondary space-y-4 md:space-y-0">
                <p>© 2026 RESUME.AI. All rights reserved.</p>
                <p>Made with ❤️ for Developers</p>
            </div>
        </footer>
    );
};

export default Footer;