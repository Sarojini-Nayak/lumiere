import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthLayout from "../layouts/AuthLayout";
import axiosInstance from "../utils/axiosInstance";
import { setCredentials } from "../redux/slices/authSlice";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId, email } = location.state || {};

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!userId) {
    return (
      <AuthLayout title="Verify Account">
        <p className="font-body text-noir/60 text-[14px]">
          No pending verification found.{" "}
          <Link to="/register" className="text-champagne underline underline-offset-4">
            Register again
          </Link>
          .
        </p>
      </AuthLayout>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/verify-otp", { userId, otp });
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Verify Your Email" subtitle={`Enter the 6-digit code sent to ${email || "your email"}.`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="000000"
          className="w-full bg-transparent border border-noir/15 rounded-luxury px-4 py-3 text-center text-[20px] tracking-[0.4em] font-body focus:outline-none focus:border-champagne transition-colors"
        />

        {error && <p className="text-red-500 text-[13px] font-body">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-3 bg-noir text-ivory py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-noir/90 transition-colors disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify Account"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default VerifyOtp;
