import { getVertexAI, getGenerativeModel, Part, Schema } from "firebase/vertexai";
import { firebaseApp } from "./firebase";
import { Invoice } from "@/store/slices/invoicesSlice";
import * as XLSX from 'xlsx';

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
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // Handle Excel files
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const csvData = XLSX.utils.sheet_to_csv(worksheet);
        return {
            inlineData: {
                data: btoa(csvData),
                mimeType: 'text/csv'
            },
        };
    }

    // Original code for other file types
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

    const prompt = `Generate JSON from the following data:
    - if there is no data for a field, leave it empty
    - for fields that have numbers, if there is no data, leave value as 0
    - for fields that have dates, if there is no data, leave it empty
    `;
    const invoices: Invoice[] = [];

    // Process files sequentially
    for (const file of fileList) {
        console.log(`Processing file: ${file.type}`);
        const part = await fileToGenerativePart(file);

        try {
            const result = await model.generateContent([prompt, part as Part]);
            const responseText = result.response.text();
            const response = JSON.parse(responseText);

            if (response?.invoices?.length) {
                invoices.push(...response.invoices);
            }
        } catch (error) {
            console.error(`Error processing file: ${file.name}`, error);
        }
    }

    console.log(invoices);
    return { invoices };
}
