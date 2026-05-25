import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { placeService } from "../../data/services/placeService.js";
import { formatDateValue } from "../utils/date.js";
import { MapPin, Star, ExternalLink, Navigation, Phone, Globe } from "lucide-react";

export default function PlaceDetails() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [directions, setDirections] = useState(null);
  const [loadingDirections, setLoadingDirections] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadPlace = async () => {
      try {
        setIsLoading(true);
        setError("");
        console.log("🔍 Loading place details for:", placeId);
        const data = await placeService.getById(placeId);

        if (!isMounted) return;

        if (!data) {
          setError("Place not found");
        } else {
          setPlace(data);
          console.log("✅ Loaded place:", data);
        }
      } catch (err) {
        console.error("❌ Failed to load place:", err);
        if (!isMounted) return;
        setError("Failed to load place details");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPlace();

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (isMounted) {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          }
        },
        (error) => {
          console.log("Location permission denied:", error.message);
        }
      );
    }

    return () => {
      isMounted = false;
    };
  }, [placeId]);

  const getDirections = async () => {
    if (!place?.coordinates) {
      alert("Place coordinates not available");
      return;
    }

    if (!userLocation) {
      alert("Please enable location permission to get directions");
      return;
    }

    try {
      setLoadingDirections(true);
      setError("");

      // Use OpenRoute Service API
      const apiKey = import.meta.env.VITE_OPENROUTE_SERVICE_API_KEY;
      if (!apiKey) {
        // Fallback to Google Maps directions
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${place.coordinates.lat},${place.coordinates.lng}`;
        window.open(googleMapsUrl, "_blank");
        return;
      }

      const url = `https://api.openrouteservice.org/v2/directions/driving?api_key=${apiKey}&start=${userLocation.lng},${userLocation.lat}&end=${place.coordinates.lng},${place.coordinates.lat}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to get directions");

      const data = await response.json();
      const route = data.routes[0];

      if (route) {
        setDirections({
          distance: (route.summary.distance / 1000).toFixed(2), // km
          duration: Math.round(route.summary.duration / 60), // minutes
          route: route,
        });
      }
    } catch (err) {
      console.error("❌ Failed to get directions:", err);
      // Fallback to Google Maps
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${place.coordinates.lat},${place.coordinates.lng}`;
      window.open(googleMapsUrl, "_blank");
    } finally {
      setLoadingDirections(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: "grid", gap: 14 }}>
        <button
          onClick={() => navigate("/places")}
          style={{
            padding: "6px 12px",
            background: "transparent",
            border: "1px solid #d9e0ea",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13,
            width: "fit-content",
          }}
        >
          ← Back to Places
        </button>
        <div style={{ padding: 40, textAlign: "center", color: "#647087" }}>
          <p>Loading place details...</p>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div style={{ display: "grid", gap: 14 }}>
        <button
          onClick={() => navigate("/places")}
          style={{
            padding: "6px 12px",
            background: "transparent",
            border: "1px solid #d9e0ea",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13,
            width: "fit-content",
          }}
        >
          ← Back to Places
        </button>
        <div style={{ padding: 20, background: "#fef2f2", color: "#b91c1c", borderRadius: 8 }}>
          {error || "Place not found"}
        </div>
      </div>
    );
  }

  // Generate map embed URL
  const mapEmbedUrl = place.coordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${place.coordinates.lng - 0.01},${place.coordinates.lat - 0.01},${place.coordinates.lng + 0.01},${place.coordinates.lat + 0.01}&layer=mapnik&marker=${place.coordinates.lat},${place.coordinates.lng}`
    : null;

  const googleMapsUrl = place.coordinates
    ? `https://maps.google.com/?q=${place.coordinates.lat},${place.coordinates.lng}`
    : null;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <button
        onClick={() => navigate("/places")}
        style={{
          padding: "6px 12px",
          background: "transparent",
          border: "1px solid #d9e0ea",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 13,
          width: "fit-content",
        }}
      >
        ← Back to Places
      </button>

      <div style={{ background: "#fff", border: "1px solid #e8ecf3", borderRadius: 8, overflow: "hidden" }}>
        {place.coverImage && (
          <img
            src={place.coverImage}
            alt={place.name}
            style={{ width: "100%", height: 400, objectFit: "cover" }}
          />
        )}

        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "start", gap: 16, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 32, color: "#1f2a3d", fontWeight: 600 }}>
                {place.name || "Unnamed Place"}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, color: "#647087" }}>
                <MapPin size={16} />
                <span>{place.city || "Unknown"}, {place.province || "Unknown"}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Star size={20} color="#f59e0b" fill="#f59e0b" />
              <div>
                <p style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#1f2a3d" }}>
                  {place.stats?.avgRating?.toFixed(1) || "N/A"}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#647087" }}>
                  {place.stats?.totalReviews || 0} reviews
                </p>
              </div>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: 15, color: "#647087", lineHeight: 1.6 }}>
            {place.description || "No description provided"}
          </p>

          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div style={{ padding: 12, background: "#f0f9ff", borderRadius: 8 }}>
              <p style={{ margin: 0, fontSize: 12, color: "#0369a1", fontWeight: 600 }}>Type</p>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "#1f2a3d", fontWeight: 600 }}>
                {place.type || "N/A"}
              </p>
            </div>
            <div style={{ padding: 12, background: "#f0f9ff", borderRadius: 8 }}>
              <p style={{ margin: 0, fontSize: 12, color: "#0369a1", fontWeight: 600 }}>Entry Fee</p>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "#1f2a3d", fontWeight: 600 }}>
                {!place.entryFee ? "Free" : `${(place.entryFee ?? 0).toLocaleString()} VND`}
              </p>
            </div>
            <div style={{ padding: 12, background: "#f0f9ff", borderRadius: 8 }}>
              <p style={{ margin: 0, fontSize: 12, color: "#0369a1", fontWeight: 600 }}>Status</p>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 14,
                  fontWeight: 600,
                  color: (place.status || "unknown") === "active" ? "#15803d" : "#991b1b",
                }}
              >
                {place.status || "Unknown"}
              </p>
            </div>
            <div style={{ padding: 12, background: "#f0f9ff", borderRadius: 8 }}>
              <p style={{ margin: 0, fontSize: 12, color: "#0369a1", fontWeight: 600 }}>Created</p>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "#1f2a3d", fontWeight: 600 }}>
                {formatDateValue(place.createdAt)}
              </p>
            </div>
          </div>

          {place.coordinates && (
            <div style={{ marginTop: 24, padding: 12, background: "#f0f9ff", borderRadius: 8 }}>
              <p style={{ margin: 0, fontSize: 12, color: "#0369a1", fontWeight: 600 }}>Coordinates</p>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#1f2a3d", fontFamily: "monospace" }}>
                Lat: {(place.coordinates?.lat ?? 0).toFixed(4)} | Lng: {(place.coordinates?.lng ?? 0).toFixed(4)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Map Section */}
      {place.coordinates && mapEmbedUrl && (
        <div style={{ background: "#fff", border: "1px solid #e8ecf3", borderRadius: 8, overflow: "hidden" }}>
          <div style={{ padding: 16, borderBottom: "1px solid #e8ecf3" }}>
            <h2 style={{ margin: 0, fontSize: 18, color: "#1f2a3d", fontWeight: 600 }}>Location Map</h2>
          </div>
          <iframe
            width="100%"
            height="400"
            src={mapEmbedUrl}
            style={{ border: 0, display: "block" }}
            title="Place location map"
            allow="geolocation"
          />
          <div style={{ padding: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={getDirections}
              disabled={loadingDirections}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                background: loadingDirections ? "#ccc" : "#0369a1",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: loadingDirections ? "wait" : "pointer",
              }}
            >
              <Navigation size={16} />
              {loadingDirections ? "Getting directions..." : "Get Directions"}
            </button>
            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 16px",
                  background: "#dbeafe",
                  color: "#0369a1",
                  border: "1px solid #bfdbfe",
                  borderRadius: 6,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <ExternalLink size={14} />
                View on Google Maps
              </a>
            )}
          </div>
        </div>
      )}

      {/* Directions Info */}
      {directions && (
        <div
          style={{
            padding: 16,
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: 8,
            color: "#065f46",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            Route Information
          </h3>
          <p style={{ margin: 0, fontSize: 13 }}>
            📍 <strong>Distance:</strong> {directions.distance} km
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 13 }}>
            ⏱️ <strong>Estimated Time:</strong> {directions.duration} minutes
          </p>
        </div>
      )}

      {/* Contact & Website Info */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8ecf3",
          borderRadius: 8,
          padding: 16,
        }}
      >
        <h2 style={{ margin: "0 0 12px", fontSize: 18, color: "#1f2a3d", fontWeight: 600 }}>
          Additional Information
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
          {place.phone && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, background: "#f9fafb", borderRadius: 6 }}>
              <Phone size={16} color="#0369a1" />
              <div>
                <p style={{ margin: 0, fontSize: 12, color: "#647087" }}>Phone</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 600, color: "#1f2a3d" }}>
                  {place.phone}
                </p>
              </div>
            </div>
          )}
          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: 12,
                background: "#f9fafb",
                borderRadius: 6,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <Globe size={16} color="#0369a1" />
              <div>
                <p style={{ margin: 0, fontSize: 12, color: "#647087" }}>Website</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 600, color: "#1f2a3d" }}>
                  Visit Website →
                </p>
              </div>
            </a>
          )}
          {place.email && (
            <a
              href={`mailto:${place.email}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: 12,
                background: "#f9fafb",
                borderRadius: 6,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <Globe size={16} color="#0369a1" />
              <div>
                <p style={{ margin: 0, fontSize: 12, color: "#647087" }}>Email</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 600, color: "#1f2a3d" }}>
                  {place.email}
                </p>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
