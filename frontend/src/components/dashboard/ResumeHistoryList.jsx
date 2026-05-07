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
    <div className="flex min-h-screen bg-background text-text-primary">
      <Sidebar />

      <main className="flex-1 p-8 mt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-violet-600 dark:text-violet-500" />
            Resume History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            View and manage your previously uploaded resumes and their analyses.
          </p>
        </div>

        {/* Resume List */}
        <div className="grid gap-4">
          <AnimatePresence>
            {mockResumes.map((resume, index) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-xl hover:shadow-violet-500/5 dark:hover:shadow-violet-500/10 transition-all duration-300 relative overflow-hidden"
              >
                {/* Decorative background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/0 to-violet-500/5 dark:to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">

                  {/* Left: Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 rounded-xl">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                          {resume.title || resume.analysis.personalInfo?.name}
                        </h3>
                        <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          Uploaded on {formatDate(resume.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Stats */}
                  <div className="flex items-center gap-6 sm:gap-10 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" /> Role Insight
                      </p>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        {resume.analysis.profileMatch?.role || "Unknown"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5" /> Match
                      </p>
                      <ScoreBadge score={resume.analysis.profileMatch?.score || 0} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" /> ATS
                      </p>
                      <ScoreBadge score={resume.analysis.ats?.score || 0} />
                    </div>
                  </div>

                  {/* Right: Action */}
                  <div className="flex justify-end md:ml-4 gap-10">
                    <button
                      onClick={() => setSelectedResume(resume)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-violet-600 text-slate-700 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-violet-600 dark:hover:text-white font-semibold rounded-xl transition-all duration-300 active:scale-95 group/btn shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                      <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-300" />
                    </button>


                    {resume._id == user.activeResume ? (
                      <button
                        className='flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-green-600 text-slate-700 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-green-600 dark:hover:text-white font-semibold rounded-xl transition-all duration-300 active:scale-95 group/btn shadow-sm w-32 text-center'
                        disabled
                      >
                        Active
                      </button>
                    ) : (
                      <button
                        className='flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-violet-600 text-slate-700 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-violet-600 dark:hover:text-white font-semibold rounded-xl transition-all duration-300 active:scale-95 group/btn shadow-sm'
                        onClick={() => makeActiveResume(resume._id)}
                        disabled={isLoading}
                      >
                        make active
                      </button>
                    )
                    }
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {mockResumes.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl border-dashed">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">No resumes found</h3>
              <p className="text-slate-500">Upload your first resume to see the analytics history here.</p>
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

