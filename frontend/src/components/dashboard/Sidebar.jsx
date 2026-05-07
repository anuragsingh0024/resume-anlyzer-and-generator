import React, { useEffect, useState } from 'react';
import { LayoutDashboard, History, FileText, Settings, LogOut, Briefcase, Upload } from 'lucide-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ResumeHistoryList from './ResumeHistoryList';
import AiTemplates from './AiTemplates';
import JobMatch from './JobMatch';
import Setting from './Setting';
import Dashboard from '../../pages/Dashboard';
import toast from 'react-hot-toast';
import axiosInstance from '../../services/axiosInstance';

const Sidebar = () => {

    const location = useLocation();

    const [activeSection, setActiveSection] = useState("");

    const menus = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: "/dashboard" },
        { name: 'Resume History', icon: <History size={20} />, path: "/resume-history" },
        { name: 'Upload new Resume', icon: <Upload size={20} />, path: "/" },
        {name: 'Generate Resume', icon: <FileText size={20} />, path: '/generate-resume'}
    ];


    useEffect(() => {
        if (location.pathname) {

            setActiveSection(location.pathname);
        }
    }, [location.pathname]);

    const navigate = useNavigate();

    function handleClick(path) {
        navigate(path);

    }

    const handleLogout = async () => {
        const loadingToast = toast.loading("Logging out...")
        try {

            const response = await axiosInstance.post("/auth/logout")
            localStorage.removeItem("token")
            localStorage.removeItem('role')
            if (response.data.success) {

                navigate("/")
                toast.success("Logged out success")
                toast.dismiss(loadingToast);
                setTimeout(() => {
                    window.location.reload()
                }, 800);
            }
        } catch (err) {
            toast.dismiss(loadingToast);
            console.log(err);
            toast.error("Something went wrong");
        }
    }




    return (
        <div className="w-64 h-screen bg-surface border-r border-border-muted flex flex-col p-6 sticky top-0">
            <div className="text-2xl font-black tracking-tighter mb-10 text-text-primary">
                RESUME<span className="text-primary">.AI</span>
            </div>

            <nav className="flex-1 space-y-2">
                {menus.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => handleClick(item.path)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeSection === item.path
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-text-secondary hover:bg-blue-500 hover:text-white'
                            }`}

                    >
                        {item.icon}
                        <span className="font-medium text-sm">{item.name}</span>
                    </button>
                ))}
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all mt-auto">
                <LogOut size={20} />
                <span className="font-medium text-sm">Logout</span>
            </button>
        </div>
    );
};

export default Sidebar;