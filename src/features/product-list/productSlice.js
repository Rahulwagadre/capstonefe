import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchAllProducts, fetchAllProductsByFilters } from './productAPI'

const initialState = {
    products: [],
    brands: [],
    categories: [],
    status: 'idle'
}

export const fetchAllProductsAsync = createAsyncThunk("product/getAllProduct", async() => {
    try {
        const { data } = await fetchAllProducts();
        return data;
    } catch (err) {
        console.log(err);
    }
})

export const fetchAllProductsByFiltersAsync = createAsyncThunk("product/getAllProductsByFilters", async(filter) => {
    try {
        const { data } = await fetchAllProductsByFilters(filter);
        return data;
    } catch (err) {
        console.log(err);
    }
})

// TO BE COMMENTED
// export const fetchAllProductCategoriesAsync = createAsyncThunk("product/getAllProductCategories", async() => {
//     try {
//         const { data } = await fetchAllProductCategories();
//         return data;
//     } catch (err) {
//         console.log(err);
//     }
// })

// export const fetchAllProductBrandsAsync = fetchAllProductBrands("product/getAllProductBrands", async() => {
//     try {
//         const { data } = await fetchAllProductBrands();
//         return data;
//     } catch (err) {
//         console.log(err);
//     }
// })

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        increment(state) {
            state.value++
        },
        decrement(state) {
            state.value--
        },
        incrementByAmount(state, action) {
            state.value += action.payload
        },
    },
    extraReducers: (builder) => {
        builder.
        addCase(fetchAllProductsAsync.pending, (state, action) => {
            state.status = 'loading';
        }).
        addCase(fetchAllProductsAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.products = action.payload;
            state.categories = [...new Set(action.payload.map(product => product.category))];
            state.brands = [...new Set(action.payload.map(product => product.brand))];
        }).
        addCase(fetchAllProductsByFiltersAsync.pending, (state, action) => {
            state.status = 'loading';
        }).
        addCase(fetchAllProductsByFiltersAsync.fulfilled, (state, action) => {
            state.status = 'idle';
            state.products = action.payload;
        })
    }
})
export const selectAllProducts = (state) => state.product.products;
export const selectAllCategories = (state) => state.product.categories;
export const selectAllBrands = (state) => state.product.brands;
export const { increment, decrement, incrementByAmount } = productSlice.actions;
export default productSlice.reducer;