import React from 'react';
import { Upload, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            num: "01",
            icon: <Upload className="w-7 h-7 text-primary" />,
            title: "Drop Your Resume",
            desc: "Upload your current resume in PDF or DOCX format. Our parser extracts all your experience, projects, and skills with precision.",
            badge: "Instant Extraction"
        },
        {
            num: "02",
            icon: <Sparkles className="w-7 h-7 text-secondary" />,
            title: "AI ATS Optimization",
            desc: "Gemini AI analyzes your profile against modern 2026 recruiter algorithms, scoring your ATS readiness and finding crucial keyword gaps.",
            badge: "Deep Analysis"
        },
        {
            num: "03",
            icon: <TrendingUp className="w-7 h-7 text-accent" />,
            title: "Get Interview Ready",
            desc: "Receive actionable bullet-by-bullet recommendations, benchmark your role match, and build recruiter-ready resumes effortlessly.",
            badge: "10x Higher Callback"
        }
    ];

    return (
        <section id="how-it-works" className="py-24 px-6 bg-surface/20 relative overflow-hidden border-y border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider">
                        Simple 3-Step Flow
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
                        How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Works</span>
                    </h2>
                    <p className="text-text-secondary text-base sm:text-lg">
                        Go from an unoptimized resume to recruiter-ready in less than 30 seconds.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className="glass-card p-8 hover:-translate-y-2 hover:border-primary/50 transition-all duration-300 relative group flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-14 h-14 bg-surface rounded-2xl border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all shadow-inner">
                                        {step.icon}
                                    </div>
                                    <span className="text-4xl font-black text-white/10 group-hover:text-primary/30 transition-colors font-mono">
                                        {step.num}
                                    </span>
                                </div>

                                <div className="mb-2">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent font-mono">
                                        {step.badge}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>

                            <div className="pt-6 mt-6 border-t border-white/5 flex items-center text-xs font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                                <span>Learn more</span>
                                <ArrowRight className="w-3.5 h-3.5 ml-1.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;