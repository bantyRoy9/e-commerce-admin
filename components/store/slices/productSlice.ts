import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

interface ProductState {
  products: any[];
  loading: boolean;
}

const initialState: ProductState = {
  products: [],
  loading: false,
};

const productSlice = createSlice({
  name: "product",

  initialState,

  reducers: {
    setProducts: (
      state,
      action: PayloadAction<any[]>,
    ) => {
      state.products = action.payload;
    },

    setLoading: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setProducts,
  setLoading,
} = productSlice.actions;

export default productSlice.reducer;