import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import AnalysisResult from '../components/dashboard/AnalysisResult';

const Dashboard = () => {



    return (
        <div className="flex min-h-screen bg-background text-text-primary">
            <Sidebar />

            <main className="flex-1 p-8 mt-20">


                <AnalysisResult />
            </main>
        </div>
    );
};

export default Dashboard;