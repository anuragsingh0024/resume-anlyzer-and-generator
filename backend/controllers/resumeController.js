import Resume from "../models/Resume.model.js";
import { analyzeResume } from "../utils/anlyzeResume.js";
import { extractTextFromDocx, extractTextFromPDF } from "../utils/exctractText.js";
import { uploadResumeToCloudinary } from "../utils/uploadToCloudinary.js";
import User from '../models/User.model.js'
import PDFDocument from "pdfkit";

export const uploadResume = async (req, res) => {
    let resumeText = "";
    try {
        const file = req.files?.file;

        if (!file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const fileName = file.name || "";
        const isPdf = fileName.toLowerCase().endsWith(".pdf") || file.mimetype === "application/pdf";
        const isDocx = fileName.toLowerCase().endsWith(".docx") || fileName.toLowerCase().endsWith(".doc");

        // 1. Extract text directly from local temp file / buffer
        if (isPdf) {
            resumeText = await extractTextFromPDF(file.tempFilePath || file.data);
        } else if (isDocx) {
            resumeText = await extractTextFromDocx(file.tempFilePath || file.data);
        }

        // 2. Upload to Cloudinary in background (non-blocking for analysis)
        let cloudinaryResult = null;
        try {
            cloudinaryResult = await uploadResumeToCloudinary(file);
            // Fallback text extraction from Cloudinary URL if local extraction was empty
            if (!resumeText && cloudinaryResult?.success && cloudinaryResult?.url) {
                if (isPdf) {
                    resumeText = await extractTextFromPDF(cloudinaryResult.url);
                } else if (isDocx) {
                    resumeText = await extractTextFromDocx(cloudinaryResult.url);
                }
            }
        } catch (cloudErr) {
            console.warn("Cloudinary upload warning:", cloudErr.message);
        }

        if (!resumeText || !resumeText.trim()) {
            return res.status(400).json({
                success: false,
                message: "Could not extract text from document. Please ensure it is a valid, non-scanned PDF or Word file."
            });
        }

        try {
            const result = await analyzeResume(resumeText);

            if (!result || typeof result !== "object") {
                return res.status(500).json({ success: false, message: "AI resume analysis failed to generate structured data." });
            }


            let userId = null;
            if (req.user) {
                userId = req.user.id;
            }

            let isGuest = false;
            if (!userId) {
                isGuest = true;
            }
            let tempId = null;
            if (isGuest) {
                tempId = Date.now();
            }


            //save whole data into db
            const newResume = await Resume.create({
                userId: isGuest ? null : userId,

                title: result?.personalInfo?.name || "Untitled Resume",

                extractedText: resumeText,

                analysis: {
                    personalInfo: {
                        name: result?.personalInfo?.name || "",
                        email: result?.personalInfo?.email || "",
                        phone: result?.personalInfo?.phone || "",
                        location: result?.personalInfo?.location || "",
                        linkedin: result?.personalInfo?.linkedin || "",
                        github: result?.personalInfo?.github || "",
                    },

                    profileMatch: {
                        role: result?.profileMatch?.role || "",
                        score: result?.profileMatch?.score || 0,
                        level: result?.profileMatch?.level || "",
                    },

                    ats: {
                        score: result?.ats?.score || 0,
                        label: result?.ats?.label || "",
                    },

                    skills: {
                        detected: result?.skills?.detected || [],
                        missing: result?.skills?.missing || [],
                    },

                    keywords: {
                        found: result?.keywords?.found || 0,
                        importantMissing: result?.keywords?.importantMissing || [],
                    },

                    education: result?.education || [],

                    experience: result?.experience || [],

                    projects: result?.projects || [],

                    recommendations: result?.recommendations || [],
                },

                meta: {
                    uploadType: isGuest ? "guest" : "user",
                },

                tempId: isGuest ? tempId : null,
            });

            if (!isGuest) {
                await User.updateOne({ _id: req.user.id }, { activeResume: newResume._id })
            }


            return res.status(201).json({ success: true, data: newResume });





        } catch (err) {
            console.error("Resume Analysis Error:", err.message);
            return res.status(500).json({ success: false, message: err.message || "Resume analysis failed" });
        }



    } catch (error) {
        console.error("Resume Upload Error:", error.message);
        return res.status(500).json({ success: false, message: error.message || "Resume upload failed" });
    }


}


export const getActiveResumeGuest = async (req, res) => {
    try {
        const { tempId } = req.params;
        if (!tempId) {
            return res.status(400).json({ success: false, message: "No tempId provided" });
        }
        const resume = await Resume.findOne({
            $or: [{ tempId: String(tempId) }, { tempId: Number(tempId) }]
        });
        if (!resume) {
            return res.status(404).json({ success: false, message: "Resume not found" });
        }
        return res.status(200).json({ success: true, data: resume });
    } catch (error) {
        console.error("Resume Fetch Error:", error.message);
        return res.status(500).json({ success: false, message: "Resume fetch failed" });
    }
}

export const updateGuestToUser = async (req, res) => {
    try {
        const { tempId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(404).json({
                success: false,
                message: "User id not found"
            });
        }
        if (!tempId || tempId === "null" || tempId === "undefined") {
            return res.status(400).json({ success: false, message: "No tempId provided" });
        }
        const resume = await Resume.findOne({
            $or: [{ tempId: String(tempId) }, { tempId: Number(tempId) }]
        });
        if (!resume) {
            return res.status(404).json({ success: false, message: "Resume not found" });
        }
        const updatedResume = await Resume.findByIdAndUpdate(
            resume._id,
            { userId, meta: { uploadType: "user" }, tempId: null },
            { new: true }
        );

        await User.findByIdAndUpdate(userId, { activeResume: updatedResume._id });
        return res.status(200).json({ success: true, data: updatedResume });
    } catch (error) {
        console.error("Resume Update Error:", error.message);
        return res.status(500).json({ success: false, message: "Resume update failed" });
    }
}

export const getActiveResumeUser = async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let resume = null;
        if (user.activeResume) {
            resume = await Resume.findById(user.activeResume);
        }

        // If no active resume set, auto-fallback to the latest resume uploaded by this user
        if (!resume) {
            resume = await Resume.findOne({ userId }).sort({ createdAt: -1 });
            if (resume) {
                await User.findByIdAndUpdate(userId, { activeResume: resume._id });
            }
        }

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "No active resume found"
            });
        }

        return res.status(200).json({ success: true, data: resume });
    } catch (error) {
        console.error("Resume Fetch Error:", error.message);
        return res.status(500).json({ success: false, message: "Resume fetch failed" });
    }
}


export const anlyzeResume = async (req, res) => {
    try {
        const { resumeText } = req.body;
        if (!resumeText) {
            return res.status(400).json({ success: false, message: "No resume text provided" });
        }
        const result = await analyzeResume(resumeText);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Resume Analysis Error:", error.message);
        return res.status(500).json({ success: false, message: "Resume analysis failed" });
    }
}


//In use for admin all resume
export const getAllResume = async (req, res) => {
    const resumes = await Resume.find({});

    if (!resumes) {
        return res.status(404).json({
            success: false,
            message: "No resume found"
        })
    }

    return res.status(200).json({
        success: true,
        message: "Resume fetched",
        resumes
    })
}

//In use for resume history in user profile

export const getAllResumeByUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const resumes = await Resume.find({ userId: userId });
        if (!resumes) {
            return res.status(404).json({
                success: false,
                message: "No resume found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Resume fetched",
            resumes
        })
    } catch (error) {
        console.error("Resume Fetch Error:", error.message);
        return res.status(500).json({ success: false, message: "Resume fetch failed" });
    }
}


///In use for making active resume from resume history
export const makeActiveResume = async (req, res) => {
    try {
        const userId = req.user.id;
        const { resumeId } = req.body

        if (!userId) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (!resumeId) {
            return res.status(400).json({
                success: false,
                message: "Resume id not found"
            })
        }

        await User.findByIdAndUpdate(userId, { activeResume: resumeId })

        return res.status(200).json({
            success: true,
            message: 'Resume set active successfully'
        })


    } catch (err) {
        console.log('err in making active resume: ', err.message)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}


// helper function
const checkArray = (arr) => Array.isArray(arr) && arr.length > 0;

export const resumeGenerator = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      github,
      linkedin,
      portfolio,
      address,
      summary,
      education,
      experience,
      projects,
      skills,
      achievements,
    } = req.body;

    // =========================
    // REQUIRED VALIDATION
    // =========================

    if (!fullName) {
      return res.status(400).json({ success: false, message: "Full name is required" });
    }
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // =========================
    // HELPERS
    // =========================

    const LEFT_MARGIN = 50;
    const RIGHT_MARGIN = 545;
    const PAGE_WIDTH = RIGHT_MARGIN - LEFT_MARGIN;

    // Draw section heading matching the resume image style
    const drawSection = (doc, title) => {
      doc
        .fontSize(13)
        .font("Times-Bold")
        .fillColor("#1a1a2e")
        .text(title, LEFT_MARGIN, doc.y);

      // Underline stroke
      doc
        .moveTo(LEFT_MARGIN, doc.y + 1)
        .lineTo(RIGHT_MARGIN, doc.y + 1)
        .lineWidth(0.8)
        .strokeColor("#333")
        .stroke();

      doc.moveDown(0.5);
    };

    // =========================
    // PDF INIT
    // =========================

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fullName.replace(/\s+/g, "_")}-resume.pdf"`,
        "Content-Length": pdfData.length,
      });
      return res.end(pdfData);
    });

    // =========================
    // HEADER — Name
    // =========================

    doc
      .fontSize(22)
      .font("Times-Bold")
      .fillColor("#000000")
      .text(fullName, { align: "center" });

    doc.moveDown(0.2);

    // Contact line (coloured in dark blue-grey, matching image)
    const contactParts = [phone, email, github, linkedin, portfolio, address].filter(Boolean);
    if (contactParts.length > 0) {
      doc
        .fontSize(9.5)
        .font("Times-Roman")
        .fillColor("#2c3e7a")
        .text(contactParts.join("  |  "), { align: "center" });
    }

    doc.moveDown(0.8);

    // =========================
    // PERSONAL SUMMARY
    // =========================

    if (summary) {
      drawSection(doc, "Personal Summary");
      doc
        .fontSize(10)
        .font("Times-Roman")
        .fillColor("#111111")
        .text(summary, LEFT_MARGIN, doc.y, { align: "justify", width: PAGE_WIDTH });
      doc.moveDown(0.8);
    }

    // =========================
    // EDUCATION
    // =========================

    if (checkArray(education)) {
      drawSection(doc, "Education");

      education.forEach((edu) => {
        const { institute, degree, field, startYear, endYear, percentage, location } = edu;

        // Institute (bold) ——————— Location (right)
        if (institute) {
          const instY = doc.y;
          doc.fontSize(10.5).font("Times-Bold").fillColor("#000").text(institute, LEFT_MARGIN, instY, { continued: true });
          doc.font("Times-Roman").text(location || "", { align: "right" });
        }

        // Degree (italic) ——————— Year range (italic right)
        const degreeText = [degree, field ? `(${field})` : ""].filter(Boolean).join(", ");
        if (degreeText) {
          doc.fontSize(9.5).font("Times-Italic").fillColor("#333").text(degreeText, LEFT_MARGIN, doc.y, { continued: true });
          doc.font("Times-Italic").text(`${startYear || ""} – ${endYear || ""}`, { align: "right" });
        }

        if (percentage) {
          doc.fontSize(9).font("Times-Roman").fillColor("#555").text(`Score: ${percentage}`);
        }

        doc.moveDown(0.6);
      });

      doc.moveDown(0.3);
    }

    // =========================
    // EXPERIENCE
    // =========================

    if (checkArray(experience)) {
      drawSection(doc, "Experience");

      experience.forEach((exp) => {
        const { role, company, duration, location, workType, description, technologies } = exp;

        // Role ——————— Duration
        if (role) {
          doc.fontSize(10.5).font("Times-Bold").fillColor("#000").text(role, LEFT_MARGIN, doc.y, { continued: true });
          doc.font("Times-Roman").text(duration || "", { align: "right" });
        }

        // Company | WorkType | Location
        const compLine = [company, workType, location].filter(Boolean).join("  |  ");
        if (compLine) {
          doc.fontSize(9.5).font("Times-Italic").fillColor("#444").text(compLine, LEFT_MARGIN);
        }

        // Bullet points (dash style like the image)
        if (checkArray(description)) {
          description.forEach((point) => {
            if (point.trim()) {
              doc
                .fontSize(9.5)
                .font("Times-Roman")
                .fillColor("#222")
                .text(`\u2013  ${point.trim()}`, LEFT_MARGIN + 10, doc.y, { width: PAGE_WIDTH - 10 });
            }
          });
        }

        // Technologies
        if (checkArray(technologies)) {
          doc
            .fontSize(9)
            .font("Times-Italic")
            .fillColor("#555")
            .text(`Technologies: ${technologies.join(", ")}`, LEFT_MARGIN);
        }

        doc.moveDown(0.6);
      });

      doc.moveDown(0.3);
    }

    // =========================
    // PROJECTS
    // =========================

    if (checkArray(projects)) {
      drawSection(doc, "Projects");

      projects.forEach((project) => {
        const { title, techStack, year, githubLink, liveLink, description } = project;

        // Title ——————— Year
        if (title) {
          doc.fontSize(10.5).font("Times-Bold").fillColor("#000").text(title, LEFT_MARGIN, doc.y, { continued: true });
          doc.font("Times-Roman").text(year || "", { align: "right" });
        }

        // Tech Stack (italic)
        if (checkArray(techStack)) {
          doc.fontSize(9.5).font("Times-Italic").fillColor("#444").text(techStack.join(", "), LEFT_MARGIN);
        }

        // Bullet descriptions
        if (checkArray(description)) {
          description.forEach((point) => {
            if (point.trim()) {
              doc
                .fontSize(9.5)
                .font("Times-Roman")
                .fillColor("#222")
                .text(`\u2013  ${point.trim()}`, LEFT_MARGIN + 10, doc.y, { width: PAGE_WIDTH - 10 });
            }
          });
        }

        // GitHub / Live links
        if (githubLink) {
          doc
            .fontSize(9)
            .font("Times-Roman")
            .fillColor("#1a56db")
            .text(`\u2013  GitHub: ${githubLink}`, LEFT_MARGIN + 10, doc.y, { link: githubLink, underline: true });
          doc.fillColor("#000");
        }

        if (liveLink) {
          doc
            .fontSize(9)
            .font("Times-Roman")
            .fillColor("#1a56db")
            .text(`\u2013  Live: ${liveLink}`, LEFT_MARGIN + 10, doc.y, { link: liveLink, underline: true });
          doc.fillColor("#000");
        }

        doc.moveDown(0.6);
      });

      doc.moveDown(0.3);
    }

    // =========================
    // SKILLS
    // =========================

    const hasSkills =
      skills &&
      typeof skills === "object" &&
      Object.values(skills).some((v) => checkArray(v));

    if (hasSkills) {
      drawSection(doc, "Skills Summary");

      Object.entries(skills).forEach(([key, value]) => {
        if (checkArray(value)) {
          doc.fontSize(10).font("Times-Bold").fillColor("#000").text(`${key}: `, LEFT_MARGIN, doc.y, { continued: true });
          doc.font("Times-Roman").fillColor("#222").text(value.join(", "), { continued: false });
          doc.moveDown(0.25);
        }
      });

      doc.moveDown(0.5);
    }

    // =========================
    // ACHIEVEMENTS
    // =========================

    if (checkArray(achievements)) {
      drawSection(doc, "Leadership and Achievements");

      achievements.forEach((item) => {
        const { title, year, description } = item;

        if (title) {
          doc.fontSize(10.5).font("Times-Bold").fillColor("#000").text(title, LEFT_MARGIN, doc.y, { continued: true });
          doc.font("Times-Roman").text(year || "", { align: "right" });
        }

        if (description) {
          doc
            .fontSize(9.5)
            .font("Times-Italic")
            .fillColor("#333")
            .text(description, LEFT_MARGIN, doc.y, { width: PAGE_WIDTH });
        }

        doc.moveDown(0.5);
      });
    }

    // =========================
    // END PDF
    // =========================

    doc.end();
  } catch (error) {
    console.error("Resume Generation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Resume generation failed",
      error: error.message,
    });
  }
};
