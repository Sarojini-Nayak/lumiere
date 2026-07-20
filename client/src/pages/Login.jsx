import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import AuthLayout from "../layouts/AuthLayout";
import axiosInstance from "../utils/axiosInstance";
import { setCredentials } from "../redux/slices/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", form);
      dispatch(setCredentials({ user: res.data.user }));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      const res = await axiosInstance.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      dispatch(setCredentials({ user: res.data.user }));
      navigate("/");
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to continue to Lumière.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="font-body text-noir/60 text-[12px] tracking-wide uppercase">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full mt-2 bg-transparent border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body focus:outline-none focus:border-champagne transition-colors"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="font-body text-noir/60 text-[12px] tracking-wide uppercase">Password</label>
          </div>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full mt-2 bg-transparent border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body focus:outline-none focus:border-champagne transition-colors"
          />
        </div>

        {error && <p className="text-red-500 text-[13px] font-body">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-3 bg-noir text-ivory py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-noir/90 transition-colors disabled:opacity-60"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-noir/10" />
        <span className="text-noir/40 text-[12px] font-body">or</span>
        <div className="flex-1 h-px bg-noir/10" />
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google sign-in failed.")}
          theme="outline"
          shape="pill"
          width="320"
        />
      </div>

      <p className="font-body text-noir/50 text-[13px] mt-6 text-center">
        New to Lumière?{" "}
        <Link to="/register" className="text-champagne hover:underline underline-offset-4">
          Create an Account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
