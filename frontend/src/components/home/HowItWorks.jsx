import React from 'react';
import { Upload, Cpu, Download } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        { icon: <Upload />, title: "Upload Resume", desc: "Drag & drop your PDF or DOCX file here." },
        { icon: <Cpu />, title: "AI Analysis", desc: "Our Neural Engine scans keywords and formatting." },
        { icon: <Download />, title: "Get Results", desc: "Download your ATS score and improvement suggestions." }
    ];

    return (
        <section id="how-it-works" className="py-24 px-6 bg-surface/30">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-16">How It <span className="text-secondary">Works</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <div key={i} className="glass-card p-8 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                            <p className="text-text-secondary">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;