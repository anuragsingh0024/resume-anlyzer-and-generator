import React, { useState } from 'react';
import { LayoutDashboard, FileText, Users, Menu, X } from 'lucide-react';

import AdminDashboard from '../components/admin/AdminDashboard';
import ResumeLibrary from '../components/admin/ResumeLibrary';
import UserList from '../components/admin/UserList';

const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderSection = () => {
        switch (activeSection) {
            case "library": return <ResumeLibrary />;
            case "users": return <UserList />;
            default: return <AdminDashboard />;
        }
    };

    const menuItems = [
        { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { key: "library", label: "Resume Library", icon: <FileText size={20} /> },
        { key: "users", label: "User Directory", icon: <Users size={20} /> },
    ];

    return (
        // Wrapper ko "flex" rakha hai aur top margin "mt-20" di hai taki navbar se na takraye
        <div className="flex min-h-screen bg-background text-text-primary mt-20 relative">

            {/* Mobile Menu Toggle Button - Navbar ke thoda niche set kiya hai */}
            <button
                className="md:hidden fixed top-24 left-4 p-3 bg-surface text-white rounded-lg z-[999] border border-border-muted"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar - top-[80px] se start hoga taaki navbar visible rahe */}
            <aside
                className={`fixed top-[80px] left-0 h-[calc(100vh-80px)] bg-surface border-r border-border-muted z-[990] transition-all duration-300 w-[250px]
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <div className="p-8 border-b border-border-muted">
                    <h1 className="text-xl font-black text-primary">ADMIN<span className="text-white">.PANEL</span></h1>
                </div>

                <ul className="mt-6">
                    {menuItems.map((item) => (
                        <li
                            key={item.key}
                            className={`py-4 px-6 cursor-pointer flex items-center gap-3 transition-all ${activeSection === item.key
                                ? "bg-primary/10 text-primary border-r-4 border-primary"
                                : "text-text-secondary hover:bg-primary/5 hover:text-text-primary"
                                }`}
                            onClick={() => {
                                setActiveSection(item.key);
                                setIsSidebarOpen(false);
                            }}
                        >
                            {item.icon}
                            <span className="font-semibold text-sm">{item.label}</span>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main Content - md:ml-[250px] space create karega sidebar ke liye */}
            <main className="flex-grow p-8 md:ml-[250px] w-full transition-all">
                <header className="mb-10">
                    <h2 className="text-3xl font-bold capitalize">{activeSection}</h2>
                </header>

                <div className="animate-in fade-in duration-500">
                    {renderSection()}
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;