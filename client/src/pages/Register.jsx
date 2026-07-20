import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthLayout from "../layouts/AuthLayout";
import axiosInstance from "../utils/axiosInstance";
import { setCredentials } from "../redux/slices/authSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/register", form);
      dispatch(setCredentials({ user: res.data.user }));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join the house of Lumière.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="font-body text-noir/60 text-[12px] tracking-wide uppercase">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full mt-2 bg-transparent border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body focus:outline-none focus:border-champagne transition-colors"
          />
        </div>
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
          <label className="font-body text-noir/60 text-[12px] tracking-wide uppercase">Password</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
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
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="font-body text-noir/50 text-[13px] mt-6 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-champagne hover:underline underline-offset-4">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
