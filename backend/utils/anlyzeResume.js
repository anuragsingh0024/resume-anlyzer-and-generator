import model from "../config/gemniConfugration.js";
import { geminiPrompt } from "./geminiPrompt.js";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const generateWithRetry = async (prompt, retries = 3) => {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        if (retries > 0 && err.message.includes("503")) {
            console.log("⚠️ Gemini busy... retrying...");
            await delay(2000);
            return generateWithRetry(prompt, retries - 1);
        }
        throw err;
    }
};

export const analyzeResume = async (resumeText) => {
    try {
        const prompt = geminiPrompt(resumeText);

        // 🔥 ONLY CHANGE: retry added
        const response = await generateWithRetry(prompt);

        const clean = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const data = JSON.parse(clean);

        return data;

    } catch (error) {
        console.error("Resume Analysis Error:", error.message);

        return {
            success: false,
            error: error.message
        };
    }
};