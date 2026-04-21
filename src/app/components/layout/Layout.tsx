import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { onAuthChange } from "../../../config/firebaseUtils";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      const hasSession = Boolean(user);
      setIsAuthResolved(true);
      setIsAuthenticated(hasSession);

      if (!hasSession) {
        navigate("/signin", { replace: true });
      }
    });

    return unsubscribe;
  }, [navigate]);

  if (!isAuthResolved) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f4f6fb",
          color: "#647087",
          fontSize: 14,
        }}
      >
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
