import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from './productsSlice';

interface Invoice {
    serialNumber: string;
    customerName: string;
    product: Product;
    tax: number;
    totalAmount: number;
    date: string;
}

interface InvoicesState {
    invoices: Invoice[];
    loading: boolean;
    error: string | null;
}

const initialState: InvoicesState = {
    invoices: [],
    loading: false,
    error: null
};

const invoicesSlice = createSlice({
    name: 'invoices',
    initialState,
    reducers: {
        // Basic CRUD operations
        addInvoice: (state, action: PayloadAction<Invoice>) => {
            state.invoices.push(action.payload);
        },
        updateInvoice: (state, action: PayloadAction<Invoice>) => {
            const index = state.invoices.findIndex(
                invoice => invoice.serialNumber === action.payload.serialNumber
            );
            if (index !== -1) {
                state.invoices[index] = action.payload;
            }
        },
        deleteInvoice: (state, action: PayloadAction<string>) => {
            state.invoices = state.invoices.filter(
                invoice => invoice.serialNumber !== action.payload
            );
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
});

// Export actions
export const {
    addInvoice,
    updateInvoice,
    deleteInvoice,
    setLoading,
    setError
} = invoicesSlice.actions;

// Selectors
export const selectAllInvoices = (state: { invoices: InvoicesState }) => state.invoices.invoices;
export const selectLoading = (state: { invoices: InvoicesState }) => state.invoices.loading;
export const selectError = (state: { invoices: InvoicesState }) => state.invoices.error;

export default invoicesSlice.reducer;
