import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, Phone, GitBranch, Link2,
    Briefcase, Code, GraduationCap, Target,
    CheckCircle2, AlertCircle, Zap, Sparkles,
    AlertTriangle, Rocket
} from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../templates/Loader';

// --- Reusable Components ---

const Card = ({ children, className = '', delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className={`bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden ${className}`}
    >
        {children}
    </motion.div>
);

const CircularProgress = ({ value, label, subtitle, colorClass, delay = 0 }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="transform -rotate-90 w-full h-full">
                    <circle
                        cx="48" cy="48" r={radius}
                        stroke="currentColor" strokeWidth="8" fill="transparent"
                        className="text-slate-100 dark:text-slate-800"
                    />
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference - (value / 100) * circumference }}
                        transition={{ duration: 1.5, delay, ease: "easeOut" }}
                        cx="48" cy="48" r={radius}
                        stroke="currentColor" strokeWidth="8" fill="transparent"
                        strokeDasharray={circumference}
                        className={colorClass}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-slate-800 dark:text-white">{value}%</span>
                </div>
            </div>
            <div className="text-center mt-3">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</h4>
                {subtitle && <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">{subtitle}</span>}
            </div>
        </div>
    );
};

// --- Main Component ---

const AnalysisResult = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('experience');

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get("/resume/get-active-resume-user");
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Provide default data for UI preview if API fails or no data yet
    const displayData = data || {
        title: "Your Resume",
        analysis: {
            personalInfo: { name: "Loading...", email: "", phone: "", linkedin: "", github: "" },
            profileMatch: { role: "Professional", score: 0, level: "N/A" },
            ats: { score: 0, label: "Analyzing" },
            skills: { detected: [], missing: [] },
            keywords: { found: 0, importantMissing: [] },
            education: [],
            experience: [],
            projects: [],
            recommendations: []
        }
    };

    const { analysis } = displayData;

    if (isLoading) {
        return (
            <div className="w-full h-[60vh] flex justify-center items-center">
                <Loader />
            </div>
        );
    }

    if (!data) {
        return (
             <div className="w-full h-[60vh] flex flex-col justify-center items-center text-slate-500">
                <AlertCircle className="w-12 h-12 mb-4 text-slate-300" />
                <p>No active resume data found.</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 space-y-8 font-sans text-slate-900 dark:text-slate-100">
            
            {/* --- HEADER: IDENTITY & SCORES --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Identity Card */}
                <Card className="lg:col-span-7 p-8 bg-gradient-to-br from-white to-violet-50 dark:from-slate-900 dark:to-slate-800/80" delay={0.1}>
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-24 h-24 bg-violet-600 text-white rounded-3xl flex items-center justify-center text-4xl font-black shadow-lg shadow-violet-600/30 shrink-0">
                            {analysis.personalInfo?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 space-y-2 w-full">
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                {analysis.personalInfo?.name || 'Unknown User'}
                            </h1>
                            <div className="flex items-center gap-3 flex-wrap text-violet-700 dark:text-violet-400 font-semibold">
                                <span className="flex items-center gap-1.5 bg-violet-100 dark:bg-violet-900/40 px-3 py-1 rounded-lg text-sm">
                                    <Target className="w-4 h-4" /> {analysis.profileMatch?.role || 'Professional'}
                                </span>
                                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-sm text-slate-600 dark:text-slate-300">
                                    <Zap className="w-4 h-4 text-amber-500" /> {analysis.profileMatch?.level || 'N/A'} Level
                                </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 pt-3 text-sm text-slate-600 dark:text-slate-400">
                                {analysis.personalInfo?.email && (
                                    <span className="flex items-center gap-1.5 hover:text-violet-600 transition-colors cursor-pointer">
                                        <Mail className="w-4 h-4" /> {analysis.personalInfo.email}
                                    </span>
                                )}
                                {analysis.personalInfo?.phone && (
                                    <span className="flex items-center gap-1.5 hover:text-violet-600 transition-colors cursor-pointer">
                                        <Phone className="w-4 h-4" /> {analysis.personalInfo.phone}
                                    </span>
                                )}
                                {analysis.personalInfo?.linkedin && (
                                    <a href={analysis.personalInfo.linkedin.startsWith('http') ? analysis.personalInfo.linkedin : `https://${analysis.personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                                        <Link2 className="w-4 h-4" /> LinkedIn
                                    </a>
                                )}
                                {analysis.personalInfo?.github && (
                                    <a href={analysis.personalInfo.github.startsWith('http') ? analysis.personalInfo.github : `https://${analysis.personalInfo.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors">
                                        <GitBranch className="w-4 h-4" /> GitHub
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Scores Card */}
                <Card className="lg:col-span-5 p-8 flex justify-around items-center bg-white dark:bg-slate-900" delay={0.2}>
                    <CircularProgress 
                        value={analysis.ats?.score || 0} 
                        label="ATS Score" 
                        subtitle={analysis.ats?.label} 
                        colorClass={analysis.ats?.score >= 75 ? "text-emerald-500" : "text-amber-500"} 
                    />
                    <div className="w-px h-16 bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
                    <CircularProgress 
                        value={analysis.profileMatch?.score || 0} 
                        label="Profile Match" 
                        subtitle="vs Job Role"
                        colorClass="text-blue-500" 
                        delay={0.2}
                    />
                </Card>
            </div>

            {/* --- MIDDLE: SKILLS & KEYWORDS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Keywords Analysis */}
                <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden group" delay={0.3}>
                    <div className="absolute right-0 top-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-700"></div>
                    
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <Rocket className="w-6 h-6 text-violet-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Keyword Engine</h3>
                                    <p className="text-slate-400 text-sm">Optimization Status</p>
                                </div>
                            </div>
                            
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-5xl font-black">{analysis.keywords?.found || 0}</span>
                                <span className="text-slate-400 font-medium">keywords matched</span>
                            </div>
                        </div>

                        {analysis.keywords?.importantMissing?.length > 0 && (
                            <div className="pt-6 border-t border-white/10">
                                <p className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" /> High-Impact Missing Keywords
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.keywords.importantMissing.map((kw, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-lg text-xs font-bold tracking-wide">
                                            + {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Skills Breakdown */}
                <Card className="p-8" delay={0.4}>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Code className="w-5 h-5 text-indigo-500" /> Technical Arsenal
                    </h3>
                    
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Detected Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {analysis.skills?.detected?.map((skill, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-default">
                                        {skill}
                                    </span>
                                ))}
                                {(!analysis.skills?.detected || analysis.skills.detected.length === 0) && (
                                    <span className="text-sm text-slate-500 italic">No skills detected.</span>
                                )}
                            </div>
                        </div>

                        {analysis.skills?.missing?.length > 0 && (
                            <div className="pt-2">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-rose-500" /> Industry Demands (Missing)
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.skills.missing.map((skill, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 text-sm font-medium rounded-lg border border-rose-100 dark:border-rose-900/30">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

            </div>

            {/* --- BOTTOM: INTERACTIVE PORTFOLIO & RECS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Interactive Tabs (Experience, Projects, Education) */}
                <Card className="lg:col-span-2 flex flex-col" delay={0.5}>
                    <div className="flex flex-wrap gap-2 p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        {[
                            { id: 'experience', label: 'Experience', icon: Briefcase },
                            { id: 'projects', label: 'Projects', icon: Code },
                            { id: 'education', label: 'Education', icon: GraduationCap }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                                    activeTab === tab.id 
                                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20' 
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    
                    <div className="p-6 md:p-8 flex-1 min-h-[300px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'experience' && (
                                <motion.div 
                                    key="exp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:h-full before:w-px before:bg-slate-200 dark:before:bg-slate-700"
                                >
                                    {analysis.experience?.map((exp, i) => (
                                        <div key={i} className="relative flex items-start gap-5 group">
                                            <div className="w-5 h-5 rounded-full bg-violet-500 shadow-[0_0_0_4px_white] dark:shadow-[0_0_0_4px_#0f172a] shrink-0 mt-0.5 relative z-10 group-hover:scale-110 transition-transform"></div>
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">{exp.role}</h4>
                                                <p className="text-sm text-violet-600 dark:text-violet-400 font-semibold mb-2">{exp.company} • {exp.duration}</p>
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                                    {exp.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!analysis.experience || analysis.experience.length === 0) && (
                                        <p className="text-slate-500 italic ml-8">No experience data found.</p>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'projects' && (
                                <motion.div 
                                    key="proj" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    {analysis.projects?.map((proj, i) => (
                                        <div key={i} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow">
                                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{proj.name}</h4>
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {proj.techStack?.map((tech, j) => (
                                                    <span key={j} className="text-[10px] px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-semibold">{tech}</span>
                                                ))}
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                                                {proj.description}
                                            </p>
                                        </div>
                                    ))}
                                    {(!analysis.projects || analysis.projects.length === 0) && (
                                        <p className="text-slate-500 italic col-span-2">No projects found.</p>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'education' && (
                                <motion.div 
                                    key="edu" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="space-y-5"
                                >
                                    {analysis.education?.map((edu, i) => (
                                        <div key={i} className="flex gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
                                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                                <GraduationCap className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200">{edu.degree}</h4>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{edu.institution}</p>
                                                <span className="inline-block mt-2 text-xs font-bold px-2.5 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg">{edu.year}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {(!analysis.education || analysis.education.length === 0) && (
                                        <p className="text-slate-500 italic">No education data found.</p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Card>

                {/* AI Recommendations */}
                <Card className="lg:col-span-1 p-8 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900/10 dark:to-slate-900" delay={0.6}>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                        <Sparkles className="w-5 h-5" /> AI Action Plan
                    </h3>
                    
                    <div className="space-y-4">
                        {analysis.recommendations?.map((rec, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="mt-0.5 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 text-xs font-bold">
                                    {i + 1}
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {rec}
                                </p>
                            </div>
                        ))}
                        {(!analysis.recommendations || analysis.recommendations.length === 0) && (
                            <p className="text-slate-500 italic text-sm">No recommendations generated.</p>
                        )}
                    </div>
                </Card>
            </div>
            
            {/* Action Nudge */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col items-center gap-4 mt-8 pt-4 pb-8"
            >
                <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-violet-600/20 transition-all hover:-translate-y-1">
                    <Sparkles className="w-5 h-5" /> Apply AI Enhancements
                </button>
            </motion.div>

        </div>
    );
};

export default AnalysisResult;