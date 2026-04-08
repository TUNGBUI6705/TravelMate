import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <Sidebar collapsed={collapsed} />
      <Topbar sidebarCollapsed={collapsed} onToggleSidebar={() => setCollapsed((prev) => !prev)} />

      <main
        style={{
          marginLeft: collapsed ? 76 : 240,
          marginTop: 58,
          transition: "margin-left 200ms ease",
          minHeight: "calc(100vh - 58px)",
          padding: 16,
          background: "#f4f6fb",
        }}
      >
        <div style={{ maxWidth: 1200 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
