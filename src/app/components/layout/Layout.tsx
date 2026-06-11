import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useTheme } from "../../utils/ThemeContext";

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();

  return (
    <div style={{ background: theme === 'dark' ? "#0f172a" : "#f8fafc", minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} />
      <Topbar sidebarCollapsed={collapsed} onToggleSidebar={() => setCollapsed((prev) => !prev)} />

      <main
        style={{
          marginLeft: collapsed ? 76 : 240,
          marginTop: 64,
          transition: "margin-left 200ms ease",
          minHeight: "calc(100vh - 64px)",
          padding: 24,
          background: theme === 'dark' ? "#0f172a" : "#f8fafc",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
