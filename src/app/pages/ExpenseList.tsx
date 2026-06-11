import { useEffect, useMemo, useState } from "react";
import { expenseService } from "../../data/services/expenseService.js";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Wallet, TrendingUp, Calendar, Filter, Download } from "lucide-react";
import { useTheme } from "../utils/ThemeContext";

function renderCell(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function ExpenseList() {
  const { theme } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isDark = theme === 'dark';

  useEffect(() => {
    let isMounted = true;
    const loadExpenses = async () => {
      try {
        const data = await expenseService.getAll();
        if (!isMounted) return;
        setExpenses(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadExpenses();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredExpenses = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return expenses.filter(exp => {
      const category = (exp.category || "").toLowerCase();
      const desc = (exp.description || exp.note || "").toLowerCase();
      return category.includes(normalized) || desc.includes(normalized);
    });
  }, [expenses, query]);

  const handleExportCSV = () => {
    const headers = ["ID", "Amount", "Category", "Date", "Description"];
    const rows = filteredExpenses.map(exp => [
      exp.id,
      exp.amount,
      exp.category || "Other",
      new Date(exp.date || exp.createdAt).toLocaleDateString(),
      exp.description || ""
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `expenses_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    const count = expenses.length;
    const avg = count > 0 ? total / count : 0;
    return { total, count, avg };
  }, [expenses]);

  const chartData = useMemo(() => {
    // Group by date
    const dailyMap = {};
    expenses.forEach(exp => {
      const date = new Date(exp.date || exp.createdAt || Date.now()).toLocaleDateString();
      dailyMap[date] = (dailyMap[date] || 0) + (Number(exp.amount) || 0);
    });

    return Object.entries(dailyMap)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days
  }, [expenses]);

  const categoryData = useMemo(() => {
    const catMap = {};
    expenses.forEach(exp => {
      const cat = exp.category || 'Other';
      catMap[cat] = (catMap[cat] || 0) + (Number(exp.amount) || 0);
    });
    return Object.entries(catMap).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, color: isDark ? "#f8fafc" : "#1f2a3d" }}>Quản lý chi tiêu</h1>
        <p style={{ margin: "8px 0 0", color: "#94a3b8" }}>
          Theo dõi và phân tích chi tiêu trên tất cả các chuyến đi.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        <div style={{ background: isDark ? "#1e293b" : "#fff", padding: 20, borderRadius: 12, border: isDark ? "1px solid #334155" : "1px solid #e8ecf3", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: isDark ? "rgba(59,130,246,0.1)" : "#eff6ff", padding: 12, borderRadius: 10, color: "#3b82f6" }}><Wallet /></div>
          <div>
            <p style={{ margin: 0, fontSize: 13, color: "#647087" }}>Tổng chi tiêu</p>
            <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: isDark ? "#f8fafc" : "#1f2a3d" }}>
              {stats.total.toLocaleString()} VND
            </p>
          </div>
        </div>
        <div style={{ background: isDark ? "#1e293b" : "#fff", padding: 20, borderRadius: 12, border: isDark ? "1px solid #334155" : "1px solid #e8ecf3", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: isDark ? "rgba(16,185,129,0.1)" : "#ecfdf5", padding: 12, borderRadius: 10, color: "#10b981" }}><TrendingUp /></div>
          <div>
            <p style={{ margin: 0, fontSize: 13, color: "#647087" }}>Trung bình mỗi bản ghi</p>
            <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: isDark ? "#f8fafc" : "#1f2a3d" }}>
              {stats.avg.toLocaleString(undefined, { maximumFractionDigits: 0 })} VND
            </p>
          </div>
        </div>
        <div style={{ background: isDark ? "#1e293b" : "#fff", padding: 20, borderRadius: 12, border: isDark ? "1px solid #334155" : "1px solid #e8ecf3", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: isDark ? "rgba(245,158,11,0.1)" : "#fff7ed", padding: 12, borderRadius: 10, color: "#f59e0b" }}><Calendar /></div>
          <div>
            <p style={{ margin: 0, fontSize: 13, color: "#647087" }}>Tổng số bản ghi</p>
            <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: isDark ? "#f8fafc" : "#1f2a3d" }}>
              {stats.count}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 20 }}>
        <div style={{ background: isDark ? "#1e293b" : "#fff", padding: 20, borderRadius: 12, border: isDark ? "1px solid #334155" : "1px solid #e8ecf3" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, color: isDark ? "#f8fafc" : "#1f2a3d" }}>Xu hướng chi tiêu (7 ngày qua)</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#f1f5f9"} />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} tick={{ fill: "#94a3b8" }} />
                <Tooltip
                  contentStyle={{ background: isDark ? "#1e293b" : "#fff", border: "none", borderRadius: 8, color: isDark ? "#f8fafc" : "#1f2a3d" }}
                  formatter={(value) => [`${value.toLocaleString()} VND`, "Số tiền"]}
                />
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: isDark ? "#1e293b" : "#fff", padding: 20, borderRadius: 12, border: isDark ? "1px solid #334155" : "1px solid #e8ecf3" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, color: isDark ? "#f8fafc" : "#1f2a3d" }}>Chi tiêu theo danh mục</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: isDark ? "#1e293b" : "#fff", border: "none", borderRadius: 8 }}
                  formatter={(value) => `${value.toLocaleString()} VND`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 18, color: isDark ? "#f8fafc" : "#1f2a3d" }}>Giao dịch gần đây</h2>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={handleExportCSV}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
                background: isDark ? "#334155" : "#f8fafc",
                border: isDark ? "1px solid #475569" : "1px solid #e2e8f0",
                borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500,
                color: isDark ? "#cbd5e1" : "#475569"
              }}
            >
              <Download size={16} /> Xuất CSV
            </button>
            <div style={{ position: "relative" }}>
              <Filter size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Lọc chi tiêu..."
                style={{
                  height: 40, border: isDark ? "1px solid #334155" : "1px solid #d9e0ea",
                  borderRadius: 8, padding: "0 12px 0 36px", fontSize: 14, outline: "none",
                  background: isDark ? "#1e293b" : "#fff", color: isDark ? "#f8fafc" : "#1f2a3d"
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ background: isDark ? "#1e293b" : "#fff", border: isDark ? "1px solid #334155" : "1px solid #e8ecf3", borderRadius: 12, overflow: "auto" }}>
          {loading && (
            <div style={{ padding: 28, textAlign: "center", color: "#647087" }}>
              Đang tải dữ liệu chi tiêu...
            </div>
          )}
          {!loading && !error && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: isDark ? "#334155" : "#f7f9fc" }}>
                  {["Ngày", "Danh mục", "Số tiền", "Mô tả"].map((col) => (
                    <th key={col} style={{ textAlign: "left", padding: "12px 14px", fontSize: 12, color: isDark ? "#94a3b8" : "#5e6b81", borderBottom: isDark ? "1px solid #1e293b" : "1px solid #e8ecf3" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} style={{ borderBottom: isDark ? "1px solid #334155" : "1px solid #eef2f8" }}>
                    <td style={{ padding: "12px 14px", color: isDark ? "#cbd5e1" : "#4d5a72", fontSize: 13 }}>
                      {new Date(expense.date || expense.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ background: isDark ? "#0f172a" : "#f1f5f9", padding: "2px 8px", borderRadius: 12, fontSize: 11, color: isDark ? "#94a3b8" : "#475569" }}>
                        {expense.category || "Chưa phân loại"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", color: isDark ? "#f8fafc" : "#1f2a3d", fontWeight: 600 }}>
                      {Number(expense.amount || 0).toLocaleString()} VND
                    </td>
                    <td style={{ padding: "12px 14px", color: isDark ? "#94a3b8" : "#647087", fontSize: 13 }}>
                      {expense.description || expense.note || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
