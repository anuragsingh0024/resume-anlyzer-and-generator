import React, { useState, useEffect } from 'react';
import { Lock, Zap, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Shield, Award, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import Loader from '../components/templates/Loader';

const DummyDashboard = () => {
    const navigate = useNavigate();

    const [basicInfo, setBasicInfo] = useState({
        name: "Uploaded Resume",
        role: "Software Developer",
        atsScore: 0,
        topSkills: [],
        status: "Analyzed"
    });

    const [isLoading, setIsLoading] = useState(false);
    const tempId = localStorage.getItem('tempId');

    const fetchBasicInfo = async () => {
        if (!tempId) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await axiosInstance.get(`/resume/get-active-resume-guest/${tempId}`);
            if (response.data?.success && response.data.data) {
                const resData = response.data.data;
                const analysis = resData.analysis || {};
                setBasicInfo({
                    name: analysis.personalInfo?.name || resData.title || "Uploaded Resume",
                    role: analysis.profileMatch?.role || "Software Engineer",
                    atsScore: analysis.ats?.score || 72,
                    topSkills: analysis.skills?.detected || [],
                    status: analysis.ats?.label || "Analyzed"
                });
            }
        } catch (error) {
            console.error('Error fetching basic info:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBasicInfo();
    }, [tempId]);

    if (!tempId) {
        return (
            <div className="min-h-screen pt-36 pb-20 px-6 bg-background flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary">No Uploaded Resume Found</h2>
                <p className="text-text-secondary max-w-md text-sm leading-relaxed">
                    Please upload your resume to get instant ATS scores, skill extraction, and keyword recommendations.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-primary text-background font-black rounded-xl hover:scale-105 transition-all cursor-pointer shadow-lg shadow-primary/20"
                >
                    Upload Resume Now
                </button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center bg-background">
                <Loader />
            </div>
        );
    }

    const isGoodScore = basicInfo.atsScore >= 70;

    return (
        <div className="min-h-screen pt-28 pb-16 px-6 bg-background relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 blur-[140px] pointer-events-none -z-10" />
            <div className="absolute top-1/2 right-10 w-96 h-96 bg-secondary/10 blur-[140px] pointer-events-none -z-10" />

            <div className="max-w-5xl mx-auto space-y-8">

                {/* Banner Tag */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-surface/50 border border-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                        <span className="text-xs font-bold text-text-primary uppercase tracking-wider font-mono">
                            Guest Analysis Preview Mode
                        </span>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-xs font-bold text-primary hover:text-accent transition-colors flex items-center gap-1 cursor-pointer"
                    >
                        Sign in to save this resume permanently <ArrowRight size={14} />
                    </button>
                </div>

                {/* 1. Basic Stats Header (Visible) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* ATS Gauge Card */}
                    <div className="glass-card p-6 flex flex-col items-center justify-center text-center border-accent/20 relative overflow-hidden">
                        <span className="text-text-secondary text-[11px] uppercase tracking-widest mb-3 font-mono font-bold">
                            ATS Compatibility Score
                        </span>
                        <div className="relative w-36 h-36 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="72" cy="72" r="56"
                                    stroke="currentColor" strokeWidth="10"
                                    fill="transparent"
                                    className="text-surface"
                                />
                                <circle
                                    cx="72" cy="72" r="56"
                                    stroke="currentColor" strokeWidth="10"
                                    fill="transparent"
                                    strokeDasharray={351.8}
                                    strokeDashoffset={351.8 - (351.8 * basicInfo.atsScore) / 100}
                                    strokeLinecap="round"
                                    className={isGoodScore ? "text-accent drop-shadow-[0_0_12px_#9bffce]" : "text-amber-400 drop-shadow-[0_0_12px_#fbbf24]"}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black text-text-primary tracking-tight">
                                    {basicInfo.atsScore}%
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isGoodScore ? "text-accent" : "text-amber-400"}`}>
                                    {basicInfo.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Candidate & Detected Role Card */}
                    <div className="glass-card p-6 md:col-span-2 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider font-mono mb-2">
                                <Sparkles size={14} /> AI Parsed Profile
                            </div>
                            <h1 className="text-3xl font-extrabold text-text-primary mb-2 tracking-tight">
                                {basicInfo.name}
                            </h1>
                            <p className="text-text-secondary mb-5 flex items-center gap-2 text-sm font-medium">
                                <Zap size={16} className="text-secondary" /> {basicInfo.role}
                            </p>
                        </div>

                        <div>
                            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-2 font-mono">
                                Extracted Skills ({basicInfo.topSkills?.length || 0})
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {basicInfo.topSkills && basicInfo.topSkills.length > 0 ? (
                                    basicInfo.topSkills.slice(0, 10).map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-surface border border-white/10 rounded-xl text-xs font-bold text-text-primary shadow-sm">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-text-secondary">Skills Analyzed</span>
                                )}
                                {basicInfo.topSkills?.length > 10 && (
                                    <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-text-secondary">
                                        +{basicInfo.topSkills.length - 10} more
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. The Blurred Teaser & Lock Overlay Area */}
                <div className="relative rounded-3xl overflow-hidden">

                    {/* Blurred Mock Background Content */}
                    <div className="space-y-6 opacity-30 select-none pointer-events-none filter blur-[3px]">
                        <div className="glass-card p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div className="h-5 w-48 bg-primary/20 rounded" />
                                <div className="h-4 w-full bg-white/10 rounded" />
                                <div className="h-4 w-5/6 bg-white/10 rounded" />
                                <div className="h-4 w-4/6 bg-white/10 rounded" />
                            </div>
                            <div className="space-y-3">
                                <div className="h-5 w-48 bg-secondary/20 rounded" />
                                <div className="h-4 w-full bg-white/10 rounded" />
                                <div className="h-4 w-3/4 bg-white/10 rounded" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-6 h-36" />
                            <div className="glass-card p-6 h-36" />
                            <div className="glass-card p-6 h-36" />
                        </div>
                    </div>

                    {/* 3. The Modern Unlock Card */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-background via-background/85 to-transparent backdrop-blur-[5px] z-20 p-6">
                        <div className="glass-card p-8 sm:p-10 max-w-md w-full text-center border-primary/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-3xl space-y-5">
                            <div className="w-16 h-16 bg-primary/15 border border-primary/25 rounded-2xl flex items-center justify-center mx-auto text-primary shadow-inner">
                                <Lock className="w-8 h-8" />
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-text-primary tracking-tight">
                                    Unlock Your Full Report
                                </h3>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    Detailed <span className="text-accent font-bold">missing keyword analysis</span>, job-match comparisons, and step-by-step bullet fixes are ready.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-background font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Sparkles size={18} />
                                Sign In to View Full Report
                            </button>

                            <div className="flex items-center justify-center gap-4 text-[11px] text-text-secondary font-mono pt-1">
                                <span>✓ Job Match Engine</span>
                                <span>•</span>
                                <span>✓ AI Recommendations</span>
                                <span>•</span>
                                <span>✓ PDF Export</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default DummyDashboard;