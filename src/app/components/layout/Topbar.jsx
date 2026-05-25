import { Menu } from "lucide-react";
import { useLocation } from "react-router";

const routeLabels = {
  "/dashboard": "Dashboard",
  "/users": "User Management",
  "/places": "Place Management",
  "/reviews": "Review Management",
  "/settings": "Settings",
};

export function Topbar({ sidebarCollapsed, onToggleSidebar }) {
  const location = useLocation();
  const title = routeLabels[location.pathname] || "TravelMate Admin";

  return (
    <header
      style={{
        position: "fixed",
        left: sidebarCollapsed ? 76 : 240,
        right: 0,
        top: 0,
        height: 58,
        transition: "left 200ms ease",
        borderBottom: "1px solid #e8ecf3",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 14px",
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={onToggleSidebar}
          style={{
            border: "1px solid #d9e0ea",
            background: "#fff",
            borderRadius: 8,
            width: 34,
            height: 34,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
          aria-label="Toggle sidebar"
        >
          <Menu size={17} />
        </button>
        <h2 style={{ margin: 0, fontSize: 16, color: "#1f2a3d" }}>{title}</h2>
      </div>

      <p style={{ margin: 0, fontSize: 13, color: "#647087" }}>
        Admin Workspace
      </p>
    </header>
  );
}
