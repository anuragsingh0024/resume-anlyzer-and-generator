import React, { useEffect, useState } from 'react';
import { LayoutDashboard, History, FileText, Upload, LogOut, Sparkles, User as UserIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axiosInstance from '../../services/axiosInstance';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("");
    const user = useSelector((state) => state.auth.user);

    const menus = [
        { name: 'Analysis Dashboard', icon: <LayoutDashboard size={18} />, path: "/dashboard" },
        { name: 'Resume History', icon: <History size={18} />, path: "/resume-history" },
        { name: 'AI Resume Generator', icon: <FileText size={18} />, path: '/generate-resume' },
        { name: 'Upload New Resume', icon: <Upload size={18} />, path: "/" },
    ];

    useEffect(() => {
        if (location.pathname) {
            setActiveSection(location.pathname);
        }
    }, [location.pathname]);

    const handleLogout = async () => {
        const loadingToast = toast.loading("Logging out...");
        try {
            await axiosInstance.post("/auth/logout");
            localStorage.removeItem("token");
            localStorage.removeItem('role');
            toast.dismiss(loadingToast);
            toast.success("Logged out successfully");
            navigate("/");
            setTimeout(() => {
                window.location.reload();
            }, 600);
        } catch (err) {
            toast.dismiss(loadingToast);
            localStorage.removeItem("token");
            navigate("/");
            window.location.reload();
        }
    };

    return (
        <aside className="w-64 min-h-[calc(100vh-5rem)] bg-surface/90 border-r border-white/5 flex flex-col justify-between p-5 sticky top-20 z-40 backdrop-blur-xl">
            <div className="space-y-6">
                <div className="px-3 pt-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary font-mono">
                        Navigation
                    </span>
                </div>

                <nav className="space-y-1.5">
                    {menus.map((item) => {
                        const isActive = activeSection === item.path;
                        return (
                            <button
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? 'bg-primary text-background shadow-lg shadow-primary/25 font-bold scale-[1.02]'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                                }`}
                            >
                                <span className={isActive ? "text-background" : "text-primary"}>
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom: User Card & Logout */}
            <div className="pt-6 border-t border-white/5 space-y-3">
                {user && (
                    <div className="p-3 bg-white/5 rounded-2xl flex items-center gap-3 border border-white/5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-background font-black text-sm shrink-0">
                            {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={16} />}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-text-primary truncate">{user.name || "Logged In User"}</p>
                            <p className="text-[10px] text-text-secondary truncate">{user.email || ""}</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-2xl text-sm font-semibold transition-all cursor-pointer"
                >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;