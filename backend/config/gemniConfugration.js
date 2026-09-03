import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const getModel = (modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash") => {
    return genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
            responseMimeType: "application/json",
        },
    });
};

const model = getModel();

export default model;