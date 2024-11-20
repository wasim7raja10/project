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

const initialState: Invoice[] = [
    {
        serialNumber: '1',
        date: '2024-01-01',
        totalAmount: 100,
        totalTax: 10,
        products: [
            {
                name: 'Product 1',
                quantity: 1,
                unitPrice: 100,
                tax: 10,
                priceWithTax: 110,
                discount: 0,
            },
        ],
        customer: { name: 'John Doe', phoneNumber: '1234567890' },
    },
];

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
