import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface Product {
    name: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    priceWithTax: number;
    discount: number;
}

export interface Customer {
    name: string;
    phoneNumber: string;
}

export interface Invoice {
    serialNumber: string;
    date: string;
    totalAmount: number;
    totalTax: number;
    products: Product[];
    customer: Customer;
}

const initialState: Invoice[] = [];

const invoicesSlice = createSlice({
    name: 'invoices',
    initialState,
    reducers: {
        addInvoice: (state, action: PayloadAction<Invoice>) => {
            state.push(action.payload);
        },
        addInvoices: (state, action: PayloadAction<Invoice[]>) => {
            state.push(...action.payload);
        },
    }
});

// Export actions
export const {
    addInvoice,
    addInvoices,
} = invoicesSlice.actions;

// Selectors
export const selectAllInvoices = (state: RootState) => state.invoices;

export default invoicesSlice.reducer;
