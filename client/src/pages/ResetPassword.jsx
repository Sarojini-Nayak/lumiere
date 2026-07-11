import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import axiosInstance from "../utils/axiosInstance";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!userId) {
    return (
      <AuthLayout title="Reset Password">
        <p className="font-body text-noir/60 text-[14px]">
          Please start from{" "}
          <Link to="/forgot-password" className="text-champagne underline underline-offset-4">
            Forgot Password
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
      await axiosInstance.post("/auth/reset-password", { userId, otp, newPassword });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Enter the code and your new password.">
      {success ? (
        <p className="text-champagne font-body text-[14px]">
          Password reset successful. Redirecting to sign in...
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            required
            placeholder="6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full bg-transparent border border-noir/15 rounded-luxury px-4 py-3 text-center text-[18px] tracking-[0.3em] font-body focus:outline-none focus:border-champagne transition-colors"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-transparent border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body focus:outline-none focus:border-champagne transition-colors"
          />
          {error && <p className="text-red-500 text-[13px] font-body">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 bg-noir text-ivory py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-noir/90 transition-colors disabled:opacity-60"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
