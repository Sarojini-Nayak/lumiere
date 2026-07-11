import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MapPin, Star, Trash2, X } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const emptyForm = {
  fullName: "", phone: "", addressLine1: "", addressLine2: "",
  city: "", state: "", postalCode: "", country: "India", isDefault: false,
};

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchAddresses = () => {
    axiosInstance.get("/users/addresses").then((res) => setAddresses(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await axiosInstance.post("/users/addresses", form);
    setAddresses(res.data);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    const res = await axiosInstance.delete(`/users/addresses/${id}`);
    setAddresses(res.data);
  };

  const setDefault = async (id) => {
    const res = await axiosInstance.put(`/users/addresses/${id}`, { isDefault: true });
    setAddresses(res.data);
  };

  if (loading) return <div className="h-40 bg-white rounded-luxury animate-pulse" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-noir text-xl">Saved Addresses</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-noir text-ivory px-4 py-2.5 rounded-luxury text-[12px] tracking-wide uppercase font-body hover:bg-noir/90 transition-colors"
        >
          <Plus size={14} strokeWidth={1.5} /> Add New
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-luxury p-10 text-center">
          <MapPin size={28} strokeWidth={1} className="text-champagne mx-auto mb-3" />
          <p className="font-body text-noir/50 text-[14px]">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr._id} className={`bg-white rounded-luxury p-5 relative ${addr.isDefault ? "ring-1 ring-champagne" : ""}`}>
              {addr.isDefault && (
                <span className="absolute top-4 right-4 text-champagne text-[10px] font-body uppercase tracking-wide flex items-center gap-1">
                  <Star size={10} className="fill-champagne" /> Default
                </span>
              )}
              <p className="font-body text-noir text-[14px]">{addr.fullName}</p>
              <p className="font-body text-noir/60 text-[13px] mt-1">
                {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}{addr.city}, {addr.state} {addr.postalCode}
              </p>
              <p className="font-body text-noir/60 text-[13px] mt-1">{addr.phone}</p>
              <div className="flex items-center gap-4 mt-4">
                {!addr.isDefault && (
                  <button onClick={() => setDefault(addr._id)} className="text-noir/50 text-[12px] font-body hover:text-noir underline underline-offset-4">
                    Set as Default
                  </button>
                )}
                <button onClick={() => handleDelete(addr._id)} className="text-red-400 text-[12px] font-body hover:text-red-500 flex items-center gap-1 ml-auto">
                  <Trash2 size={12} strokeWidth={1.5} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-noir/50 flex items-center justify-center px-6"
            onClick={() => setShowForm(false)}
          >
            <motion.form
              onSubmit={handleAdd}
              initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-ivory rounded-luxury p-7 max-w-md w-full relative"
            >
              <button type="button" onClick={() => setShowForm(false)} className="absolute top-5 right-5 text-noir/50" aria-label="Close">
                <X size={18} strokeWidth={1.5} />
              </button>
              <h3 className="font-heading text-noir text-xl mb-5">New Address</h3>
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="col-span-2 border border-noir/15 rounded-luxury px-3 py-2.5 text-[13.5px] font-body focus:outline-none focus:border-champagne" />
                <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="col-span-2 border border-noir/15 rounded-luxury px-3 py-2.5 text-[13.5px] font-body focus:outline-none focus:border-champagne" />
                <input required placeholder="Address Line 1" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} className="col-span-2 border border-noir/15 rounded-luxury px-3 py-2.5 text-[13.5px] font-body focus:outline-none focus:border-champagne" />
                <input placeholder="Address Line 2" value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} className="col-span-2 border border-noir/15 rounded-luxury px-3 py-2.5 text-[13.5px] font-body focus:outline-none focus:border-champagne" />
                <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="border border-noir/15 rounded-luxury px-3 py-2.5 text-[13.5px] font-body focus:outline-none focus:border-champagne" />
                <input required placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="border border-noir/15 rounded-luxury px-3 py-2.5 text-[13.5px] font-body focus:outline-none focus:border-champagne" />
                <input required placeholder="Postal Code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="border border-noir/15 rounded-luxury px-3 py-2.5 text-[13.5px] font-body focus:outline-none focus:border-champagne" />
                <input disabled value="India" className="border border-noir/15 rounded-luxury px-3 py-2.5 text-[13.5px] font-body bg-noir/5 text-noir/50" />
              </div>
              <button type="submit" className="mt-5 w-full bg-noir text-ivory py-3 rounded-luxury text-[13px] tracking-[0.15em] uppercase font-body hover:bg-noir/90 transition-colors">
                Save Address
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Addresses;
