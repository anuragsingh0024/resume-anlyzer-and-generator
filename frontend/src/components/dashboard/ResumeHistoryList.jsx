import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Calendar, TrendingUp, Briefcase,
  Eye, X, Award, ChevronRight,

} from 'lucide-react';
import Sidebar from './Sidebar';
import axiosInstance from '../../services/axiosInstance';
import ResumeCard from '../../components/ResumeCard'
import Loader from '../templates/Loader';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Mock data based on the provided JSON structure



const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Reusable status badge component
const ScoreBadge = ({ score }) => {
  let color = "text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-800/50";
  if (score >= 80) color = "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50";
  else if (score < 50) color = "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-800/50";

  return (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${color}`}>
      {score}%
    </span>
  );
};

const ResumeHistoryList = () => {
  const [selectedResume, setSelectedResume] = useState(null);
  const [mockResumes, setMockResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState({})
  const navigate = useNavigate();

  const fetchResumes = async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get('/resume/get-all-resumes-user');
      if (response.data.success) {
        setMockResumes(response.data.resumes);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  const makeActiveResume = async (id) => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.put('/resume/make-active-resume', { resumeId: id })
      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/dashboard')

      } else {
        toast.error(response?.data?.message || "something went wrong ")
      }
    } catch (err) {
      toast.error("something error from server")
      console.log('error in making resume active: ', err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      const response = await axiosInstance.get('/user/get-user');
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes();
    fetchUser();
    console.log('first: ', user)
  }, []);

  // Close modal when pressing Escape key
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedResume(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);


  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-text-primary pt-20">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-x-hidden">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-text-primary flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <FileText className="w-5 h-5" />
            </span>
            Resume History & Scans
          </h1>
          <p className="text-text-secondary text-sm">
            View, switch active target resumes, and inspect previous AI ATS scan reports.
          </p>
        </div>

        {/* Resume List */}
        <div className="grid gap-4">
          <AnimatePresence>
            {mockResumes.map((resume, index) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass-card p-6 border border-white/5 hover:border-primary/40 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">

                  {/* Left: Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 bg-surface rounded-2xl border border-white/5 text-primary group-hover:scale-105 transition-transform">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                          {resume.title || resume.analysis?.personalInfo?.name || "Uploaded Resume"}
                        </h3>
                        <p className="flex items-center gap-2 text-xs text-text-secondary mt-1 font-mono">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(resume.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Stats */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-8 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                    <div>
                      <p className="text-[10px] text-text-secondary font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Briefcase className="w-3 h-3 text-secondary" /> Detected Role
                      </p>
                      <p className="text-xs font-bold text-text-primary">
                        {resume.analysis?.profileMatch?.role || "Software Developer"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-text-secondary font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3 text-primary" /> Role Match
                      </p>
                      <ScoreBadge score={resume.analysis?.profileMatch?.score || 0} />
                    </div>

                    <div>
                      <p className="text-[10px] text-text-secondary font-mono uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <Award className="w-3 h-3 text-accent" /> ATS Score
                      </p>
                      <ScoreBadge score={resume.analysis?.ats?.score || 0} />
                    </div>
                  </div>

                  {/* Right: Action */}
                  <div className="flex items-center justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                    <button
                      onClick={() => setSelectedResume(resume)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-surface hover:bg-white/10 text-text-primary text-xs font-bold rounded-xl border border-white/5 transition-all cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-primary" />
                      View Full Analysis
                    </button>

                    {String(resume._id) === String(user?.activeResume?._id || user?.activeResume) ? (
                      <button
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl w-28 text-center cursor-default"
                        disabled
                      >
                        ✓ Active
                      </button>
                    ) : (
                      <button
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary text-background hover:scale-105 text-xs font-black rounded-xl transition-all cursor-pointer shadow-md shadow-primary/20 w-28"
                        onClick={() => makeActiveResume(resume._id)}
                        disabled={isLoading}
                      >
                        Make Active
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {mockResumes.length === 0 && (
            <div className="text-center py-20 glass-card border-dashed border-white/10 rounded-3xl space-y-3">
              <FileText className="w-12 h-12 text-text-secondary mx-auto mb-2 opacity-50" />
              <h3 className="text-lg font-bold text-text-primary">No Resumes Found</h3>
              <p className="text-text-secondary text-sm max-w-sm mx-auto">
                Upload your first resume to see comprehensive history and track ATS improvement over time.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Full-Screen Popup Component */}
      <AnimatePresence>
        {selectedResume && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-slate-900/60 dark:bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedResume(null)}
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full max-w-7xl bg-slate-50 dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 z-10">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {selectedResume.title}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(selectedResume.createdAt)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedResume(null)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body / Dynamic Component Area */}
              <div className="flex-1 overflow-y-auto p-6">
                <ResumeCard data={selectedResume} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeHistoryList;

