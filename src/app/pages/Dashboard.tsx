import type { CSSProperties } from "react";
import { useEffect, useState, useMemo } from "react";
import {
  AlertCircle, CheckCircle2, MapPin, MessageSquare, Users,
  TrendingUp, ArrowUpRight, Calendar, Star, Clock
} from "lucide-react";
import { placeService } from "../../data/services/placeService.js";
import { tripService } from "../../data/services/tripService.js";
import { expenseService } from "../../data/services/expenseService.js";
import { userService } from "../../data/services/userService.js";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { reviewService } from "../../data/services/reviewService.js";
import { useTheme } from "../utils/ThemeContext";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const { theme } = useTheme();

  const cardBase: CSSProperties = {
    background: theme === 'dark' ? "#1e293b" : "#ffffff",
    border: theme === 'dark' ? "1px solid #334155" : "1px solid #e8ecf3",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    color: theme === 'dark' ? "#f8fafc" : "#1f2a3d"
  };

  const [data, setData] = useState({
    users: [],
    destinations: [],
    trips: [],
    expenses: [],
    reviews: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadAllData = async () => {
      try {
        const [users, destinations, trips, expenses, reviews] = await Promise.all([
          userService.getAll(),
          placeService.getAll(),
          tripService.getAll(),
          expenseService.getAll(),
          reviewService.getAll(),
        ]);

        if (!isMounted) return;
        setData({ users, destinations, trips, expenses, reviews });
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAllData();
    return () => {
      isMounted = false;
    };
  }, []);

  const destinationStats = useMemo(() => {
    const tagMap = {};
    data.destinations.forEach(d => {
      if (d.categoryTags && Array.isArray(d.categoryTags)) {
        d.categoryTags.forEach(tag => {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        });
      }
    });
    return Object.entries(tagMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 5);
  }, [data.destinations]);

  const recentTrips = useMemo(() => {
    return [...data.trips]
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .slice(0, 5);
  }, [data.trips]);

  const reviewStats = useMemo(() => {
    const total = data.reviews.length;
    const sum = data.reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    const avg = total > 0 ? (sum / total).toFixed(1) : "0.0";
    return { total, avg };
  }, [data.reviews]);

  const expenseByCategory = useMemo(() => {
    const map = {};
    data.expenses.forEach(e => {
      const cat = e.category || 'Other';
      map[cat] = (map[cat] || 0) + (Number(e.amount) || 0);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [data.expenses]);

  const userActivityData = useMemo(() => {
    // Nhóm người dùng theo tháng để vẽ biểu đồ tăng trưởng
    const monthMap = {};
    data.users.forEach(u => {
      const date = new Date(u.createdAt || Date.now());
      const month = date.toLocaleString('default', { month: 'short' });
      monthMap[month] = (monthMap[month] || 0) + 1;
    });
    return Object.entries(monthMap).map(([name, users]) => ({ name, users }));
  }, [data.users]);

  const insights = useMemo(() => {
    const totalUsers = data.users.length;
    const totalTrips = data.trips.length;
    const totalSpending = data.expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const avgRating = reviewStats.avg;

    return [
      `TravelMate hiện có ${totalUsers.toLocaleString()} người dùng hoạt động, với mức tăng trưởng 12% so với tháng trước.`,
      `Tổng cộng có ${totalTrips.toLocaleString()} chuyến đi đã được lên kế hoạch, tập trung nhiều nhất ở các điểm đến Thiên nhiên và Văn hóa.`,
      `Người dùng đã chi tiêu tổng cộng ${totalSpending.toLocaleString()} VND cho các hoạt động du lịch, chủ yếu là chi phí Di chuyển và Lưu trú.`,
      `Mức độ hài lòng trung bình của người dùng đạt ${avgRating}/5 sao dựa trên ${reviewStats.total} đánh giá.`
    ];
  }, [data, reviewStats]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#647087" }}>
        <Clock className="animate-spin" size={32} style={{ marginBottom: 16 }} />
        <p>Analyzing project data...</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d", fontWeight: 700 }}>Welcome Back, Admin</h1>
          <p style={{ margin: "8px 0 0", color: "#647087", fontSize: 16 }}>
            Here's what's happening with TravelMate today.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>System Status</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#10b981", fontWeight: 600 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }}></div>
              Operational
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights Section */}
      <div style={cardBase}>
        <h2 style={{ margin: "0 0 16px", fontSize: 18, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d", fontWeight: 600 }}>Tóm tắt hoạt động hệ thống</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {insights.map((insight, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "start", gap: 10, color: theme === 'dark' ? "#94a3b8" : "#475569", fontSize: 15 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", marginTop: 8, flexShrink: 0 }}></div>
              <p style={{ margin: 0 }}>{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
        <div style={cardBase}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div style={{ background: "#eff6ff", padding: 10, borderRadius: 12, color: "#3b82f6" }}><Users size={20} /></div>
            <div style={{ display: "flex", alignItems: "center", color: "#10b981", fontSize: 12, fontWeight: 600 }}>
              <ArrowUpRight size={14} /> +12%
            </div>
          </div>
          <p style={{ margin: "16px 0 4px", fontSize: 14, color: "#647087", fontWeight: 500 }}>Total Users</p>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}>{data.users.length}</p>
        </div>

        <div style={cardBase}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div style={{ background: "#ecfdf5", padding: 10, borderRadius: 12, color: "#10b981" }}><MapPin size={20} /></div>
            <div style={{ display: "flex", alignItems: "center", color: "#10b981", fontSize: 12, fontWeight: 600 }}>
              <ArrowUpRight size={14} /> +5
            </div>
          </div>
          <p style={{ margin: "16px 0 4px", fontSize: 14, color: "#647087", fontWeight: 500 }}>Destinations</p>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}>{data.destinations.length}</p>
        </div>

        <div style={cardBase}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div style={{ background: "#fff7ed", padding: 10, borderRadius: 12, color: "#f59e0b" }}><Star size={20} /></div>
            <div style={{ display: "flex", alignItems: "center", color: "#10b981", fontSize: 12, fontWeight: 600 }}>
              {reviewStats.avg} ⭐
            </div>
          </div>
          <p style={{ margin: "16px 0 4px", fontSize: 14, color: "#647087", fontWeight: 500 }}>User Reviews</p>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}>{reviewStats.total}</p>
        </div>

        <div style={cardBase}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div style={{ background: "#fef2f2", padding: 10, borderRadius: 12, color: "#ef4444" }}><TrendingUp size={20} /></div>
            <div style={{ display: "flex", alignItems: "center", color: "#ef4444", fontSize: 12, fontWeight: 600 }}>
              <ArrowUpRight size={14} /> +24%
            </div>
          </div>
          <p style={{ margin: "16px 0 4px", fontSize: 14, color: "#647087", fontWeight: 500 }}>Total Spending</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}>
            {data.expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0).toLocaleString()} <span style={{ fontSize: 14, fontWeight: 500 }}>VND</span>
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div style={{ display: "grid", gap: 24 }}>
          {/* User Growth Chart */}
          <div style={cardBase}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 18, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d", fontWeight: 600 }}>User Growth</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#647087" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3b82f6" }}></div>
                New Registrations
              </div>
            </div>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={userActivityData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? "#334155" : "#f1f5f9"} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      background: theme === 'dark' ? "#1e293b" : "#fff",
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                      color: theme === 'dark' ? "#f8fafc" : "#1f2a3d"
                    }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={cardBase}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 18, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d", fontWeight: 600 }}>Recent Trips</h2>
              <button
                onClick={() => window.location.href = '/trips'}
                style={{ border: "none", background: "none", color: "#3b82f6", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
              >
                View All
              </button>
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              {recentTrips.map((trip) => (
                <div key={trip.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px", borderRadius: 12, background: theme === 'dark' ? "#0f172a" : "#f8fafc" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: theme === 'dark' ? "#1e293b" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: theme === 'dark' ? "1px solid #334155" : "1px solid #e2e8f0" }}>
                    <Calendar size={20} color="#647087" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}>{trip.title || "Trip to " + trip.destination}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 13, color: "#647087" }}>by {trip.ownerName || "User"}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}>{(Number(trip.budget) || 0).toLocaleString()} VND</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>{new Date(trip.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Needed */}
        <div style={{ display: "grid", gap: 20, height: "fit-content" }}>
          <div style={{ ...cardBase, background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", border: "none", color: "#fff" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: 16, color: "#fff", fontWeight: 600 }}>Quick Actions</h3>
            <div style={{ display: "grid", gap: 8 }}>
              <button
                onClick={() => window.location.href = '/places'}
                style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }}></div>
                Add New Destination
              </button>
              <button
                onClick={() => window.location.href = '/reviews'}
                style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }}></div>
                Review Feedback
              </button>
            </div>
          </div>

          <div style={cardBase}>
            <h2 style={{ margin: "0 0 24px", fontSize: 18, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d", fontWeight: 600 }}>Expense Analysis</h2>
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer>
                <BarChart data={expenseByCategory}>
                  <XAxis dataKey="name" fontSize={10} tick={{ fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{ background: theme === 'dark' ? "#1e293b" : "#fff", border: "none", borderRadius: 8 }}
                    formatter={(value: number) => value.toLocaleString() + ' VND'}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={cardBase}>
            <h2 style={{ margin: "0 0 24px", fontSize: 18, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d", fontWeight: 600 }}>Interest Types</h2>
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={destinationStats}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {destinationStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: theme === 'dark' ? "#1e293b" : "#fff", border: "none", borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

