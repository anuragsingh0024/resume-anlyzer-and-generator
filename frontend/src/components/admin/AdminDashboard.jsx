import React from 'react';
import { Users, FileText, Activity, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
    const stats = [
        { label: "Total Resumes", value: "1,284", icon: <FileText className="text-primary" />, change: "+12%" },
        { label: "Active Users", value: "856", icon: <Users className="text-accent" />, change: "+5%" },
        { label: "Avg ATS Score", value: "72%", icon: <Activity className="text-secondary" />, change: "+2%" },
        { label: "Pending Tickets", value: "04", icon: <AlertTriangle className="text-red-400" />, change: "0" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-card p-6 border-b-2 border-primary/30 hover:border-primary transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-surface rounded-xl">{stat.icon}</div>
                            <span className="text-xs font-bold text-accent">{stat.change}</span>
                        </div>
                        <h3 className="text-text-secondary text-xs uppercase tracking-widest">{stat.label}</h3>
                        <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>
            {/* Yahan tu chart dal sakta hai */}
        </div>
    );
};

export default AdminDashboard;