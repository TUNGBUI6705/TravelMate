import type { CSSProperties } from "react";
import { AlertCircle, CheckCircle2, MapPin, MessageSquare, Users } from "lucide-react";
import { placesSeed, reviewsSeed, usersSeed } from "../data/adminData";

const cardBase: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e8ecf3",
  borderRadius: 12,
  padding: 16,
};

export default function Dashboard() {
  const totalUsers = usersSeed.length;
  const blockedUsers = usersSeed.filter((u) => u.status === "blocked").length;
  const totalPlaces = placesSeed.length;
  const pendingReviews = reviewsSeed.filter((r) => r.status === "pending").length;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>Dashboard</h1>
        <p style={{ margin: "8px 0 0", color: "#647087" }}>
          Overview of core admin data.
        </p>
      </div>

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
          This admin panel is now simplified and initialized with empty datasets.
          Connect your real API to replace the placeholder state.
        </p>
      </div>
    </div>
  );
}
