import { PDFParse } from 'pdf-parse';
import axios from "axios";
import mammoth from "mammoth";

export const extractTextFromPDF = async (url) => {
    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
        });

        const buffer = Buffer.from(response.data);
        const parser = new PDFParse({ data: buffer });
        const data = await parser.getText();
        
        return data?.text || "";
    } catch (error) {
        console.error("PDF Extract Error:", error.message);
        return null;
    }
};



export const extractTextFromDocx = async (url) => {
    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
        });

        const buffer = Buffer.from(response.data);
        const doc = await mammoth.extractRawText({ buffer });
        return doc.value;

    } catch (error) {
        console.error("Docx Extract Error:", error.message);
        return null;
    }
}