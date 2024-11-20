import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { model } from "@/lib/firebase";
import * as XLSX from 'xlsx';


export default function InputContainer() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("No file selected");
            return;
        }

        try {
            const fileType = selectedFile.type;
            let content;

            // Handle different file types
            if (fileType === 'application/pdf' || fileType.startsWith('image/')) {
                content = await handleImagePdfFile(selectedFile);
            } else if (
                fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                fileType === 'application/vnd.ms-excel'
            ) {
                content = await handleExcelFile(selectedFile);
            } else {
                setError("Unsupported file type");
                return;
            }

            // Prepare prompt based on file type
            const prompt = `
                You are a document entity extraction specialist. Given a document, your task is to extract the text value of the following entities:

                {
                    "invoice": {
                        "serial_number": "string",
                        "date": "string",
                        "total_amount": "number",
                        "tax": "number"
                    },
                    "customer": {
                        "name": "string",
                        "phone_number": "string",
                        "email": "string",
                        "address": "string",
                        "status": "string",
                        "number_of_orders": "number",
                        "last_purchase_date": "string"
                    },
                    "products": [
                        {
                            "name": "string",
                            "quantity": "number",
                            "unit_price": "number",
                            "tax": "number",
                            "price_with_tax": "number",
                            "discount": "number"
                        }
                    ]
                }

               Instructions:
                - Extract only information that exists in the document
                - Do not normalize or modify any values
                - Use null for missing fields
                - Ensure all numbers are parsed as numeric values
                - Dates should be in ISO format when possible
            `;

            // Generate content using the model
            const result = await model.generateContentStream([prompt, content]);

            let response = "";

            // Handle the response stream
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                // join the chunks to form the final response
                response += chunkText;
                // You might want to update state here to show the response to the user
            }

            console.log(response);

        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error(err);
        }
    };

    // Helper function to handle Excel files
    const handleExcelFile = async (file: File): Promise<{ text: string }> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const workbook = XLSX.read(e.target?.result, { type: 'binary' });
                    let result = '';

                    workbook.SheetNames.forEach((sheetName: string) => {
                        const worksheet = workbook.Sheets[sheetName];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet);
                        result += `Sheet: ${sheetName}\n${JSON.stringify(jsonData, null, 2)}\n\n`;
                    });

                    resolve({ text: result });
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    };

    // Helper function to handle image files
    const handleImagePdfFile = async (file: File) => {
        return new Promise<{ inlineData: { data: string, mimeType: string } }>((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                const result = reader.result as string;
                const base64Data = result.split(',')[1];
                resolve({
                    inlineData: {
                        data: base64Data,
                        mimeType: file.type
                    }
                });
            };

            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Just store the selected file
            setSelectedFile(file);
            setError("");
        }
    };

    return (<div className="mb-4">
        <Input type="file" onChange={handleFileSelect} accept=".xlsx,.pdf,image/*" ref={fileInputRef} className="mb-2" />
        <Button
            onClick={handleUpload}
            disabled={!selectedFile}
            className="w-full"
        >
            Upload
        </Button>



        {error && <p className="text-red-500">{error}</p>}


    </div>)
}