import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { placeService } from "../../data/services/placeService.js";
import { formatDateValue } from "../utils/date.js";
import { MapPin, Star, ExternalLink, Navigation, Phone, Globe, ChevronLeft, Calendar, Info, DollarSign } from "lucide-react";
import { openRouteService } from "../../data/services/openRouteService.js";

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
        const data = await placeService.getById(placeId);
        if (!isMounted) return;
        if (!data) setError("Place not found");
        else setPlace(data);
      } catch (err) {
        if (isMounted) setError("Failed to load place details");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadPlace();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => isMounted && setUserLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => console.log("Location denied")
      );
    }
    return () => { isMounted = false; };
  }, [placeId]);

  const getDirections = async () => {
    if (!place?.coordinates || !userLocation) return;
    try {
      setLoadingDirections(true);
      const data = await openRouteService.getDirections(
        userLocation.lat, userLocation.lng,
        place.coordinates.lat, place.coordinates.lng, 'driving-car'
      );
      if (data?.routes?.[0]) {
        const route = data.routes[0];
        setDirections({
          distance: (route.summary.distance / 1000).toFixed(1),
          duration: Math.round(route.summary.duration / 60)
        });
      }
    } catch (err) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${place.coordinates.lat},${place.coordinates.lng}`;
      window.open(url, "_blank");
    } finally {
      setLoadingDirections(false);
    }
  };

  if (isLoading) return <div style={{ padding: 60, textAlign: "center", color: "#647087" }}>Loading details...</div>;
  if (error || !place) return <div style={{ padding: 40, background: "#fef2f2", color: "#b91c1c", borderRadius: 12 }}>{error || "Place not found"}</div>;

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <button
        onClick={() => navigate("/places")}
        style={{ display: "flex", alignItems: "center", gap: 8, border: "none", background: "none", color: "#3b82f6", fontWeight: 600, cursor: "pointer", padding: 0 }}
      >
        <ChevronLeft size={20} /> Back to Destinations
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
        {/* Left Column: Image & Main Info */}
        <div style={{ display: "grid", gap: 24 }}>
          <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #e8ecf3" }}>
            <div style={{ height: 400, position: "relative" }}>
              <img
                src={place.coverImage || "https://images.unsplash.com/photo-1469474968028-56623f02e42e"}
                alt={place.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 32, background: "linear-gradient(transparent, rgba(0,0,0,0.8))", color: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
                  <div>
                    <span style={{ background: "#3b82f6", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>{place.type || place.category}</span>
                    <h1 style={{ margin: "12px 0 8px", fontSize: 40, fontWeight: 700 }}>{place.name}</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, opacity: 0.9 }}>
                      <MapPin size={18} />
                      {place.location || `${place.city}, ${place.province}`}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.2)", padding: "8px 16px", borderRadius: 12, backdropFilter: "blur(8px)" }}>
                      <Star size={20} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ fontSize: 20, fontWeight: 700 }}>{place.stats?.avgRating?.toFixed(1) || "4.5"}</span>
                    </div>
                    <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.8 }}>{place.stats?.totalReviews || 0} Reviews</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: 32 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 20, color: "#1f2a3d", fontWeight: 700 }}>Description</h3>
              <p style={{ margin: 0, fontSize: 16, color: "#475569", lineHeight: 1.8 }}>
                {place.description || "No description available for this beautiful destination. It's a must-visit spot that offers unique experiences and breathtaking views."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Stats & Map */}
        <div style={{ display: "grid", gap: 24, height: "fit-content" }}>
          <div style={{ background: "#fff", padding: 24, borderRadius: 16, border: "1px solid #e8ecf3" }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, color: "#1f2a3d", fontWeight: 700 }}>Details</h3>
            <div style={{ display: "grid", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: "#f8fafc", borderRadius: 12 }}>
                <DollarSign size={20} color="#10b981" />
                <div>
                  <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Entry Fee</p>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{place.entryFee ? `${place.entryFee.toLocaleString()} VND` : "Free Entrance"}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: "#f8fafc", borderRadius: 12 }}>
                <Calendar size={20} color="#3b82f6" />
                <div>
                  <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Created At</p>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{formatDateValue(place.createdAt)}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: "#f8fafc", borderRadius: 12 }}>
                <Info size={20} color="#f59e0b" />
                <div>
                  <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Status</p>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: place.status === 'active' ? '#10b981' : '#ef4444' }}>
                    {place.status?.toUpperCase() || "ACTIVE"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", padding: 24, borderRadius: 16, border: "1px solid #e8ecf3" }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, color: "#1f2a3d", fontWeight: 700 }}>Location</h3>
            {place.coordinates ? (
              <div style={{ display: "grid", gap: 16 }}>
                <iframe
                  width="100%" height="200"
                  style={{ borderRadius: 12, border: 0 }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.coordinates.lng - 0.01},${place.coordinates.lat - 0.01},${place.coordinates.lng + 0.01},${place.coordinates.lat + 0.01}&layer=mapnik&marker=${place.coordinates.lat},${place.coordinates.lng}`}
                />
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={getDirections}
                    disabled={loadingDirections}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#1d4ed8", color: "#fff", border: "none", padding: "10px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}
                  >
                    <Navigation size={18} /> {loadingDirections ? "Loading..." : "Directions"}
                  </button>
                  <a
                    href={`https://maps.google.com/?q=${place.coordinates.lat},${place.coordinates.lng}`}
                    target="_blank" rel="noreferrer"
                    style={{ background: "#f1f5f9", color: "#1f2a3d", padding: "10px", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
                {directions && (
                  <div style={{ padding: "12px", background: "#ecfdf5", border: "1px solid #10b981", borderRadius: 10, color: "#065f46", fontSize: 13, fontWeight: 500 }}>
                    Estimated {directions.distance} km away ({directions.duration} min drive)
                  </div>
                )}
              </div>
            ) : <p style={{ color: "#94a3b8", fontSize: 14 }}>No coordinates available.</p>}
          </div>

          {(place.phone || place.website) && (
            <div style={{ background: "#fff", padding: 24, borderRadius: 16, border: "1px solid #e8ecf3" }}>
              <h3 style={{ margin: "0 0 20px", fontSize: 18, color: "#1f2a3d", fontWeight: 700 }}>Contact Info</h3>
              <div style={{ display: "grid", gap: 12 }}>
                {place.phone && (
                  <a href={`tel:${place.phone}`} style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "#1f2a3d" }}>
                    <div style={{ background: "#eff6ff", padding: 8, borderRadius: 8, color: "#3b82f6" }}><Phone size={18} /></div>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{place.phone}</span>
                  </a>
                )}
                {place.website && (
                  <a href={place.website} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "#1f2a3d" }}>
                    <div style={{ background: "#eff6ff", padding: 8, borderRadius: 8, color: "#3b82f6" }}><Globe size={18} /></div>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>Visit Official Website</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

