import { useEffect, useMemo, useState } from "react";
import { userService } from "../../data/services/userService";
import type { User, UserStatus } from "../../domain/models/User";
import { formatDateValue } from "../utils/date";

type FilterStatus = "all" | UserStatus;

function getStatusStyle(status: UserStatus) {
  if (status === "active") return { bg: "#e8f7ef", color: "#137a3d" };
  return { bg: "#fdecec", color: "#b42318" };
}

const getUserId = (user: User) => user.id || user.uid;

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<FilterStatus>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

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

    void loadUsers();

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
        user.displayName.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery) ||
        userId.includes(normalizedQuery);
      const matchStatus = status === "all" || user.status === status;
      return matchQuery && matchStatus;
    });
  }, [users, query, status]);

  const toggleBlocked = async (user: User) => {
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
        <div
          style={{
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#b91c1c",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

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
          <option value="banned">Banned</option>
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
              const userId = getUserId(user);
              const isUpdating = updatingUserId === userId;

              return (
                <tr key={userId}>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#1f2a3d" }}>{userId}</td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#1f2a3d", fontWeight: 600 }}>
                    {user.displayName}
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#4d5a72" }}>{user.email}</td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#4d5a72" }}>
                    {formatDateValue(user.createdAt)}
                  </td>
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
                      onClick={() => void toggleBlocked(user)}
                      disabled={isUpdating}
                      style={{
                        border: "1px solid #d9e0ea",
                        background: isUpdating ? "#f3f6fb" : "#fff",
                        color: "#344155",
                        padding: "6px 10px",
                        borderRadius: 8,
                        cursor: isUpdating ? "not-allowed" : "pointer",
                        fontSize: 12,
                      }}
                    >
                      {isUpdating ? "Saving..." : user.status === "banned" ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {isLoading && (
          <div style={{ padding: 28, textAlign: "center", color: "#647087" }}>
            Loading users...
          </div>
        )}

        {!isLoading && filteredUsers.length === 0 && (
          <div style={{ padding: 28, textAlign: "center", color: "#647087" }}>
            No users match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
