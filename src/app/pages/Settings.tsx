import { useState } from 'react';
import { User, Shield, Bell, Palette, Users, Eye, EyeOff, Check, Plus, Trash2, Edit } from 'lucide-react';
import { adminAccounts } from '../data/mockData';

const settingsNav = [
  { icon: User, label: 'Account & Profile' },
  { icon: Shield, label: 'Security' },
  { icon: Bell, label: 'Notifications' },
  { icon: Palette, label: 'Appearance' },
  { icon: Users, label: 'Admin Management' },
];

const roleColors: Record<string, { bg: string; text: string }> = {
  'Super Admin': { bg: '#FCE4EC', text: '#880E4F' },
  'Moderator': { bg: '#E3F2FD', text: '#1565C0' },
  'Analyst': { bg: '#E8F5E9', text: '#2E7D32' },
  'Inactive': { bg: '#F5F5F5', text: '#616161' },
};

export default function Settings() {
  const [activeSection, setActiveSection] = useState(0);
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [twoFa, setTwoFa] = useState(false);
  const [notifSettings, setNotifSettings] = useState({ newUser: true, flaggedReview: true, pendingPlace: true, weeklyReport: false, securityAlert: true });
  const [adminList, setAdminList] = useState(adminAccounts);
  const [addAdminModal, setAddAdminModal] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 14, color: '#6B7A99' }}>Manage your account and system preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 9fr', gap: 20 }}>
        {/* Settings Navigation */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', height: 'fit-content' }}>
          {settingsNav.map((item, idx) => (
            <button
              key={item.label}
              onClick={() => setActiveSection(idx)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 14px', borderRadius: 8, border: 'none',
                background: activeSection === idx ? '#E3F2FD' : 'transparent',
                color: activeSection === idx ? '#1565C0' : '#6B7A99',
                fontSize: 13, fontWeight: activeSection === idx ? 600 : 400,
                cursor: 'pointer', textAlign: 'left', fontFamily: 'Poppins, sans-serif',
                transition: 'all 150ms',
                borderLeft: activeSection === idx ? '3px solid #2196F3' : '3px solid transparent',
              }}
              onMouseEnter={e => { if (activeSection !== idx) e.currentTarget.style.background = '#F5F7FA'; }}
              onMouseLeave={e => { if (activeSection !== idx) e.currentTarget.style.background = 'transparent'; }}
            >
              <item.icon size={16} color={activeSection === idx ? '#2196F3' : '#9E9E9E'} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div>
          {/* Account & Profile */}
          {activeSection === 0 && (
            <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1A2332', marginBottom: 24 }}>Account & Profile</h2>
              
              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, padding: '20px 24px', background: '#F5F7FA', borderRadius: 12 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2196F3, #1565C0)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 28, fontWeight: 700, flexShrink: 0,
                }}>
                  SA
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>Super Admin</h3>
                  <p style={{ fontSize: 13, color: '#6B7A99', marginBottom: 10 }}>Your profile picture is visible to all admins</p>
                  <button style={{
                    padding: '7px 16px', border: '1px solid #2196F3', borderRadius: 8,
                    background: '#E3F2FD', cursor: 'pointer', fontSize: 12, color: '#2196F3',
                    fontWeight: 500, fontFamily: 'Poppins, sans-serif',
                  }}>
                    Change Avatar
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                {[
                  { label: 'Full Name', placeholder: 'Super Admin', type: 'text' },
                  { label: 'Username', placeholder: 'superadmin', type: 'text' },
                  { label: 'Email Address', placeholder: 'superadmin@travelmate.com', type: 'email' },
                  { label: 'Phone Number', placeholder: '+84 901 234 567', type: 'tel' },
                ].map(field => (
                  <div key={field.label}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>{field.label}</label>
                    <input
                      type={field.type}
                      defaultValue={field.placeholder}
                      style={{ width: '100%', height: 44, border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 14px', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', background: '#fff', color: '#1A2332' }}
                      onFocus={e => e.target.style.borderColor = '#2196F3'}
                      onBlur={e => e.target.style.borderColor = '#E8ECF0'}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleSaveProfile}
                  style={{
                    padding: '10px 24px', background: profileSaved ? '#4CAF50' : 'linear-gradient(135deg, #2196F3, #1976D2)',
                    border: 'none', borderRadius: 8, cursor: 'pointer',
                    color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif',
                    display: 'flex', alignItems: 'center', gap: 6, transition: 'background 300ms',
                  }}
                >
                  {profileSaved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
                </button>
                <button style={{ padding: '10px 20px', border: '1px solid #E8ECF0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, color: '#6B7A99', fontFamily: 'Poppins, sans-serif' }}>
                  Discard Changes
                </button>
              </div>
            </div>
          )}

          {/* Security */}
          {activeSection === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Change Password */}
              <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1A2332', marginBottom: 20 }}>Change Password</h2>
                {[
                  { label: 'Current Password', key: 'old', show: showOldPw, toggle: () => setShowOldPw(!showOldPw) },
                  { label: 'New Password', key: 'new', show: showNewPw, toggle: () => setShowNewPw(!showNewPw) },
                  { label: 'Confirm New Password', key: 'confirm', show: showNewPw, toggle: () => {} },
                ].map(field => (
                  <div key={field.label} style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>{field.label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 14px', height: 44 }}>
                      <input type={field.show ? 'text' : 'password'} placeholder="••••••••" style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, fontFamily: 'Poppins, sans-serif', background: 'transparent' }} />
                      <button onClick={field.toggle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7A99', display: 'flex' }}>
                        {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}
                <button style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #2196F3, #1976D2)', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                  Update Password
                </button>
              </div>

              {/* 2FA */}
              <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>Two-Factor Authentication</h2>
                    <p style={{ fontSize: 13, color: '#6B7A99', maxWidth: 400 }}>Add an extra layer of security to your account by requiring a verification code when you sign in.</p>
                  </div>
                  <div
                    onClick={() => setTwoFa(!twoFa)}
                    style={{
                      width: 52, height: 28, borderRadius: 14, cursor: 'pointer',
                      background: twoFa ? '#2196F3' : '#E8ECF0',
                      position: 'relative', transition: 'background 250ms', flexShrink: 0,
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 3, left: twoFa ? 27 : 3,
                      width: 22, height: 22, borderRadius: '50%', background: '#fff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      transition: 'left 250ms',
                    }} />
                  </div>
                </div>
                {twoFa && (
                  <div style={{ marginTop: 16, padding: '14px 16px', background: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: 8 }}>
                    <p style={{ fontSize: 13, color: '#2E7D32', fontWeight: 500 }}>✓ Two-Factor Authentication is enabled. Your account is more secure.</p>
                  </div>
                )}
              </div>

              {/* Active Sessions */}
              <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1A2332', marginBottom: 16 }}>Active Sessions</h2>
                {[
                  { device: 'Chrome on Windows 11', location: 'Hà Nội, Vietnam', time: 'Current session', icon: '🖥️', current: true },
                  { device: 'Safari on iPhone 15', location: 'TP. HCM, Vietnam', time: '2 hours ago', icon: '📱', current: false },
                  { device: 'Firefox on MacOS', location: 'Đà Nẵng, Vietnam', time: 'Yesterday', icon: '💻', current: false },
                ].map((session, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: idx < 2 ? '1px solid #E8ECF0' : 'none' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 20 }}>{session.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A2332', display: 'flex', gap: 8, alignItems: 'center' }}>
                          {session.device}
                          {session.current && <span style={{ fontSize: 10, padding: '2px 8px', background: '#E8F5E9', color: '#2E7D32', borderRadius: 10, fontWeight: 600 }}>CURRENT</span>}
                        </div>
                        <div style={{ fontSize: 12, color: '#6B7A99' }}>{session.location} · {session.time}</div>
                      </div>
                    </div>
                    {!session.current && (
                      <button style={{ padding: '5px 12px', border: '1px solid #FFCDD2', borderRadius: 6, background: '#FFF5F5', cursor: 'pointer', fontSize: 12, color: '#F44336', fontFamily: 'Poppins, sans-serif' }}>
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 2 && (
            <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1A2332', marginBottom: 20 }}>Notification Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { key: 'newUser', label: 'New User Registration', desc: 'Get notified when new users join the platform' },
                  { key: 'flaggedReview', label: 'Flagged Reviews', desc: 'Alert when reviews are flagged for inappropriate content' },
                  { key: 'pendingPlace', label: 'Pending Place Approval', desc: 'Notify when places are waiting for approval' },
                  { key: 'weeklyReport', label: 'Weekly Analytics Report', desc: 'Receive weekly platform performance digest' },
                  { key: 'securityAlert', label: 'Security Alerts', desc: 'Critical alerts for suspicious account activity' },
                ].map((item, idx) => (
                  <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: idx < 4 ? '1px solid #E8ECF0' : 'none' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#1A2332' }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: '#6B7A99', marginTop: 2 }}>{item.desc}</div>
                    </div>
                    <div
                      onClick={() => setNotifSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      style={{
                        width: 52, height: 28, borderRadius: 14, cursor: 'pointer',
                        background: notifSettings[item.key as keyof typeof notifSettings] ? '#2196F3' : '#E8ECF0',
                        position: 'relative', transition: 'background 250ms', flexShrink: 0,
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 3,
                        left: notifSettings[item.key as keyof typeof notifSettings] ? 27 : 3,
                        width: 22, height: 22, borderRadius: '50%', background: '#fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)', transition: 'left 250ms',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
              <button style={{ marginTop: 20, padding: '10px 24px', background: 'linear-gradient(135deg, #2196F3, #1976D2)', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>
                Save Preferences
              </button>
            </div>
          )}

          {/* Appearance */}
          {activeSection === 3 && (
            <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1A2332', marginBottom: 20 }}>Appearance</h2>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 12 }}>Theme</label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[
                    { label: 'Light', desc: 'Default light theme', icon: '☀️', active: true },
                    { label: 'Dark', desc: 'Easy on the eyes', icon: '🌙', active: false },
                    { label: 'System', desc: 'Follow system setting', icon: '💻', active: false },
                  ].map(theme => (
                    <div key={theme.label} style={{
                      flex: 1, padding: '16px 14px', border: `2px solid ${theme.active ? '#2196F3' : '#E8ECF0'}`,
                      borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                      background: theme.active ? '#F0F8FF' : '#fff',
                      transition: 'all 150ms',
                    }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>{theme.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: theme.active ? '#1565C0' : '#1A2332' }}>{theme.label}</div>
                      <div style={{ fontSize: 11, color: '#6B7A99', marginTop: 2 }}>{theme.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 12 }}>Accent Color</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['#2196F3', '#9C27B0', '#4CAF50', '#FF9800', '#F44336', '#00BCD4'].map((color, idx) => (
                    <div key={color} style={{
                      width: 36, height: 36, borderRadius: '50%', background: color, cursor: 'pointer',
                      border: idx === 0 ? '3px solid #1A2332' : '3px solid transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxSizing: 'border-box',
                    }}>
                      {idx === 0 && <Check size={16} color="#fff" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Admin Management */}
          {activeSection === 4 && (
            <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1A2332' }}>Admin Management</h2>
                <button
                  onClick={() => setAddAdminModal(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '9px 16px', background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                    border: 'none', borderRadius: 8, cursor: 'pointer',
                    color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  <Plus size={15} /> Add Admin
                </button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F5F7FA' }}>
                    {['NAME', 'EMAIL', 'ROLE', 'LAST LOGIN', 'STATUS', 'ACTIONS'].map(col => (
                      <th key={col} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7A99', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adminList.map((admin, idx) => (
                    <tr key={admin.id} style={{ borderBottom: '1px solid #E8ECF0', transition: 'background 150ms' }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#F5F7FA'}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = '#fff'}
                    >
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2196F3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>
                            {admin.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#1A2332' }}>{admin.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 13, color: '#6B7A99' }}>{admin.email}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500, background: roleColors[admin.role]?.bg || '#F5F5F5', color: roleColors[admin.role]?.text || '#616161' }}>
                          {admin.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: '#6B7A99' }}>{admin.lastLogin}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'flex', alignItems: 'center', gap: 5, width: 'fit-content',
                          padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500,
                          background: admin.status === 'Active' ? '#E8F5E9' : '#F5F5F5',
                          color: admin.status === 'Active' ? '#2E7D32' : '#616161',
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: admin.status === 'Active' ? '#4CAF50' : '#9E9E9E' }} />
                          {admin.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #E8ECF0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7A99' }}>
                            <Edit size={13} />
                          </button>
                          {admin.role !== 'Super Admin' && (
                            <button onClick={() => setAdminList(prev => prev.filter(a => a.id !== admin.id))} style={{ width: 30, height: 30, borderRadius: 6, border: '1px solid #FFCDD2', background: '#FFF5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F44336' }}>
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Admin Modal */}
      {addAdminModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setAddAdminModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 480, padding: 28, boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1A2332', marginBottom: 20 }}>Add New Admin</h3>
            {[
              { label: 'Full Name', placeholder: 'Enter admin full name' },
              { label: 'Email Address', placeholder: 'admin@travelmate.com' },
            ].map(field => (
              <div key={field.label} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>{field.label}</label>
                <input placeholder={field.placeholder} style={{ width: '100%', height: 44, border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 14px', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Role</label>
              <select style={{ width: '100%', height: 44, border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 14px', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', background: '#fff' }}>
                <option>Moderator</option>
                <option>Analyst</option>
                <option>Super Admin</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setAddAdminModal(false)} style={{ padding: '10px 20px', border: '1px solid #E8ECF0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, color: '#6B7A99', fontFamily: 'Poppins, sans-serif' }}>
                Cancel
              </button>
              <button onClick={() => setAddAdminModal(false)} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #2196F3, #1976D2)', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
