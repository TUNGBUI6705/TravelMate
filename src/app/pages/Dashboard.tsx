import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, MapPin, MessageSquare, Users } from "lucide-react";
import { dashboardService, type DashboardStats } from "../../data/services/dashboardService";

const cardBase: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e8ecf3",
  borderRadius: 12,
  padding: 16,
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        setIsLoading(true);
        setError("");
        console.log("📊 Loading dashboard stats...");
        const data = await dashboardService.getStats();
        if (!isMounted) {
          return;
        }
        console.log("✅ Dashboard stats loaded:", data);
        setStats(data);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        console.error("❌ Failed to load dashboard stats:", loadError);
        if (typeof loadError === "object" && loadError) {
          console.error("Error details:", {
            code: "code" in loadError ? loadError.code : "unknown",
            message: "message" in loadError ? loadError.message : "unknown",
          });
        }
        const errorMsg = typeof loadError === "object" && loadError && "message" in loadError
          ? String(loadError.message)
          : String(loadError);
        
        if (errorMsg.includes("ERR_BLOCKED_BY_CLIENT") || errorMsg.includes("ERR_NETWORK")) {
          setError("Network/Firewall Error: Ad blocker or firewall is blocking Firebase. Please disable ad blocker and refresh.");
        } else if (errorMsg.includes("permission-denied")) {
          setError("Permission Error: You don't have access to this data. Please check Firebase Security Rules.");
        } else {
          setError("Cannot load dashboard data from backend. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalUsers = stats?.totalUsers ?? 0;
  const blockedUsers = stats?.blockedUsers ?? 0;
  const totalPlaces = stats?.totalPlaces ?? 0;
  const pendingReviews = stats?.pendingReviews ?? 0;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>Dashboard</h1>
        <p style={{ margin: "8px 0 0", color: "#647087" }}>
          Overview of core admin data from backend services.
        </p>
      </div>

      {error && (
        <div
          style={{
            ...cardBase,
            borderColor: "#fecaca",
            background: "#fef2f2",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        <div style={cardBase}>
          <Users size={18} color="#1d4ed8" />
          <p style={{ margin: "10px 0 4px", fontSize: 13, color: "#647087" }}>Users</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1f2a3d" }}>{totalUsers}</p>
        </div>
        <div style={cardBase}>
          <MapPin size={18} color="#0369a1" />
          <p style={{ margin: "10px 0 4px", fontSize: 13, color: "#647087" }}>Places</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1f2a3d" }}>{totalPlaces}</p>
        </div>
        <div style={cardBase}>
          <MessageSquare size={18} color="#b45309" />
          <p style={{ margin: "10px 0 4px", fontSize: 13, color: "#647087" }}>Pending Reviews</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1f2a3d" }}>{pendingReviews}</p>
        </div>
        <div style={cardBase}>
          <AlertCircle size={18} color="#b91c1c" />
          <p style={{ margin: "10px 0 4px", fontSize: 13, color: "#647087" }}>Blocked Users</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1f2a3d" }}>{blockedUsers}</p>
        </div>
      </div>

      <div style={{ ...cardBase, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <CheckCircle2 size={18} color="#15803d" />
          <h2 style={{ margin: 0, fontSize: 17, color: "#1f2a3d" }}>System Ready</h2>
        </div>
        <p style={{ margin: 0, color: "#647087", lineHeight: 1.6 }}>
          {isLoading
            ? "Syncing dashboard metrics from backend..."
            : "Dashboard is connected to backend metrics and ready for admin operations."}
        </p>
      </div>
    </div>
  );
}
