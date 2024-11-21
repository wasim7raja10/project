import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { useProcessInvoiceMutation } from "@/services/invoiceApi";
import { useDispatch } from "react-redux";
import { addInvoices } from "@/store/slices/invoicesSlice";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

const createFileList = (files: File[]): FileList => {
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    return dataTransfer.files;
};

export default function InputContainer() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

    const [processInvoice, { data, isLoading, error }] = useProcessInvoiceMutation();

    const handleUpload = async () => {
        if (!selectedFiles.length) return;

        try {
            await processInvoice(createFileList(selectedFiles));
            // Optional: Clear files after successful upload
            setSelectedFiles([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            console.error('Upload failed:', err);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        // Merge new files with existing ones, avoiding duplicates
        const newFiles = Array.from(files);
        setSelectedFiles(prevFiles => {
            const existingFileNames = new Set(prevFiles.map(f => f.name));
            const uniqueNewFiles = newFiles.filter(file => !existingFileNames.has(file.name));
            return [...prevFiles, ...uniqueNewFiles];
        });
    };

    useEffect(() => {
        if (data) {
            toast("Invoices processed successfully");
            dispatch(addInvoices(data));
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            toast.error("Error processing invoices");
        }
    }, [error]);

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));

        // Reset input value to allow re-uploading the same file
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="mb-4">
            <Input
                type="file"
                onChange={handleFileSelect}
                accept=".xlsx,.xls,.pdf,image/*"
                ref={fileInputRef}
                className="mb-2"
                disabled={isLoading}
                multiple
            />

            {selectedFiles && selectedFiles.length > 0 && (
                <div className="text-sm text-gray-600">
                    <p>Selected files ({selectedFiles.length}):</p>
                    <ul className="list-disc pl-4 mt-2">
                        {Array.from(selectedFiles).map((file, index) => (
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



            <Button
                onClick={handleUpload}
                disabled={!selectedFiles}
                className="w-full"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center">
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Processing {Array.from(selectedFiles || []).length} file(s)...
                    </span>
                ) : (
                    `Upload ${selectedFiles ? Array.from(selectedFiles).length : 0} file(s)`
                )}
            </Button>
        </div >
    );
}