import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import { setCredentials } from "../../redux/slices/authSlice";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await axiosInstance.put("/users/profile", form);
      dispatch(setCredentials({ user: res.data.user, token }));
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-luxury p-6 md:p-8 max-w-lg">
      <h2 className="font-heading text-noir text-xl mb-6">Personal Information</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="font-body text-noir/60 text-[12px] tracking-wide uppercase">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full mt-2 border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body focus:outline-none focus:border-champagne"
          />
        </div>
        <div>
          <label className="font-body text-noir/60 text-[12px] tracking-wide uppercase">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full mt-2 border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body bg-noir/5 text-noir/50"
          />
        </div>
        <div>
          <label className="font-body text-noir/60 text-[12px] tracking-wide uppercase">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full mt-2 border border-noir/15 rounded-luxury px-4 py-3 text-[14px] font-body focus:outline-none focus:border-champagne"
          />
        </div>

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
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
