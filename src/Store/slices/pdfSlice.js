import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: "ResponcecCache",
    initialState: {
        ProductDetails: [],
    },
    reducers: {
        addProduct: (state, action) => {

            if (state.ProductDetails) {
                state.ProductDetails.push(...action.payload);
            }
            state.ProductDetails = action.payload;
        },
    },
});

export const { addProduct } = authSlice.actions;
export default authSlice.reducer;
