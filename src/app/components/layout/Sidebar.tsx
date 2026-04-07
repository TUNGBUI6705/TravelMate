import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard, Users, MapPin, Star, BarChart2, Settings,
  LogOut, Compass, ChevronRight, Menu, X
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navSections = [
  {
    label: 'OVERVIEW',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { icon: Users, label: 'User Management', path: '/users' },
      { icon: MapPin, label: 'Place Management', path: '/places' },
      { icon: Star, label: 'Review Management', path: '/reviews' },
    ],
  },
  {
    label: 'ANALYTICS',
    items: [
      { icon: BarChart2, label: 'Analytics & Reports', path: '/analytics' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { icon: Settings, label: 'Settings', path: '/settings' },
    ],
  },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/signin');
  };

  return (
    <aside
      style={{
        width: collapsed ? 68 : 260,
        background: 'linear-gradient(180deg, #1A2332 0%, #0D1821 100%)',
        transition: 'width 250ms ease-in-out',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 99,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      {/* Logo Area */}
      <div
        style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          padding: collapsed ? '0 14px' : '0 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(33,150,243,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Compass size={20} color="#2196F3" />
        </div>
        {!collapsed && (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ color: '#fff', fontSize: 16, fontWeight: 700, lineHeight: 1.2, whiteSpace: 'nowrap' }}>TravelMate</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, letterSpacing: '0.5px' }}>Admin Panel</div>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.5)',
              padding: 4,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        )}
        {collapsed && (
          <button
            onClick={onToggle}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.5)',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              right: 8,
            }}
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {navSections.map((section) => (
          <div key={section.label} style={{ marginBottom: 8 }}>
            {!collapsed && (
              <div
                style={{
                  padding: '8px 20px 4px',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '1px',
                  color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase',
                }}
              >
                {section.label}
              </div>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: collapsed ? '14px 0' : '12px 20px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
                  background: isActive ? 'rgba(33,150,243,0.2)' : 'transparent',
                  borderLeft: isActive ? '3px solid #2196F3' : '3px solid transparent',
                  transition: 'all 150ms',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  position: 'relative',
                })}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  if (!el.classList.contains('active')) {
                    el.style.background = 'rgba(33,150,243,0.1)';
                    el.style.color = 'rgba(255,255,255,0.9)';
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  if (!el.classList.contains('active')) {
                    el.style.background = 'transparent';
                    el.style.color = 'rgba(255,255,255,0.65)';
                  }
                }}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={20}
                      color={isActive ? '#2196F3' : 'rgba(255,255,255,0.5)'}
                      style={{ flexShrink: 0 }}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}

        {/* Sign Out */}
        <div style={{ marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8 }}>
          <button
            onClick={handleSignOut}
            title={collapsed ? 'Sign Out' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: collapsed ? '14px 0' : '12px 20px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              width: '100%',
              background: 'none',
              border: 'none',
              borderLeft: '3px solid transparent',
              fontSize: 14,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.65)',
              cursor: 'pointer',
              transition: 'all 150ms',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(244,67,54,0.1)';
              e.currentTarget.style.color = '#F44336';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
            }}
          >
            <LogOut size={20} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </nav>

      {/* Bottom Admin Card */}
      {!collapsed && (
        <div
          style={{
            margin: 12,
            padding: 12,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2196F3, #1565C0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            SA
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Super Admin</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>Administrator</div>
          </div>
        </div>
      )}

      {/* Version */}
      {!collapsed && (
        <div style={{ textAlign: 'center', paddingBottom: 12, color: 'rgba(255,255,255,0.25)', fontSize: 11 }}>
          v2.1.0
        </div>
      )}
    </aside>
  );
}
