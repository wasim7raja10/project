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
        deleteInvoice: (state, action: PayloadAction<string>) => {
            return state.filter(invoice => invoice.serialNumber !== action.payload);
        },
        updateInvoice: (state, action: PayloadAction<{ invoice: Invoice, serialNumber: string }>) => {
            const index = state.findIndex(invoice => invoice.serialNumber === action.payload.serialNumber);
            if (index !== -1) {
                state[index] = action.payload.invoice;
            }
        },
        deleteProduct: (state, action: PayloadAction<{
            invoiceSerialNumber: string;
            productName: string;
        }>) => {
            const index = state.findIndex(invoice => invoice.serialNumber === action.payload.invoiceSerialNumber);
            if (index !== -1) {
                state[index].products = state[index].products.filter(product => product.name !== action.payload.productName);
            }
        },
        updateProduct: (state, action: PayloadAction<{
            productPayload: Product
            productLocation: {
                invoiceSerialNumber: string
                productName: string
            }
        }>) => {
            const invoiceIndex = state.findIndex(invoice => invoice.serialNumber === action.payload.productLocation.invoiceSerialNumber);
            const productIndex = state[invoiceIndex].products.findIndex(product => product.name === action.payload.productLocation.productName);
            if (invoiceIndex !== -1 && productIndex !== -1) {
                state[invoiceIndex].products[productIndex] = action.payload.productPayload;
            }
        },
        deleteCustomer: (state, action: PayloadAction<string>) => {
            const index = state.findIndex(invoice => invoice.serialNumber === action.payload);
            if (index !== -1) {
                state[index].customer = { name: '', phoneNumber: '' };
            }
        },
        updateCustomer: (state, action: PayloadAction<Customer>) => {
            const index = state.findIndex(invoice => invoice.customer.name === action.payload.name);
            if (index !== -1) {
                state[index].customer = action.payload;
            }
        },
    }
});

// Export actions
export const {
    addInvoice,
    addInvoices,
    deleteInvoice,
    updateInvoice,
    deleteProduct,
    updateProduct,
    deleteCustomer,
    updateCustomer,
} = invoicesSlice.actions;

// Selectors
export const selectAllInvoices = (state: RootState) => state.invoices;

export default invoicesSlice.reducer;
