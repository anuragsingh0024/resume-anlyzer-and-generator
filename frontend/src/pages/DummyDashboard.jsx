import React from 'react';
import { Lock, Zap, BarChart3, AlertCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useEffect } from 'react';
import Loader from '../components/templates/Loader';

const DummyDashboard = () => {
    const navigate = useNavigate();

    // Mock data for the "Fewer Details" view
    const [basicInfo, setBasicInfo] = useState({
        name: "Dummy data",
        atsScore: 68,
        topSkills: ["React.js", "Node.js", "Tailwind CSS"],
        status: "Action Required"
    });

    const [isLoading, setIsLoading] = useState(false)


    const fetchBasicInfo = async () => {
        const tempId = localStorage.getItem('tempId')

        if (!tempId) {
            navigate('/')
        }

        try {
            setIsLoading(true)
            const response = await axiosInstance.get(`/resume/get-active-resume-guest/${tempId}`)
            console.log('1st clg response: ', response);
            console.log('2nd clg response. data: ', response.data);
            setBasicInfo({
                name: response.data.data.analysis.personalInfo.name,
                atsScore: response.data.data.analysis.ats.score,
                topSkills: response.data.data.analysis.skills.detected,
                status: response.data.data.analysis.ats.label
            });
            setIsLoading(false)
            console.log('3rd clg basicInfo: ', basicInfo);
        } catch (error) {
            setIsLoading(false)
            console.error('Error fetching basic info:', error);
        }

    }

    useEffect(() => {
        fetchBasicInfo();
    }, []);


    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center bg-gray-900">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-10 px-6 bg-background relative">
            {/* Background Glows */}
            <div className="absolute top-40 left-10 w-72 h-72 bg-primary/10 blur-[100px]" />

            <div className="max-w-5xl mx-auto space-y-8">

                {/* 1. Basic Stats Header (Visible) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 flex flex-col items-center justify-center text-center border-accent/20">
                        <span className="text-text-secondary text-xs uppercase tracking-widest mb-2 font-mono">ATS Compatibility</span>
                        <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface" />
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                                    strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * basicInfo.atsScore) / 100}
                                    className="text-accent shadow-[0_0_15px_#9bffce]" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-3xl font-black">{basicInfo.atsScore}%</span>
                        </div>
                    </div>

                    <div className="glass-card p-6 md:col-span-2 flex flex-col justify-center">
                        <h1 className="text-3xl font-bold mb-2 tracking-tight">{basicInfo.name}</h1>
                        <p className="text-text-secondary mb-4 flex items-center gap-2">
                            <Zap size={16} className="text-secondary" /> Senior Web Developer Profile Detected
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {basicInfo.topSkills.map(skill => (
                                <span key={skill} className="px-3 py-1 bg-surface border border-border-muted rounded-full text-xs font-medium text-text-primary">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. The "Restricted" Content Area */}
                <div className="relative">

                    {/* Dummy Content (Partially Visible) */}
                    <div className="space-y-6 opacity-40 select-none pointer-events-none">
                        <div className="glass-card p-8 space-y-4">
                            <div className="h-6 w-48 bg-border-muted rounded" />
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-border-muted/30 rounded" />
                                <div className="h-4 w-5/6 bg-border-muted/30 rounded" />
                                <div className="h-4 w-4/6 bg-border-muted/30 rounded" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-card p-8 h-40 border-dashed border-border-muted" />
                            <div className="glass-card p-8 h-40 border-dashed border-border-muted" />
                        </div>
                    </div>

                    {/* 3. The Blur Overlay & CTA Button */}
                    <div className="absolute inset-0 top-0 flex flex-col items-center justify-center bg-gradient-to-t from-background via-background/80 to-transparent backdrop-blur-[6px] z-20 pt-20">
                        <div className="glass-card p-8 max-w-sm text-center border-primary/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Lock className="text-primary w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 italic">Unlock Full Analysis</h3>
                            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                                Aapke resume mein <span className="text-accent font-bold">12+ missing keywords</span> aur formatting issues detect hue hain. Inhe dekhne ke liye login karein.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-3 bg-primary text-background font-black rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(163,166,255,0.4)]"
                            >
                                Sign In to View Full Report
                            </button>
                            <p className="mt-4 text-[10px] text-text-secondary uppercase tracking-widest">
                                Includes: Detailed ATS Feedback • Job Match Score • AI Rewriter
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default DummyDashboard;