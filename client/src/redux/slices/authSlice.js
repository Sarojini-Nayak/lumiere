import { createSlice } from "@reduxjs/toolkit";

const userFromStorage = localStorage.getItem("lumiere_user")
  ? JSON.parse(localStorage.getItem("lumiere_user"))
  : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage,
    token: localStorage.getItem("lumiere_token") || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("lumiere_user", JSON.stringify(action.payload.user));
      localStorage.setItem("lumiere_token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("lumiere_user");
      localStorage.removeItem("lumiere_token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
