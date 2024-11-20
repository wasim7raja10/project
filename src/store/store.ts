import { configureStore } from '@reduxjs/toolkit';
import invoicesReducer from './slices/invoicesSlice';
import productsReducer from './slices/productsSlice';
import customersReducer from './slices/customersSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        invoices: invoicesReducer,
        products: productsReducer,
        customers: customersReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;