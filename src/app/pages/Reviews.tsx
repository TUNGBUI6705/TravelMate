import { useState } from 'react';
import { Search, Download, MoreVertical, Star, X, CheckCircle, EyeOff, Flag, Trash2, User, MapPin } from 'lucide-react';
import { mockReviews } from '../data/mockData';

const statusColors: Record<string, { bg: string; text: string }> = {
  Published: { bg: '#E8F5E9', text: '#2E7D32' },
  Pending: { bg: '#FFF8E1', text: '#F57F17' },
  Flagged: { bg: '#FFEBEE', text: '#C62828' },
  Hidden: { bg: '#F5F5F5', text: '#616161' },
};

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={size} fill={s <= rating ? '#FF9800' : 'transparent'} color={s <= rating ? '#FF9800' : '#E8ECF0'} />
      ))}
    </span>
  );
}

function ReviewActionMenu({ review, onApprove, onHide, onFlag, onDelete }: any) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={e => { e.stopPropagation(); setOpen(!open); }}
        style={{ width: 30, height: 30, borderRadius: 6, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7A99' }}
        onMouseEnter={e => e.currentTarget.style.background = '#F5F7FA'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: 34, width: 180, background: '#fff', borderRadius: 8, border: '1px solid #E8ECF0', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', zIndex: 50, overflow: 'hidden' }}>
          <button onClick={() => { onApprove(); setOpen(false); }} style={mStyle}><CheckCircle size={13} color="#4CAF50" /> Approve</button>
          <button onClick={() => { onHide(); setOpen(false); }} style={mStyle}><EyeOff size={13} color="#9E9E9E" /> Hide Review</button>
          <button onClick={() => { onFlag(); setOpen(false); }} style={mStyle}><Flag size={13} color="#FF9800" /> Flag Review</button>
          <div style={{ height: 1, background: '#E8ECF0' }} />
          <button onClick={() => { onDelete(); setOpen(false); }} style={{ ...mStyle, color: '#F44336' }}><Trash2 size={13} color="#F44336" /> Delete Review</button>
        </div>
      )}
    </div>
  );
}

const mStyle: React.CSSProperties = {
  width: '100%', padding: '9px 14px', background: 'none', border: 'none',
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
  fontSize: 12, color: '#1A2332', fontFamily: 'Poppins, sans-serif',
};

export default function Reviews() {
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [reviews, setReviews] = useState(mockReviews);
  const [drawer, setDrawer] = useState<any>(null);

  const filtered = reviews.filter(r => {
    const matchSearch = !search || r.content.toLowerCase().includes(search.toLowerCase()) || r.reviewer.toLowerCase().includes(search.toLowerCase()) || r.place.toLowerCase().includes(search.toLowerCase());
    const matchRating = ratingFilter === 'All' || (ratingFilter === '5' && r.rating === 5) || (ratingFilter === '4' && r.rating >= 4) || (ratingFilter === '3' && r.rating >= 3) || (ratingFilter === '2' && r.rating <= 2);
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchSearch && matchRating && matchStatus;
  });

  const updateStatus = (id: string, status: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (drawer?.id === id) setDrawer((d: any) => ({ ...d, status }));
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    if (drawer?.id === id) setDrawer(null);
  };

  const totalCount = reviews.length;
  const pendingCount = reviews.filter(r => r.status === 'Pending').length;
  const flaggedCount = reviews.filter(r => r.status === 'Flagged').length;

  const colors = ['#2196F3', '#FF9800', '#4CAF50', '#9C27B0', '#E91E63', '#00BCD4', '#FF5722', '#607D8B'];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>Review Management</h1>
          <p style={{ fontSize: 14, color: '#6B7A99' }}>Monitor and moderate user-submitted reviews</p>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {[
            { label: 'Total', val: totalCount.toLocaleString(), color: '#1A2332' },
            { label: 'Pending', val: pendingCount, color: '#FF9800' },
            { label: 'Flagged', val: flaggedCount, color: '#F44336' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 11, color: '#6B7A99' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 12px', background: '#fff', height: 40, width: 300 }}>
          <Search size={14} color="#6B7A99" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by content, user, place..." style={{ border: 'none', outline: 'none', fontSize: 13, flex: 1, fontFamily: 'Poppins, sans-serif', background: 'transparent' }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><X size={13} color="#6B7A99" /></button>}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)}
            style={{ height: 40, padding: '0 12px', border: '1px solid #E8ECF0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'Poppins, sans-serif', outline: 'none', cursor: 'pointer' }}>
            <option value="All">All Ratings</option>
            <option value="5">★★★★★ 5 stars</option>
            <option value="4">★★★★☆ 4+</option>
            <option value="3">★★★☆☆ 3+</option>
            <option value="2">★★ 2 & below</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{ height: 40, padding: '0 12px', border: '1px solid #E8ECF0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'Poppins, sans-serif', outline: 'none', cursor: 'pointer' }}>
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Pending">Pending</option>
            <option value="Flagged">Flagged</option>
            <option value="Hidden">Hidden</option>
          </select>
          <button style={{ height: 40, padding: '0 14px', border: '1px solid #E8ECF0', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6B7A99' }}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F5F7FA' }}>
              {['#', 'REVIEWER', 'PLACE', 'RATING', 'REVIEW CONTENT', 'DATE', 'STATUS', 'ACTIONS'].map(col => (
                <th key={col} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7A99', letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((review, idx) => {
              const isFlagged = review.status === 'Flagged';
              const isPending = review.status === 'Pending';
              const color = colors[parseInt(review.reviewerId) % colors.length];
              return (
                <tr
                  key={review.id}
                  style={{
                    borderBottom: '1px solid #E8ECF0',
                    borderLeft: isFlagged ? '3px solid #F44336' : isPending ? '3px solid #FF9800' : '3px solid transparent',
                    background: isFlagged ? '#FFF5F5' : isPending ? '#FFFDE7' : '#fff',
                    transition: 'background 150ms', cursor: 'default',
                  }}
                  onMouseEnter={e => { if (!isFlagged && !isPending) (e.currentTarget as HTMLTableRowElement).style.background = '#F5F7FA'; }}
                  onMouseLeave={e => { if (!isFlagged && !isPending) (e.currentTarget as HTMLTableRowElement).style.background = '#fff'; }}
                >
                  <td style={{ padding: '14px 14px', fontSize: 12, color: '#B0BAC9', fontFamily: 'JetBrains Mono, monospace' }}>{String(idx + 1).padStart(3, '0')}</td>
                  <td style={{ padding: '14px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        {review.reviewer.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A2332' }}>{review.reviewer}</div>
                        <div style={{ fontSize: 10, padding: '1px 6px', background: '#E3F2FD', color: '#1565C0', borderRadius: 4, display: 'inline-block', fontFamily: 'JetBrains Mono, monospace' }}>#{review.reviewerId}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 14px' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1A2332', marginBottom: 3 }}>{review.place}</div>
                    <span style={{
                      display: 'inline-block', padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 500,
                      background: '#E3F2FD', color: '#1565C0',
                    }}>
                      {review.placeCategory}
                    </span>
                  </td>
                  <td style={{ padding: '14px 14px' }}><StarRating rating={review.rating} /></td>
                  <td style={{ padding: '14px 14px', maxWidth: 220 }}>
                    <span
                      title={review.content}
                      style={{ fontSize: 13, color: '#6B7A99', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}
                      onClick={() => setDrawer(review)}
                    >
                      {review.content.slice(0, 80)}{review.content.length > 80 ? '...' : ''}
                    </span>
                    {review.content.length > 80 && (
                      <button onClick={() => setDrawer(review)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2196F3', fontSize: 12, padding: 0, fontFamily: 'Poppins, sans-serif' }}>
                        See more
                      </button>
                    )}
                  </td>
                  <td style={{ padding: '14px 14px', fontSize: 12, color: '#6B7A99', whiteSpace: 'nowrap' }}>{review.date}</td>
                  <td style={{ padding: '14px 14px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500, background: statusColors[review.status]?.bg || '#F5F5F5', color: statusColors[review.status]?.text || '#616161' }}>
                      {review.status === 'Flagged' && '⚑ '}{review.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 14px' }}>
                    <ReviewActionMenu
                      review={review}
                      onApprove={() => updateStatus(review.id, 'Published')}
                      onHide={() => updateStatus(review.id, 'Hidden')}
                      onFlag={() => updateStatus(review.id, 'Flagged')}
                      onDelete={() => deleteReview(review.id)}
                    />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 6 }}>No reviews found</div>
                  <div style={{ fontSize: 13, color: '#6B7A99' }}>No reviews match your current search or filters.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div style={{ padding: '14px 20px', borderTop: '1px solid #E8ECF0' }}>
          <span style={{ fontSize: 13, color: '#6B7A99' }}>Showing {filtered.length} of {reviews.length} reviews</span>
        </div>
      </div>

      {/* Review Detail Drawer */}
      {drawer && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} onClick={() => setDrawer(null)} />
          <div style={{
            position: 'fixed', right: 0, top: 0, bottom: 0, width: 480,
            background: '#fff', zIndex: 201, boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
            display: 'flex', flexDirection: 'column',
            animation: 'slideLeft 0.3s ease',
          }}>
            {/* Drawer Header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8ECF0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1A2332' }}>Review Detail</h3>
              <button onClick={() => setDrawer(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7A99', display: 'flex', padding: 4, borderRadius: 6 }}
                onMouseEnter={e => e.currentTarget.style.background = '#F5F7FA'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
              {/* Reviewer */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>Reviewer</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#2196F3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 700 }}>
                    {drawer.reviewer.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1A2332' }}>{drawer.reviewer}</div>
                    <div style={{ fontSize: 12, color: '#6B7A99' }}>User #{drawer.reviewerId}</div>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2196F3', fontSize: 12, padding: 0, fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>View Profile →</button>
                  </div>
                </div>
              </div>

              {/* Place */}
              <div style={{ marginBottom: 20, padding: 14, background: '#F5F7FA', borderRadius: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Place</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 48, height: 36, borderRadius: 6, background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={18} color="#2196F3" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1A2332' }}>{drawer.place}</div>
                    <div style={{ fontSize: 11, color: '#6B7A99' }}>{drawer.placeCategory}</div>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Rating</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <StarRating rating={drawer.rating} size={22} />
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#1A2332' }}>{drawer.rating}.0 / 5.0</span>
                </div>
              </div>

              {/* Review Text */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Review Content</p>
                <p style={{ fontSize: 14, color: '#1A2332', lineHeight: 1.7, padding: '14px 16px', background: '#F5F7FA', borderRadius: 8 }}>{drawer.content}</p>
                <p style={{ fontSize: 11, color: '#B0BAC9', marginTop: 8 }}>Submitted: {drawer.date}</p>
              </div>

              {/* Status */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Current Status</p>
                <span style={{ padding: '4px 14px', borderRadius: 12, fontSize: 12, fontWeight: 500, background: statusColors[drawer.status]?.bg || '#F5F5F5', color: statusColors[drawer.status]?.text || '#616161' }}>
                  {drawer.status}
                </span>
              </div>

              {/* Admin Notes */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Admin Notes</p>
                <textarea style={{ width: '100%', border: '1px solid #E8ECF0', borderRadius: 8, padding: '10px 12px', fontSize: 13, fontFamily: 'Poppins, sans-serif', resize: 'none', outline: 'none', boxSizing: 'border-box', height: 80 }} placeholder="Add internal notes..." />
                <button style={{ marginTop: 8, padding: '7px 16px', border: '1px solid #E8ECF0', borderRadius: 6, background: '#F5F7FA', cursor: 'pointer', fontSize: 12, color: '#1A2332', fontFamily: 'Poppins, sans-serif' }}>Save Note</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #E8ECF0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={() => updateStatus(drawer.id, 'Published')} style={{ height: 40, background: '#E8F5E9', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'Poppins, sans-serif' }}>
                <CheckCircle size={15} /> Approve
              </button>
              <button onClick={() => updateStatus(drawer.id, 'Hidden')} style={{ height: 40, background: '#F5F5F5', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#616161', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'Poppins, sans-serif' }}>
                <EyeOff size={15} /> Hide
              </button>
              <button onClick={() => updateStatus(drawer.id, 'Flagged')} style={{ height: 40, background: '#FFF8E1', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#F57F17', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'Poppins, sans-serif' }}>
                <Flag size={15} /> Flag
              </button>
              <button onClick={() => { deleteReview(drawer.id); setDrawer(null); }} style={{ height: 40, background: '#FFEBEE', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#C62828', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'Poppins, sans-serif' }}>
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`@keyframes slideLeft { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}
