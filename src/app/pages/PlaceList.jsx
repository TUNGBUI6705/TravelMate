import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { placeService } from "../../data/services/placeService.js";
import { formatDateValue } from "../utils/date.js";
import { MapPin, Star } from "lucide-react";

const cardBase = {
  background: "#ffffff",
  border: "1px solid #e8ecf3",
  borderRadius: "12px",
  padding: "12px",
};

export default function PlaceList() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadPlaces = async () => {
      try {
        setIsLoading(true);
        setError("");
        console.log("🔍 Loading places from Firestore...");
        const firestorePlaces = await placeService.getAll();

        if (!isMounted) return;

        if (firestorePlaces.length === 0) {
          setError("ℹ️ No places found in Firestore. Try adding some places first.");
          setPlaces([]);
        } else {
          setPlaces(firestorePlaces);
          console.log("✅ Loaded", firestorePlaces.length, "places from Firestore");
        }
        setError("");
      } catch (err) {
        console.error("❌ Failed to load places:", err);
        if (!isMounted) return;
        setError("❌ Failed to load places. Check console for details.");
        setPlaces([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPlaces();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPlaces = useMemo(() => {
    let filtered = places;

    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) {
      filtered = filtered.filter((place) => {
        const name = (place.name || "").toLowerCase();
        const province = (place.province || "").toLowerCase();
        const city = (place.city || "").toLowerCase();
        return name.includes(normalizedQuery) || province.includes(normalizedQuery) || city.includes(normalizedQuery);
      });
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((place) => (place.type || "") === selectedCategory);
    }

    return filtered;
  }, [places, query, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set(places.map((p) => p.type).filter(Boolean));
    return Array.from(cats).sort();
  }, [places]);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>Place Management</h1>
        <p style={{ margin: "8px 0 0", color: "#647087" }}>
          Browse and manage all travel places in the system.
        </p>
      </div>

      {error && (
        <div style={{ padding: 12, borderRadius: 8, background: "#fef2f2", color: "#b91c1c", fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search places..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: 200,
            padding: "8px 12px",
            border: "1px solid #d9e0ea",
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #d9e0ea",
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#647087" }}>
          <p>📍 Loading places...</p>
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "#647087" }}>
          <p>No places found</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {filteredPlaces.map((place) => (
            <div key={place.id} style={cardBase}>
              {place.coverImage && (
                <img
                  src={place.coverImage}
                  alt={place.name}
                  style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8, marginBottom: 8 }}
                />
              )}
              <div style={{ display: "flex", alignItems: "start", gap: 8, marginBottom: 8 }}>
                <MapPin size={16} color="#0369a1" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1f2a3d" }}>{place.name || "Unnamed"}</h3>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#647087" }}>
                    {place.city || "Unknown"}, {place.province || "Unknown"}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Star size={14} color="#f59e0b" fill="#f59e0b" />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#1f2a3d" }}>
                  {place.stats?.avgRating?.toFixed(1) || "N/A"} ({place.stats?.totalReviews || 0} reviews)
                </span>
              </div>

              <p style={{ margin: "0 0 8px", fontSize: 12, color: "#647087", lineHeight: 1.4 }}>
                {place.description || "No description"}
              </p>

              <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>
                <p style={{ margin: "4px 0" }}>Type: <span style={{ fontWeight: 600 }}>{place.type || "N/A"}</span></p>
                <p style={{ margin: "4px 0" }}>Entry Fee: <span style={{ fontWeight: 600 }}>{!place.entryFee ? "Free" : `${(place.entryFee ?? 0).toLocaleString()} VND`}</span></p>
                <p style={{ margin: "4px 0" }}>Status: <span style={{ fontWeight: 600, color: place.status === "active" ? "#15803d" : "#991b1b" }}>{place.status || "Unknown"}</span></p>
                <p style={{ margin: "4px 0" }}>Created: {formatDateValue(place.createdAt || new Date())}</p>
              </div>

              <button
                onClick={() => navigate(`/places/${place.id}`)}
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  background: "#dbeafe",
                  color: "#0369a1",
                  border: "1px solid #bfdbfe",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: 12, background: "#f0f9ff", borderRadius: 8, fontSize: 12, color: "#0369a1" }}>
        Showing {filteredPlaces.length} of {places.length} places
      </div>
    </div>
  );
}
