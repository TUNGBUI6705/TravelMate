import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Save, Trash2, Clock } from 'lucide-react';
import { mockPlaces } from '../data/mockData';

const categories = ['Restaurant', 'Hotel', 'Attraction', 'Nature', 'Shopping', 'Other'];
const provinces = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hội An', 'Huế', 'Đà Lạt', 'Nha Trang', 'Phú Quốc', 'Quảng Bình', 'Hạ Long'];

export default function EditPlace() {
  const navigate = useNavigate();
  const { id } = useParams();
  const place = mockPlaces.find(p => p.id === id) || mockPlaces[0];

  const [form, setForm] = useState({
    name: place.name,
    category: place.category,
    location: place.location,
    status: place.status,
    description: `${place.name} is a wonderful destination in ${place.location}. It offers visitors an authentic experience of Vietnamese culture and beauty. The place has received ${place.reviews.toLocaleString()} reviews with an average rating of ${place.rating} stars.`,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1px solid #E8ECF0', borderRadius: 8,
    padding: '0 14px', fontSize: 14, fontFamily: 'Poppins, sans-serif',
    outline: 'none', boxSizing: 'border-box', height: 44, background: '#fff', color: '#1A2332',
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <button onClick={() => navigate('/places')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#2196F3', fontSize: 13, fontWeight: 500, marginBottom: 8, padding: 0 }}>
            <ArrowLeft size={16} /> Back to Places
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1A2332', marginBottom: 2 }}>Edit: {place.name}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#B0BAC9' }}>
            <Clock size={13} />
            Last saved: 2 min ago
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 20px',
              background: saved ? '#4CAF50' : saving ? '#BDBDBD' : 'linear-gradient(135deg, #2196F3, #1976D2)',
              border: 'none', borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer',
              color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'Poppins, sans-serif',
              transition: 'background 300ms',
            }}
          >
            {saving ? (
              <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.5)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> Saving...</>
            ) : saved ? (
              <>✓ Saved!</>
            ) : (
              <><Save size={15} /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: 20 }}>
        {/* Main Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Basic Info */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 20 }}>Basic Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Place Name</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2196F3'}
                  onBlur={e => e.target.style.borderColor = '#E8ECF0'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    style={{ ...inputStyle, cursor: 'pointer', padding: '0 14px' }}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    style={{ ...inputStyle, cursor: 'pointer', padding: '0 14px' }}>
                    {['Published', 'Draft', 'Pending Review', 'Archived'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={5}
                  style={{ ...inputStyle, height: 'auto', padding: '12px 14px', resize: 'vertical', lineHeight: 1.7 }}
                  onFocus={e => e.target.style.borderColor = '#2196F3'}
                  onBlur={e => e.target.style.borderColor = '#E8ECF0'}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 20 }}>Location</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Province/City</label>
                <select value={form.location.split(',').pop()?.trim()} style={{ ...inputStyle, cursor: 'pointer', padding: '0 14px' }}>
                  {provinces.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Full Address</label>
                <input defaultValue={form.location} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#2196F3'}
                  onBlur={e => e.target.style.borderColor = '#E8ECF0'} />
              </div>
            </div>
            {/* Map */}
            <div style={{ marginTop: 16, height: 200, borderRadius: 10, background: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.2 }}>
                {Array.from({ length: 12 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 20} x2="100%" y2={i * 20} stroke="#1976D2" strokeWidth="0.8" />)}
                {Array.from({ length: 25 }).map((_, i) => <line key={`v${i}`} x1={i * 30} y1="0" x2={i * 30} y2="100%" stroke="#1976D2" strokeWidth="0.8" />)}
              </svg>
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#2196F3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', boxShadow: '0 4px 12px rgba(33,150,243,0.4)' }}>
                  📍
                </div>
                <p style={{ fontSize: 12, color: '#1976D2', fontWeight: 500 }}>{form.location}</p>
              </div>
            </div>
          </div>

          {/* Media */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 20 }}>Media</h3>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 8 }}>Cover Photo</label>
              <img src={place.thumbnail} alt={place.name} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 10 }}
                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=400&fit=crop'; }} />
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button style={{ padding: '8px 16px', border: '1px solid #2196F3', borderRadius: 8, background: '#E3F2FD', cursor: 'pointer', fontSize: 12, color: '#2196F3', fontFamily: 'Poppins, sans-serif' }}>
                  Replace Image
                </button>
                <button style={{ padding: '8px 16px', border: '1px solid #FFCDD2', borderRadius: 8, background: '#FFF5F5', cursor: 'pointer', fontSize: 12, color: '#F44336', fontFamily: 'Poppins, sans-serif' }}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quick Stats */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1A2332', marginBottom: 14 }}>Place Stats</h3>
            {[
              { label: 'Rating', value: `⭐ ${place.rating}/5.0` },
              { label: 'Total Reviews', value: place.reviews.toLocaleString() },
              { label: 'Created By', value: place.createdBy },
              { label: 'Place ID', value: place.id },
            ].map(stat => (
              <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F5F7FA' }}>
                <span style={{ fontSize: 12, color: '#6B7A99' }}>{stat.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1A2332', fontFamily: stat.label === 'Place ID' ? 'JetBrains Mono, monospace' : 'Poppins, sans-serif' }}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Version History */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1A2332', marginBottom: 14 }}>Version History</h3>
            {[
              { action: 'Category updated', by: 'admin01', time: '2 hours ago' },
              { action: 'Description edited', by: 'admin02', time: 'Yesterday' },
              { action: 'Photos updated', by: 'admin01', time: '3 days ago' },
              { action: 'Place created', by: 'admin01', time: '1 month ago' },
            ].map((h, idx) => (
              <div key={idx} style={{ padding: '9px 0', borderBottom: idx < 3 ? '1px solid #F5F7FA' : 'none' }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#1A2332' }}>{h.action}</div>
                <div style={{ fontSize: 11, color: '#B0BAC9' }}>by {h.by} · {h.time}</div>
              </div>
            ))}
          </div>

          {/* Danger Zone */}
          <div style={{ background: '#FFF5F5', border: '1px solid #FFCDD2', borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#C62828', marginBottom: 4 }}>⚠️ Danger Zone</h3>
            <p style={{ fontSize: 12, color: '#F44336', marginBottom: 14 }}>Permanently delete this place and all associated data.</p>
            <button
              onClick={() => setDeleteModal(true)}
              style={{
                width: '100%', height: 40, background: '#F44336', border: 'none',
                borderRadius: 8, cursor: 'pointer', color: '#fff', fontSize: 13, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              <Trash2 size={14} /> Delete Place
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setDeleteModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, width: 480, padding: 28, boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1A2332', marginBottom: 6 }}>Delete "{place.name}"?</h3>
            <p style={{ fontSize: 13, color: '#6B7A99', marginBottom: 16 }}>
              This will permanently remove all data including {place.reviews.toLocaleString()} reviews.
            </p>
            <div style={{ padding: 12, background: '#FFF5F5', border: '1px solid #FFCDD2', borderRadius: 8, marginBottom: 16 }}>
              <p style={{ fontSize: 12, color: '#C62828' }}>⚠️ This action cannot be undone.</p>
            </div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>
              Type <strong style={{ color: '#1A2332' }}>"{place.name}"</strong> to confirm:
            </label>
            <input
              value={deleteConfirmName}
              onChange={e => setDeleteConfirmName(e.target.value)}
              placeholder={place.name}
              style={{ width: '100%', height: 44, border: `2px solid ${deleteConfirmName === place.name ? '#F44336' : '#E8ECF0'}`, borderRadius: 8, padding: '0 14px', fontSize: 13, fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }}
            />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteModal(false)} style={{ padding: '10px 20px', border: '1px solid #E8ECF0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, color: '#6B7A99', fontFamily: 'Poppins, sans-serif' }}>
                Cancel
              </button>
              <button
                disabled={deleteConfirmName !== place.name}
                onClick={() => { navigate('/places'); }}
                style={{
                  padding: '10px 20px', background: deleteConfirmName === place.name ? '#F44336' : '#BDBDBD',
                  border: 'none', borderRadius: 8, cursor: deleteConfirmName === place.name ? 'pointer' : 'not-allowed',
                  fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: 'Poppins, sans-serif',
                }}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
