import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { useExtractInvoiceDataMutation } from "@/services/invoiceApi";
import { useAppDispatch } from "@/store/hooks";
import { addInvoices } from "@/store/slices/invoicesSlice";

function fileToBase64(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    });
}

export default function InputContainer() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();

    const [extractInvoiceData, { isLoading: isProcessing }] = useExtractInvoiceDataMutation();

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("No file selected");
            return;
        }

        try {
            const base64Data = await fileToBase64(selectedFile);
            const payload = {
                fileType: selectedFile.type,
                fileData: base64Data as string
            };

            const result = await extractInvoiceData(payload).unwrap();
            // Handle successful response here
            console.log('Invoice data:', result);

            dispatch(addInvoices(result));
        } catch (error) {
            console.error('Error extracting invoice data:', error);
            setError('Failed to process invoice');
        }
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
        <Input
            type="file"
            onChange={handleFileSelect}
            accept=".xlsx,.pdf,image/*"
            ref={fileInputRef}
            className="mb-2"
            disabled={isProcessing}
        />
        <Button
            onClick={handleUpload}
            disabled={!selectedFile || isProcessing}
            className="w-full"
        >
            {isProcessing ? 'Processing...' : 'Upload'}
        </Button>

        {error && <p className="text-red-500">{error}</p>}
    </div>)
}