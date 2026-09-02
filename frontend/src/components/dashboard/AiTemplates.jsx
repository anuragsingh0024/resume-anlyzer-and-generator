import React from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { LayoutTemplate, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

const templates = [
    {
        id: 'standard-ats',
        name: 'Tech Standard (ATS Optimized)',
        description: 'Single-column high-parseable layout recommended by top tech recruiters and Fortune 500 ATS systems.',
        score: '98% ATS Score',
        tag: 'Recommended',
        sections: ['Header & Contacts', 'Personal Summary', 'Education & Scores', 'Experience (Bullet points)', 'Projects & Tech stack', 'Skills Summary', 'Achievements'],
        color: 'from-blue-500/20 to-purple-500/20'
    },
    {
        id: 'modern-clean',
        name: 'Modern Developer Minimal',
        description: 'Clean typography layout with prominent GitHub, LinkedIn links and structured skills categorisation.',
        score: '95% ATS Score',
        tag: 'Popular',
        sections: ['Contact Bar', 'Skills Grid', 'Work History', 'Key Projects', 'Education'],
        color: 'from-emerald-500/20 to-teal-500/20'
    },
    {
        id: 'executive-pro',
        name: 'Senior & Lead Classic',
        description: 'Focuses heavily on leadership impact, quantified bullet metrics, and cross-functional project delivery.',
        score: '94% ATS Score',
        tag: 'Senior',
        sections: ['Executive Summary', 'Leadership Experience', 'Key Achievements', 'Education & Certifications'],
        color: 'from-amber-500/20 to-orange-500/20'
    }
];

const AiTemplates = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            <Sidebar />

            <main className="flex-1 p-8 mt-20 max-w-6xl space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold flex items-center gap-3">
                        <LayoutTemplate className="w-8 h-8 text-primary" /> AI Resume Templates
                    </h1>
                    <p className="text-text-secondary mt-1">
                        Select an ATS-tested format to generate professional PDFs with our built-in PDF engine.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((tpl) => (
                        <div
                            key={tpl.id}
                            className="glass-card p-6 rounded-2xl border border-border-muted flex flex-col justify-between hover:border-primary/50 transition-all duration-300 relative group overflow-hidden"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                                        {tpl.tag}
                                    </span>
                                    <span className="text-xs font-bold text-accent">{tpl.score}</span>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                                        {tpl.name}
                                    </h3>
                                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                                        {tpl.description}
                                    </p>
                                </div>

                                <div className="space-y-2 pt-3 border-t border-border-muted/50">
                                    <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                                        Included Sections
                                    </span>
                                    <ul className="space-y-1 text-xs text-text-secondary">
                                        {tpl.sections.map((sec, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <CheckCircle2 size={12} className="text-primary shrink-0" />
                                                <span>{sec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/generate-resume')}
                                className="w-full mt-6 py-2.5 px-4 bg-primary text-background font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                            >
                                <Sparkles size={16} /> Use Template in Builder <ArrowRight size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AiTemplates;