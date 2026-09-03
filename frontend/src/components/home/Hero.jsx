import React, { useEffect, useState } from 'react';
import { Upload, CheckCircle, Search, FileText, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../../services/axiosInstance';
import toast from 'react-hot-toast';

const Hero = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [file, setFile] = useState(null);
    const { token } = useSelector((state) => state.auth);
    const isLoggedIn = !!(token && token !== "null" && token !== "undefined");
    const tempId = localStorage.getItem('tempId');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [resumeResultData, setResumeResultData] = useState({
        name: "",
        atsScore: 0,
        profileMatchScore: 0,
        skills: [],
        tempId: null,
    });

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            try {
                setFile(selectedFile);
                setIsScanning(true);

                const formData = new FormData();
                formData.append("file", selectedFile);

                const response = await axiosInstance.post("/resume/upload-resume",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.data?.success && response.data.data) {
                    const resData = response.data.data;
                    const resumeIdOrTempId = resData.tempId || resData._id;
                    if (resumeIdOrTempId) {
                        localStorage.setItem("tempId", String(resumeIdOrTempId));
                    }
                    setResumeResultData(resData);
                    toast.success("Resume analyzed successfully!");
                    setIsScanning(false);
                    if (isLoggedIn) {
                        navigate('/dashboard');
                    } else {
                        navigate('/dummy-dashboard');
                    }
                } else {
                    toast.error(response.data?.message || "Resume analysis failed");
                }
            } catch (error) {
                console.error("Resume Upload Error:", error.message);
                const msg = error.response?.data?.message || "Resume upload failed. Please try again.";
                toast.error(msg);
                setIsScanning(false);
            } finally {
                setIsScanning(false);
            }
        }
    };

    return (
        <section className="relative pt-32 pb-24 px-6 overflow-hidden">
            {/* Background Aesthetic Glow Orbs */}
            <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">

                {/* Left: Headline & Upload Dropzone */}
                <div className="lg:col-span-7 space-y-8 text-left">
                    {/* Top Pill Badges */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-wide uppercase shadow-sm">
                        <Sparkles size={14} className="animate-spin" />
                        Next-Gen ATS Resume Optimizer
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
                        Build a Resume that <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                            Demands Interviews.
                        </span>
                    </h1>

                    <p className="text-text-secondary text-lg sm:text-xl leading-relaxed max-w-2xl">
                        Upload your resume to get instant <span className="text-text-primary font-semibold">ATS scoring</span>, uncover missing recruiter keywords, and receive tailored AI fixes in seconds.
                    </p>

                    {/* Action & Status Indicator */}
                    <div className="flex flex-wrap items-center gap-4">
                        {tempId && tempId !== "null" && tempId !== "undefined" && !isLoggedIn ? (
                            <button
                                className="flex items-center gap-2.5 px-6 py-3.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold rounded-2xl hover:bg-emerald-500/25 transition-all cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-95"
                                onClick={() => navigate('/dummy-dashboard')}
                            >
                                <FileText size={18} /> See Uploaded Resume Preview →
                            </button>
                        ) : isLoggedIn ? (
                            <button
                                className="flex items-center gap-2.5 px-7 py-3.5 bg-primary text-background font-black rounded-2xl hover:scale-105 transition-all cursor-pointer shadow-xl shadow-primary/25 active:scale-95"
                                onClick={() => navigate('/dashboard')}
                            >
                                <FileText size={18} /> Open Your Analysis Dashboard →
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 text-text-secondary text-sm font-medium">
                                <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                                Drop your resume below • Supports PDF and DOCX
                            </div>
                        )}
                    </div>

                    {/* Upload Drop Zone Card */}
                    <div className="glass-card p-8 sm:p-10 border-2 border-dashed border-border-muted/80 hover:border-primary/80 transition-all duration-300 relative group overflow-hidden hover:shadow-[0_0_40px_rgba(163,166,255,0.15)] rounded-2xl">
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            disabled={isScanning}
                            className="absolute inset-0 opacity-0 cursor-pointer z-20 w-full h-full"
                        />
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-16 h-16 bg-surface border border-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all shrink-0">
                                <Upload className="text-primary w-8 h-8 group-hover:text-accent transition-colors" />
                            </div>
                            <div className="text-center sm:text-left flex-1">
                                <p className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                                    {file ? file.name : "Choose or drag your resume file here"}
                                </p>
                                <p className="text-text-secondary text-sm mt-1">
                                    Instant AI analysis • PDF, DOC, DOCX up to 10MB
                                </p>
                            </div>
                            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-text-secondary hidden sm:block">
                                Browse Files
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-text-secondary font-medium">
                        <span className="flex items-center gap-1.5"><span className="text-accent font-bold">✓</span> 100% Free Scan</span>
                        <span className="flex items-center gap-1.5"><span className="text-accent font-bold">✓</span> No Credit Card Required</span>
                        <span className="flex items-center gap-1.5"><span className="text-accent font-bold">✓</span> Bank-Grade Privacy</span>
                    </div>
                </div>

                {/* Right: The Modern Scanning Simulator Card */}
                <div className="lg:col-span-5 flex justify-center relative">
                    <div className="glass-card w-full max-w-[420px] aspect-[4/5] p-6 sm:p-8 bg-surface/70 border border-white/10 overflow-hidden relative rounded-3xl shadow-2xl">

                        {isScanning ? (
                            <div className="h-full flex flex-col justify-between relative z-10 py-4">
                                {/* The Moving Scanner Laser */}
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_25px_#9bffce] z-30 animate-scan" />

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-accent animate-ping" />
                                            <span className="text-xs font-mono font-bold text-accent tracking-wider">AI NEURAL ENGINE ACTIVE</span>
                                        </div>
                                        <span className="text-xs text-text-secondary font-mono">STEP 1/3</span>
                                    </div>

                                    <div className="h-7 w-3/5 bg-white/10 rounded-lg animate-pulse" />
                                    <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
                                    <div className="h-4 w-4/5 bg-white/5 rounded animate-pulse" />

                                    <div className="grid grid-cols-2 gap-3 pt-6">
                                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                                            <div className="text-xs text-text-secondary">Extracted Skills</div>
                                            <div className="text-lg font-bold text-primary animate-pulse">Analyzing...</div>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                                            <div className="text-xs text-text-secondary">ATS Match</div>
                                            <div className="text-lg font-bold text-accent animate-pulse">Calculating...</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-4">
                                    <div className="flex justify-between text-xs font-mono text-text-secondary">
                                        <span>PARSING KEYWORDS...</span>
                                        <span className="text-accent font-bold">IN PROGRESS</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-surface border border-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent animate-progress" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center text-primary shadow-inner">
                                    <Search className="w-9 h-9 text-primary animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-text-primary">Instant AI Resume Analyzer</h3>
                                    <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                                        Upload your resume on the left to trigger the real-time ATS optimization scanner.
                                    </p>
                                </div>
                                <div className="w-full pt-4 grid grid-cols-2 gap-3 border-t border-white/5 text-left">
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                        <div className="text-[11px] text-text-secondary font-mono">ATS PARSER</div>
                                        <div className="text-sm font-bold text-accent">Smart Score %</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                        <div className="text-[11px] text-text-secondary font-mono">SKILL MATCHER</div>
                                        <div className="text-sm font-bold text-primary">Missing Gaps</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;