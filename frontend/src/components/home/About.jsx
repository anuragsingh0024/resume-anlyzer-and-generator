import React from 'react';
import { ShieldCheck, Zap, Target, Award, Cpu, FileCheck } from 'lucide-react';

const About = () => {
    const features = [
        {
            icon: <Target className="w-6 h-6 text-accent" />,
            title: "98% Precision ATS Matching",
            desc: "Parses your resume against exact recruiter search algorithms used by top tech companies worldwide."
        },
        {
            icon: <Zap className="w-6 h-6 text-secondary" />,
            title: "Instant 5-Second Feedback",
            desc: "Zero waiting. Get your comprehensive ATS score, missing skills, and formatting recommendations immediately."
        },
        {
            icon: <FileCheck className="w-6 h-6 text-primary" />,
            title: "Smart Keyword Injection",
            desc: "Discovers critical industry keywords missing in your experience bullet points and provides drop-in fixes."
        },
        {
            icon: <Cpu className="w-6 h-6 text-emerald-400" />,
            title: "Gemini 2.5 AI Neural Engine",
            desc: "Powered by modern LLM reasoning for deep contextual analysis, not just basic regex word counts."
        },
        {
            icon: <Award className="w-6 h-6 text-amber-400" />,
            title: "Job Role Alignment",
            desc: "Calculates match percentage for specific target roles like Frontend, Backend, Full-Stack, and DevOps."
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-indigo-400" />,
            title: "100% Data Privacy",
            desc: "Your data is strictly encrypted. Resumes are never shared, sold, or exposed to third-party data brokers."
        }
    ];

    return (
        <section id="about" className="py-24 px-6 relative overflow-hidden">
            {/* Decorative Ambient Background Blurs */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 blur-[120px] -z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                        Core Superpowers
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-text-primary">
                        Empowering Job Seekers with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Next-Gen AI</span>
                    </h2>
                    <p className="text-text-secondary text-base sm:text-lg">
                        Engineered specifically for the competitive 2026 tech recruitment market to help you stand out.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="glass-card p-8 border border-white/5 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-12 h-12 mb-6 bg-surface rounded-2xl border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/15 transition-all shadow-inner">
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-bold text-text-primary mb-2.5 group-hover:text-primary transition-colors">
                                    {f.title}
                                </h3>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;