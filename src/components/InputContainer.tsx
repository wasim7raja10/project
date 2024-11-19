import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function InputContainer() {
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Placeholder for file upload logic
        console.log("File uploaded:", event.target.files?.[0])
    }

    return (<div className="mb-4">
        <Input type="file" onChange={handleFileUpload} accept=".xlsx,.pdf,.jpg,.png" className="mb-2" />
        <Button>Upload File</Button>
    </div>
    )
}