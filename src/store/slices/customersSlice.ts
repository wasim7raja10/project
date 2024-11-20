import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Customer {
    id: string;
    name: string;
    phoneNumber: string;
    totalPurchaseAmount: number;
    // Additional useful fields
    email?: string;
    address?: string;
    lastPurchaseDate?: string;
    status: 'active' | 'inactive';
    numberOfOrders: number;
}

interface CustomersState {
    customers: Customer[];
    loading: boolean;
    error: string | null;
}

const initialState: CustomersState = {
    customers: [],
    loading: false,
    error: null
};

const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        addCustomer: (state, action: PayloadAction<Customer>) => {
            state.customers.push(action.payload);
        },
        updateCustomer: (state, action: PayloadAction<Customer>) => {
            const index = state.customers.findIndex(
                customer => customer.id === action.payload.id
            );
            if (index !== -1) {
                state.customers[index] = action.payload;
            }
        },
        deleteCustomer: (state, action: PayloadAction<string>) => {
            state.customers = state.customers.filter(
                customer => customer.id !== action.payload
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

export const {
    addCustomer,
    updateCustomer,
    deleteCustomer,
    setLoading,
    setError
} = customersSlice.actions;

export const selectAllCustomers = (state: { customers: CustomersState }) => state.customers.customers;
export const selectLoading = (state: { customers: CustomersState }) => state.customers.loading;
export const selectError = (state: { customers: CustomersState }) => state.customers.error;

export default customersSlice.reducer;