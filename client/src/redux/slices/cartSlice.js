import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    coupon: null,
    giftWrap: false,
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items || [];
      state.coupon = action.payload.coupon || null;
      state.giftWrap = action.payload.giftWrap || false;
    },
    clearCartState: (state) => {
      state.items = [];
      state.coupon = null;
      state.giftWrap = false;
    },
  },
});

export const { setCart, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
