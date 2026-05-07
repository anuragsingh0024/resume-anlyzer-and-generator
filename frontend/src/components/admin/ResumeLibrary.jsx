import React, { useState, useMemo } from 'react';
import {
    Search, Filter, X, ChevronRight, User, Mail, Phone, MapPin,
    Link2, GitBranch, Award, Briefcase, GraduationCap, FolderGit2,
    CheckCircle2, AlertCircle, Calendar, Code, Lightbulb, Target, TrendingUp,
    Loader
} from 'lucide-react';
import axiosInstance from '../../services/axiosInstance'
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const ResumeLibrary = () => {
    // Backend data using the provided JSON structure
    const [resumes, setResumes] = useState([
        {
            "_id": { "$oid": "69daab1333f0fc6408e99264" },
            "title": "Ravi Sahani",
            "analysis": {
                "personalInfo": {
                    "name": "Ravi Sahani",
                    "email": "mrbadshaff@gmail.com",
                    "phone": "+91 7575088632",
                    "location": "",
                    "linkedin": "linkedin.com/Ravi Sahani",
                    "github": "github.com/ravisahani75750"
                },
                "profileMatch": { "role": "Full Stack Developer", "score": 68, "level": "Intermediate" },
                "ats": { "score": 78, "label": "Good" },
                "skills": {
                    "detected": ["C", "C++", "JavaScript", "HTML", "CSS", "Tailwind CSS", "React", "Node.js", "Express.js", "Postman", "MongoDB", "Git", "GitHub", "Vercel"],
                    "missing": ["Docker", "Kubernetes", "Redis", "TypeScript", "AWS"]
                },
                "education": [
                    { "degree": "BCA (Bachelor of Computer Applications)", "institution": "JS University", "year": "2026" },
                    { "degree": "Intermediate (PCM)", "institution": "Kasturba Gandhi Inter College", "year": "2023" }
                ],
                "experience": [
                    { "role": "Full-Stack Developer", "company": "Personal Project – Remote", "duration": "2025", "description": "Built a Gym Membership website. Designed responsive UI with React.js + Tailwind CSS. Deployed using Vercel (frontend)." },
                    { "role": "Full-Stack Developer", "company": "Personal Project – Remote", "duration": "2025", "description": "Made a food ordering website containing order, cart, checkout also with quantity editing on the main page." }
                ],
                "projects": [
                    { "name": "Gym Website", "techStack": ["React", "Tailwind CSS", "Node.js", "Express.js", "MongoDB", "Vercel"], "description": "Developed a gym website with membership buying and tracking features." },
                    { "name": "Food Ordering Site", "techStack": ["React", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"], "description": "Built a real-time food ordering app with interactive UI." }
                ],
                "recommendations": [
                    "Quantify achievements in project descriptions (e.g., 'handled X concurrent users', 'reduced load time by Y%').",
                    "Explore and learn containerization tools like Docker and orchestration with Kubernetes."
                ]
            },
            "createdAt": { "$date": "2026-04-11T20:12:04.022Z" }
        },
        {
            "_id": { "$oid": "69daab1333f0fc6408e99265" },
            "title": "Amit Verma",
            "analysis": {
                "personalInfo": {
                    "name": "Amit Verma",
                    "email": "amit@email.com",
                    "phone": "+91 9876543210",
                    "location": "Delhi, India",
                    "linkedin": "linkedin.com/in/amitverma",
                    "github": "github.com/amitverma"
                },
                "profileMatch": { "role": "Backend Developer", "score": 85, "level": "Senior" },
                "ats": { "score": 92, "label": "Excellent" },
                "skills": {
                    "detected": ["Java", "Spring Boot", "AWS", "SQL", "Docker", "Kubernetes"],
                    "missing": ["GraphQL", "React", "Node.js"]
                },
                "education": [
                    { "degree": "B.Tech in Computer Science", "institution": "Delhi College of Engineering", "year": "2020" }
                ],
                "experience": [
                    { "role": "Backend Engineer", "company": "Tech Corp", "duration": "2020 - Present", "description": "Developed scalable microservices using Spring Boot." }
                ],
                "projects": [
                    { "name": "E-commerce Backend", "techStack": ["Java", "Spring Boot", "MySQL", "Redis"], "description": "High performance backend for e-commerce." }
                ],
                "recommendations": [
                    "Add more frontend skills to become full-stack.",
                    "Consider AWS Certification."
                ]
            },
            "createdAt": { "$date": "2026-03-10T10:00:00.000Z" }
        }
    ]);


    const fetchResumes = async () => {
        try {
            setIsLoading(true)
            const response = await axiosInstance.get("/resume/admin/all-resumes");
            setResumes(response.data.resumes)

        } catch (err) {
            toast.error(response?.data?.message || "Failed to fetch resume")
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    //fetch while rendoring
    useEffect(() => {
        fetchResumes()
    }, [])

    const [search, setSearch] = useState("");
    const [selectedRole, setSelectedRole] = useState("All");
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [selectedSkill, setSelectedSkill] = useState("All");
    const [selectedResume, setSelectedResume] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

    // Dynamic Filter Options
    const uniqueRoles = useMemo(() => ["All", ...new Set(resumes.map(r => r.analysis?.profileMatch?.role).filter(Boolean))], [resumes]);
    const uniqueLevels = useMemo(() => ["All", ...new Set(resumes.map(r => r.analysis?.profileMatch?.level).filter(Boolean))], [resumes]);
    const uniqueSkills = useMemo(() => {
        const skills = new Set();
        resumes.forEach(r => {
            r.analysis?.skills?.detected?.forEach(s => skills.add(s));
        });
        return ["All", ...Array.from(skills).sort()];
    }, [resumes]);

    // Enhanced Filter Logic
    const filteredResumes = useMemo(() => {
        return resumes.filter(r => {
            const analysis = r.analysis || {};
            const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                analysis.personalInfo?.email?.toLowerCase().includes(search.toLowerCase());
            const matchesRole = selectedRole === "All" || analysis.profileMatch?.role === selectedRole;
            const matchesLevel = selectedLevel === "All" || analysis.profileMatch?.level === selectedLevel;
            const matchesSkill = selectedSkill === "All" || analysis.skills?.detected?.includes(selectedSkill);

            return matchesSearch && matchesRole && matchesLevel && matchesSkill;
        });
    }, [search, selectedRole, selectedLevel, selectedSkill, resumes]);


    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center bg-gray-900">
                <Loader />
            </div>
        );
    }


    return (
        <div className="space-y-6">
            {/* Filters & Search Header */}
            <div className="glass-card p-4 rounded-2xl flex flex-col xl:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-3 text-text-secondary" size={18} />
                    <input
                        className="w-full bg-background border border-border-muted p-2.5 pl-10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-3 w-full xl:w-auto">
                    <div className="flex items-center gap-2 bg-background border border-border-muted rounded-xl px-3 flex-1 md:flex-none">
                        <Briefcase size={14} className="text-text-secondary" />
                        <select
                            className="bg-transparent p-2.5 w-full text-sm outline-none cursor-pointer"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="All" className="bg-background">All Roles</option>
                            {uniqueRoles.filter(r => r !== 'All').map(role => <option className="bg-background" key={role} value={role}>{role}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-background border border-border-muted rounded-xl px-3 flex-1 md:flex-none">
                        <TrendingUp size={14} className="text-text-secondary" />
                        <select
                            className="bg-transparent p-2.5 w-full text-sm outline-none cursor-pointer"
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                        >
                            <option value="All" className="bg-background">All Levels</option>
                            {uniqueLevels.filter(l => l !== 'All').map(level => <option className="bg-background" key={level} value={level}>{level}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-background border border-border-muted rounded-xl px-3 flex-1 md:flex-none">
                        <Code size={14} className="text-text-secondary" />
                        <select
                            className="bg-transparent p-2.5 w-full text-sm outline-none cursor-pointer max-w-[150px]"
                            value={selectedSkill}
                            onChange={(e) => setSelectedSkill(e.target.value)}
                        >
                            <option value="All" className="bg-background">All Skills</option>
                            {uniqueSkills.filter(s => s !== 'All').map(skill => <option className="bg-background" key={skill} value={skill}>{skill}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Resumes Table */}
            <div className="glass-card overflow-hidden rounded-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-surface/50 border-b border-border-muted/30">
                            <tr className="text-text-secondary text-[11px] uppercase tracking-wider">
                                <th className="p-4 font-semibold">Candidate</th>
                                <th className="p-4 font-semibold">Target Role</th>
                                <th className="p-4 font-semibold">Level</th>
                                <th className="p-4 font-semibold">ATS Score</th>
                                <th className="p-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-muted/20">
                            {filteredResumes.length > 0 ? filteredResumes.map(r => (
                                <tr key={r._id.$oid} className="hover:bg-primary/5 transition-colors cursor-pointer group" onClick={() => setSelectedResume(r)}>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold">
                                                {r.title.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-text-primary">{r.title}</p>
                                                <p className="text-xs text-text-secondary">{r.analysis?.personalInfo?.email || 'No email'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm font-medium">{r.analysis?.profileMatch?.role || 'N/A'}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide
                                            ${r.analysis?.profileMatch?.level === 'Senior' ? 'bg-purple-500/10 text-purple-500' :
                                                r.analysis?.profileMatch?.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-green-500/10 text-green-500'}`}>
                                            {r.analysis?.profileMatch?.level || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full max-w-[80px] bg-surface rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary to-accent"
                                                    style={{ width: `${r.analysis?.ats?.score || 0}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold">{r.analysis?.ats?.score || 0}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-primary hover:text-white inline-flex items-center gap-1 text-sm font-bold transition-colors">
                                            View <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-text-secondary">
                                        No resumes found matching the current filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Comprehensive Detail Drawer */}
            {selectedResume && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedResume(null)} />
                    <div className="w-full md:w-[650px] lg:w-[750px] bg-background h-full shadow-2xl border-l border-border-muted p-0 overflow-y-auto animate-in slide-in-from-right flex flex-col relative z-10">

                        {/* Drawer Header (Sticky) */}
                        <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border-muted p-6 flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl text-primary font-black shadow-lg">
                                    {selectedResume.title.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-text-primary">{selectedResume.title}</h2>
                                    <p className="text-primary font-medium flex items-center gap-2 mt-1">
                                        <Target size={16} /> {selectedResume.analysis?.profileMatch?.role || 'Unknown Role'}
                                        <span className="text-text-secondary text-sm ml-2">({selectedResume.analysis?.profileMatch?.level})</span>
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedResume(null)} className="p-2 bg-surface hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Drawer Body */}
                        <div className="p-6 space-y-8">

                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-surface border border-border-muted/50 rounded-2xl flex flex-col items-center text-center">
                                    <span className="text-[11px] text-text-secondary uppercase font-bold tracking-wider mb-2">ATS Score</span>
                                    <div className="relative w-16 h-16 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" className="text-background" strokeWidth="8" />
                                            <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" className="text-primary" strokeWidth="8" strokeDasharray="175" strokeDashoffset={175 - (175 * (selectedResume.analysis?.ats?.score || 0)) / 100} />
                                        </svg>
                                        <span className="absolute text-lg font-black">{selectedResume.analysis?.ats?.score}%</span>
                                    </div>
                                    <span className="text-xs text-primary mt-2 font-medium bg-primary/10 px-2 py-0.5 rounded-md">{selectedResume.analysis?.ats?.label || 'N/A'}</span>
                                </div>

                                <div className="p-4 bg-surface border border-border-muted/50 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <span className="text-[11px] text-text-secondary uppercase font-bold tracking-wider mb-2">Profile Match</span>
                                    <span className="text-3xl font-black text-accent">{selectedResume.analysis?.profileMatch?.score || 0}%</span>
                                </div>

                                <div className="p-4 bg-surface border border-border-muted/50 rounded-2xl flex flex-col items-center justify-center text-center md:col-span-2">
                                    <span className="text-[11px] text-text-secondary uppercase font-bold tracking-wider mb-2">Contact Info</span>
                                    <div className="space-y-1.5 w-full text-left text-sm">
                                        {selectedResume.analysis?.personalInfo?.email && (
                                            <p className="flex items-center gap-2 text-text-secondary"><Mail size={14} className="text-primary shrink-0" /> <span className="truncate">{selectedResume.analysis.personalInfo.email}</span></p>
                                        )}
                                        {selectedResume.analysis?.personalInfo?.phone && (
                                            <p className="flex items-center gap-2 text-text-secondary"><Phone size={14} className="text-primary shrink-0" /> <span>{selectedResume.analysis.personalInfo.phone}</span></p>
                                        )}
                                        {selectedResume.analysis?.personalInfo?.location && (
                                            <p className="flex items-center gap-2 text-text-secondary"><MapPin size={14} className="text-primary shrink-0" /> <span className="truncate">{selectedResume.analysis.personalInfo.location}</span></p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Links if available */}
                            {(selectedResume.analysis?.personalInfo?.linkedin || selectedResume.analysis?.personalInfo?.github) && (
                                <div className="flex flex-wrap gap-3">
                                    {selectedResume.analysis.personalInfo.linkedin && (
                                        <a href={`https://${selectedResume.analysis.personalInfo.linkedin.replace('https://', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-500 rounded-xl text-sm font-medium hover:bg-blue-600/20 transition-colors">
                                            <Link2 size={16} /> LinkedIn
                                        </a>
                                    )}
                                    {selectedResume.analysis.personalInfo.github && (
                                        <a href={`https://${selectedResume.analysis.personalInfo.github.replace('https://', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-500/10 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-500/20 transition-colors">
                                            <GitBranch size={16} /> GitHub
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Skills Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border-muted pb-2">
                                    <Award size={20} className="text-primary" /> Skills Overview
                                </h3>

                                {selectedResume.analysis?.skills?.detected && selectedResume.analysis.skills.detected.length > 0 && (
                                    <div>
                                        <p className="text-sm text-text-secondary mb-3 flex items-center gap-1"><CheckCircle2 size={14} className="text-green-500" /> Detected Skills</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedResume.analysis.skills.detected.map(s => (
                                                <span key={s} className="px-3 py-1.5 bg-surface border border-primary/20 text-text-primary rounded-lg text-xs font-semibold shadow-sm">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedResume.analysis?.skills?.missing && selectedResume.analysis.skills.missing.length > 0 && (
                                    <div className="pt-2">
                                        <p className="text-sm text-text-secondary mb-3 flex items-center gap-1"><AlertCircle size={14} className="text-red-500" /> Missing Job-critical Skills</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedResume.analysis.skills.missing.map(s => (
                                                <span key={s} className="px-3 py-1.5 bg-red-500/5 border border-red-500/20 text-red-500 rounded-lg text-xs font-semibold">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Recommendations / AI Insights */}
                            {selectedResume.analysis?.recommendations && selectedResume.analysis.recommendations.length > 0 && (
                                <div className="bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-2xl p-5 space-y-3">
                                    <h3 className="text-sm font-bold text-accent flex items-center gap-2">
                                        <Lightbulb size={16} className="text-accent" /> AI Recommendations
                                    </h3>
                                    <ul className="space-y-2 text-sm text-text-secondary">
                                        {selectedResume.analysis.recommendations.map((rec, idx) => (
                                            <li key={idx} className="flex gap-2 items-start">
                                                <div className="min-w-[4px] h-[4px] rounded-full bg-accent mt-2 shrink-0" />
                                                <span>{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Experience Section */}
                            {selectedResume.analysis?.experience && selectedResume.analysis.experience.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border-muted pb-2">
                                        <Briefcase size={20} className="text-secondary" /> Work Experience
                                    </h3>
                                    <div className="space-y-5">
                                        {selectedResume.analysis.experience.map((ex, i) => (
                                            <div key={i} className="relative pl-6 border-l-2 border-border-muted before:absolute before:left-[-5px] before:top-1.5 before:w-2 before:h-2 before:bg-secondary before:rounded-full">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                                                    <h4 className="font-bold text-text-primary text-base">{ex.role}</h4>
                                                    <span className="text-xs text-secondary font-medium bg-secondary/10 px-2 py-1 rounded-md flex items-center gap-1 w-fit mt-1 sm:mt-0">
                                                        <Calendar size={12} /> {ex.duration}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-primary font-medium mb-2">{ex.company}</p>
                                                {ex.description && <p className="text-sm text-text-secondary leading-relaxed">{ex.description}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Projects Section */}
                            {selectedResume.analysis?.projects && selectedResume.analysis.projects.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border-muted pb-2">
                                        <FolderGit2 size={20} className="text-accent" /> Notable Projects
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedResume.analysis.projects.map((proj, i) => (
                                            <div key={i} className="bg-surface border border-border-muted p-4 rounded-xl flex flex-col h-full">
                                                <h4 className="font-bold text-text-primary mb-2">{proj.name}</h4>
                                                {proj.description && <p className="text-xs text-text-secondary mb-4 flex-grow">{proj.description}</p>}
                                                {proj.techStack && (
                                                    <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-border-muted/50">
                                                        {proj.techStack.slice(0, 4).map(tech => (
                                                            <span key={tech} className="text-[10px] bg-background px-2 py-1 rounded text-text-secondary">{tech}</span>
                                                        ))}
                                                        {proj.techStack.length > 4 && <span className="text-[10px] bg-background px-2 py-1 rounded text-text-secondary">+{proj.techStack.length - 4}</span>}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Education Section */}
                            {selectedResume.analysis?.education && selectedResume.analysis.education.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border-muted pb-2">
                                        <GraduationCap size={20} className="text-blue-400" /> Education
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedResume.analysis.education.map((edu, i) => (
                                            <div key={i} className="flex gap-4 items-start bg-surface/50 p-4 rounded-xl border border-border-muted/50">
                                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                                                    <GraduationCap size={20} className="text-blue-500" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-text-primary">{edu.degree}</h4>
                                                    <p className="text-sm text-text-secondary mt-0.5">{edu.institution}</p>
                                                    <p className="text-xs text-blue-400 font-medium mt-1">Class of {edu.year}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeLibrary;