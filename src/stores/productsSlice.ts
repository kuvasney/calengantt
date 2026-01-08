import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../types/products";

interface ProductState {
  productsList: Product[];
}

const initialState: ProductState = {
  productsList: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProductsList: (state, action: PayloadAction<Product[]>) => {
      state.productsList = action.payload;
    },
  },
});

export const { setProductsList } = productsSlice.actions;

export default productsSlice.reducer;
