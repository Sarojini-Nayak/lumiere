import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import axiosInstance from "../utils/axiosInstance";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      navigate("/reset-password", { state: { userId: res.data.userId } });
    } catch (err) {
      setError(err.response?.data?.message || "No account found with this email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="We'll send a code to reset it.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body focus:outline-none focus:border-champagne transition-colors"
        />
        {error && <p className="text-red-500 text-[13px] font-body">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-3 bg-noir text-ivory py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-noir/90 transition-colors disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Code"}
        </button>
      </form>
      <p className="font-body text-noir/50 text-[13px] mt-6 text-center">
        <Link to="/login" className="text-champagne hover:underline underline-offset-4">
          Back to Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;
