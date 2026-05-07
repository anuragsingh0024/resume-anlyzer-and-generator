import React from 'react';
import { ShieldCheck, Zap, Target } from 'lucide-react';

const About = () => {
    const features = [
        {
            icon: <Target className="text-accent" />,
            title: "Precision Matching",
            desc: "Our AI matches keywords from job descriptions with 98% accuracy."
        },
        {
            icon: <Zap className="text-secondary" />,
            title: "Instant Feedback",
            desc: "No waiting needed. Get your ATS score and improvement suggestions in seconds."
        },
        {
            icon: <ShieldCheck className="text-primary" />,
            title: "Data Privacy",
            desc: "Your data is fully encrypted. We never sell your resume to any third party."
        }
    ];

    return (
        <section id="about" className="py-24 px-6 relative overflow-hidden">
            {/* Decorative Blur */}
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-secondary/5 blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Empowering Job Seekers with <span className="text-primary">Next-Gen AI</span>
                    </h2>
                    <p className="text-text-secondary text-lg max-w-3xl mx-auto">
                        RESUME.AI's mission is to make the hiring process transparent. We've designed it
                        keeping modern 2026 recruitment standards in mind.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="glass-card p-8 border border-border-muted/50 hover:border-primary/50 transition-all group">
                            <div className="w-12 h-12 mb-6 bg-surface rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                            <p className="text-text-secondary leading-relaxed text-sm">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;