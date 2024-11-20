import { Invoice } from '@/store/slices/invoicesSlice';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


interface FileUploadRequest {
    files: {
        fileData: string;
        fileType: string;
    }[];
}

export const invoiceApi = createApi({
    reducerPath: 'invoiceApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://127.0.0.1:5001/gemini-extraction/us-central1/' 
    }),
    endpoints: (builder) => ({
        extractInvoiceData: builder.mutation<Invoice[], FileUploadRequest>({
            query: (payload) => ({
                url: 'extractInvoiceData',
                method: 'POST',
                body: payload,
            }),
        }),
    }),
});

export const { useExtractInvoiceDataMutation } = invoiceApi; 