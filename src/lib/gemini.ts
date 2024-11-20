import { getVertexAI, getGenerativeModel, Part, Schema } from "firebase/vertexai";
import { firebaseApp } from "./firebase";

const vertexAI = getVertexAI(firebaseApp);

const invoiceJSONSchema = Schema.object({
    properties: {
        invoices: Schema.array({
            items: Schema.object({
                properties: {
                    serialNumber: Schema.string(),
                    date: Schema.string(),
                    totalAmount: Schema.number(),
                    totalTax: Schema.number(),

                    products: Schema.array({
                        items: Schema.object({
                            properties: {
                                name: Schema.string(),
                                quantity: Schema.number(),
                                unitPrice: Schema.number(),
                                tax: Schema.number(),
                                priceWithTax: Schema.number(),
                                discount: Schema.number(),
                            }
                        })
                    }),

                    customer: Schema.object({
                        properties: {
                            name: Schema.string(),
                            phoneNumber: Schema.string(),
                        }
                    })
                }
            })
        })
    }
});

export const model = getGenerativeModel(vertexAI, {
    model: "gemini-1.5-flash", generationConfig: {
        responseSchema: invoiceJSONSchema,
        responseMimeType: "application/json"
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


export async function run(fileList: FileList) {
    // Provide a text prompt to include with the image
    const prompt = "Generate JSON from the following invoice:";

    if (!fileList) return;

    // Prepare images for input
    const imageParts = await Promise.all(
        [...fileList].map(fileToGenerativePart)
    );

    // To generate text output, call generateContent with the text and images
    const result = await model.generateContent([prompt, ...imageParts as Part[]]);

    const response = result.response;
    const text = response.text();
    return text;
}
