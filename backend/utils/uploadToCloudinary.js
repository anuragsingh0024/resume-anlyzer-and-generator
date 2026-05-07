import cloudinary from "cloudinary";

import path from "path";

// Allowed resume types
const supportedTypes = ["pdf", "doc", "docx"];

export const uploadResumeToCloudinary = async (file) => {
    try {
        // Extract extension
        const fileExt = path.extname(file.name).toLowerCase().replace(".", "");

        // Validate file type
        if (!supportedTypes.includes(fileExt)) {
            return { success: false, message: "Only PDF/DOC/DOCX allowed" };
        }

        // Upload to Cloudinary
        const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "resumes",
            type: "upload",
            resource_type: "raw", // 🔥 VERY IMPORTANT
            public_id: file.name + Date.now() + `.${fileExt}`,
        });

        return {
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            type: fileExt

        };

    } catch (error) {
        console.error("Cloudinary Resume Upload Error:", error);
        return { success: false, message: "Resume upload failed" };
    }
};