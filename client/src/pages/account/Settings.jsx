import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const Settings = () => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await axiosInstance.put("/users/change-password", form);
      setMessage({ type: "success", text: "Password updated successfully." });
      setForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-luxury p-6 md:p-8 max-w-lg">
      <h2 className="font-heading text-noir text-xl mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          required
          placeholder="Current Password"
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          className="border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body focus:outline-none focus:border-champagne"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="New Password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          className="border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body focus:outline-none focus:border-champagne"
        />
        {message && (
          <p className={`text-[13px] font-body ${message.type === "success" ? "text-champagne" : "text-red-500"}`}>
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-noir text-ivory py-3.5 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-noir/90 transition-colors disabled:opacity-60 w-fit px-8"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
