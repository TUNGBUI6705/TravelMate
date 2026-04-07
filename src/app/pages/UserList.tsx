import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Search, Filter, Download, ChevronLeft, ChevronRight, MoreVertical, Eye, Ban, Trash2, UserPlus, Check, X } from 'lucide-react';
import { mockUsers } from '../data/mockData';

type Status = 'All' | 'Active' | 'Banned' | 'Pending';
type DateFilter = 'All Time' | 'Today' | 'Last 7 Days' | 'Last 30 Days';

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  Active: { bg: '#E8F5E9', text: '#2E7D32', dot: '#4CAF50' },
  Banned: { bg: '#FFEBEE', text: '#C62828', dot: '#F44336' },
  Pending: { bg: '#FFF8E1', text: '#F57F17', dot: '#FF9800' },
};

function StatusChip({ status }: { status: string }) {
  const s = statusColors[status] || { bg: '#F5F5F5', text: '#616161', dot: '#9E9E9E' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 12,
      background: s.bg, color: s.text, fontSize: 12, fontWeight: 500,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
      {status}
    </span>
  );
}

function ActionMenu({ userId, onBan, onDelete, onView }: { userId: string; onBan: () => void; onDelete: () => void; onView: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(!open); }}
        style={{
          width: 32, height: 32, borderRadius: 6, border: 'none', background: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#6B7A99',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#F5F7FA'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 36, width: 180,
          background: '#fff', borderRadius: 8, border: '1px solid #E8ECF0',
          boxShadow: '0 10px 15px rgba(0,0,0,0.1)', zIndex: 50, overflow: 'hidden',
        }}>
          <button onClick={() => { onView(); setOpen(false); }} style={menuItemStyle}>
            <Eye size={14} color="#2196F3" /> View Details
          </button>
          <button onClick={() => { onBan(); setOpen(false); }} style={{ ...menuItemStyle, color: '#F44336' }}>
            <Ban size={14} color="#F44336" /> Ban User
          </button>
          <div style={{ height: 1, background: '#E8ECF0' }} />
          <button onClick={() => { onDelete(); setOpen(false); }} style={{ ...menuItemStyle, color: '#F44336' }}>
            <Trash2 size={14} color="#F44336" /> Delete Account
          </button>
        </div>
      )}
    </div>
  );
}

const menuItemStyle: React.CSSProperties = {
  width: '100%', padding: '9px 14px', background: 'none', border: 'none',
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
  fontSize: 13, color: '#1A2332', fontFamily: 'Poppins, sans-serif',
  transition: 'background 150ms',
};

export default function UserList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status>('All');
  const [dateFilter, setDateFilter] = useState<DateFilter>('All Time');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [banModal, setBanModal] = useState<{ open: boolean; userId: string; userName: string }>({ open: false, userId: '', userName: '' });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; userId: string; userName: string }>({ open: false, userId: '', userName: '' });
  const [users, setUsers] = useState(mockUsers);
  const perPage = 10;

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.id.includes(search);
      const matchStatus = statusFilter === 'All' || u.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [users, search, statusFilter]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);
  const allSelected = paginated.length > 0 && paginated.every(u => selected.includes(u.id));

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelected(prev => prev.filter(id => !paginated.map(u => u.id).includes(id)));
    } else {
      setSelected(prev => [...new Set([...prev, ...paginated.map(u => u.id)])]);
    }
  };

  const handleBan = (userId: string, userName: string) => {
    setBanModal({ open: true, userId, userName });
  };

  const confirmBan = () => {
    setUsers(prev => prev.map(u => u.id === banModal.userId ? { ...u, status: 'Banned' } : u));
    setBanModal({ open: false, userId: '', userName: '' });
  };

  const handleDelete = (userId: string, userName: string) => {
    setDeleteModal({ open: true, userId, userName });
  };

  const confirmDelete = () => {
    setUsers(prev => prev.filter(u => u.id !== deleteModal.userId));
    setDeleteModal({ open: false, userId: '', userName: '' });
  };

  const colors = ['#2196F3', '#FF9800', '#4CAF50', '#9C27B0', '#E91E63', '#00BCD4', '#FF5722', '#607D8B'];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>User Management</h1>
          <p style={{ fontSize: 14, color: '#6B7A99' }}>Manage all registered travelers on the platform</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 18px', background: 'linear-gradient(135deg, #FF9800, #E65100)',
          border: 'none', borderRadius: 8, cursor: 'pointer',
          color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif',
          boxShadow: '0 4px 6px rgba(255,152,0,0.3)',
        }}>
          <UserPlus size={16} /> Invite User
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 12px',
          background: '#fff', height: 40, width: 280,
        }}>
          <Search size={14} color="#6B7A99" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, ID..."
            style={{ border: 'none', outline: 'none', fontSize: 13, flex: 1, fontFamily: 'Poppins, sans-serif', color: '#1A2332', background: 'transparent' }}
          />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7A99', display: 'flex' }}><X size={14} /></button>}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value as Status); setPage(1); }}
            style={{
              height: 40, padding: '0 12px', border: '1px solid #E8ECF0',
              borderRadius: 8, fontSize: 13, background: '#fff', color: '#1A2332',
              cursor: 'pointer', fontFamily: 'Poppins, sans-serif', outline: 'none',
            }}
          >
            {['All', 'Active', 'Banned', 'Pending'].map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>
            ))}
          </select>
          <select
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value as DateFilter)}
            style={{
              height: 40, padding: '0 12px', border: '1px solid #E8ECF0',
              borderRadius: 8, fontSize: 13, background: '#fff', color: '#1A2332',
              cursor: 'pointer', fontFamily: 'Poppins, sans-serif', outline: 'none',
            }}
          >
            {['All Time', 'Today', 'Last 7 Days', 'Last 30 Days'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <button style={{
            height: 40, padding: '0 14px', border: '1px solid #E8ECF0',
            borderRadius: 8, background: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6B7A99',
          }}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selected.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '10px 16px', background: '#E3F2FD',
          border: '1px solid #2196F3', borderRadius: 8, marginBottom: 12,
          animation: 'slideDown 0.2s ease',
        }}>
          <span style={{ fontSize: 13, color: '#1565C0', fontWeight: 600 }}>{selected.length} users selected</span>
          <button style={{ padding: '6px 14px', background: '#FF9800', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#fff', fontSize: 12, fontWeight: 500 }}>
            Ban Selected
          </button>
          <button style={{ padding: '6px 14px', background: '#F44336', border: 'none', borderRadius: 6, cursor: 'pointer', color: '#fff', fontSize: 12, fontWeight: 500 }}>
            Delete Selected
          </button>
          <button onClick={() => setSelected([])} style={{ padding: '6px 14px', background: 'none', border: '1px solid #2196F3', borderRadius: 6, cursor: 'pointer', color: '#2196F3', fontSize: 12, fontWeight: 500 }}>
            Clear Selection
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F5F7FA' }}>
              <th style={{ width: 44, padding: '12px 16px' }}>
                <div
                  onClick={toggleAll}
                  style={{
                    width: 18, height: 18, borderRadius: 4,
                    border: `2px solid ${allSelected ? '#2196F3' : '#E8ECF0'}`,
                    background: allSelected ? '#2196F3' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 150ms',
                  }}
                >
                  {allSelected && <Check size={11} color="#fff" />}
                </div>
              </th>
              {['#', 'NAME', 'EMAIL', 'JOINED DATE', 'TRIPS', 'STATUS', 'ACTIONS'].map(col => (
                <th key={col} style={{
                  padding: '12px 14px', textAlign: 'left',
                  fontSize: 11, fontWeight: 600, color: '#6B7A99',
                  letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((user, idx) => {
              const isSelected = selected.includes(user.id);
              const isBanned = user.status === 'Banned';
              const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);
              const color = colors[(parseInt(user.id) - 1) % colors.length];
              const globalIdx = (page - 1) * perPage + idx + 1;
              return (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: '1px solid #E8ECF0',
                    background: isSelected ? 'rgba(33,150,243,0.05)' : isBanned ? '#FFF5F5' : '#fff',
                    borderLeft: isSelected ? '3px solid #2196F3' : '3px solid transparent',
                    transition: 'background 150ms',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => { if (!isSelected && !isBanned) (e.currentTarget as HTMLTableRowElement).style.background = '#F5F7FA'; }}
                  onMouseLeave={e => { if (!isSelected && !isBanned) (e.currentTarget as HTMLTableRowElement).style.background = '#fff'; }}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div
                      onClick={() => toggleSelect(user.id)}
                      style={{
                        width: 18, height: 18, borderRadius: 4,
                        border: `2px solid ${isSelected ? '#2196F3' : '#E8ECF0'}`,
                        background: isSelected ? '#2196F3' : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 150ms',
                      }}
                    >
                      {isSelected && <Check size={11} color="#fff" />}
                    </div>
                  </td>
                  <td style={{ padding: '14px 14px', fontSize: 13, color: '#B0BAC9', fontFamily: 'JetBrains Mono, monospace' }}>
                    {String(globalIdx).padStart(3, '0')}
                  </td>
                  <td style={{ padding: '14px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', background: color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0,
                      }}>
                        {initials}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A2332' }}>{user.name}</div>
                        <div style={{ fontSize: 11, color: '#B0BAC9', fontFamily: 'JetBrains Mono, monospace' }}>#{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 14px', fontSize: 13, color: '#6B7A99', maxWidth: 180 }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                      {user.email}
                    </span>
                  </td>
                  <td style={{ padding: '14px 14px', fontSize: 13, color: '#6B7A99' }}>
                    {new Date(user.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '14px 14px', textAlign: 'center' }}>
                    {user.trips > 10 ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '2px 8px', background: '#E3F2FD', color: '#1565C0', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
                        {user.trips}
                      </span>
                    ) : (
                      <span style={{ fontSize: 13, color: '#1A2332', fontWeight: 500 }}>{user.trips}</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 14px' }}><StatusChip status={user.status} /></td>
                  <td style={{ padding: '14px 14px' }}>
                    <ActionMenu
                      userId={user.id}
                      onView={() => navigate(`/users/${user.id}`)}
                      onBan={() => handleBan(user.id, user.name)}
                      onDelete={() => handleDelete(user.id, user.name)}
                    />
                  </td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 6 }}>No users found</div>
                  <div style={{ fontSize: 13, color: '#6B7A99' }}>No users match your current filters. Try adjusting your search.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 20px', borderTop: '1px solid #E8ECF0',
        }}>
          <span style={{ fontSize: 13, color: '#6B7A99' }}>
            Showing {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length} users
          </span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                height: 34, padding: '0 10px', border: '1px solid #E8ECF0', borderRadius: 8,
                background: page === 1 ? '#F5F7FA' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer',
                color: page === 1 ? '#B0BAC9' : '#6B7A99', display: 'flex', alignItems: 'center',
              }}
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  style={{
                    width: 34, height: 34, border: 'none', borderRadius: 8,
                    background: page === pageNum ? '#2196F3' : '#fff',
                    color: page === pageNum ? '#fff' : '#6B7A99',
                    cursor: 'pointer', fontSize: 13, fontWeight: page === pageNum ? 600 : 400,
                    border: page !== pageNum ? '1px solid #E8ECF0' : 'none',
                  } as React.CSSProperties}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                height: 34, padding: '0 10px', border: '1px solid #E8ECF0', borderRadius: 8,
                background: page === totalPages ? '#F5F7FA' : '#fff',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                color: page === totalPages ? '#B0BAC9' : '#6B7A99', display: 'flex', alignItems: 'center',
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Ban Modal */}
      {banModal.open && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setBanModal({ open: false, userId: '', userName: '' })}>
          <div style={{
            background: '#fff', borderRadius: 16, width: 480, padding: 28,
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            animation: 'scaleIn 0.2s ease',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1A2332', marginBottom: 6 }}>Ban User Account</h3>
            <p style={{ fontSize: 13, color: '#6B7A99', marginBottom: 20 }}>This action will immediately restrict the user's access.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, background: '#F5F7FA', borderRadius: 10, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F44336', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>
                {banModal.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A2332' }}>{banModal.userName}</div>
                <div style={{ fontSize: 12, color: '#6B7A99' }}>User #{banModal.userId}</div>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#6B7A99', display: 'block', marginBottom: 6 }}>Reason</label>
              <select style={{ width: '100%', height: 40, padding: '0 12px', border: '1px solid #E8ECF0', borderRadius: 8, fontSize: 13, fontFamily: 'Poppins, sans-serif', outline: 'none' }}>
                <option>Spam</option>
                <option>Fake Reviews</option>
                <option>Harassment</option>
                <option>Inappropriate Content</option>
                <option>Other</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#6B7A99', display: 'block', marginBottom: 6 }}>Ban Duration</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['7 Days', '30 Days', 'Permanent'].map((d, i) => (
                  <button key={d} style={{
                    flex: 1, height: 36, border: i === 2 ? '2px solid #F44336' : '1px solid #E8ECF0',
                    borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: i === 2 ? 600 : 400,
                    background: i === 2 ? '#FFF5F5' : '#fff', color: i === 2 ? '#F44336' : '#6B7A99',
                    fontFamily: 'Poppins, sans-serif',
                  }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button
                onClick={() => setBanModal({ open: false, userId: '', userName: '' })}
                style={{ padding: '10px 20px', border: '1px solid #E8ECF0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'Poppins, sans-serif', color: '#6B7A99' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmBan}
                style={{ padding: '10px 20px', background: '#F44336', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: 'Poppins, sans-serif' }}
              >
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setDeleteModal({ open: false, userId: '', userName: '' })}>
          <div style={{
            background: '#fff', borderRadius: 16, width: 440, padding: 28,
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1A2332', marginBottom: 6 }}>Delete Account</h3>
            <p style={{ fontSize: 13, color: '#6B7A99', marginBottom: 20 }}>
              Are you sure you want to delete <strong>{deleteModal.userName}</strong>'s account? This action cannot be undone.
            </p>
            <div style={{ padding: 14, background: '#FFF5F5', border: '1px solid #FFCDD2', borderRadius: 8, marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: '#C62828' }}>⚠️ All user data, trips, and reviews will be permanently deleted.</p>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteModal({ open: false, userId: '', userName: '' })}
                style={{ padding: '10px 20px', border: '1px solid #E8ECF0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'Poppins, sans-serif', color: '#6B7A99' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{ padding: '10px 20px', background: '#F44336', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: 'Poppins, sans-serif' }}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
