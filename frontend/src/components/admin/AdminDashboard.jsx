import React, { useEffect, useState } from 'react';
import { Users, FileText, Activity, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../templates/Loader';

const AdminDashboard = () => {
    const [statsData, setStatsData] = useState({
        totalResumes: 0,
        totalUsers: 0,
        avgAtsScore: 0,
        guestUploads: 0
    });
    const [isLoading, setIsLoading] = useState(false);

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            const res = await axiosInstance.get("/admin/get-stats");
            if (res.data?.success && res.data.stats) {
                setStatsData(res.data.stats);
            }
        } catch (err) {
            console.log("Error fetching stats:", err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="w-full h-[50vh] flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    const cards = [
        { label: "Total Resumes Analyzed", value: statsData.totalResumes, icon: <FileText className="text-primary" />, change: "Live" },
        { label: "Registered Users", value: statsData.totalUsers, icon: <Users className="text-accent" />, change: "Live" },
        { label: "Average ATS Score", value: `${statsData.avgAtsScore}%`, icon: <Activity className="text-secondary" />, change: "Avg" },
        { label: "Guest Scans", value: statsData.guestUploads, icon: <UserCheck className="text-emerald-400" />, change: "Conversion" },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((stat, i) => (
                    <div key={i} className="glass-card p-6 border-b-2 border-primary/30 hover:border-primary transition-all rounded-2xl">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-surface rounded-xl">{stat.icon}</div>
                            <span className="text-xs font-bold text-accent px-2 py-0.5 rounded-full bg-accent/10">{stat.change}</span>
                        </div>
                        <h3 className="text-text-secondary text-xs uppercase tracking-widest">{stat.label}</h3>
                        <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Quick Admin Summary */}
            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-3">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <ShieldCheck size={20} className="text-primary" /> System Health & Status
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                    AI Resume Analyzer engine is connected with Gemini Flash and Cloudinary Storage. All background parsing queues and authentication pipelines are running live.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboard;