import { useEffect, useMemo, useState } from "react";
import { expenseService } from "../../data/services/expenseService.js";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Wallet, TrendingUp, Calendar, Filter, Download } from "lucide-react";

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
  const [expenses, setExpenses] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const columns = useMemo(() => {
    const keys = new Set();
    expenses.forEach((item) => {
      Object.keys(item || {}).forEach((key) => keys.add(key));
    });
    return ["id", "amount", "category", "date", ...Array.from(keys).filter((key) => !["id", "amount", "category", "date"].includes(key))];
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return expenses.filter((expense) => {
      if (!normalizedQuery) return true;
      return columns.some((column) => {
        const value = renderCell(expense[column]);
        return value.toLowerCase().includes(normalizedQuery);
      });
    });
  }, [columns, query, expenses]);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>Expense Management</h1>
        <p style={{ margin: "8px 0 0", color: "#647087" }}>
          Track and analyze spending across all trips.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e8ecf3", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: "#eff6ff", padding: 12, borderRadius: 10, color: "#1d4ed8" }}><Wallet /></div>
          <div>
            <p style={{ margin: 0, fontSize: 13, color: "#647087" }}>Total Expenses</p>
            <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: "#1f2a3d" }}>
              {stats.total.toLocaleString()} VND
            </p>
          </div>
        </div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e8ecf3", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: "#ecfdf5", padding: 12, borderRadius: 10, color: "#059669" }}><TrendingUp /></div>
          <div>
            <p style={{ margin: 0, fontSize: 13, color: "#647087" }}>Average per Record</p>
            <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: "#1f2a3d" }}>
              {stats.avg.toLocaleString(undefined, { maximumFractionDigits: 0 })} VND
            </p>
          </div>
        </div>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e8ecf3", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: "#fff7ed", padding: 12, borderRadius: 10, color: "#d97706" }}><Calendar /></div>
          <div>
            <p style={{ margin: 0, fontSize: 13, color: "#647087" }}>Total Records</p>
            <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: "#1f2a3d" }}>
              {stats.count}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 20 }}>
        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e8ecf3" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, color: "#1f2a3d" }}>Spending Trend (Last 7 Days)</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip formatter={(value) => [`${value.toLocaleString()} VND`, "Amount"]} />
                <Line type="monotone" dataKey="amount" stroke="#1d4ed8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: "#fff", padding: 20, borderRadius: 12, border: "1px solid #e8ecf3" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16, color: "#1f2a3d" }}>Expenses by Category</h3>
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
                <Tooltip formatter={(value) => `${value.toLocaleString()} VND`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 18, color: "#1f2a3d" }}>Recent Transactions</h2>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={handleExportCSV}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#475569" }}
            >
              <Download size={16} /> Export CSV
            </button>
            <div style={{ position: "relative" }}>
              <Filter size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter expenses..."
                style={{ height: 40, border: "1px solid #d9e0ea", borderRadius: 8, padding: "0 12px 0 36px", fontSize: 14, outline: "none" }}
              />
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e8ecf3", borderRadius: 12, overflow: "auto" }}>
          {loading && (
            <div style={{ padding: 28, textAlign: "center", color: "#647087" }}>
              Loading expense records...
            </div>
          )}
          {!loading && !error && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f7f9fc" }}>
                  {["Date", "Category", "Amount", "Description"].map((col) => (
                    <th key={col} style={{ textAlign: "left", padding: "12px 14px", fontSize: 12, color: "#5e6b81", borderBottom: "1px solid #e8ecf3" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="table-row">
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#4d5a72", fontSize: 13 }}>
                      {new Date(expense.date || expense.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8" }}>
                      <span style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: 12, fontSize: 11, color: "#475569" }}>
                        {expense.category || "Uncategorized"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#1f2a3d", fontWeight: 600 }}>
                      {Number(expense.amount || 0).toLocaleString()} VND
                    </td>
                    <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#647087", fontSize: 13 }}>
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

