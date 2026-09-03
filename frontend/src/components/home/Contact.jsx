import React, { useState } from 'react';
import { Send, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill in all fields");
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Thank you! Your message has been sent.");
            setFormData({ name: '', email: '', message: '' });
        }, 600);
    };

    return (
        <section id="contact" className="py-24 px-6 relative overflow-hidden bg-surface/10">
            <div className="max-w-4xl mx-auto glass-card p-8 sm:p-12 border border-white/10 shadow-2xl relative rounded-3xl">
                <div className="text-center mb-10 space-y-3">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
                        We're Here to Help
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
                        Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Touch</span>
                    </h2>
                    <p className="text-text-secondary text-base max-w-lg mx-auto">
                        Have feedback, feature requests, or questions about ATS resume optimization? Drop us a note.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Your Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Anurag Singh"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-surface/80 border border-white/10 p-4 rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Your Email</label>
                        <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-surface/80 border border-white/10 p-4 rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Message</label>
                        <textarea
                            required
                            placeholder="Tell us what you need help with..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-surface/80 border border-white/10 p-4 rounded-xl h-36 text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="sm:col-span-2 py-4 bg-gradient-to-r from-primary to-secondary text-background font-black rounded-xl hover:opacity-95 hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Send size={18} />
                        {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Contact;