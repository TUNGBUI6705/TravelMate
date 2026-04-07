import { useState } from 'react';
import { Users, MapPin, Star, Ban, TrendingUp, TrendingDown, RefreshCw, Download, Eye, Clock, AlertTriangle, UserPlus } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { mockUsers, userGrowthData, categoryDistribution, recentActivity } from '../data/mockData';

const statCards = [
  {
    label: 'Total Users', value: '12,548', trend: '↑ 12.5% this month',
    gradient: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
    icon: Users, iconBg: 'rgba(255,255,255,0.2)',
  },
  {
    label: 'Total Places', value: '1,024', trend: '↑ 3.2% this month',
    gradient: 'linear-gradient(135deg, #FF9800 0%, #E65100 100%)',
    icon: MapPin, iconBg: 'rgba(255,255,255,0.2)',
  },
  {
    label: 'Total Reviews', value: '48,302', trend: '↑ 8.1% this month',
    gradient: 'linear-gradient(135deg, #4CAF50 0%, #1B5E20 100%)',
    icon: Star, iconBg: 'rgba(255,255,255,0.2)',
  },
  {
    label: 'Banned Accounts', value: '42', trend: '↓ 5 this month',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #4A148C 100%)',
    icon: Ban, iconBg: 'rgba(255,255,255,0.2)',
    trendDown: true,
  },
];

const quickStats = [
  { label: 'Pending Reviews', value: '124', icon: Clock, color: '#FF9800' },
  { label: 'Active Places', value: '876', icon: MapPin, color: '#4CAF50' },
  { label: 'Reports Today', value: '18', icon: AlertTriangle, color: '#F44336' },
  { label: 'New Users (7d)', value: '453', icon: UserPlus, color: '#2196F3' },
];

const statusColors: Record<string, string> = { Active: '#4CAF50', Banned: '#F44336', Pending: '#FF9800' };

function StatusChip({ status }: { status: string }) {
  const bgMap: Record<string, string> = { Active: '#E8F5E9', Banned: '#FFEBEE', Pending: '#FFF8E1' };
  const textMap: Record<string, string> = { Active: '#2E7D32', Banned: '#C62828', Pending: '#F57F17' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 12,
      background: bgMap[status] || '#F5F5F5',
      color: textMap[status] || '#616161',
      fontSize: 12, fontWeight: 500,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColors[status] || '#9E9E9E' }} />
      {status}
    </span>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1A2332', borderRadius: 8, padding: '8px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>{payload[0].value.toLocaleString()} users</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [growthTab, setGrowthTab] = useState<'7days' | '30days' | '90days' | '1year'>('30days');
  const chartData = userGrowthData[growthTab];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, color: '#1A2332', marginBottom: 4 }}>Dashboard</h1>
          <p style={{ fontSize: 14, color: '#6B7A99' }}>Welcome back, Admin! Here's what's happening today.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            padding: '8px 14px', background: '#fff', border: '1px solid #E8ECF0',
            borderRadius: 8, fontSize: 13, color: '#6B7A99', cursor: 'pointer',
          }}>
            📅 Feb 1 – Feb 25, 2026
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            background: '#fff', border: '1px solid #E8ECF0', borderRadius: 8,
            cursor: 'pointer', fontSize: 13, color: '#6B7A99',
          }}>
            <RefreshCw size={14} />
            Refresh
          </button>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            background: 'linear-gradient(135deg, #2196F3, #1976D2)',
            border: 'none', borderRadius: 8, cursor: 'pointer',
            fontSize: 13, color: '#fff', fontWeight: 500, fontFamily: 'Poppins, sans-serif',
          }}>
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: card.gradient, borderRadius: 12, padding: 20,
              boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
              display: 'flex', gap: 16, alignItems: 'flex-start',
              transition: 'transform 200ms, box-shadow 200ms', cursor: 'default',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 15px rgba(0,0,0,0.15), 0 4px 6px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)';
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <card.icon size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{card.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 3 }}>{card.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 6 }}>{card.trend}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 20, marginBottom: 24 }}>
        {/* User Growth Chart */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 2 }}>User Growth</h3>
              <p style={{ fontSize: 12, color: '#6B7A99' }}>New registrations over time</p>
            </div>
            <div style={{ display: 'flex', gap: 4, background: '#F5F7FA', borderRadius: 8, padding: 3 }}>
              {(['7days', '30days', '90days', '1year'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setGrowthTab(tab)}
                  style={{
                    padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                    fontSize: 11, fontWeight: 500, fontFamily: 'Poppins, sans-serif',
                    background: growthTab === tab ? '#2196F3' : 'transparent',
                    color: growthTab === tab ? '#fff' : '#6B7A99',
                    transition: 'all 150ms',
                  }}
                >
                  {tab === '7days' ? '7D' : tab === '30days' ? '30D' : tab === '90days' ? '90D' : '1Y'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2196F3" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2196F3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7A99', fontFamily: 'Poppins' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7A99', fontFamily: 'Poppins' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="users" stroke="#2196F3" strokeWidth={2} fill="url(#userGradient)" dot={false} activeDot={{ r: 5, fill: '#2196F3' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Content Distribution */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332', marginBottom: 2 }}>Content Distribution</h3>
            <p style={{ fontSize: 12, color: '#6B7A99' }}>Places by category</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {categoryDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, 'Places']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {categoryDistribution.map(cat => (
              <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: cat.color, display: 'inline-block' }} />
                  <span style={{ fontSize: 12, color: '#6B7A99' }}>{cat.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1A2332' }}>{cat.value}</span>
                  <span style={{ fontSize: 11, color: '#B0BAC9' }}>{Math.round(cat.value / 10.24)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: 20 }}>
        {/* Recent Users Table */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2332' }}>Recently Registered Users</h3>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2196F3', fontSize: 13, fontWeight: 500 }}>
              View All →
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F5F7FA', borderRadius: 8 }}>
                {['AVATAR + NAME', 'EMAIL', 'JOINED', 'STATUS', 'ACTIONS'].map(col => (
                  <th key={col} style={{
                    padding: '10px 12px', textAlign: 'left',
                    fontSize: 11, fontWeight: 600, color: '#6B7A99',
                    letterSpacing: '0.5px', textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockUsers.slice(0, 5).map((user, idx) => {
                const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                const colors = ['#2196F3', '#FF9800', '#4CAF50', '#9C27B0', '#E91E63'];
                const color = colors[idx % colors.length];
                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid #E8ECF0', transition: 'background 150ms' }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#F5F7FA'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}
                  >
                    <td style={{ padding: '12px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%', background: color,
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
                    <td style={{ padding: '12px 12px', fontSize: 13, color: '#6B7A99' }}>{user.email}</td>
                    <td style={{ padding: '12px 12px', fontSize: 12, color: '#6B7A99' }}>{user.joined}</td>
                    <td style={{ padding: '12px 12px' }}><StatusChip status={user.status} /></td>
                    <td style={{ padding: '12px 12px' }}>
                      <button style={{
                        width: 30, height: 30, borderRadius: 6, border: '1px solid #E8ECF0',
                        background: '#fff', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: '#6B7A99',
                      }}>
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Quick Stats + Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quick Overview */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1A2332', marginBottom: 12 }}>Quick Overview</h3>
            {quickStats.map((stat, idx) => (
              <div key={stat.label}>
                {idx > 0 && <div style={{ height: 1, background: '#E8ECF0', margin: '10px 0' }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <stat.icon size={16} color={stat.color} />
                  </div>
                  <span style={{ flex: 1, fontSize: 13, color: '#6B7A99' }}>{stat.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#1A2332' }}>{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1A2332', marginBottom: 14 }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {recentActivity.map((act, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', background: act.color,
                    flexShrink: 0, marginTop: 5,
                  }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, color: '#1A2332', lineHeight: 1.4, marginBottom: 2 }}>{act.text}</p>
                    <p style={{ fontSize: 11, color: '#B0BAC9' }}>{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
