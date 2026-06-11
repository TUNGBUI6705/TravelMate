import { Briefcase, CreditCard, Home, MapPin, MessageSquare, Settings, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useTheme } from "../../utils/ThemeContext";

interface SidebarProps {
  collapsed: boolean;
}

const navItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: MapPin, label: "Destinations", path: "/places" },
  { icon: Briefcase, label: "Trips", path: "/trips" },
  { icon: CreditCard, label: "Expenses", path: "/expenses" },
  { icon: MessageSquare, label: "Reviews", path: "/reviews" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar({ collapsed }: SidebarProps) {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <aside
      style={{
        width: collapsed ? 76 : 240,
        transition: "width 200ms ease",
        background: isDark ? "#1e293b" : "linear-gradient(180deg, #111827, #0f172a)",
        color: "#fff",
        borderRight: isDark ? "1px solid #334155" : "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        inset: "0 auto 0 0",
        zIndex: 100
      }}
    >
      <div style={{ padding: collapsed ? "18px 10px" : "18px 16px", borderBottom: isDark ? "1px solid #334155" : "1px solid rgba(255,255,255,0.08)" }}>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 700, textAlign: collapsed ? "center" : "left" }}>
          {collapsed ? "TM" : "TravelMate"}
        </p>
        {!collapsed && <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Admin Panel</p>}
      </div>

      <nav style={{ display: "grid", gap: 4, padding: 10 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 10,
              padding: collapsed ? "10px 8px" : "10px 12px",
              textDecoration: "none",
              color: isActive ? "#ffffff" : "rgba(255,255,255,0.7)",
              background: isActive ? (isDark ? "#3b82f6" : "rgba(59,130,246,0.25)") : "transparent",
            })}
          >
            <item.icon size={18} />
            {!collapsed && <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: "auto", padding: 10 }}>
        <button
          onClick={() => navigate("/signin")}
          style={{
            width: "100%",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent",
            color: "#fff",
            borderRadius: 10,
            padding: collapsed ? "10px 8px" : "10px 12px",
            textAlign: collapsed ? "center" : "left",
            cursor: "pointer",
          }}
        >
          {collapsed ? "Out" : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
