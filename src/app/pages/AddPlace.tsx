import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Check, ChevronRight, Upload, MapPin, Plus, X, Clock, Globe } from 'lucide-react';

const STEPS = ['Basic Info', 'Location & Map', 'Media & Gallery', 'Review & Publish'];

const categories = ['Restaurant', 'Hotel', 'Attraction', 'Nature', 'Shopping', 'Other'];
const provinces = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hội An', 'Huế', 'Đà Lạt', 'Nha Trang', 'Phú Quốc', 'Quảng Bình', 'Hạ Long'];

interface FormData {
  name: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  tags: string[];
  province: string;
  address: string;
  lat: string;
  lng: string;
  thumbnail: File | null;
  publishStatus: 'publish' | 'draft' | 'schedule';
}

export default function AddPlace() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState<FormData>({
    name: '', category: '', shortDesc: '', fullDesc: '',
    tags: ['beach', 'historic'], province: '', address: '',
    lat: '', lng: '', thumbnail: null, publishStatus: 'publish',
  });
  const [charCount, setCharCount] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim())) {
        setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handlePublish = async () => {
    setPublishing(true);
    await new Promise(r => setTimeout(r, 2000));
    setPublishing(false);
    setPublished(true);
    setTimeout(() => navigate('/places'), 1500);
  };

  if (published) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Check size={40} color="#4CAF50" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1A2332', marginBottom: 8 }}>Place Published!</h2>
        <p style={{ fontSize: 14, color: '#6B7A99' }}>Redirecting to Place Management...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => navigate('/places')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#2196F3', fontSize: 13, fontWeight: 500, marginBottom: 8, padding: 0 }}>
          <ArrowLeft size={16} /> Back to Places
        </button>
        <h1 style={{ fontSize: 26, fontWeight: 600, color: '#1A2332' }}>Add New Place</h1>
      </div>

      {/* Step Indicator */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '20px 28px', marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center' }}>
        {STEPS.map((s, idx) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: idx < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: idx < step ? '#4CAF50' : idx === step ? '#2196F3' : '#E8ECF0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: idx <= step ? '#fff' : '#B0BAC9',
                fontSize: 13, fontWeight: 700, flexShrink: 0,
                transition: 'all 200ms',
              }}>
                {idx < step ? <Check size={16} /> : idx + 1}
              </div>
              <span style={{
                fontSize: 13, fontWeight: idx === step ? 600 : 400,
                color: idx === step ? '#1A2332' : idx < step ? '#4CAF50' : '#B0BAC9',
                whiteSpace: 'nowrap',
              }}>
                {s}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: idx < step ? '#4CAF50' : '#E8ECF0', margin: '0 16px', transition: 'background 300ms' }} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 20 }}>
        {/* Step 1: Basic Info */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1A2332', marginBottom: 24 }}>Basic Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Place Name <span style={{ color: '#F44336' }}>*</span></label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Enter official place name"
                  style={{ width: '100%', height: 44, border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 14px', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#2196F3'}
                  onBlur={e => e.target.style.borderColor = '#E8ECF0'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Category <span style={{ color: '#F44336' }}>*</span></label>
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  style={{ width: '100%', height: 44, border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 14px', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', background: '#fff', cursor: 'pointer' }}
                >
                  <option value="">Select a category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Short Description</label>
                <textarea
                  value={form.shortDesc}
                  onChange={e => { setForm(p => ({ ...p, shortDesc: e.target.value })); setCharCount(e.target.value.length); }}
                  maxLength={150}
                  rows={3}
                  placeholder="Brief overview of this place..."
                  style={{ width: '100%', border: '1px solid #E8ECF0', borderRadius: 8, padding: '12px 14px', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.6 }}
                  onFocus={e => e.target.style.borderColor = '#2196F3'}
                  onBlur={e => e.target.style.borderColor = '#E8ECF0'}
                />
                <div style={{ textAlign: 'right', fontSize: 11, color: '#B0BAC9', marginTop: 4 }}>{charCount}/150</div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Full Description</label>
                <div style={{ border: '1px solid #E8ECF0', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ padding: '8px 12px', background: '#F5F7FA', borderBottom: '1px solid #E8ECF0', display: 'flex', gap: 8 }}>
                    {['B', 'I', '• List', '1. List', '🔗'].map(btn => (
                      <button key={btn} style={{ padding: '3px 8px', background: '#fff', border: '1px solid #E8ECF0', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: btn === 'B' ? 700 : 400, fontStyle: btn === 'I' ? 'italic' : 'normal' }}>{btn}</button>
                    ))}
                  </div>
                  <textarea
                    value={form.fullDesc}
                    onChange={e => setForm(p => ({ ...p, fullDesc: e.target.value }))}
                    placeholder="Detailed description of the place, history, highlights..."
                    style={{ width: '100%', minHeight: 180, border: 'none', padding: '14px', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.7 }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Tags</label>
                <div style={{ border: '1px solid #E8ECF0', borderRadius: 8, padding: '8px 12px', display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 48, background: '#fff' }}>
                  {form.tags.map(tag => (
                    <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: '#E3F2FD', color: '#1565C0', borderRadius: 12, fontSize: 12, fontWeight: 500 }}>
                      {tag}
                      <button onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: '#1565C0' }}><X size={12} /></button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Add tags (press Enter)..."
                    style={{ border: 'none', outline: 'none', fontSize: 13, fontFamily: 'Poppins, sans-serif', minWidth: 160, background: 'transparent', flex: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1A2332', marginBottom: 24 }}>Location & Map</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Province / City <span style={{ color: '#F44336' }}>*</span></label>
                  <select value={form.province} onChange={e => setForm(p => ({ ...p, province: e.target.value }))}
                    style={{ width: '100%', height: 44, border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 14px', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', background: '#fff', cursor: 'pointer' }}>
                    <option value="">Select province/city</option>
                    {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Address</label>
                  <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                    placeholder="Full street address"
                    style={{ width: '100%', height: 44, border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 14px', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#2196F3'}
                    onBlur={e => e.target.style.borderColor = '#E8ECF0'}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Coordinates</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input value={form.lat} onChange={e => setForm(p => ({ ...p, lat: e.target.value }))}
                    placeholder="Latitude (e.g. 16.0544)"
                    style={{ flex: 1, height: 44, border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 14px', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none' }}
                  />
                  <input value={form.lng} onChange={e => setForm(p => ({ ...p, lng: e.target.value }))}
                    placeholder="Longitude (e.g. 108.2022)"
                    style={{ flex: 1, height: 44, border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 14px', fontSize: 14, fontFamily: 'Poppins, sans-serif', outline: 'none' }}
                  />
                  <button style={{ height: 44, padding: '0 16px', border: '1px solid #2196F3', borderRadius: 8, background: '#E3F2FD', cursor: 'pointer', color: '#2196F3', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', fontFamily: 'Poppins, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={14} /> Auto-detect
                  </button>
                </div>
              </div>
              {/* Map placeholder */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Map Preview</label>
                <div style={{
                  width: '100%', height: 340, borderRadius: 12, border: '1px solid #E8ECF0',
                  background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
                }}>
                  {/* Fake map grid */}
                  <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.3 }}>
                    {Array.from({ length: 20 }).map((_, i) => (
                      <line key={`h${i}`} x1="0" y1={i * 20} x2="100%" y2={i * 20} stroke="#1976D2" strokeWidth="0.5" />
                    ))}
                    {Array.from({ length: 30 }).map((_, i) => (
                      <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="100%" stroke="#1976D2" strokeWidth="0.5" />
                    ))}
                  </svg>
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#2196F3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 4px 12px rgba(33,150,243,0.4)' }}>
                      <MapPin size={24} color="#fff" />
                    </div>
                    <p style={{ fontSize: 13, color: '#1976D2', fontWeight: 500 }}>Click to set location</p>
                    <p style={{ fontSize: 11, color: '#42A5F5', marginTop: 4 }}>Drag pin to exact position</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Media */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1A2332', marginBottom: 24 }}>Media & Gallery</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Thumbnail / Cover Photo <span style={{ color: '#F44336' }}>*</span></label>
                <div style={{
                  border: '2px dashed #E8ECF0', borderRadius: 12, padding: '40px 20px',
                  textAlign: 'center', cursor: 'pointer', transition: 'border-color 150ms, background 150ms',
                  background: '#FAFBFC',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#2196F3'; e.currentTarget.style.background = '#F0F8FF'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8ECF0'; e.currentTarget.style.background = '#FAFBFC'; }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <Upload size={22} color="#2196F3" />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#1A2332', marginBottom: 6 }}>Drag & drop or click to upload</p>
                  <p style={{ fontSize: 12, color: '#6B7A99' }}>JPG / PNG, minimum 800×600px, maximum 5MB</p>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Gallery Photos (up to 10)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <div key={idx} style={{
                      height: 90, border: '2px dashed #E8ECF0', borderRadius: 8,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', fontSize: 11, color: '#B0BAC9', background: '#FAFBFC', gap: 4,
                      transition: 'border-color 150ms',
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#2196F3'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#E8ECF0'}
                    >
                      <Plus size={18} color="#B0BAC9" />
                      Photo {idx + 1}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>360° Photo URL (Optional)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 12px', height: 44 }}>
                    <Globe size={14} color="#6B7A99" />
                    <input placeholder="https://..." style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, fontFamily: 'Poppins, sans-serif', background: 'transparent' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>Video URL (Optional)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #E8ECF0', borderRadius: 8, padding: '0 12px', height: 44 }}>
                    <Globe size={14} color="#6B7A99" />
                    <input placeholder="YouTube / Vimeo URL..." style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, fontFamily: 'Poppins, sans-serif', background: 'transparent' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Publish */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1A2332', marginBottom: 24 }}>Review & Publish</h2>
            {/* Summary */}
            {[
              { title: 'Basic Info', items: [['Name', form.name || '—'], ['Category', form.category || '—'], ['Tags', form.tags.join(', ') || '—']] },
              { title: 'Location', items: [['Province', form.province || '—'], ['Address', form.address || '—'], ['Coordinates', form.lat && form.lng ? `${form.lat}, ${form.lng}` : '—']] },
              { title: 'Media', items: [['Thumbnail', form.thumbnail ? '✓ Uploaded' : 'Not uploaded'], ['Gallery', '0 photos'], ['Video', 'Not added']] },
            ].map(section => (
              <div key={section.title} style={{ background: '#F5F7FA', borderRadius: 10, padding: '16px 20px', marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1A2332' }}>{section.title}</h4>
                  <button onClick={() => setStep(section.title === 'Basic Info' ? 0 : section.title === 'Location' ? 1 : 2)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2196F3', fontSize: 12, fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>
                    Edit Section →
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {section.items.map(([label, val]) => (
                    <div key={label}>
                      <div style={{ fontSize: 11, color: '#B0BAC9', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 13, color: '#1A2332', fontWeight: 500 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Publish Status */}
            <div style={{ marginTop: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 12 }}>Publish Status</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { val: 'publish', label: 'Publish Immediately', desc: 'Make this place visible to all users right away' },
                  { val: 'draft', label: 'Save as Draft', desc: 'Save for later, not visible to users yet' },
                  { val: 'schedule', label: 'Schedule', desc: 'Set a future date and time to publish' },
                ].map(opt => (
                  <label key={opt.val} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', padding: '12px 16px', borderRadius: 8, border: `2px solid ${form.publishStatus === opt.val ? '#2196F3' : '#E8ECF0'}`, background: form.publishStatus === opt.val ? '#F0F8FF' : '#fff', transition: 'all 150ms' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${form.publishStatus === opt.val ? '#2196F3' : '#E8ECF0'}`, background: form.publishStatus === opt.val ? '#2196F3' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      {form.publishStatus === opt.val && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} />}
                    </div>
                    <input type="radio" value={opt.val} checked={form.publishStatus === opt.val} onChange={() => setForm(p => ({ ...p, publishStatus: opt.val as any }))} style={{ display: 'none' }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1A2332' }}>{opt.label}</div>
                      <div style={{ fontSize: 12, color: '#6B7A99', marginTop: 2 }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handlePublish}
              disabled={publishing}
              style={{
                width: '100%', height: 50, marginTop: 24,
                background: publishing ? '#BDBDBD' : 'linear-gradient(135deg, #2196F3, #1976D2)',
                border: 'none', borderRadius: 10, cursor: publishing ? 'not-allowed' : 'pointer',
                color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: 'Poppins, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {publishing ? (
                <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.5)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> Publishing...</>
              ) : (
                <><Check size={18} /> {form.publishStatus === 'draft' ? 'Save as Draft' : 'Publish Place'}</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('/places')} style={{ padding: '10px 20px', border: '1px solid #E8ECF0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, color: '#6B7A99', fontFamily: 'Poppins, sans-serif' }}>
            Cancel
          </button>
          {step < 3 && (
            <button onClick={() => {}} style={{ padding: '10px 20px', border: '1px solid #2196F3', borderRadius: 8, background: '#E3F2FD', cursor: 'pointer', fontSize: 13, color: '#2196F3', fontWeight: 500, fontFamily: 'Poppins, sans-serif' }}>
              Save Draft
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} style={{ padding: '10px 20px', border: '1px solid #E8ECF0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, color: '#1A2332', fontFamily: 'Poppins, sans-serif' }}>
              ← Previous
            </button>
          )}
          {step < 3 && (
            <button onClick={() => setStep(step + 1)} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #2196F3, #1976D2)', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: 'Poppins, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
              Next Step <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
