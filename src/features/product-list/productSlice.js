// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import { fetchAllProducts, fetchProductsByBrand, fetchProductsByCategory } from './productAPI'

// const initialState = {
//     products: [],
//     brands: [],
//     categories: [],
//     status: 'idle'
// }

// export const fetchAllProductsAsync = createAsyncThunk("product/getAllProduct", async() => {
//     try {
//         const { data } = await fetchAllProducts();
//         return data;
//     } catch (err) {
//         console.log(err);
//     }
// })


// const productSlice = createSlice({
//     name: 'product',
//     initialState,
//     reducers: {
//         increment(state) {
//             state.value++
//         },
//         decrement(state) {
//             state.value--
//         },
//         incrementByAmount(state, action) {
//             state.value += action.payload
//         },
//     },
//     extraReducers: (builder) => {
//         builder.
//         addCase(fetchAllProductsAsync.pending, (state, action) => {
//             state.status = 'loading';
//         }).
//         addCase(fetchAllProductsAsync.fulfilled, (state, action) => {
//             state.status = 'idle';
//             state.products = action.payload;
//             state.categories = [...new Set(action.payload.map(product => product.category))];
//             state.brands = [...new Set(action.payload.map(product => product.brand))];
//         })
        
//     }
// })
// export const selectAllProducts = (state) => state.product.products;
// export const selectAllCategories = (state) => state.product.categories;
// export const selectAllBrands = (state) => state.product.brands;
// export const { increment, decrement, incrementByAmount } = productSlice.actions;
// export default productSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { 
    fetchAllProducts, 
    fetchProductsByBrand, 
    fetchProductsByCategory,
    fetchAllProductsByFilters 
} from './productAPI';

const initialState = {
    products: [],
    brands: [],
    categories: [],
    status: 'idle',
    totalItems: 0,
    selectedBrand: null,
    selectedCategory: null
};

export const fetchAllProductsAsync = createAsyncThunk(
    "product/fetchAllProducts",
    async () => {
        try {
            const { data } = await fetchAllProducts();
            return data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
);

export const fetchProductsByBrandAsync = createAsyncThunk(
    "product/fetchByBrand",
    async (brand) => {
        try {
            const { data } = await fetchProductsByBrand(brand);
            return data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
);

export const fetchProductsByCategoryAsync = createAsyncThunk(
    "product/fetchByCategory",
    async (category) => {
        try {
            const { data } = await fetchProductsByCategory(category);
            return data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
);

export const fetchAllProductsByFiltersAsync = createAsyncThunk(
    "product/fetchByFilters",
    async ({ filter }) => {
        try {
            const { data } = await fetchAllProductsByFilters({ filter });
            return data;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setSelectedBrand: (state, action) => {
            state.selectedBrand = action.payload;
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        clearFilters: (state) => {
            state.selectedBrand = null;
            state.selectedCategory = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProductsAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllProductsAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.products = action.payload;
                state.brands = [...new Set(action.payload.map(p => p.brand))];
                state.categories = [...new Set(action.payload.map(p => p.category))];
            })
            .addCase(fetchProductsByBrandAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProductsByBrandAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.products = action.payload;
            })
            .addCase(fetchProductsByCategoryAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProductsByCategoryAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.products = action.payload;
            })
            .addCase(fetchAllProductsByFiltersAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllProductsByFiltersAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.products = action.payload;
            });
    }
});

// Selectors
export const selectAllProducts = (state) => state.product.products;
export const selectAllBrands = (state) => state.product.brands;
export const selectAllCategories = (state) => state.product.categories;
export const selectProductStatus = (state) => state.product.status;
export const selectSelectedBrand = (state) => state.product.selectedBrand;
export const selectSelectedCategory = (state) => state.product.selectedCategory;

// Actions
export const { 
    setSelectedBrand, 
    setSelectedCategory, 
    clearFilters 
} = productSlice.actions;

export default productSlice.reducer;