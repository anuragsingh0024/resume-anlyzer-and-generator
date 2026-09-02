import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axiosInstance from '../../services/axiosInstance';
import Loader from '../templates/Loader';
import { Settings as SettingsIcon, User, Mail, Shield, Calendar, LogOut, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Setting = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setIsLoading(true);
                const res = await axiosInstance.get('/user/get-user');
                if (res.data?.success && res.data.user) {
                    setUserData(res.data.user);
                }
            } catch (err) {
                console.log('Error fetching user settings:', err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/auth/logout');
        } catch (err) {
            console.log(err);
        } finally {
            dispatch(logout());
            toast.success("Logged out successfully");
            navigate('/');
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-background text-text-primary">
                <Sidebar />
                <main className="flex-1 p-8 mt-20 flex items-center justify-center">
                    <Loader />
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            <Sidebar />

            <main className="flex-1 p-8 mt-20 max-w-4xl space-y-8">
                <div>
                    <h1 className="text-3xl font-extrabold flex items-center gap-3">
                        <SettingsIcon className="w-8 h-8 text-primary" /> Account & Settings
                    </h1>
                    <p className="text-text-secondary mt-1">
                        Manage your profile, active subscriptions, and preferences.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="glass-card p-6 rounded-2xl border border-border-muted space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl font-black text-primary border border-primary/20">
                            {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-text-primary">{userData?.name || "User Account"}</h2>
                            <p className="text-sm text-text-secondary flex items-center gap-2 mt-0.5">
                                <Mail size={14} className="text-primary" /> {userData?.email}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border-muted/50">
                        <div className="p-4 bg-surface/50 rounded-xl border border-white/5 space-y-1">
                            <span className="text-xs uppercase tracking-wider text-text-secondary font-semibold">Account Role</span>
                            <p className="text-base font-bold text-primary capitalize flex items-center gap-2">
                                <Shield size={16} /> {userData?.role || "User"}
                            </p>
                        </div>

                        <div className="p-4 bg-surface/50 rounded-xl border border-white/5 space-y-1">
                            <span className="text-xs uppercase tracking-wider text-text-secondary font-semibold">Current Plan</span>
                            <p className="text-base font-bold text-accent capitalize flex items-center gap-2">
                                <CheckCircle size={16} /> {userData?.plan || "Free Tier"}
                            </p>
                        </div>

                        <div className="p-4 bg-surface/50 rounded-xl border border-white/5 space-y-1 sm:col-span-2">
                            <span className="text-xs uppercase tracking-wider text-text-secondary font-semibold">Member Since</span>
                            <p className="text-sm text-text-secondary flex items-center gap-2 mt-1">
                                <Calendar size={16} className="text-primary" />
                                {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }) : "Recently Joined"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="glass-card p-6 rounded-2xl border border-rose-500/20 flex items-center justify-between">
                    <div>
                        <h4 className="text-base font-bold text-text-primary">Sign Out</h4>
                        <p className="text-xs text-text-secondary mt-0.5">Securely log out of your current session on this device.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-5 py-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Setting;