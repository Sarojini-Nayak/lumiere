import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [], // array of product IDs currently in the wishlist
  },
  reducers: {
    setWishlistIds: (state, action) => {
      state.items = action.payload || [];
    },
    clearWishlistState: (state) => {
      state.items = [];
    },
  },
});

export const { setWishlistIds, clearWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
