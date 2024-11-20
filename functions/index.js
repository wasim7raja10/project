import { onRequest } from "firebase-functions/v2/https";
import logger from "firebase-functions/logger";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import * as XLSX from 'xlsx';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { PROMPT } from "./helper/prompt.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

export const extractInvoiceData = onRequest({
    cors: true,
}, async (req, res) => {
    const tempFiles = [];
    const fileUris = [];

    try {
        const { files } = req.body;

        if (!Array.isArray(files)) {
            res.status(400).send({ error: "Files array is required" });
            return;
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const results = [];

        // Process each file sequentially
        for (const file of files) {
            const { fileData, fileType } = file;

            if (!fileData || !fileType) {
                continue; // Skip invalid files
            }

            let content;
            let tempFilePath = null;
            let fileUri = null;

            // Handle different file types
            if (fileType === 'application/pdf' || fileType.startsWith('image/')) {
                try {
                    const fileBuffer = Buffer.from(fileData, 'base64');
                    const extension = fileType.split('/')[1];
                    tempFilePath = path.join(os.tmpdir(), `temp-${Date.now()}.${extension}`);

                    fs.writeFileSync(tempFilePath, fileBuffer);
                    tempFiles.push(tempFilePath);

                    const uploadResponse = await fileManager.uploadFile(tempFilePath, {
                        mimeType: fileType,
                        displayName: `Invoice-${Date.now()}`,
                    });

                    fileUri = uploadResponse.file.uri;
                    fileUris.push(fileUri);
                    content = {
                        fileData: {
                            mimeType: uploadResponse.file.mimeType,
                            fileUri: fileUri,
                        }
                    };
                } catch (error) {
                    console.error('Error processing PDF/Image:', error);
                    continue; // Skip to next file if this one fails
                }
            } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
                try {
                    const workbook = XLSX.read(Buffer.from(fileData, 'base64'), {
                        type: 'buffer',
                        cellDates: true,
                        dateNF: 'yyyy-mm-dd'
                    });
                    const csvData = [];

                    workbook.SheetNames.forEach(sheetName => {
                        const worksheet = workbook.Sheets[sheetName];
                        const csv = XLSX.utils.sheet_to_csv(worksheet, {
                            blankrows: false,
                            skipHidden: true,
                            rawNumbers: true,
                            dateNF: 'yyyy-mm-dd',
                            strip: true,
                            range: XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
                        });

                        if (csv.trim()) {
                            csvData.push(`Sheet: ${sheetName}\n${csv}`);
                        }
                    });

                    const csvContent = '\ufeff' + csvData.join('\n\n---\n\n');
                    tempFilePath = path.join(os.tmpdir(), `temp-${Date.now()}.csv`);
                    fs.writeFileSync(tempFilePath, csvContent, 'utf8');
                    tempFiles.push(tempFilePath);

                    const uploadResponse = await fileManager.uploadFile(tempFilePath, {
                        mimeType: 'text/csv',
                        displayName: `Invoice-${Date.now()}.csv`,
                    });

                    fileUri = uploadResponse.file.uri;
                    fileUris.push(fileUri);
                    content = {
                        fileData: {
                            mimeType: uploadResponse.file.mimeType,
                            fileUri: fileUri,
                        }
                    };
                } catch (error) {
                    console.error('Error processing Excel:', error);
                    continue; // Skip to next file if this one fails
                }
            } else {
                console.warn('Unsupported file type:', fileType);
                continue; // Skip unsupported files
            }

            try {
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
                results.push(...parsedData);
            } catch (error) {
                console.error('Error generating content:', error);
                // Add error result for this file
                results.push({
                    error: error instanceof Error ? error.message : "Failed to process file",
                    fileType
                });
            }
        }

        res.status(200).send(results);

    } catch (error) {
        console.error('Error processing invoices:', error);
        res.status(500).send({
            error: error instanceof Error ? error.message : "An unknown error occurred"
        });
    } finally {
        // Clean up all temporary files
        for (const tempFile of tempFiles) {
            if (fs.existsSync(tempFile)) {
                try {
                    fs.unlinkSync(tempFile);
                } catch (error) {
                    console.warn('Error deleting temp file:', error);
                }
            }
        }

        // Clean up all uploaded files
        for (const uri of fileUris) {
            try {
                await fileManager.deleteFile(uri);
            } catch (error) {
                console.warn('Error deleting uploaded file:', error);
            }
        }
    }
});
