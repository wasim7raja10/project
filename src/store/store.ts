import { configureStore } from '@reduxjs/toolkit';
import { invoiceApi } from '../services/invoiceApi';
import invoicesReducer from './slices/invoicesSlice';

export const store = configureStore({
    reducer: {
        invoices: invoicesReducer,
        [invoiceApi.reducerPath]: invoiceApi.reducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(invoiceApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;