import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/authSlice';
import axiosInstance from './services/axiosInstance';

import Home from './pages/Home';
import Navbar from './components/layout/Nav';
import LoginPage from './pages/LoginPage';
import DummyDashboard from './pages/DummyDashboard';
import OpenRoute from './components/auth/OpenRoute';
import PrivateRoute from './components/auth/PrivateRoute';
import Dashboard from './pages/Dashboard';
import ResumeHistoryList from './components/dashboard/ResumeHistoryList';
import JobMatch from './components/dashboard/JobMatch';
import AiTemplates from './components/dashboard/AiTemplates';
import Setting from './components/dashboard/Setting';
import AdminRoute from './components/auth/AdminRoute';
import AdminPanel from './pages/Admin';
import ResumeGenerator from './components/ResumeGenerator';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axiosInstance.get("/user/get-user")
        .then((res) => {
          if (res.data?.success && res.data.user) {
            dispatch(setUser(res.data.user));
            localStorage.setItem("role", res.data.user.role || "user");
          }
        })
        .catch((err) => {
          console.log("Session restore failed:", err.message);
        });
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-background text-text-primary selection:bg-primary/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<OpenRoute><LoginPage /></OpenRoute>} />
          <Route path="/dummy-dashboard" element={<DummyDashboard />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/resume-history" element={<PrivateRoute><ResumeHistoryList /></PrivateRoute>} />
          <Route path="/ai-templates" element={<PrivateRoute><AiTemplates /></PrivateRoute>} />
          <Route path="/job-matches" element={<PrivateRoute><JobMatch /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Setting /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminRoute><AdminPanel /></AdminRoute></PrivateRoute>} />
          <Route path="/generate-resume" element={<PrivateRoute><ResumeGenerator /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;