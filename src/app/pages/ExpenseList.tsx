import { useEffect, useMemo, useState } from "react";
import { expenseService } from "../../data/services/expenseService.js";

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

  const columns = useMemo(() => {
    const keys = new Set();
    expenses.forEach((item) => {
      Object.keys(item || {}).forEach((key) => keys.add(key));
    });
    return ["id", ...Array.from(keys).filter((key) => key !== "id")];
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
    <div style={{ display: "grid", gap: 14 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>Expenses</h1>
        <p style={{ margin: "8px 0 0", color: "#647087" }}>
          View and search expense records from your Realtime Database.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", gap: 10, background: "#ffffff", border: "1px solid #e8ecf3", borderRadius: 12, padding: 12 }}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search expenses by any field..."
          style={{ height: 40, border: "1px solid #d9e0ea", borderRadius: 8, padding: "0 12px", fontSize: 14, outline: "none" }}
        />
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8ecf3", borderRadius: 12, overflow: "auto" }}>
        {loading && (
          <div style={{ padding: 28, textAlign: "center", color: "#647087" }}>
            Loading expense records from backend...
          </div>
        )}
        {error && (
          <div style={{ padding: 28, textAlign: "center", color: "#b42318" }}>
            Error loading expenses: {error}
          </div>
        )}
        {!loading && !error && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f7f9fc" }}>
                {columns.map((col) => (
                  <th key={col} style={{ textAlign: "left", padding: "12px 14px", fontSize: 12, color: "#5e6b81", borderBottom: "1px solid #e8ecf3" }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  {columns.map((column) => (
                    <td key={`${expense.id}-${column}`} style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#1f2a3d", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      {renderCell(expense[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && filteredExpenses.length === 0 && (
          <div style={{ padding: 28, textAlign: "center", color: "#647087" }}>
            No expense records found in your backend.
          </div>
        )}
      </div>
    </div>
  );
}
