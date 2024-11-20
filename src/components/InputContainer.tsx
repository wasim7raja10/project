import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { useExtractInvoiceDataMutation } from "@/services/invoiceApi";
import { useDispatch } from "react-redux";
import { addInvoices } from "@/store/slices/invoicesSlice";
import { X } from "lucide-react";

async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            }
        };
        reader.onerror = error => reject(error);
    });
}

export default function InputContainer() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

    const [extractInvoiceData, { isLoading: isProcessing }] = useExtractInvoiceDataMutation();

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setError("No files selected");
            return;
        }

        try {
            const filesData = await Promise.all(
                selectedFiles.map(async (file) => ({
                    fileData: await fileToBase64(file),
                    fileType: file.type
                }))
            );

            const result = await extractInvoiceData({ files: filesData }).unwrap();

            // Dispatch all invoices to the store
            dispatch(addInvoices(result));

            // Clear the file input after successful upload
            setSelectedFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error extracting invoice data:', error);
            setError('Failed to process invoices');
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        // Convert FileList to Array and remove duplicates  
        const fileArray = Array.from(files).filter((file, index, self) =>
            index === self.findIndex(t => t.name === file.name)
        );

        const invalidFiles = fileArray.filter(file => {
            const isValidType =
                file.type.startsWith('image/') ||
                file.type === 'application/pdf' ||
                file.type.includes('spreadsheet') ||
                file.type.includes('excel');
            return !isValidType;
        });

        if (invalidFiles.length > 0) {
            setError(`Invalid file type(s): ${invalidFiles.map(f => f.name).join(', ')}`);
            return;
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        setSelectedFiles(old => [...old, ...fileArray]);
        setError("");
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <div className="mb-4">
            <Input
                type="file"
                onChange={handleFileSelect}
                accept=".xlsx,.xls,.pdf,image/*"
                ref={fileInputRef}
                className="mb-2"
                disabled={isProcessing}
                multiple
            />

            {selectedFiles.length > 0 && (
                <div className="text-sm text-gray-600">
                    <p>Selected files ({selectedFiles.length}):</p>
                    <ul className="list-disc pl-4 mt-2">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center">
                                <li className="truncate">
                                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                </li>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(index)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </ul>
                </div>
            )}

            {
                error && (
                    <div className="text-red-500 text-sm">
                        {error}
                    </div>
                )
            }

            <Button
                onClick={handleUpload}
                disabled={isProcessing || selectedFiles.length === 0}
                className="w-full"
            >
                {isProcessing ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing {selectedFiles.length} file(s)...
                    </span>
                ) : (
                    `Upload ${selectedFiles.length || 'No'} file(s)`
                )}
            </Button>
        </div >
    );
}