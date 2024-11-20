import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { run } from '../lib/gemini';

export const invoiceApi = createApi({
  reducerPath: 'invoiceApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    processInvoice: builder.mutation<string, FileList>({
      queryFn: async (files) => {
        try {
          const result = await run(files);
          return { data: result || '' };
        } catch (error) {
          return { error: { data: error, status: 500 } };
        }
      },
    }),
  }),
});

export const { useProcessInvoiceMutation } = invoiceApi; 