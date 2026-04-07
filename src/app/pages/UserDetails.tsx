import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Mail, MapPin, Calendar, Star, Bookmark, AlertTriangle, Phone, Monitor, Shield, Ban, Trash2, Clock, CheckCircle, ExternalLink } from 'lucide-react';
import { mockUsers, mockReviews } from '../data/mockData';

const activityLog = [
  { type: 'account', text: 'Account created via Google OAuth', time: 'Jan 12, 2025 09:14', color: '#2196F3' },
  { type: 'trip', text: 'Created trip "Khám phá Hà Nội"', time: 'Jan 15, 2025 14:32', color: '#4CAF50' },
  { type: 'review', text: 'Wrote review for Hội An Ancient Town', time: 'Jan 20, 2025 18:45', color: '#FF9800' },
  { type: 'trip', text: 'Created trip "Biển Đà Nẵng Weekend"', time: 'Feb 01, 2025 10:12', color: '#4CAF50' },
  { type: 'review', text: 'Wrote review for Nhà Hàng Ngon', time: 'Feb 08, 2025 20:03', color: '#FF9800' },
  { type: 'account', text: 'Profile picture updated', time: 'Feb 14, 2025 11:22', color: '#2196F3' },
  { type: 'review', text: 'Wrote review for Phong Nha Cave', time: 'Feb 18, 2025 16:45', color: '#FF9800' },
];

const userTrips = [
  { name: 'Khám phá Hà Nội', destination: 'Hà Nội', startDate: 'Jan 15, 2025', endDate: 'Jan 18, 2025', status: 'Completed' },
  { name: 'Biển Đà Nẵng Weekend', destination: 'Đà Nẵng', startDate: 'Feb 01, 2025', endDate: 'Feb 03, 2025', status: 'Completed' },
  { name: 'Huế Cổ Kính', destination: 'Huế', startDate: 'Mar 10, 2025', endDate: 'Mar 13, 2025', status: 'Upcoming' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={14} fill={s <= rating ? '#FF9800' : 'transparent'} color={s <= rating ? '#FF9800' : '#E8ECF0'} />
      ))}
    </span>
  );
}

export default function UserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [banModal, setBanModal] = useState(false);
  const [showIp, setShowIp] = useState(false);

  const user = mockUsers.find(u => u.id === id) || mockUsers[0];
  const userReviews = mockReviews.slice(0, 3);
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  const mini = [
    { label: 'Total Trips', value: user.trips, icon: MapPin, color: '#2196F3' },
    { label: 'Reviews Written', value: userReviews.length, icon: Star, color: '#FF9800' },
    { label: 'Places Bookmarked', value: 14, icon: Bookmark, color: '#4CAF50' },
    { label: 'Reports Received', value: 2, icon: AlertTriangle, color: '#F44336' },
  ];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => navigate('/users')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#2196F3', fontSize: 13, fontWeight: 500, marginBottom: 8,
            fontFamily: 'Poppins, sans-serif', padding: 0,
          }}
        >
          <ArrowLeft size={16} /> Back to Users
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: 20 }}>
        {/* Left Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Profile Card */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            {/* Banner */}
            <div style={{
              height: 100,
              background: 'linear-gradient(135deg, #1976D2, #2196F3, #64B5F6)',
              position: 'relative',
            }} />
            {/* Avatar */}
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, #2196F3, #1565C0)',
                border: '4px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 24, fontWeight: 700,
                marginTop: -40, marginBottom: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}>
                {initials}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>{user.name}</h2>
                  <p style={{ fontSize: 13, color: '#6B7A99', marginBottom: 4 }}>{user.email}</p>
                  <p style={{ fontSize: 11, color: '#B0BAC9', fontFamily: 'JetBrains Mono, monospace', marginBottom: 10 }}>
                    UID: USR-{user.id}-TM
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Calendar size={13} color="#6B7A99" />
                    <span style={{ fontSize: 12, color: '#6B7A99' }}>
                      Joined {user.joined} · Member for {Math.floor((new Date('2026-02-25').getTime() - new Date(user.joined).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{
                    padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                    background: user.status === 'Active' ? '#E8F5E9' : user.status === 'Banned' ? '#FFEBEE' : '#FFF8E1',
                    color: user.status === 'Active' ? '#2E7D32' : user.status === 'Banned' ? '#C62828' : '#F57F17',
                  }}>
                    {user.status}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                  border: '1px solid #2196F3', borderRadius: 8, background: '#fff',
                  cursor: 'pointer', fontSize: 13, color: '#2196F3', fontWeight: 500,
                  fontFamily: 'Poppins, sans-serif',
                }}>
                  <ExternalLink size={14} /> View on App
                </button>
                <button
                  onClick={() => setBanModal(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                    background: '#F44336', border: 'none', borderRadius: 8,
                    cursor: 'pointer', fontSize: 13, color: '#fff', fontWeight: 600,
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  <Ban size={14} /> Ban User
                </button>
                <button style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: '#F44336', fontWeight: 500,
                  fontFamily: 'Poppins, sans-serif', padding: '8px 16px',
                  textDecoration: 'underline',
                }}>
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Mini Stats */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
              {mini.map((m, idx) => (
                <div key={m.label} style={{
                  textAlign: 'center', padding: '16px 12px',
                  borderRight: idx < 3 ? '1px solid #E8ECF0' : 'none',
                }}>
                  <m.icon size={20} color={m.color} style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 22, fontWeight: 700, color: m.color, marginBottom: 4 }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: '#6B7A99' }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trips Table */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332' }}>User's Trips</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2196F3', fontSize: 12, fontWeight: 500 }}>View All →</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F5F7FA' }}>
                  {['TRIP NAME', 'DESTINATION', 'START DATE', 'END DATE', 'STATUS'].map(col => (
                    <th key={col} style={{ padding: '9px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {userTrips.map((trip, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E8ECF0' }}>
                    <td style={{ padding: '12px 12px', fontSize: 13, fontWeight: 500, color: '#1A2332' }}>{trip.name}</td>
                    <td style={{ padding: '12px 12px', fontSize: 13, color: '#6B7A99' }}>{trip.destination}</td>
                    <td style={{ padding: '12px 12px', fontSize: 12, color: '#6B7A99' }}>{trip.startDate}</td>
                    <td style={{ padding: '12px 12px', fontSize: 12, color: '#6B7A99' }}>{trip.endDate}</td>
                    <td style={{ padding: '12px 12px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500,
                        background: trip.status === 'Completed' ? '#E8F5E9' : '#E3F2FD',
                        color: trip.status === 'Completed' ? '#2E7D32' : '#1565C0',
                      }}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reviews Table */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332' }}>User's Reviews</h3>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2196F3', fontSize: 12, fontWeight: 500 }}>View All →</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F5F7FA' }}>
                  {['PLACE', 'RATING', 'COMMENT', 'DATE', 'STATUS'].map(col => (
                    <th key={col} style={{ padding: '9px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {userReviews.map((review) => (
                  <tr key={review.id} style={{ borderBottom: '1px solid #E8ECF0' }}>
                    <td style={{ padding: '12px 12px', fontSize: 13, fontWeight: 500, color: '#1A2332' }}>{review.place}</td>
                    <td style={{ padding: '12px 12px' }}><StarRating rating={review.rating} /></td>
                    <td style={{ padding: '12px 12px', fontSize: 12, color: '#6B7A99', maxWidth: 200 }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{review.content}</span>
                    </td>
                    <td style={{ padding: '12px 12px', fontSize: 12, color: '#6B7A99' }}>{review.date}</td>
                    <td style={{ padding: '12px 12px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500,
                        background: review.status === 'Published' ? '#E8F5E9' : review.status === 'Flagged' ? '#FFEBEE' : '#FFF8E1',
                        color: review.status === 'Published' ? '#2E7D32' : review.status === 'Flagged' ? '#C62828' : '#F57F17',
                      }}>
                        {review.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Activity Timeline */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1A2332', marginBottom: 16 }}>Activity Log</h3>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 7, top: 0, bottom: 20, width: 1, background: '#E8ECF0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {activityLog.map((act, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%',
                      background: act.color, border: '2px solid #fff',
                      boxShadow: `0 0 0 2px ${act.color}40`,
                      flexShrink: 0, zIndex: 1,
                    }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, color: '#1A2332', marginBottom: 2 }}>{act.text}</p>
                      <p style={{ fontSize: 11, color: '#B0BAC9' }}>{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2196F3', fontSize: 12, fontWeight: 500, marginTop: 14, padding: 0 }}>
              View Full Log →
            </button>
          </div>

          {/* Account Info */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1A2332', marginBottom: 14 }}>Account Info</h3>
            {[
              { icon: Shield, label: 'Registered via', value: 'Google OAuth' },
              { icon: Clock, label: 'Last Login', value: 'Feb 24, 2026 · 3 hrs ago' },
              { icon: Monitor, label: 'Device', value: 'Mobile (Android)' },
              { icon: Phone, label: 'IP Address', value: showIp ? '192.168.1.***' : '●●●.●●●.●.●●●' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #F5F7FA' }}>
                <item.icon size={15} color="#6B7A99" />
                <span style={{ fontSize: 12, color: '#6B7A99', flex: 1 }}>{item.label}</span>
                <span
                  style={{ fontSize: 12, fontWeight: 500, color: '#1A2332', cursor: item.label === 'IP Address' ? 'pointer' : 'default', fontFamily: item.label === 'IP Address' ? 'JetBrains Mono, monospace' : 'Poppins, sans-serif' }}
                  onClick={() => item.label === 'IP Address' && setShowIp(!showIp)}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Danger Zone */}
          <div style={{
            background: '#FFF5F5', border: '1px solid #FFCDD2',
            borderRadius: 12, padding: 20,
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#C62828', marginBottom: 4 }}>⚠️ Danger Zone</h3>
            <p style={{ fontSize: 12, color: '#F44336', marginBottom: 16 }}>These actions are irreversible. Proceed with caution.</p>
            <button
              onClick={() => setBanModal(true)}
              style={{
                width: '100%', height: 40, background: '#F44336', border: 'none',
                borderRadius: 8, cursor: 'pointer', color: '#fff', fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: 'Poppins, sans-serif', marginBottom: 10,
              }}
            >
              <Ban size={15} /> Ban User
            </button>
            <button style={{
              width: '100%', height: 40, background: 'none',
              border: '1px solid #F44336', borderRadius: 8, cursor: 'pointer',
              color: '#F44336', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontFamily: 'Poppins, sans-serif',
            }}>
              <Trash2 size={15} /> Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Ban Modal */}
      {banModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setBanModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 480, padding: 28, boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1A2332', marginBottom: 6 }}>Ban User Account</h3>
            <p style={{ fontSize: 13, color: '#6B7A99', marginBottom: 20 }}>This action will immediately restrict access for <strong>{user.name}</strong>.</p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#6B7A99', display: 'block', marginBottom: 6 }}>Reason</label>
              <select style={{ width: '100%', height: 40, padding: '0 12px', border: '1px solid #E8ECF0', borderRadius: 8, fontSize: 13, fontFamily: 'Poppins, sans-serif', outline: 'none' }}>
                <option>Spam</option><option>Fake Reviews</option><option>Harassment</option><option>Inappropriate Content</option><option>Other</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#6B7A99', display: 'block', marginBottom: 6 }}>Additional Notes</label>
              <textarea style={{ width: '100%', border: '1px solid #E8ECF0', borderRadius: 8, padding: 12, fontSize: 13, fontFamily: 'Poppins, sans-serif', resize: 'none', outline: 'none', height: 80, boxSizing: 'border-box' }} placeholder="Optional notes..." />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#6B7A99', display: 'block', marginBottom: 6 }}>Ban Duration</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['7 Days', '30 Days', 'Permanent'].map((d, i) => (
                  <button key={d} style={{
                    flex: 1, height: 36, border: i === 2 ? '2px solid #F44336' : '1px solid #E8ECF0', borderRadius: 8,
                    cursor: 'pointer', fontSize: 13, fontWeight: i === 2 ? 600 : 400,
                    background: i === 2 ? '#FFF5F5' : '#fff', color: i === 2 ? '#F44336' : '#6B7A99', fontFamily: 'Poppins, sans-serif',
                  }}>{d}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setBanModal(false)} style={{ padding: '10px 20px', border: '1px solid #E8ECF0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'Poppins, sans-serif', color: '#6B7A99' }}>
                Cancel
              </button>
              <button onClick={() => setBanModal(false)} style={{ padding: '10px 20px', background: '#F44336', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
