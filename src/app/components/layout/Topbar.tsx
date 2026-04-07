import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Bell, Search, ChevronRight, Home, Menu, User, Settings, LogOut, Check, MapPin, Star, Users, X } from 'lucide-react';

interface TopbarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const routeMap: Record<string, string[]> = {
  '/dashboard': ['Dashboard'],
  '/users': ['User Management'],
  '/places': ['Place Management'],
  '/places/add': ['Place Management', 'Add New Place'],
  '/reviews': ['Review Management'],
  '/analytics': ['Analytics & Reports'],
  '/settings': ['Settings'],
};

const notifications = [
  { id: 1, type: 'user', icon: Users, title: 'New user registered', desc: 'Cao Thị Yến just joined TravelMate', time: '2 min ago', unread: true, color: '#4CAF50' },
  { id: 2, type: 'review', icon: Star, title: 'Review flagged', desc: 'A review on Nhà Hàng Ngon was flagged for inappropriate content', time: '15 min ago', unread: true, color: '#FF9800' },
  { id: 3, type: 'place', icon: MapPin, title: 'New place pending', desc: "Mũi Né Beach is waiting for approval", time: '32 min ago', unread: true, color: '#2196F3' },
  { id: 4, type: 'user', icon: Users, title: 'User banned', desc: 'Lê Hoàng Duy was banned by Mod Linh', time: '1 hr ago', unread: false, color: '#F44336' },
  { id: 5, type: 'review', icon: Star, title: 'Bulk reviews flagged', desc: '3 reviews from Bùi Thanh Liêm were auto-flagged', time: '2 hr ago', unread: false, color: '#FF9800' },
];

export function Topbar({ sidebarCollapsed, onToggleSidebar }: TopbarProps) {
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [notifList, setNotifList] = useState(notifications);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const breadcrumbs = (() => {
    const path = location.pathname;
    if (routeMap[path]) return routeMap[path];
    if (path.startsWith('/users/')) return ['User Management', 'User Details'];
    if (path.startsWith('/places/edit/')) return ['Place Management', 'Edit Place'];
    return ['Dashboard'];
  })();
  const unreadCount = notifList.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifList(notifList.map(n => ({ ...n, unread: false })));
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: sidebarCollapsed ? 68 : 260,
        right: 0,
        height: 60,
        background: '#fff',
        borderBottom: '1px solid #E8ECF0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 12,
        transition: 'left 250ms ease-in-out',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      {/* Hamburger */}
      <button
        onClick={onToggleSidebar}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#6B7A99',
          padding: 6,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#F0F4F8'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, fontSize: 13 }}>
        <Home size={14} color="#6B7A99" />
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ChevronRight size={12} color="#B0BAC9" />
            <span
              style={{
                color: idx === breadcrumbs.length - 1 ? '#1A2332' : '#6B7A99',
                fontWeight: idx === breadcrumbs.length - 1 ? 600 : 400,
              }}
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          {searchOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '2px solid #2196F3',
                borderRadius: 8,
                padding: '0 12px',
                height: 36,
                background: '#fff',
                width: 280,
              }}>
                <Search size={14} color="#6B7A99" />
                <input
                  autoFocus
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search users, places…"
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: 13,
                    marginLeft: 8,
                    flex: 1,
                    background: 'transparent',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                />
              </div>
              <button
                onClick={() => { setSearchOpen(false); setSearchVal(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7A99', display: 'flex' }}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                width: 36, height: 36, borderRadius: 8, border: 'none',
                background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#6B7A99',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F0F4F8'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <Search size={18} />
            </button>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            style={{
              width: 36, height: 36, borderRadius: 8, border: 'none',
              background: showNotif ? '#F0F4F8' : 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#6B7A99', position: 'relative',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F0F4F8'}
            onMouseLeave={e => e.currentTarget.style.background = showNotif ? '#F0F4F8' : 'none'}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 4,
                width: 16, height: 16, borderRadius: '50%',
                background: '#F44336', color: '#fff',
                fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div style={{
              position: 'absolute', right: 0, top: 44,
              width: 340, background: '#fff', borderRadius: 12,
              boxShadow: '0 20px 25px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.04)',
              border: '1px solid #E8ECF0', zIndex: 200, overflow: 'hidden',
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #E8ECF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: '#1A2332' }}>Notifications</span>
                <button onClick={markAllRead} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2196F3', fontSize: 12, fontWeight: 500 }}>
                  Mark all read
                </button>
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {notifList.map(n => (
                  <div key={n.id} style={{
                    padding: '12px 16px', display: 'flex', gap: 12,
                    borderLeft: n.unread ? '3px solid #2196F3' : '3px solid transparent',
                    background: n.unread ? 'rgba(33,150,243,0.03)' : '#fff',
                    borderBottom: '1px solid #F5F7FA',
                    cursor: 'pointer',
                    transition: 'background 150ms',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F5F7FA'}
                    onMouseLeave={e => e.currentTarget.style.background = n.unread ? 'rgba(33,150,243,0.03)' : '#fff'}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: `${n.color}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <n.icon size={16} color={n.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1A2332', marginBottom: 2 }}>{n.title}</div>
                      <div style={{ fontSize: 12, color: '#6B7A99', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.desc}</div>
                      <div style={{ fontSize: 11, color: '#B0BAC9', marginTop: 4 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '10px 16px', borderTop: '1px solid #E8ECF0', textAlign: 'center' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2196F3', fontSize: 13, fontWeight: 500 }}>
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
              borderRadius: 8, transition: 'background 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F0F4F8'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2196F3, #1565C0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 12, fontWeight: 700,
            }}>
              SA
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A2332' }}>Super Admin</div>
              <div style={{
                fontSize: 10, background: '#E3F2FD', color: '#1565C0',
                borderRadius: 4, padding: '1px 6px', fontWeight: 500,
              }}>
                Administrator
              </div>
            </div>
          </button>

          {showProfile && (
            <div style={{
              position: 'absolute', right: 0, top: 48,
              width: 200, background: '#fff', borderRadius: 10,
              boxShadow: '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
              border: '1px solid #E8ECF0', zIndex: 200, overflow: 'hidden',
            }}>
              {[
                { icon: User, label: 'Profile', color: '#2196F3' },
                { icon: Settings, label: 'Settings', color: '#6B7A99' },
              ].map(item => (
                <button key={item.label} style={{
                  width: '100%', padding: '10px 14px', background: 'none', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 13, color: '#1A2332', transition: 'background 150ms',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F5F7FA'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <item.icon size={16} color={item.color} />
                  {item.label}
                </button>
              ))}
              <div style={{ borderTop: '1px solid #E8ECF0' }}>
                <button style={{
                  width: '100%', padding: '10px 14px', background: 'none', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 13, color: '#F44336', transition: 'background 150ms',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FFF5F5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <LogOut size={16} color="#F44336" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}