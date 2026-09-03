import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import AnalysisResult from '../components/dashboard/AnalysisResult';

const Dashboard = () => {
    return (
        <div className="flex min-h-screen bg-background text-text-primary pt-20">
            <Sidebar />
            <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-x-hidden">
                <AnalysisResult />
            </main>
        </div>
    );
};

export default Dashboard;