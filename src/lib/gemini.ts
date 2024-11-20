import { getVertexAI, getGenerativeModel, Part, Schema } from "firebase/vertexai";
import { firebaseApp } from "./firebase";
import { Invoice } from "@/store/slices/invoicesSlice";

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


export async function run(fileList: FileList): Promise<{ invoices: Invoice[] }> {
    if (!fileList) return { invoices: [] };

    const prompt = "Generate JSON from the following data:";

    const imageParts: Part[] = [];
    const pdfParts: Part[] = [];

    // Separate files based on type
    await Promise.all([...fileList].map(async (file) => {
        console.log(file.type);
        
        const part = await fileToGenerativePart(file);
        if (file.type.startsWith("image/")) {
            imageParts.push(part as Part);
        } else if (file.type === "application/pdf") {
            pdfParts.push(part as Part);
        }
    }));

    const invoices = []; // Array to hold all invoices

    // Process image parts
    if (imageParts.length) {
        const imageResult = await model.generateContent([prompt, ...imageParts]);
        const imageResponseText = await imageResult.response.text();
        try {
            const imageResponse = JSON.parse(imageResponseText);
            if (imageResponse?.invoices?.length) {
                invoices.push(...imageResponse.invoices);
            }
        } catch (error) {
            console.error("Error parsing image response:", error);
        }
    }

    // Process PDF parts
    if (pdfParts.length) {
        const pdfResult = await model.generateContent([prompt, ...pdfParts]);
        const pdfResponseText = await pdfResult.response.text();
        try {
            const pdfResponse = JSON.parse(pdfResponseText);
            if (pdfResponse?.invoices?.length) {
                invoices.push(...pdfResponse.invoices);
            }
        } catch (error) {
            console.error("Error parsing PDF response:", error);
        }
    }

    // Return the combined result
    return { invoices };
}
