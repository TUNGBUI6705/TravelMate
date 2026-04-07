import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, Compass, CheckCircle, Loader2 } from 'lucide-react';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@travelmate.com');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [pwFocus, setPwFocus] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      {/* Left Panel */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #1976D2 0%, #2196F3 60%, #64B5F6 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 48,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -120, left: -60, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', top: '30%', left: '60%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Compass size={28} color="#fff" />
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>TravelMate</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Admin Panel</div>
          </div>
        </div>

        {/* Center content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 40 }}>
          <h1 style={{ color: '#fff', fontSize: 38, fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>
            Control Your<br />Platform
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, maxWidth: 340, lineHeight: 1.6 }}>
            The all-in-one admin panel for managing TravelMate — your users, places, reviews and analytics.
          </p>

          {/* World map decoration */}
          <div style={{ position: 'relative', marginTop: 40 }}>
            <svg width="360" height="180" viewBox="0 0 360 180" fill="none" style={{ opacity: 0.25 }}>
              <ellipse cx="180" cy="90" rx="170" ry="80" stroke="white" strokeWidth="1.5" strokeDasharray="4 3" />
              <ellipse cx="180" cy="90" rx="110" ry="80" stroke="white" strokeWidth="1" strokeDasharray="4 3" />
              <ellipse cx="180" cy="90" rx="50" ry="80" stroke="white" strokeWidth="1" strokeDasharray="4 3" />
              <line x1="10" y1="90" x2="350" y2="90" stroke="white" strokeWidth="1" strokeDasharray="4 3" />
              <line x1="180" y1="10" x2="180" y2="170" stroke="white" strokeWidth="1" strokeDasharray="4 3" />
              <circle cx="120" cy="65" r="5" fill="white" fillOpacity="0.8" />
              <circle cx="230" cy="55" r="4" fill="white" fillOpacity="0.8" />
              <circle cx="160" cy="110" r="6" fill="white" fillOpacity="0.8" />
              <circle cx="270" cy="90" r="3" fill="white" fillOpacity="0.8" />
              <circle cx="80" cy="100" r="4" fill="white" fillOpacity="0.8" />
            </svg>
          </div>
        </div>

        {/* Feature bullets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            'Manage users & content',
            'Real-time analytics dashboard',
            'Full platform control & moderation',
          ].map(feat => (
            <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle size={18} color="rgba(255,255,255,0.9)" />
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h2 style={{ fontSize: 28, fontWeight: 600, color: '#1A2332', marginBottom: 6 }}>
            Welcome Back 👋
          </h2>
          <p style={{ fontSize: 14, color: '#6B7A99', marginBottom: 36 }}>
            Sign in to your admin account
          </p>

          {error && (
            <div style={{
              padding: '12px 16px', background: '#FFEBEE', borderRadius: 8,
              border: '1px solid #FFCDD2', color: '#C62828', fontSize: 13,
              marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSignIn}>
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>
                Email Address
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                border: `${emailFocus ? '2px' : '1px'} solid ${emailFocus ? '#2196F3' : error ? '#F44336' : '#E8ECF0'}`,
                borderRadius: 8, padding: '0 14px', height: 48, background: '#fff',
                transition: 'border 150ms',
              }}>
                <Mail size={16} color={emailFocus ? '#2196F3' : '#6B7A99'} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  placeholder="admin@travelmate.com"
                  style={{
                    flex: 1, border: 'none', outline: 'none', fontSize: 14,
                    fontFamily: 'Poppins, sans-serif', color: '#1A2332', background: 'transparent',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7A99', marginBottom: 6 }}>
                Password
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                border: `${pwFocus ? '2px' : '1px'} solid ${pwFocus ? '#2196F3' : error ? '#F44336' : '#E8ECF0'}`,
                borderRadius: 8, padding: '0 14px', height: 48, background: '#fff',
                transition: 'border 150ms',
              }}>
                <Lock size={16} color={pwFocus ? '#2196F3' : '#6B7A99'} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setPwFocus(true)}
                  onBlur={() => setPwFocus(false)}
                  placeholder="Enter your password"
                  style={{
                    flex: 1, border: 'none', outline: 'none', fontSize: 14,
                    fontFamily: 'Poppins, sans-serif', color: '#1A2332', background: 'transparent',
                  }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7A99', display: 'flex' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#6B7A99' }}>
                <div
                  onClick={() => setRemember(!remember)}
                  style={{
                    width: 18, height: 18, borderRadius: 4,
                    border: `2px solid ${remember ? '#2196F3' : '#E8ECF0'}`,
                    background: remember ? '#2196F3' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 150ms', flexShrink: 0,
                  }}
                >
                  {remember && <CheckCircle size={12} color="#fff" />}
                </div>
                Remember me
              </label>
              <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2196F3', fontSize: 13, fontWeight: 500 }}>
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: 48, borderRadius: 8, border: 'none',
                background: loading ? '#BDBDBD' : 'linear-gradient(135deg, #2196F3, #1976D2)',
                color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all 200ms', fontFamily: 'Poppins, sans-serif',
                boxShadow: loading ? 'none' : '0 4px 6px rgba(33,150,243,0.3)',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 6px 10px rgba(33,150,243,0.4)'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.boxShadow = '0 4px 6px rgba(33,150,243,0.3)'; }}
            >
              {loading ? (
                <>
                  <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#E8ECF0' }} />
              <span style={{ fontSize: 12, color: '#B0BAC9' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: '#E8ECF0' }} />
            </div>

            {/* Google */}
            <button
              type="button"
              style={{
                width: '100%', height: 48, borderRadius: 8,
                border: '1px solid #E8ECF0', background: '#fff',
                color: '#1A2332', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                fontFamily: 'Poppins, sans-serif', transition: 'all 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F5F7FA'; e.currentTarget.style.borderColor = '#2196F3'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E8ECF0'; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 28, fontSize: 12, color: '#B0BAC9' }}>
            TravelMate Admin v2.1.0 · <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B0BAC9', fontSize: 12, textDecoration: 'underline' }}>Privacy Policy</button>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
