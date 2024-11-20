import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    tax: number;
    priceWithTax: number;
    discount?: number; // Optional field
}

interface ProductsState {
    products: Product[];
    loading: boolean;
    error: string | null;
}

const initialState: ProductsState = {
    products: [],
    loading: false,
    error: null
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<Product>) => {
            state.products.push(action.payload);
        },
        updateProduct: (state, action: PayloadAction<Product>) => {
            const index = state.products.findIndex(
                product => product.id === action.payload.id
            );
            if (index !== -1) {
                state.products[index] = action.payload;
            }
        },
        deleteProduct: (state, action: PayloadAction<string>) => {
            state.products = state.products.filter(
                product => product.id !== action.payload
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
    addProduct,
    updateProduct,
    deleteProduct,
    setLoading,
    setError
} = productsSlice.actions;

export const selectAllProducts = (state: { products: ProductsState }) => state.products.products;
export const selectLoading = (state: { products: ProductsState }) => state.products.loading;
export const selectError = (state: { products: ProductsState }) => state.products.error;

export default productsSlice.reducer;