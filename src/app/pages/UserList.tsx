import { useEffect, useMemo, useState } from "react";
import { userService } from "../../data/services/userService.js";

type FilterStatus = "all" | "active" | "blocked" | "banned" | "pending";

function getStatusStyle(status: string) {
  if (status === "active") return { bg: "#e8f7ef", color: "#137a3d" };
  if (status === "banned" || status === "blocked") return { bg: "#fdecec", color: "#b42318" };
  return { bg: "#fff4e5", color: "#b35a00" };
}

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    userService
      .getAll()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load users:", err);
        setError("Failed to load users");
        setLoading(false);
      });
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchQuery =
        query.trim().length === 0 ||
        (user.fullName && user.fullName.toLowerCase().includes(query.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(query.toLowerCase())) ||
        (user.id && user.id.toLowerCase().includes(query.toLowerCase()));
      const matchStatus = status === "all" || user.status === status;
      return matchQuery && matchStatus;
    });
  }, [users, query, status]);

  const toggleBlocked = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "blocked" ? "active" : "blocked" }
          : user,
      ),
    );
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#647087" }}>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, background: "#fef2f2", color: "#b91c1c", borderRadius: 8 }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>User Management</h1>
        <p style={{ margin: "8px 0 0", color: "#647087" }}>
          Simple user list with basic filtering and status update.
        </p>
      </div>

      <div className="toolbar">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, email or id..."
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as FilterStatus)}
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr className="table-header">
              {["ID", "Full Name", "Email", "Joined", "Status", "Action"].map((col) => (
                <th key={col}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const statusStyle = getStatusStyle(user.status);
              return (
                <tr key={user.id} className="table-row">
                  <td>{user.id}</td>
                  <td style={{ fontWeight: 600 }}>{user.fullName || user.displayName || "N/A"}</td>
                  <td style={{ color: "#4d5a72" }}>{user.email || "N/A"}</td>
                  <td style={{ color: "#4d5a72" }}>{user.joinedAt || user.createdAt || "N/A"}</td>
                  <td>
                    <span className="status-badge" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                      {user.status || "unknown"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="action-button"
                      onClick={() => toggleBlocked(user.id)}
                    >
                      {user.status === "blocked" ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!filteredUsers.length && (
          <div className="empty-state">
            No user data yet. Connect API data to populate this table.
          </div>
        )}
      </div>
    </div>
  );
}