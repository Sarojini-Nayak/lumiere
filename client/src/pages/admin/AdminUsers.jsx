import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { Search, Trash2, ShieldCheck, ShieldOff, BadgeCheck, Ban } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import PageHeader from "../../components/admin/PageHeader";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const ROLE_TABS = ["All", "user", "admin"];

const AdminUsers = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleTab, setRoleTab] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all"); // all | blocked | active
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = useMemo(() => {
    return users
      .filter((u) => (roleTab === "All" ? true : u.role === roleTab))
      .filter((u) => {
        if (statusFilter === "blocked") return u.isBlocked;
        if (statusFilter === "active") return !u.isBlocked;
        return true;
      })
      .filter((u) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      });
  }, [users, roleTab, statusFilter, search]);

  const isSelf = (u) => u._id === currentUser?.id;

  const handleRoleChange = async (user, newRole) => {
    if (newRole === user.role) return;
    setError("");
    setBusyId(user._id);
    try {
      await axiosInstance.put(`/users/${user._id}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u)));
    } catch (err) {
      setError(err.response?.data?.message || "Could not update role");
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleBlock = async (user) => {
    setError("");
    setBusyId(user._id);
    try {
      await axiosInstance.put(`/users/${user._id}/block`);
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u)));
    } catch (err) {
      setError(err.response?.data?.message || "Could not update user");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/users/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete user");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage customer and admin accounts" />

      {error && (
        <div className="bg-red-50 text-red-600 text-[13px] font-body px-4 py-2.5 rounded-luxury mb-5">{error}</div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-noir/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-luxury border border-noir/15 text-[13.5px] font-body bg-white focus:outline-none focus:border-champagne"
          />
        </div>
        <div className="flex gap-2">
          {ROLE_TABS.map((r) => (
            <button
              key={r}
              onClick={() => setRoleTab(r)}
              className={`px-4 py-2.5 rounded-luxury text-[12.5px] font-body capitalize transition-colors ${
                roleTab === r ? "bg-noir text-ivory" : "bg-white text-noir/60 hover:bg-noir/5"
              }`}
            >
              {r === "All" ? "All Roles" : r}
            </button>
          ))}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-luxury border border-noir/15 text-[13px] font-body bg-white focus:outline-none focus:border-champagne"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="bg-white rounded-luxury overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="border-b border-noir/10">
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">User</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Role</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Verified</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Status</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body">Joined</th>
              <th className="px-5 py-3.5 text-[11px] uppercase tracking-wide text-noir/40 font-body text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-noir/40 text-[13px] font-body">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-noir/40 text-[13px] font-body">No users found.</td></tr>
            ) : (
              filtered.map((u) => (
                <tr key={u._id} className="border-b border-noir/5 last:border-0 hover:bg-noir/[0.02]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-champagne/20 text-champagne flex items-center justify-center font-heading text-[13px] shrink-0">
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-noir text-[13.5px] font-body truncate max-w-[180px]">
                          {u.name} {isSelf(u) && <span className="text-noir/35 text-[11px]">(you)</span>}
                        </p>
                        <p className="text-noir/40 text-[11.5px] font-body truncate max-w-[180px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={u.role}
                      disabled={isSelf(u) || busyId === u._id}
                      onChange={(e) => handleRoleChange(u, e.target.value)}
                      className="px-3 py-1.5 rounded-luxury border border-noir/15 text-[12.5px] font-body bg-white capitalize disabled:opacity-50 focus:outline-none focus:border-champagne"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5">
                    {u.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-green-700 text-[12px] font-body">
                        <BadgeCheck size={13} strokeWidth={1.5} /> Verified
                      </span>
                    ) : (
                      <span className="text-noir/40 text-[12px] font-body">Unverified</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-body uppercase tracking-wide ${
                        u.isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-noir/60 text-[12.5px] font-body">
                    {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleBlock(u)}
                        disabled={isSelf(u) || busyId === u._id}
                        title={u.isBlocked ? "Unblock user" : "Block user"}
                        className="w-8 h-8 rounded-luxury flex items-center justify-center text-noir/50 hover:bg-noir/5 hover:text-noir transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {u.isBlocked ? <ShieldCheck size={14} strokeWidth={1.5} /> : <Ban size={14} strokeWidth={1.5} />}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(u)}
                        disabled={isSelf(u)}
                        title="Delete user"
                        className="w-8 h-8 rounded-luxury flex items-center justify-center text-noir/50 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will permanently remove their account.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default AdminUsers;
