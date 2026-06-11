import { useEffect, useMemo, useState } from "react";
import { userService } from "../../data/services/userService.js";
import { User, Mail, Calendar, Shield, ShieldOff, Trash2, Search, Filter, Edit } from "lucide-react";
import { useNotification } from "../utils/NotificationContext";
import UserEditModal from "../components/UserEditModal";
import { useTheme } from "../utils/ThemeContext";

type FilterStatus = "all" | "active" | "blocked" | "pending";

export default function UserList() {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  const isDark = theme === 'dark';

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      showNotification("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (uid, data) => {
    try {
      await userService.update(uid, data);
      showNotification("User updated successfully", "success");
      await loadUsers();
    } catch (err) {
      showNotification("Failed to update user", "error");
      throw err;
    }
  };

  const handleToggleBlock = async (user) => {
    const isBlocked = user.status === "blocked";
    try {
      if (isBlocked) {
        await userService.unblock(user.id);
        showNotification(`${user.fullName || user.email} has been unblocked`, "success");
      } else {
        await userService.block(user.id, "Violating community guidelines");
        showNotification(`${user.fullName || user.email} has been blocked`, "warning");
      }
      await loadUsers();
    } catch (err) {
      showNotification("Action failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this user?")) {
      try {
        await userService.delete(id);
        setUsers(users.filter(u => u.id !== id));
        showNotification("User deleted successfully", "success");
      } catch (err) {
        showNotification("Delete failed", "error");
      }
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = String(user.fullName || user.displayName || "").toLowerCase();
      const email = String(user.email || "").toLowerCase();
      const matchQuery =
        query.trim().length === 0 ||
        name.includes(query.toLowerCase()) ||
        email.includes(query.toLowerCase());
      const matchStatus = status === "all" || user.status === status;
      return matchQuery && matchStatus;
    });
  }, [users, query, status]);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, color: isDark ? "#f8fafc" : "#1f2a3d" }}>User Management</h1>
          <p style={{ margin: "8px 0 0", color: "#647087" }}>
            Monitor users, manage account status and community safety.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, background: isDark ? "#1e293b" : "#fff", padding: 16, borderRadius: 12, border: isDark ? "1px solid #334155" : "1px solid #e8ecf3" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or email..."
            style={{
              width: "100%", height: 42,
              border: isDark ? "1px solid #334155" : "1px solid #d9e0ea",
              borderRadius: 8, padding: "0 12px 0 40px", fontSize: 14, outline: "none",
              background: isDark ? "#0f172a" : "#fff",
              color: isDark ? "#f8fafc" : "#1f2a3d"
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px", border: isDark ? "1px solid #334155" : "1px solid #d9e0ea", borderRadius: 8, background: isDark ? "#0f172a" : "#fff" }}>
          <Filter size={16} color="#647087" />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as FilterStatus)}
            style={{ border: "none", background: "none", outline: "none", fontSize: 14, color: isDark ? "#f8fafc" : "#1f2a3d", cursor: "pointer" }}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked Only</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div style={{ background: isDark ? "#1e293b" : "#fff", border: isDark ? "1px solid #334155" : "1px solid #e8ecf3", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: isDark ? "#334155" : "#f7f9fc" }}>
              {["User", "Contact", "Joined", "Status", "Actions"].map((col) => (
                <th key={col} style={{ textAlign: "left", padding: "14px 20px", fontSize: 12, color: isDark ? "#94a3b8" : "#5e6b81", borderBottom: isDark ? "1px solid #1e293b" : "1px solid #e8ecf3", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && users.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#647087" }}>Loading users...</td></tr>
            ) : filteredUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: isDark ? "1px solid #334155" : "1px solid #eef2f8" }}>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: isDark ? "#0f172a" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <User size={20} color="#94a3b8" />
                      )}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: isDark ? "#f8fafc" : "#1f2a3d", fontSize: 14 }}>{user.fullName || user.displayName || "Unknown"}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", fontFamily: "monospace" }}>ID: {user.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "16px 20px", color: isDark ? "#cbd5e1" : "#475569" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                    <Mail size={14} />
                    {user.email || "No email"}
                  </div>
                </td>
                <td style={{ padding: "16px 20px", color: isDark ? "#cbd5e1" : "#475569" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                    <Calendar size={14} />
                    {user.createdAt ? new Date(Number(user.createdAt)).toLocaleDateString() : "N/A"}
                  </div>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    background: user.status === 'active' ? '#dcfce7' : user.status === 'blocked' ? '#fee2e2' : '#fef3c7',
                    color: user.status === 'active' ? '#15803d' : user.status === 'blocked' ? '#991b1b' : '#92400e'
                  }}>
                    {user.status || 'active'}
                  </span>
                </td>
                <td style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleEdit(user)}
                      title="Edit User"
                      style={{ border: "none", background: isDark ? "#334155" : "#eff6ff", color: isDark ? "#3b82f6" : "#1d4ed8", padding: 8, borderRadius: 6, cursor: "pointer" }}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleToggleBlock(user)}
                      title={user.status === 'blocked' ? "Unblock User" : "Block User"}
                      style={{
                        border: "none",
                        background: user.status === 'blocked' ? (isDark ? "rgba(16,185,129,0.1)" : "#ecfdf5") : (isDark ? "rgba(225,29,72,0.1)" : "#fff1f2"),
                        color: user.status === 'blocked' ? "#059669" : "#e11d48",
                        padding: 8, borderRadius: 6, cursor: "pointer"
                      }}
                    >
                      {user.status === 'blocked' ? <Shield size={18} /> : <ShieldOff size={18} />}
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      title="Delete User"
                      style={{ border: "none", background: isDark ? "#334155" : "#f8fafc", color: "#647087", padding: 8, borderRadius: 6, cursor: "pointer" }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filteredUsers.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "#647087" }}>
            No users found matching your criteria.
          </div>
        )}
      </div>

      <UserEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />
    </div>
  );
}
