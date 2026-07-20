import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // send/receive the httpOnly auth cookie cross-origin
});

// If the server ever says "not authorized" (expired/cleared cookie), clear
// the stale local user state so the UI doesn't keep showing a logged-in
// state that the backend no longer honors.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
