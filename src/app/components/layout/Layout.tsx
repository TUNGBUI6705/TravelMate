import { useState } from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div
        style={{
          marginLeft: collapsed ? 68 : 260,
          flex: 1,
          transition: 'margin-left 250ms ease-in-out',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          background: '#F0F4F8',
        }}
      >
        <Topbar sidebarCollapsed={collapsed} onToggleSidebar={() => setCollapsed(!collapsed)} />
        <main
          style={{
            flex: 1,
            marginTop: 60,
            padding: 28,
            maxWidth: 1400,
            width: '100%',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
