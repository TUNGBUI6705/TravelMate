import { useMemo, useState } from "react";
import { usersSeed } from "../data/adminData";

type FilterStatus = "all" | "active" | "blocked" | "pending";

function getStatusStyle(status: string) {
  if (status === "active") return { bg: "#e8f7ef", color: "#137a3d" };
  if (status === "blocked") return { bg: "#fdecec", color: "#b42318" };
  return { bg: "#fff4e5", color: "#b35a00" };
}

export default function UserList() {
  const [users, setUsers] = useState(usersSeed);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchQuery =
        query.trim().length === 0 ||
        user.fullName.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.id.toLowerCase().includes(query.toLowerCase());
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

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>User Management</h1>
        <p style={{ margin: "8px 0 0", color: "#647087" }}>
          Simple user list with basic filtering and status update.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 180px",
          gap: 10,
          background: "#ffffff",
          border: "1px solid #e8ecf3",
          borderRadius: 12,
          padding: 12,
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, email or id..."
          style={{
            height: 40,
            border: "1px solid #d9e0ea",
            borderRadius: 8,
            padding: "0 12px",
            fontSize: 14,
            outline: "none",
          }}
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as FilterStatus)}
          style={{
            height: 40,
            border: "1px solid #d9e0ea",
            borderRadius: 8,
            padding: "0 10px",
            fontSize: 14,
            outline: "none",
            background: "#fff",
          }}
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8ecf3", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f7f9fc" }}>
              {["ID", "Full Name", "Email", "Joined", "Status", "Action"].map((col) => (
                <th
                  key={col}
                  style={{
                    textAlign: "left",
                    padding: "12px 14px",
                    fontSize: 12,
                    color: "#5e6b81",
                    borderBottom: "1px solid #e8ecf3",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const statusStyle = getStatusStyle(user.status);
              return (
                <tr key={user.id}>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#1f2a3d" }}>{user.id}</td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#1f2a3d", fontWeight: 600 }}>
                    {user.fullName}
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#4d5a72" }}>{user.email}</td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#4d5a72" }}>{user.joinedAt}</td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8" }}>
                    <button
                      onClick={() => toggleBlocked(user.id)}
                      style={{
                        border: "1px solid #d9e0ea",
                        background: "#fff",
                        color: "#344155",
                        padding: "6px 10px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      {user.status === "blocked" ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div style={{ padding: 28, textAlign: "center", color: "#647087" }}>
            No user data yet. Connect API data to populate this table.
          </div>
        )}
      </div>
    </div>
  );
}
