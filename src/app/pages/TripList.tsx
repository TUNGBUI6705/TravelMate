import { useEffect, useMemo, useState } from "react";
import { tripService } from "../../data/services/tripService.js";
import { Calendar, MapPin, Users, DollarSign, ChevronRight, Search, X, Clock, Map as MapIcon } from "lucide-react";

export default function TripList() {
  const [trips, setTrips] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadTrips = async () => {
      try {
        const data = await tripService.getAll();
        if (!isMounted) return;
        setTrips(data);
      } catch (err) {
        if (!isMounted) return;
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadTrips();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTrips = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return trips.filter((trip) => {
      if (!normalizedQuery) return true;
      const searchableText = `${trip.title} ${trip.destination} ${trip.ownerName || ""}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [query, trips]);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>Trip Management</h1>
          <p style={{ margin: "8px 0 0", color: "#647087" }}>
            Monitor all planned trips and itineraries.
          </p>
        </div>
        <div style={{ position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search trips, destinations..."
            style={{
              height: 44,
              width: 300,
              border: "1px solid #d9e0ea",
              borderRadius: 10,
              padding: "0 12px 0 40px",
              fontSize: 14,
              outline: "none",
              background: "#fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
            }}
          />
        </div>
      </div>

      {loading && (
        <div style={{ padding: 40, textAlign: "center", color: "#647087" }}>
          Loading trips...
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 20 }}>
        {!loading && filteredTrips.map((trip) => (
          <div
            key={trip.id}
            onClick={() => setSelectedTrip(trip)}
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #e8ecf3",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer"
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ padding: 20, flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 18, color: "#1f2a3d", fontWeight: 600 }}>{trip.title || "Untitled Trip"}</h3>
                <span style={{
                  background: trip.status === 'completed' ? '#f1f5f9' : '#dcfce7',
                  color: trip.status === 'completed' ? '#475569' : '#15803d',
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase"
                }}>
                  {trip.status || "Planned"}
                </span>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#647087", fontSize: 14 }}>
                  <MapPin size={16} color="#3b82f6" />
                  <span>{trip.destination || "Not specified"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#647087", fontSize: 14 }}>
                  <Calendar size={16} color="#3b82f6" />
                  <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#647087", fontSize: 14 }}>
                  <Users size={16} color="#3b82f6" />
                  <span>{Array.isArray(trip.members) ? trip.members.length : 1} Members</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#647087", fontSize: 14 }}>
                  <DollarSign size={16} color="#3b82f6" />
                  <span>Budget: <strong style={{ color: "#1f2a3d" }}>{(Number(trip.budget) || 0).toLocaleString()} VND</strong></span>
                </div>
              </div>

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#3b82f6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>
                  {(trip.ownerName || "U").charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Organizer</p>
                  <p style={{ margin: 0, fontSize: 14, color: "#1f2a3d", fontWeight: 500 }}>{trip.ownerName || "Unknown User"}</p>
                </div>
                <ChevronRight size={18} color="#94a3b8" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && filteredTrips.length === 0 && (
        <div style={{ padding: 60, textAlign: "center", background: "#fff", borderRadius: 16, border: "1px solid #e8ecf3" }}>
          <div style={{ color: "#94a3b8", marginBottom: 12 }}><Search size={40} /></div>
          <h3 style={{ margin: 0, color: "#1f2a3d" }}>No trips found</h3>
          <p style={{ margin: "8px 0 0", color: "#647087" }}>Try adjusting your search query.</p>
        </div>
      )}

      {selectedTrip && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex",
          alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{
            background: "#fff", borderRadius: 16, width: "100%", maxWidth: 800,
            maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column"
          }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e8ecf3", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: 20, color: "#1f2a3d" }}>Trip Details</h2>
              <button onClick={() => setSelectedTrip(null)} style={{ border: "none", background: "none", cursor: "pointer", color: "#647087" }}><X size={24} /></button>
            </div>

            <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
                <div>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16, color: "#1f2a3d" }}>General Information</h3>
                  <div style={{ display: "grid", gap: 12 }}>
                    <div style={{ display: "flex", gap: 12 }}>
                      <MapIcon size={18} color="#3b82f6" />
                      <div>
                        <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Trip Title</p>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{selectedTrip.title}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <MapPin size={18} color="#3b82f6" />
                      <div>
                        <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Destination</p>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{selectedTrip.destination}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <Calendar size={18} color="#3b82f6" />
                      <div>
                        <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Duration</p>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
                          {new Date(selectedTrip.startDate).toLocaleDateString()} - {new Date(selectedTrip.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16, color: "#1f2a3d" }}>Participants & Budget</h3>
                  <div style={{ display: "grid", gap: 12 }}>
                    <div style={{ display: "flex", gap: 12 }}>
                      <Users size={18} color="#3b82f6" />
                      <div>
                        <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Members</p>
                        <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                          {Array.isArray(selectedTrip.members) ? selectedTrip.members.map((m, i) => (
                            <div key={i} title={m.name || m.email} style={{ width: 28, height: 28, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, border: "2px solid #fff" }}>
                              {String(m.name || m.email || "?").charAt(0).toUpperCase()}
                            </div>
                          )) : "1 Member"}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <DollarSign size={18} color="#3b82f6" />
                      <div>
                        <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Total Budget</p>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#10b981" }}>{(Number(selectedTrip.budget) || 0).toLocaleString()} VND</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h3 style={{ margin: "0 0 16px", fontSize: 16, color: "#1f2a3d" }}>Full Itinerary</h3>
              {selectedTrip.itinerary && Array.isArray(selectedTrip.itinerary) && selectedTrip.itinerary.length > 0 ? (
                <div style={{ display: "grid", gap: 16 }}>
                  {selectedTrip.itinerary.map((day, idx) => (
                    <div key={idx} style={{ padding: 16, border: "1px solid #e2e8f0", borderRadius: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <div style={{ background: "#3b82f6", color: "#fff", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                          {idx + 1}
                        </div>
                        <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{day.title || `Day ${idx + 1}`}</h4>
                      </div>
                      <div style={{ display: "grid", gap: 8, paddingLeft: 34 }}>
                        {day.activities && day.activities.map((act, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "start", gap: 10 }}>
                            <Clock size={14} color="#94a3b8" style={{ marginTop: 2 }} />
                            <div>
                              <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{act.time} - {act.title}</p>
                              {act.location && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#647087" }}>📍 {act.location}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: 20, textAlign: "center", background: "#f8fafc", borderRadius: 12, color: "#647087" }}>
                  No detailed itinerary available for this trip.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


