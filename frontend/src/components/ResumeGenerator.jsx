// ResumeGenerator.jsx
import React, { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import {
  User, Mail, Phone, GitBranch, Link2, Globe, MapPin, FileText,
  GraduationCap, Briefcase, FolderOpen, Code, Trophy, Plus, Trash2,
  Download, Eye, Loader2, ChevronDown, ChevronUp, Sparkles
} from "lucide-react";

// ─── Section Wrapper ──────────────────────────────────────────────────
const SectionCard = ({ icon, title, children, onAdd, addLabel }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 text-left"
        >
          <span className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</span>
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <span className="text-text-secondary">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>
        {onAdd && open && (
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-all"
          >
            <Plus size={14} /> {addLabel || "Add"}
          </button>
        )}
      </div>
      {open && <div className="space-y-4">{children}</div>}
    </div>
  );
};

// ─── Styled Input ──────────────────────────────────────────────────────
const StyledInput = ({ icon, label, ...props }) => (
  <div className="space-y-1">
    {label && <label className="text-xs text-text-secondary font-medium uppercase tracking-wider">{label}</label>}
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
          {icon}
        </span>
      )}
      <input
        {...props}
        className={`w-full bg-background/60 border border-border-muted rounded-xl px-4 py-3 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm ${icon ? "pl-10" : ""}`}
      />
    </div>
  </div>
);

// ─── Styled Textarea ──────────────────────────────────────────────────
const StyledTextarea = ({ label, ...props }) => (
  <div className="space-y-1">
    {label && <label className="text-xs text-text-secondary font-medium uppercase tracking-wider">{label}</label>}
    <textarea
      {...props}
      className="w-full bg-background/60 border border-border-muted rounded-xl px-4 py-3 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm resize-none"
    />
  </div>
);

// ─── Sub-card for array items ──────────────────────────────────────────
const ItemCard = ({ label, onRemove, children }) => (
  <div className="border border-border-muted/50 rounded-xl p-4 space-y-3 bg-surface/40 relative">
    {label && (
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-primary uppercase tracking-widest">{label}</span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-400/60 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    )}
    {children}
  </div>
);

// ─── Skill row ────────────────────────────────────────────────────────
const SkillRow = ({ label, value, onChange }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs font-semibold text-primary w-40 shrink-0">{label}</span>
    <input
      type="text"
      placeholder={`Enter ${label.toLowerCase()} (comma separated)`}
      value={value}
      onChange={onChange}
      className="flex-1 bg-background/60 border border-border-muted rounded-xl px-4 py-2.5 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm"
    />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

const ResumeGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    portfolio: "",
    address: "",
    summary: "",

    education: [
      { institute: "", degree: "", field: "", startYear: "", endYear: "", percentage: "", location: "" },
    ],

    experience: [
      { role: "", company: "", duration: "", location: "", workType: "", description: "", technologies: "" },
    ],

    projects: [
      { title: "", techStack: "", year: "", githubLink: "", liveLink: "", description: "" },
    ],

    skills: {
      "Programming Languages": "",
      Frontend: "",
      Backend: "",
      "API & Testing": "",
      "Real-Time Communication": "",
      Database: "",
      "Version Control": "",
      Hosting: "",
      "Soft Skills": "",
    },

    achievements: [
      { title: "", year: "", description: "" },
    ],
  });

  // ─── Handlers ─────────────────────────────────────────────────────

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleArrayChange = (section, index, field, value) => {
    const updated = [...formData[section]];
    updated[index][field] = value;
    setFormData({ ...formData, [section]: updated });
  };

  const addField = (section, obj) =>
    setFormData({ ...formData, [section]: [...formData[section], obj] });

  const removeField = (section, index) => {
    const updated = [...formData[section]];
    updated.splice(index, 1);
    setFormData({ ...formData, [section]: updated });
  };

  const handleSkillChange = (field, value) =>
    setFormData({ ...formData, skills: { ...formData.skills, [field]: value } });

  // ─── Submit ────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setPdfUrl("");

      const splitTrim = (str) =>
        str ? str.split(",").map((s) => s.trim()).filter(Boolean) : [];

      const payload = {
        ...formData,
        experience: formData.experience.map((item) => ({
          ...item,
          description: splitTrim(item.description),
          technologies: splitTrim(item.technologies),
        })),
        projects: formData.projects.map((item) => ({
          ...item,
          techStack: splitTrim(item.techStack),
          description: splitTrim(item.description),
        })),
        skills: Object.fromEntries(
          Object.entries(formData.skills).map(([k, v]) => [k, splitTrim(v)])
        ),
      };

      const response = await axiosInstance.post(
        "/resume/generate-resume",
        payload,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      setPdfUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
      alert("Resume generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* ── Page Header ── */}
      <div className="sticky top-0 z-20 border-b border-border-muted bg-background/80 backdrop-blur-lg px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-primary/10 text-primary">
            <Sparkles size={20} />
          </span>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Resume Generator</h1>
            <p className="text-xs text-text-secondary">Fill in your details and generate a professional PDF resume</p>
          </div>
        </div>

        {pdfUrl && (
          <a
            href={pdfUrl}
            download={`${formData.fullName || "resume"}-resume.pdf`}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-background font-semibold rounded-xl hover:opacity-90 transition-all text-sm shadow-lg shadow-primary/20"
          >
            <Download size={16} /> Download PDF
          </a>
        )}
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_480px] gap-6 p-6">

        {/* ════════════════════════════════
            FORM
        ════════════════════════════════ */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Personal Info ── */}
          <SectionCard icon={<User size={18} />} title="Personal Information">
            <div className="grid sm:grid-cols-2 gap-4">
              <StyledInput icon={<User size={15} />} name="fullName" placeholder="Full Name" required value={formData.fullName} onChange={handleChange} label="Full Name *" />
              <StyledInput icon={<Mail size={15} />} type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} label="Email *" />
              <StyledInput icon={<Phone size={15} />} name="phone" placeholder="+91 99999 99999" value={formData.phone} onChange={handleChange} label="Phone" />
              <StyledInput icon={<MapPin size={15} />} name="address" placeholder="City, State" value={formData.address} onChange={handleChange} label="Location" />
              <StyledInput icon={<GitBranch size={15} />} name="github" placeholder="github.com/username" value={formData.github} onChange={handleChange} label="GitHub URL" />
              <StyledInput icon={<Link2 size={15} />} name="linkedin" placeholder="linkedin.com/in/username" value={formData.linkedin} onChange={handleChange} label="LinkedIn URL" />
              <div className="sm:col-span-2">
                <StyledInput icon={<Globe size={15} />} name="portfolio" placeholder="Portfolio / Website URL" value={formData.portfolio} onChange={handleChange} label="Portfolio" />
              </div>
            </div>
            <StyledTextarea
              name="summary"
              placeholder="Write a compelling professional summary highlighting your skills, experience, and goals..."
              value={formData.summary}
              onChange={handleChange}
              rows={4}
              label="Personal Summary"
            />
          </SectionCard>

          {/* ── Education ── */}
          <SectionCard
            icon={<GraduationCap size={18} />}
            title="Education"
            onAdd={() => addField("education", { institute: "", degree: "", field: "", startYear: "", endYear: "", percentage: "", location: "" })}
            addLabel="Add Education"
          >
            {formData.education.map((edu, i) => (
              <ItemCard key={i} label={`Education ${i + 1}`} onRemove={formData.education.length > 1 ? () => removeField("education", i) : null}>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <StyledInput placeholder="Institute / University Name" label="Institute" value={edu.institute} onChange={(e) => handleArrayChange("education", i, "institute", e.target.value)} />
                  </div>
                  <StyledInput placeholder="e.g. BCA, B.Tech" label="Degree" value={edu.degree} onChange={(e) => handleArrayChange("education", i, "degree", e.target.value)} />
                  <StyledInput placeholder="e.g. Computer Science" label="Field of Study" value={edu.field} onChange={(e) => handleArrayChange("education", i, "field", e.target.value)} />
                  <StyledInput placeholder="2021" label="Start Year" value={edu.startYear} onChange={(e) => handleArrayChange("education", i, "startYear", e.target.value)} />
                  <StyledInput placeholder="2024" label="End Year / Expected" value={edu.endYear} onChange={(e) => handleArrayChange("education", i, "endYear", e.target.value)} />
                  <StyledInput placeholder="e.g. 85% or 8.5 CGPA" label="Score / Percentage" value={edu.percentage} onChange={(e) => handleArrayChange("education", i, "percentage", e.target.value)} />
                  <StyledInput icon={<MapPin size={14} />} placeholder="City, State" label="Location" value={edu.location} onChange={(e) => handleArrayChange("education", i, "location", e.target.value)} />
                </div>
              </ItemCard>
            ))}
          </SectionCard>

          {/* ── Experience ── */}
          <SectionCard
            icon={<Briefcase size={18} />}
            title="Work Experience"
            onAdd={() => addField("experience", { role: "", company: "", duration: "", location: "", workType: "", description: "", technologies: "" })}
            addLabel="Add Experience"
          >
            {formData.experience.map((exp, i) => (
              <ItemCard key={i} label={`Experience ${i + 1}`} onRemove={formData.experience.length > 1 ? () => removeField("experience", i) : null}>
                <div className="grid sm:grid-cols-2 gap-3">
                  <StyledInput placeholder="e.g. Full-Stack Developer" label="Role / Position" value={exp.role} onChange={(e) => handleArrayChange("experience", i, "role", e.target.value)} />
                  <StyledInput placeholder="Company Name" label="Company" value={exp.company} onChange={(e) => handleArrayChange("experience", i, "company", e.target.value)} />
                  <StyledInput placeholder="e.g. Jan 2024 – Present" label="Duration" value={exp.duration} onChange={(e) => handleArrayChange("experience", i, "duration", e.target.value)} />
                  <StyledInput placeholder="e.g. Remote / Onsite" label="Work Type" value={exp.workType} onChange={(e) => handleArrayChange("experience", i, "workType", e.target.value)} />
                  <div className="sm:col-span-2">
                    <StyledInput icon={<MapPin size={14} />} placeholder="City, Country" label="Location" value={exp.location} onChange={(e) => handleArrayChange("experience", i, "location", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <StyledTextarea placeholder="Describe your responsibilities and achievements (use comma to separate bullet points)" label="Description (comma separated for bullets)" value={exp.description} onChange={(e) => handleArrayChange("experience", i, "description", e.target.value)} rows={3} />
                  </div>
                  <div className="sm:col-span-2">
                    <StyledInput placeholder="React.js, Node.js, MongoDB (comma separated)" label="Technologies Used" value={exp.technologies} onChange={(e) => handleArrayChange("experience", i, "technologies", e.target.value)} />
                  </div>
                </div>
              </ItemCard>
            ))}
          </SectionCard>

          {/* ── Projects ── */}
          <SectionCard
            icon={<FolderOpen size={18} />}
            title="Projects"
            onAdd={() => addField("projects", { title: "", techStack: "", year: "", githubLink: "", liveLink: "", description: "" })}
            addLabel="Add Project"
          >
            {formData.projects.map((project, i) => (
              <ItemCard key={i} label={`Project ${i + 1}`} onRemove={formData.projects.length > 1 ? () => removeField("projects", i) : null}>
                <div className="grid sm:grid-cols-2 gap-3">
                  <StyledInput placeholder="e.g. Gym Website" label="Project Title" value={project.title} onChange={(e) => handleArrayChange("projects", i, "title", e.target.value)} />
                  <StyledInput placeholder="2024" label="Year" value={project.year} onChange={(e) => handleArrayChange("projects", i, "year", e.target.value)} />
                  <div className="sm:col-span-2">
                    <StyledInput placeholder="MERN Stack, WebRTC, Socket.io (comma separated)" label="Tech Stack" value={project.techStack} onChange={(e) => handleArrayChange("projects", i, "techStack", e.target.value)} />
                  </div>
                  <StyledInput icon={<GitBranch size={14} />} placeholder="github.com/repo-link" label="GitHub Link" value={project.githubLink} onChange={(e) => handleArrayChange("projects", i, "githubLink", e.target.value)} />
                  <StyledInput icon={<Globe size={14} />} placeholder="Live demo URL" label="Live Link" value={project.liveLink} onChange={(e) => handleArrayChange("projects", i, "liveLink", e.target.value)} />
                  <div className="sm:col-span-2">
                    <StyledTextarea placeholder="Describe key features and your contribution (use comma to separate bullet points)" label="Description (comma separated for bullets)" value={project.description} onChange={(e) => handleArrayChange("projects", i, "description", e.target.value)} rows={3} />
                  </div>
                </div>
              </ItemCard>
            ))}
          </SectionCard>

          {/* ── Skills ── */}
          <SectionCard icon={<Code size={18} />} title="Skills Summary">
            <div className="space-y-3">
              {Object.keys(formData.skills).map((skill) => (
                <SkillRow
                  key={skill}
                  label={skill}
                  value={formData.skills[skill]}
                  onChange={(e) => handleSkillChange(skill, e.target.value)}
                />
              ))}
            </div>
            <p className="text-xs text-text-secondary mt-2">💡 Separate each skill with a comma (e.g., React.js, Node.js, MongoDB)</p>
          </SectionCard>

          {/* ── Achievements ── */}
          <SectionCard
            icon={<Trophy size={18} />}
            title="Leadership & Achievements"
            onAdd={() => addField("achievements", { title: "", year: "", description: "" })}
            addLabel="Add Achievement"
          >
            {formData.achievements.map((achievement, i) => (
              <ItemCard key={i} label={`Achievement ${i + 1}`} onRemove={formData.achievements.length > 1 ? () => removeField("achievements", i) : null}>
                <div className="grid sm:grid-cols-2 gap-3">
                  <StyledInput placeholder="e.g. NIIT Excellence Award (1st Rank)" label="Title" value={achievement.title} onChange={(e) => handleArrayChange("achievements", i, "title", e.target.value)} />
                  <StyledInput placeholder="2024" label="Year" value={achievement.year} onChange={(e) => handleArrayChange("achievements", i, "year", e.target.value)} />
                  <div className="sm:col-span-2">
                    <StyledTextarea placeholder="Brief description of the achievement..." label="Description" value={achievement.description} onChange={(e) => handleArrayChange("achievements", i, "description", e.target.value)} rows={2} />
                  </div>
                </div>
              </ItemCard>
            ))}
          </SectionCard>

          {/* ── Submit Button ── */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-bold text-base text-background bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] hover:bg-right transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generating your Resume...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Resume PDF
              </>
            )}
          </button>
        </form>

        {/* ════════════════════════════════
            PDF PREVIEW PANEL
        ════════════════════════════════ */}
        <div className="sticky top-[73px] h-[calc(100vh-93px)]">
          <div className="glass-card h-full flex flex-col overflow-hidden">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-muted shrink-0">
              <div className="flex items-center gap-2 text-text-primary font-semibold">
                <Eye size={18} className="text-primary" />
                Resume Preview
              </div>
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  download={`${formData.fullName || "resume"}-resume.pdf`}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all text-sm font-medium"
                >
                  <Download size={14} /> Download
                </a>
              )}
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-hidden p-3">
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  title="Resume Preview"
                  className="w-full h-full rounded-xl border border-border-muted/50"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-text-secondary">
                  {loading ? (
                    <>
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                        <Sparkles size={20} className="absolute inset-0 m-auto text-primary" />
                      </div>
                      <p className="text-sm">Crafting your resume...</p>
                    </>
                  ) : (
                    <>
                      <div className="w-32 h-40 rounded-xl border-2 border-dashed border-border-muted flex items-center justify-center">
                        <FileText size={40} className="text-border-muted" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-text-secondary">Your resume preview will appear here</p>
                        <p className="text-xs text-text-secondary/60 mt-1">Fill in the form and click Generate</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResumeGenerator;