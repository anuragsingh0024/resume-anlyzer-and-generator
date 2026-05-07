import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false, // guest support
    },

    title: {
        type: String,
        default: "Untitled Resume",
    },

    // 🔥 Raw extracted text (IMPORTANT)
    extractedText: {
        type: String,
    },

    // 🔥 AI structured response (MAIN DATA)
    analysis: {
        personalInfo: {
            name: String,
            email: String,
            phone: String,
            location: String,
            linkedin: String,
            github: String,
        },

        profileMatch: {
            role: String,
            score: Number,
            level: String,
        },

        ats: {
            score: Number,
            label: String,
        },

        skills: {
            detected: [String],
            missing: [String],
        },

        keywords: {
            found: Number,
            importantMissing: [String],
        },

        education: [
            {
                degree: String,
                institution: String,
                year: String,
            },
        ],

        experience: [
            {
                role: String,
                company: String,
                duration: String,
                description: String,
            },
        ],

        projects: [
            {
                name: String,
                techStack: [String],
                description: String,
            },
        ],

        recommendations: [String],
    },

    tempId: {
        type: String,
        required: false,
    },

    // 🔥 metadata (future use)
    meta: {
        uploadType: {
            type: String,
            enum: ["guest", "user"],
        },
        version: {
            type: Number,
            default: 1,
        },
    },

    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Resume", resumeSchema);