import { useEffect, useMemo, useState } from "react";
import { userService } from "../../data/services/userService.js";
import { formatDateValue } from "../utils/date.js";

function getStatusStyle(status) {
  if (status === "active") return { bg: "#e8f7ef", color: "#137a3d" };
  return { bg: "#fdecec", color: "#b42318" };
}

const getUserId = (user) => user.id || user.uid;

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await userService.getAll();
        if (!isMounted) {
          return;
        }
        setUsers(data);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        console.error(loadError);
        setError("Cannot load users from backend. Please try again.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return users.filter((user) => {
      const userId = getUserId(user).toLowerCase();
      const matchQuery =
        normalizedQuery.length === 0 ||
        (user.displayName || "").toLowerCase().includes(normalizedQuery) ||
        (user.email || "").toLowerCase().includes(normalizedQuery) ||
        userId.includes(normalizedQuery);
      const matchStatus = status === "all" || user.status === status;
      return matchQuery && matchStatus;
    });
  }, [users, query, status]);

  const toggleBlocked = async (user) => {
    const userId = getUserId(user);

    try {
      setError("");
      setUpdatingUserId(userId);
      const updatedUser =
        user.status === "banned"
          ? await userService.unban(userId)
          : await userService.ban(userId, "Blocked from admin dashboard");

      if (!updatedUser) {
        return;
      }

      setUsers((prev) => prev.map((item) => (getUserId(item) === userId ? updatedUser : item)));
    } catch (updateError) {
      console.error(updateError);
      setError("Cannot update user status right now. Please try again.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>User Management</h1>
        <p style={{ margin: "8px 0 0", color: "#647087" }}>
          Connected to backend users collection with live status updates.
        </p>
      </div>

      {error && (
        <div style={{ padding: 10, borderRadius: 8, background: "#fef2f2", color: "#b91c1c", fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #d9e0ea",
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #d9e0ea",
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {isLoading ? (
        <div style={{ padding: 20, textAlign: "center", color: "#647087" }}>Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div style={{ padding: 20, textAlign: "center", color: "#647087" }}>No users found</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f4f6fb", borderBottom: "1px solid #e8ecf3" }}>
                <th style={{ padding: 10, textAlign: "left", fontWeight: 600, color: "#475467" }}>Name</th>
                <th style={{ padding: 10, textAlign: "left", fontWeight: 600, color: "#475467" }}>Email</th>
                <th style={{ padding: 10, textAlign: "left", fontWeight: 600, color: "#475467" }}>Phone</th>
                <th style={{ padding: 10, textAlign: "left", fontWeight: 600, color: "#475467" }}>Status</th>
                <th style={{ padding: 10, textAlign: "left", fontWeight: 600, color: "#475467" }}>Joined</th>
                <th style={{ padding: 10, textAlign: "center", fontWeight: 600, color: "#475467" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={getUserId(user)} style={{ borderBottom: "1px solid #e8ecf3" }}>
                  <td style={{ padding: 10, color: "#1f2a3d" }}>{user.displayName || "Unknown"}</td>
                  <td style={{ padding: 10, color: "#647087" }}>{user.email || "N/A"}</td>
                  <td style={{ padding: 10, color: "#647087" }}>{user.phone || "-"}</td>
                  <td style={{ padding: 10 }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: 4,
                        fontSize: 12,
                        fontWeight: 600,
                        ...getStatusStyle(user.status || "active"),
                      }}
                    >
                      {user.status || "Unknown"}
                    </span>
                  </td>
                  <td style={{ padding: 10, color: "#647087" }}>{formatDateValue(user.createdAt || new Date())}</td>
                  <td style={{ padding: 10, textAlign: "center" }}>
                    <button
                      onClick={() => toggleBlocked(user)}
                      disabled={updatingUserId === getUserId(user)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 4,
                        border: "1px solid #d9e0ea",
                        background: user.status === "banned" ? "#dbeafe" : "#fee2e2",
                        color: user.status === "banned" ? "#0369a1" : "#b91c1c",
                        cursor: updatingUserId === getUserId(user) ? "wait" : "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {updatingUserId === getUserId(user) ? "..." : user.status === "banned" ? "Unban" : "Ban"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
