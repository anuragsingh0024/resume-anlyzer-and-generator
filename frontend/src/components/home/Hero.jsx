import React, { useEffect, useState } from 'react';
import { Upload, CheckCircle, Search, FileText } from 'lucide-react';
import { data, useNavigate } from 'react-router-dom';
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
                    setResumeResultData(response.data.data);
                    if (response.data.data.tempId) {
                        localStorage.setItem("tempId", response.data.data.tempId);
                    }
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
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            {/* Background Orbs for Aesthetic */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

                {/* Left: Text & Upload */}
                <div className="space-y-8">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium">
                        ✨ AI-Powered ATS Optimization
                    </div>
                    <h1 className="text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                        Build a Resume that <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Gets Noticed.</span>
                    </h1>
                    <p className="text-text-secondary text-lg leading-relaxed">
                        Our AI scans your resume, finds missing keywords,
                        and helps you land 10x more interviews.
                    </p>
                    {
                        tempId != "null" && !isLoggedIn ? (
                            <button
                                className='bg-green-400 text-black cursor-pointer font-bold p-5 rounded-md hover:bg-green-300 transition-all duration-200'
                                onClick={() => navigate('/dummy-dashboard')}
                            >See Previous uploaded Resume </button>
                        ) : (
                            <p className='text-amber-400'>Upload your resume here</p>
                        )
                    }
                    {/* Upload Box */}
                    <div className="glass-card p-10 border-dashed border-2 border-border-muted hover:border-primary transition-all relative group overflow-hidden">
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        />
                        <div className="flex flex-col items-center space-y-4">
                            <div className="p-4 bg-surface rounded-2xl group-hover:scale-110 transition-transform">
                                <Upload className="text-primary w-8 h-8" />
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-semibold">{file ? file.name : "Upload your resume"}</p>
                                <p className="text-text-secondary mt-1">Drag and drop or click to browse</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: The Scanning Simulator */}
                <div className="relative flex justify-center">
                    <div className="glass-card w-full max-w-[450px] aspect-[3/4] p-8 bg-surface/50 border border-border-muted overflow-hidden relative">

                        {isScanning ? (
                            <div className="h-full flex flex-col space-y-6">
                                {/* The Moving Scanner Line */}
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent shadow-[0_0_20px_#9bffce] z-30 animate-scan" />

                                {/* Mock Content Shimmer */}
                                <div className="space-y-4 mt-10">
                                    <div className="h-8 w-1/3 bg-border-muted/50 rounded animate-pulse" />
                                    <div className="h-4 w-full bg-border-muted/30 rounded animate-pulse" />
                                    <div className="h-4 w-5/6 bg-border-muted/30 rounded animate-pulse" />
                                    <div className="grid grid-cols-3 gap-4 pt-10">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-20 bg-border-muted/20 rounded-lg flex items-center justify-center">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 animate-ping" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-10 space-y-3">
                                        <div className="flex justify-between items-center text-accent text-sm font-mono">
                                            <span>SCANNING SKILLS...</span>
                                            <span>{Math.floor(Math.random() * 100)}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-border-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-accent animate-progress" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
                                <div className="p-6 bg-border-muted/20 rounded-full">
                                    <Search className="w-12 h-12 text-text-secondary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Analysis Preview</h3>
                                    <p className="text-sm text-text-secondary mt-2">Upload a file to start the real-time AI scanning process.</p>
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