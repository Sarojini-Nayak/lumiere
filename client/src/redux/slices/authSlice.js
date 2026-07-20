import { createSlice } from "@reduxjs/toolkit";

// Only the user's display info is cached in localStorage - purely for a
// fast, non-flickery initial UI on page load. It is NOT the source of
// truth for auth state; the httpOnly cookie is, and App.jsx verifies
// against the server via /auth/me on mount and corrects this if stale.
const userFromStorage = localStorage.getItem("lumiere_user")
  ? JSON.parse(localStorage.getItem("lumiere_user"))
  : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      localStorage.setItem("lumiere_user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("lumiere_user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
