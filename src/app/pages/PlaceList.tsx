import { useEffect, useMemo, useState } from "react";
import { placeService } from "../../data/services/placeService.js";

export default function PlaceList() {
  const [places, setPlaces] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadPlaces = async () => {
      try {
        const data = await placeService.getAll();
        if (!isMounted) return;
        setPlaces(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadPlaces();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(places.map((place) => place.category));
    return ["all", ...Array.from(set)];
  }, [places]);

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const matchQuery =
        query.trim().length === 0 ||
        (place.name || "").toLowerCase().includes(query.toLowerCase()) ||
        (place.location || "").toLowerCase().includes(query.toLowerCase());
      const matchCategory = category === "all" || place.category === category;
      return matchQuery && matchCategory;
    });
  }, [places, query, category]);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>Destination Management</h1>
        <p style={{ margin: "8px 0 0", color: "#647087" }}>
          Full destination listing loaded from Realtime Database.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 200px",
          gap: 10,
          background: "#ffffff",
          border: "1px solid #e8ecf3",
          borderRadius: 12,
          padding: 12,
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by place name or location..."
          style={{
            height: 40,
            border: "1px solid #d9e0ea",
            borderRadius: 8,
            padding: "0 12px",
            fontSize: 14,
            outline: "none",
          }}
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          style={{
            height: 40,
            border: "1px solid #d9e0ea",
            borderRadius: 8,
            padding: "0 10px",
            fontSize: 14,
            outline: "none",
            background: "#fff",
          }}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All categories" : item}
            </option>
          ))}
        </select>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8ecf3", borderRadius: 12, overflow: "hidden" }}>
        {loading && (
          <div style={{ padding: 28, textAlign: "center", color: "#647087" }}>
            Loading places from backend...
          </div>
        )}
        {error && (
          <div style={{ padding: 28, textAlign: "center", color: "#b42318" }}>
            Error loading places: {error}
          </div>
        )}
        {!loading && !error && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f7f9fc" }}>
              {["ID", "Name", "Location", "Category", "Status"].map((col) => (
                <th
                  key={col}
                  style={{
                    textAlign: "left",
                    padding: "12px 14px",
                    fontSize: 12,
                    color: "#5e6b81",
                    borderBottom: "1px solid #e8ecf3",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPlaces.map((place) => (
              <tr key={place.id}>
                <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#1f2a3d" }}>{place.id}</td>
                <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#1f2a3d", fontWeight: 600 }}>
                  {place.name}
                </td>
                <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#4d5a72" }}>{place.location}</td>
                <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#4d5a72" }}>{place.category}</td>
                <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#4d5a72", textTransform: "capitalize" }}>
                  {place.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}

        {!loading && !error && filteredPlaces.length === 0 && (
          <div style={{ padding: 28, textAlign: "center", color: "#647087" }}>
            No place data yet. Add real data from your backend source.
          </div>
        )}
      </div>
    </div>
  );
}
