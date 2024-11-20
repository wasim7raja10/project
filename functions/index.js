import { onRequest } from "firebase-functions/v2/https";
import logger from "firebase-functions/logger";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import * as XLSX from 'xlsx';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { PROMPT } from "./helper/prompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

export const extractInvoiceData = onRequest({
    cors: true,
}, async (req, res) => {
    let tempFilePath = null;
    let fileUri = null;

    try {
        const { fileData, fileType } = req.body;

        if (!fileData || !fileType) {
            res.status(400).send({ error: "Missing file type or data" });
            return;
        }

        let content;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        // Handle different file types
        if (fileType === 'application/pdf' || fileType.startsWith('image/')) {
            try {
                const fileBuffer = Buffer.from(fileData, 'base64');
                const extension = fileType.split('/')[1];
                tempFilePath = path.join(os.tmpdir(), `temp-${Date.now()}.${extension}`);

                fs.writeFileSync(tempFilePath, fileBuffer);

                const uploadResponse = await fileManager.uploadFile(tempFilePath, {
                    mimeType: fileType,
                    displayName: `Invoice-${Date.now()}`,
                });

                fileUri = uploadResponse.file.uri;
                content = {
                    fileData: {
                        mimeType: uploadResponse.file.mimeType,
                        fileUri: fileUri,
                    }
                };
            } finally {
                // Clean up temporary file
                if (tempFilePath && fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }
            }
        } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
            try {
                // Convert Excel to CSV with better options
                const workbook = XLSX.read(Buffer.from(fileData, 'base64'), {
                    type: 'buffer',
                    cellDates: true,  // Properly handle dates
                    dateNF: 'yyyy-mm-dd'  // Date format
                });
                const csvData = [];

                // Convert each sheet to CSV with improved options
                workbook.SheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    const csv = XLSX.utils.sheet_to_csv(worksheet, {
                        blankrows: false,     // Skip empty rows
                        skipHidden: true,     // Skip hidden rows/columns
                        rawNumbers: true,     // Keep raw numbers
                        dateNF: 'yyyy-mm-dd', // Date format
                        strip: true,          // Remove trailing spaces
                        // Include headers and all data
                        range: XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
                    });

                    // Only add non-empty sheets
                    if (csv.trim()) {
                        csvData.push(`Sheet: ${sheetName}\n${csv}`);
                    }
                });

                // Create a CSV file with UTF-8 BOM for Excel compatibility
                const csvContent = '\ufeff' + csvData.join('\n\n---\n\n');
                tempFilePath = path.join(os.tmpdir(), `temp-${Date.now()}.csv`);
                fs.writeFileSync(tempFilePath, csvContent, 'utf8');

                // Upload CSV file
                const uploadResponse = await fileManager.uploadFile(tempFilePath, {
                    mimeType: 'text/csv',
                    displayName: `Invoice-${Date.now()}.csv`,
                });

                fileUri = uploadResponse.file.uri;
                content = {
                    fileData: {
                        mimeType: uploadResponse.file.mimeType,
                        fileUri: fileUri,
                    }
                };
            } finally {
                // Clean up temporary file
                if (tempFilePath && fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }
            }
        } else {
            res.status(400).send({ error: "Unsupported file type" });
            return;
        }

        // Generate content using Gemini
        const result = await model.generateContent([
            { text: PROMPT },
            content
        ]);

        const response = result.response;
        const textResponse = response.text();

        // Clean and parse the response
        const cleanedResponse = textResponse
            .replace(/```json\n?/, '')
            .replace(/```$/, '')
            .trim();

        const parsedData = JSON.parse(cleanedResponse);

        // Clean up the uploaded file if it exists
        if (fileUri) {
            try {
                await fileManager.deleteFile(fileUri);
            } catch (deleteError) {
                console.warn('Error deleting file:', deleteError);
                // Continue execution even if file deletion fails
            }
        }

        res.status(200).send(parsedData);

    } catch (error) {
        // Clean up the uploaded file in case of error
        if (fileUri) {
            try {
                await fileManager.deleteFile(fileUri);
            } catch (deleteError) {
                console.warn('Error deleting file:', deleteError);
            }
        }

        console.error('Error processing invoice:', error);
        res.status(500).send({
            error: error instanceof Error ? error.message : "An unknown error occurred"
        });
    }
});
