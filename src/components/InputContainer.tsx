import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { getDownloadURL } from "firebase/storage";
import { useSelector } from 'react-redux';
import { RootState } from "@/strore/store";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { firebaseUpload } from "@/lib/storage";

export default function InputContainer() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [uploading, setUploading] = useState<boolean>(false);
    const [downloadURL, setDownloadURL] = useState<string>("");
    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get userId from Redux store
    const userId = useSelector((state: RootState) => state.user.userId);

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("No file selected");
            return;
        }

        // Reset states
        setError("");
        setDownloadURL("");

        setUploading(true);
        setProgress(0);

        const uploadTask = firebaseUpload(selectedFile, userId);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                console.error('Upload error:', error);
                setError("An error occurred while uploading the file.");
                setUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setDownloadURL(url);
                    setUploading(false);
                    setSelectedFile(null);
                    fileInputRef.current!.value = "";
                });
            }
        );
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Just store the selected file
            setSelectedFile(file);
            setError("");
            setDownloadURL("");
        }
    };

    const getFileIcon = (url: string) => {
        if (url.includes('.pdf')) return '📄';
        if (url.includes('.xlsx')) return '📊';
        return '🖼️';
    };

    return (<div className="mb-4">
        <Input type="file" onChange={handleFileSelect} accept=".xlsx,.pdf,image/*" ref={fileInputRef} className="mb-2" />
        <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full"
        >
            {uploading ? 'Uploading...' : 'Upload'}
        </Button>

        {uploading && (
            <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-gray-500 text-center">
                    {Math.round(progress)}% uploaded
                </p>
            </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        {downloadURL && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-green-600 font-medium mb-2">
                        File uploaded successfully!
                    </p>
                    <Button
                        onClick={() => setDownloadURL("")}
                        className=""
                        variant={"destructive"}
                    >
                        Dismiss
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <span>{getFileIcon(downloadURL)}</span>
                    <a
                        href={downloadURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm truncate"
                    >
                        View uploaded file
                    </a>
                </div>
            </div>
        )}
    </div>)
}