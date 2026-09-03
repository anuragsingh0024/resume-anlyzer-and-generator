import model, { getModel } from "../config/gemniConfugration.js";
import { geminiPrompt } from "./geminiPrompt.js";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const candidateModels = [
    process.env.GEMINI_MODEL || "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-2.5-flash-lite",
    "gemini-3.5-flash"
];

const generateWithRetry = async (prompt) => {
    let lastError = null;

    for (const modelName of candidateModels) {
        try {
            const currentModel = getModel(modelName);
            const result = await currentModel.generateContent(prompt);
            return result.response.text();
        } catch (err) {
            lastError = err;
            console.log(`⚠️ Model ${modelName} failed (${err.message}). Trying next candidate...`);
            if (err.message && err.message.includes("503")) {
                await delay(1500);
            }
        }
    }
    throw lastError;
};

export const analyzeResume = async (resumeText) => {
    try {
        const prompt = geminiPrompt(resumeText);

        const response = await generateWithRetry(prompt);

        let clean = response
            .replace(/```json/gi, "")
            .replace(/```/gi, "")
            .trim();

        // Extract substring between first { and last }
        const firstBrace = clean.indexOf('{');
        const lastBrace = clean.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            clean = clean.substring(firstBrace, lastBrace + 1);
        }

        const data = JSON.parse(clean);
        return data;

    } catch (error) {
        console.error("Resume Analysis Error:", error.message);
        throw error;
    }
};