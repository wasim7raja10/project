import { getVertexAI, getGenerativeModel, Part, Schema } from "firebase/vertexai";
import { firebaseApp } from "./firebase";

const vertexAI = getVertexAI(firebaseApp);

export const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

const jsonSchema = Schema.object({
    properties: {
        characters: Schema.array({
            items: Schema.object({
                properties: {
                    name: Schema.string(),
                    accessory: Schema.string(),
                    age: Schema.number(),
                    species: Schema.string(),
                },
                optionalProperties: ["accessory"],
            }),
        }),
    }
});


// Converts a File object to a Part object.
// Converts a File object to a Part object.
async function fileToGenerativePart(file: File) {
    const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string)?.split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
}


export async function run(fileInputEl: HTMLInputElement) {
    // Provide a text prompt to include with the image
    const prompt = "What's different between these pictures?";

    if (!fileInputEl.files) return;

    // Prepare images for input
    const imageParts = await Promise.all(
        Array.from(fileInputEl.files).map(fileToGenerativePart)
    );

    // To generate text output, call generateContent with the text and images
    const result = await model.generateContent([prompt, ...imageParts as Part[]]);

    const response = result.response;
    const text = response.text();
    console.log(text);

    return text;
}
