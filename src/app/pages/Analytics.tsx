import { useState } from 'react';
import { Download, TrendingUp, TrendingDown, Users, MapPin, Star, Ban } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, LineChart, Line,
} from 'recharts';
import {
  userGrowthData, userStatusDistribution, monthlyGrowthData,
  categoryDistribution, ratingDistribution, topPlacesByReviews,
} from '../data/mockData';

const tabs = ['User Statistics', 'Place Statistics', 'Review Statistics'];

const kpiSets = {
  users: [
    { label: 'Total Users', value: '12,548', change: '+12.5%', up: true, gradient: 'linear-gradient(135deg, #2196F3, #1565C0)', icon: Users },
    { label: 'New Users (Period)', value: '2,780', change: '+18.3%', up: true, gradient: 'linear-gradient(135deg, #4CAF50, #1B5E20)', icon: TrendingUp },
    { label: 'Active Users', value: '10,234', change: '+5.2%', up: true, gradient: 'linear-gradient(135deg, #FF9800, #E65100)', icon: Users },
    { label: 'Banned Users', value: '42', change: '-11.9%', up: false, gradient: 'linear-gradient(135deg, #9C27B0, #4A148C)', icon: Ban },
  ],
  places: [
    { label: 'Total Places', value: '1,024', change: '+3.2%', up: true, gradient: 'linear-gradient(135deg, #2196F3, #1565C0)', icon: MapPin },
    { label: 'New Places (Period)', value: '47', change: '+8.1%', up: true, gradient: 'linear-gradient(135deg, #4CAF50, #1B5E20)', icon: TrendingUp },
    { label: 'Avg Rating', value: '4.32 ★', change: '+0.12', up: true, gradient: 'linear-gradient(135deg, #FF9800, #E65100)', icon: Star },
    { label: 'Most Reviewed', value: 'Bún Chả HLiên', change: '2,108 reviews', up: true, gradient: 'linear-gradient(135deg, #9C27B0, #4A148C)', icon: Star },
  ],
  reviews: [
    { label: 'Total Reviews', value: '48,302', change: '+8.1%', up: true, gradient: 'linear-gradient(135deg, #2196F3, #1565C0)', icon: Star },
    { label: 'Avg Rating', value: '4.1 ★', change: '+0.06', up: true, gradient: 'linear-gradient(135deg, #4CAF50, #1B5E20)', icon: Star },
    { label: '5-Star %', value: '35.6%', change: '+2.3%', up: true, gradient: 'linear-gradient(135deg, #FF9800, #E65100)', icon: TrendingUp },
    { label: 'Flagged Reviews', value: '38', change: '-5.0%', up: false, gradient: 'linear-gradient(135deg, #9C27B0, #4A148C)', icon: Ban },
  ],
};

const placesOverTime = [
  { date: 'Mar', places: 45 }, { date: 'Apr', places: 62 }, { date: 'May', places: 78 },
  { date: 'Jun', places: 54 }, { date: 'Jul', places: 91 }, { date: 'Aug', places: 103 },
  { date: 'Sep', places: 87 }, { date: 'Oct', places: 118 }, { date: 'Nov', places: 134 },
  { date: 'Dec', places: 122 }, { date: 'Jan', places: 156 }, { date: 'Feb', places: 174 },
];

const reviewsOverTime = [
  { date: 'Mar', reviews: 2100 }, { date: 'Apr', reviews: 2800 }, { date: 'May', reviews: 3400 },
  { date: 'Jun', reviews: 2900 }, { date: 'Jul', reviews: 4100 }, { date: 'Aug', reviews: 4800 },
  { date: 'Sep', reviews: 3900 }, { date: 'Oct', reviews: 5200 }, { date: 'Nov', reviews: 5800 },
  { date: 'Dec', reviews: 5400 }, { date: 'Jan', reviews: 6200 }, { date: 'Feb', reviews: 7100 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1A2332', borderRadius: 8, padding: '8px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 4 }}>{label}</p>
        {payload.map((p: any, idx: number) => (
          <p key={idx} style={{ color: p.color || '#fff', fontSize: 14, fontWeight: 600 }}>
            {p.name}: {p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function Analytics() {
  const [activeTab, setActiveTab] = useState(0);
  const [growthTab, setGrowthTab] = useState<'7days' | '30days' | '1year'>('1year');

  const kpis = kpiSets[activeTab === 0 ? 'users' : activeTab === 1 ? 'places' : 'reviews'];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>Analytics & Reports</h1>
          <p style={{ fontSize: 14, color: '#6B7A99' }}>Platform-wide performance metrics and trends</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ padding: '8px 14px', background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8, fontSize: 13, color: '#6B7A99', cursor: 'pointer' }}>
            📅 Feb 1 – Feb 25, 2026
          </div>
          <select style={{ height: 38, padding: '0 12px', border: '1px solid #E8ECF0', borderRadius: 8, fontSize: 13, background: '#fff', fontFamily: 'Poppins, sans-serif', outline: 'none', cursor: 'pointer' }}>
            <option>Export Report</option>
            <option>Export as PDF</option>
            <option>Export as CSV</option>
            <option>Export as Excel</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, background: '#fff', borderRadius: 12, padding: '4px', marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', width: 'fit-content' }}>
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(idx)}
            style={{
              padding: '10px 22px', border: 'none', cursor: 'pointer',
              borderRadius: 8, fontSize: 13, fontWeight: activeTab === idx ? 600 : 400,
              background: activeTab === idx ? '#2196F3' : 'transparent',
              color: activeTab === idx ? '#fff' : '#6B7A99',
              fontFamily: 'Poppins, sans-serif',
              transition: 'all 150ms',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        {kpis.map((kpi) => (
          <div key={kpi.label}
            style={{
              background: kpi.gradient, borderRadius: 12, padding: 20,
              boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
              transition: 'transform 200ms', cursor: 'default',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={20} color="#fff" />
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 3,
                padding: '3px 8px', borderRadius: 12,
                background: 'rgba(255,255,255,0.2)',
                fontSize: 11, fontWeight: 600, color: '#fff',
              }}>
                {kpi.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {kpi.change}
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{kpi.value}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* USER STATISTICS TAB */}
      {activeTab === 0 && (
        <>
          {/* Charts Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 20, marginBottom: 20 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 2 }}>User Registration Trend</h3>
                  <p style={{ fontSize: 12, color: '#6B7A99' }}>New registrations over time</p>
                </div>
                <div style={{ display: 'flex', gap: 4, background: '#F5F7FA', borderRadius: 8, padding: 3 }}>
                  {(['7days', '30days', '1year'] as const).map(t => (
                    <button key={t} onClick={() => setGrowthTab(t)} style={{
                      padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                      fontSize: 11, fontWeight: 500, fontFamily: 'Poppins, sans-serif',
                      background: growthTab === t ? '#2196F3' : 'transparent',
                      color: growthTab === t ? '#fff' : '#6B7A99',
                    }}>
                      {t === '7days' ? '7D' : t === '30days' ? '30D' : '1Y'}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={userGrowthData[growthTab]} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2196F3" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2196F3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7A99', fontFamily: 'Poppins' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7A99', fontFamily: 'Poppins' }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="users" name="Users" stroke="#2196F3" strokeWidth={2} fill="url(#areaGrad)" dot={false} activeDot={{ r: 5, fill: '#2196F3' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>Users by Status</h3>
              <p style={{ fontSize: 12, color: '#6B7A99', marginBottom: 12 }}>Distribution across all user statuses</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={userStatusDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={2}>
                    {userStatusDistribution.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [v.toLocaleString(), 'Users']} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {userStatusDistribution.map(item => (
                  <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: item.color, display: 'inline-block' }} />
                      <span style={{ fontSize: 12, color: '#6B7A99' }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1A2332' }}>{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>User Growth by Month</h3>
              <p style={{ fontSize: 12, color: '#6B7A99', marginBottom: 16 }}>New vs Returning users</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyGrowthData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7A99', fontFamily: 'Poppins' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7A99', fontFamily: 'Poppins' }} axisLine={false} tickLine={false} width={45} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="new" name="New Users" fill="#2196F3" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="returning" name="Returning" fill="#FF9800" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>Top Users by Activity</h3>
              <p style={{ fontSize: 12, color: '#6B7A99', marginBottom: 16 }}>Top 8 users by reviews written</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { name: 'Nguyễn Văn An', reviews: 34 },
                  { name: 'Võ Thị Mai', reviews: 28 },
                  { name: 'Phạm Minh Khoa', reviews: 22 },
                  { name: 'Hoàng Thu Hà', reviews: 19 },
                  { name: 'Trần Thị Bích', reviews: 15 },
                  { name: 'Đinh Văn Toàn', reviews: 12 },
                  { name: 'Ngô Thị Lan', reviews: 9 },
                  { name: 'Lý Thị Hoa', reviews: 7 },
                ].map((user, idx) => {
                  const colors = ['#2196F3', '#1976D2', '#1565C0', '#0D47A1', '#1976D2', '#2196F3', '#42A5F5', '#64B5F6'];
                  return (
                    <div key={user.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 11, color: '#B0BAC9', width: 16, fontFamily: 'JetBrains Mono, monospace' }}>{idx + 1}</span>
                      <span style={{ fontSize: 12, color: '#1A2332', width: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                      <div style={{ flex: 1, height: 8, borderRadius: 4, background: '#E8ECF0', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(user.reviews / 34) * 100}%`, background: colors[idx], borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#1A2332', width: 24, textAlign: 'right' }}>{user.reviews}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* PLACE STATISTICS TAB */}
      {activeTab === 1 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: 20, marginBottom: 20 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>Places Added Over Time</h3>
              <p style={{ fontSize: 12, color: '#6B7A99', marginBottom: 16 }}>Monthly new places added to platform</p>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={placesOverTime} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7A99', fontFamily: 'Poppins' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7A99', fontFamily: 'Poppins' }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="places" name="Places" stroke="#FF9800" strokeWidth={2} dot={{ fill: '#FF9800', r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>Places by Category</h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={categoryDistribution} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 60 }}>
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7A99' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6B7A99', fontFamily: 'Poppins' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Places" radius={[0, 4, 4, 0]}>
                    {categoryDistribution.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                {categoryDistribution.map(c => (
                  <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: '#6B7A99', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color, display: 'inline-block' }} />
                      {c.name}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#1A2332' }}>{c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 16 }}>Top Places by Reviews</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {topPlacesByReviews.slice(0, 6).map((place, idx) => (
                  <div key={place.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, color: '#B0BAC9', width: 16 }}>{idx + 1}</span>
                    <span style={{ fontSize: 12, color: '#1A2332', width: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.name}</span>
                    <div style={{ flex: 1, height: 8, borderRadius: 4, background: '#E8ECF0', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(place.reviews / 2108) * 100}%`, background: '#FF9800', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1A2332', width: 40, textAlign: 'right' }}>{place.reviews.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>Geographic Distribution</h3>
              <p style={{ fontSize: 12, color: '#6B7A99', marginBottom: 12 }}>Places concentration by region</p>
              <div style={{ height: 220, background: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <svg width="100%" height="100%" style={{ position: 'absolute', opacity: 0.2 }}>
                  {Array.from({ length: 15 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 20} x2="100%" y2={i * 20} stroke="#1976D2" strokeWidth="0.8" />)}
                  {Array.from({ length: 25 }).map((_, i) => <line key={`v${i}`} x1={i * 30} y1="0" x2={i * 30} y2="100%" stroke="#1976D2" strokeWidth="0.8" />)}
                </svg>
                <div style={{ position: 'relative', textAlign: 'center' }}>
                  <MapPin size={32} color="#2196F3" style={{ marginBottom: 8 }} />
                  <p style={{ fontSize: 13, color: '#1976D2', fontWeight: 500 }}>Geographic Heatmap</p>
                  <p style={{ fontSize: 11, color: '#42A5F5' }}>1,024 places across Vietnam</p>
                  {/* Fake dots */}
                  {[{ top: 30, left: 45, size: 20, label: 'Hà Nội\n312' }, { top: 60, left: 42, size: 16, label: 'Huế\n87' }, { top: 70, left: 55, size: 22, label: 'TP.HCM\n289' }].map((dot, i) => (
                    <div key={i} title={dot.label} style={{
                      position: 'absolute', width: dot.size, height: dot.size, borderRadius: '50%',
                      background: `rgba(33,150,243,${0.3 + i * 0.2})`,
                      border: '2px solid #2196F3',
                      top: `${dot.top}%`, left: `${dot.left}%`,
                      transform: 'translate(-50%,-50%)',
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* REVIEW STATISTICS TAB */}
      {activeTab === 2 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 20, marginBottom: 20 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>Review Volume Over Time</h3>
              <p style={{ fontSize: 12, color: '#6B7A99', marginBottom: 16 }}>Monthly review submissions</p>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={reviewsOverTime} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="reviewGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7A99', fontFamily: 'Poppins' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7A99', fontFamily: 'Poppins' }} axisLine={false} tickLine={false} width={45} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="reviews" name="Reviews" stroke="#4CAF50" strokeWidth={2} fill="url(#reviewGrad)" dot={false} activeDot={{ r: 5, fill: '#4CAF50' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>Rating Distribution</h3>
              <p style={{ fontSize: 12, color: '#6B7A99', marginBottom: 16 }}>Breakdown of review ratings</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={ratingDistribution} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
                  <XAxis dataKey="rating" tick={{ fontSize: 12, fill: '#6B7A99', fontFamily: 'Poppins' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#6B7A99' }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Reviews" radius={[4, 4, 0, 0]}>
                    {ratingDistribution.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 16 }}>Reviews by Category</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={2}>
                    {categoryDistribution.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [v.toLocaleString(), 'Reviews']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 16 }}>Top Reviewed Places</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {topPlacesByReviews.slice(0, 6).map((place, idx) => (
                  <div key={place.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: '#1A2332', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{place.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#1A2332' }}>{place.reviews.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: '#E8ECF0', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(place.reviews / 2108) * 100}%`, background: '#2196F3', borderRadius: 3, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
