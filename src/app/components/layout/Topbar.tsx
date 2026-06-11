import { Menu, Search, User, Moon, Sun } from "lucide-react";
import { useLocation } from "react-router";
import { useTheme } from "../../utils/ThemeContext";
import NotificationCenter from "../NotificationCenter";

interface TopbarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const routeLabels: Record<string, string> = {
  "/dashboard": "Overview",
  "/users": "User Management",
  "/places": "Destinations",
  "/trips": "Trip Monitoring",
  "/expenses": "Financial Analytics",
  "/reviews": "Content Moderation",
  "/settings": "System Settings",
};

export function Topbar({ sidebarCollapsed, onToggleSidebar }: TopbarProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const title = routeLabels[location.pathname] || "Admin Panel";

  return (
    <header
      style={{
        position: "fixed",
        left: sidebarCollapsed ? 76 : 240,
        right: 0,
        top: 0,
        height: 64,
        transition: "left 200ms ease",
        borderBottom: theme === 'dark' ? "1px solid #334155" : "1px solid #e8ecf3",
        background: theme === 'dark' ? "#1e293b" : "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        zIndex: 50,
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={onToggleSidebar}
          style={{
            border: "none",
            background: theme === 'dark' ? "#334155" : "#f1f5f9",
            color: theme === 'dark' ? "#94a3b8" : "#647087",
            borderRadius: 8,
            width: 36,
            height: 36,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <h2 style={{ margin: 0, fontSize: 18, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d", fontWeight: 600 }}>{title}</h2>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <button
          onClick={toggleTheme}
          style={{
            border: "none",
            background: "none",
            color: theme === 'dark' ? "#f59e0b" : "#647087",
            cursor: "pointer",
            padding: 8,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s"
          }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Search size={18} color="#94a3b8" style={{ position: "absolute", left: 10 }} />
          <input
            placeholder="Search anything..."
            style={{
              background: theme === 'dark' ? "#0f172a" : "#f8fafc",
              border: theme === 'dark' ? "1px solid #334155" : "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "8px 12px 8px 34px",
              fontSize: 13,
              outline: "none",
              width: 220,
              color: theme === 'dark' ? "#f8fafc" : "#1f2a3d"
            }}
          />
        </div>

        <NotificationCenter />

        <div style={{ height: 24, width: 1, background: theme === 'dark' ? "#334155" : "#e2e8f0" }}></div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}>Admin User</p>
            <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>Super Admin</p>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}

