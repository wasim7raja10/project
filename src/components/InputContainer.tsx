import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function InputContainer() {
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
       console.log(event);
    }

    return (<div className="mb-4">
        <Input type="file" onChange={handleFileUpload} accept=".xlsx,.pdf,.jpg,.png" className="mb-2" />
        <Button>Upload File</Button>
    </div>
    )
}