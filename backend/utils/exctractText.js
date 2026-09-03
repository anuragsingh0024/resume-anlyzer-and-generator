import { PDFParse } from 'pdf-parse';
import axios from "axios";
import mammoth from "mammoth";
import fs from "fs";

export const extractTextFromPDF = async (source) => {
    try {
        let buffer;
        if (Buffer.isBuffer(source)) {
            buffer = source;
        } else if (typeof source === 'string' && (source.startsWith('http://') || source.startsWith('https://'))) {
            const response = await axios.get(source, {
                responseType: "arraybuffer",
            });
            buffer = Buffer.from(response.data);
        } else if (typeof source === 'string' && fs.existsSync(source)) {
            buffer = fs.readFileSync(source);
        } else {
            buffer = Buffer.from(source);
        }

        const parser = new PDFParse({ data: buffer });
        const data = await parser.getText();
        
        return data?.text || "";
    } catch (error) {
        console.error("PDF Extract Error:", error.message);
        return "";
    }
};

export const extractTextFromDocx = async (source) => {
    try {
        let buffer;
        if (Buffer.isBuffer(source)) {
            buffer = source;
        } else if (typeof source === 'string' && (source.startsWith('http://') || source.startsWith('https://'))) {
            const response = await axios.get(source, {
                responseType: "arraybuffer",
            });
            buffer = Buffer.from(response.data);
        } else if (typeof source === 'string' && fs.existsSync(source)) {
            buffer = fs.readFileSync(source);
        } else {
            buffer = Buffer.from(source);
        }

        const doc = await mammoth.extractRawText({ buffer });
        return doc?.value || "";
    } catch (error) {
        console.error("Docx Extract Error:", error.message);
        return "";
    }
};