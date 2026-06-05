import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, MapPin, MessageSquare, Users } from "lucide-react";
import { placeService } from "../../data/services/placeService.js";
import { reviewService } from "../../data/services/reviewService.js";
import { tripService } from "../../data/services/tripService.js";
import { expenseService } from "../../data/services/expenseService.js";
import { userService } from "../../data/services/userService.js";

const cardBase: CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e8ecf3",
  borderRadius: 12,
  padding: 16,
};

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDestinations, setTotalDestinations] = useState(0);
  const [totalTrips, setTotalTrips] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCounts = async () => {
      try {
        const [users, destinations, trips, expenses] = await Promise.all([
          userService.getAll(),
          placeService.getAll(),
          tripService.getAll(),
          expenseService.getAll(),
        ]);

        if (!isMounted) return;
        setTotalUsers(users.length);
        setTotalDestinations(destinations.length);
        setTotalTrips(trips.length);
        setTotalExpenses(expenses.length);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCounts();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>Dashboard</h1>
          <p style={{ margin: "8px 0 0", color: "#647087" }}>
            Overview of core admin data.
          </p>
        </div>
        <div style={{ padding: 28, textAlign: "center", color: "#647087" }}>
          Loading dashboard data from backend...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>Dashboard</h1>
          <p style={{ margin: "8px 0 0", color: "#647087" }}>
            Overview of core admin data.
          </p>
        </div>
        <div style={{ padding: 28, textAlign: "center", color: "#b42318" }}>
          Error loading dashboard data: {error}
        </div>
      </div>
    );
  }

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
          <p style={{ margin: "10px 0 4px", fontSize: 13, color: "#647087" }}>Destinations</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1f2a3d" }}>{totalDestinations}</p>
        </div>
        <div style={cardBase}>
          <MessageSquare size={18} color="#b45309" />
          <p style={{ margin: "10px 0 4px", fontSize: 13, color: "#647087" }}>Trips</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1f2a3d" }}>{totalTrips}</p>
        </div>
        <div style={cardBase}>
          <AlertCircle size={18} color="#b91c1c" />
          <p style={{ margin: "10px 0 4px", fontSize: 13, color: "#647087" }}>Expenses</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1f2a3d" }}>{totalExpenses}</p>
        </div>
      </div>

      <div style={{ ...cardBase, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <CheckCircle2 size={18} color="#15803d" />
          <h2 style={{ margin: 0, fontSize: 17, color: "#1f2a3d" }}>System Ready</h2>
        </div>
        <p style={{ margin: 0, color: "#647087", lineHeight: 1.6 }}>
          Dashboard metrics are loaded from the connected Realtime Database.
          Refresh or update records in the backend to see live counts here.
        </p>
      </div>
    </div>
  );
}
