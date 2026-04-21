import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { placeService } from "../../data/services/placeService";
import { MapPin, Star } from "lucide-react";
import { MapComponent } from "../components/maps/MapComponent";
import type { Place } from "../../domain/models/Place";

const cardBase = {
  background: "#ffffff",
  border: "1px solid #e8ecf3",
  borderRadius: "12px",
  padding: "12px",
};

export default function PlaceList() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Place[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [newPlaceForm, setNewPlaceForm] = useState({
    name: "",
    type: "Other",
    city: "",
    province: "",
    description: "",
    address: "",
  });
  const [isSubmittingPlace, setIsSubmittingPlace] = useState(false);
  const [addPlaceError, setAddPlaceError] = useState("");

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (err) => {
            console.warn("Location access denied:", err);
            setUserLocation({
              lat: 21.0285,
              lon: 105.8542,
            });
          }
        );
      } else {
        setUserLocation({
          lat: 21.0285,
          lon: 105.8542,
        });
      }
    };

    getLocation();
  }, []);

  const loadPlaces = async () => {
    try {
      setIsLoading(true);
      setError("");

      console.log("🔍 Loading places from Firestore...");
      const firestorePlaces = await placeService.getAll();

      if (firestorePlaces.length === 0) {
        setError("❌ No places found in Firestore.");
        setPlaces([]);
        setIsLoading(false);
        return;
      }

      setPlaces(firestorePlaces);
      console.log("✅ Loaded", firestorePlaces.length, "places from Firestore");
      setError("");
      setIsLoading(false);
    } catch (err) {
      console.error("❌ Failed to load places:", err);
      setError("❌ Failed to load places from Firestore. Please try again.");
      setPlaces([]);
      setIsLoading(false);
    }
  };

  const handleMapClick = (coords: { lat: number; lon: number }) => {
    if (isAddingPlace) {
      setSelectedCoords(coords);
      fetchLocationDetails(coords.lat, coords.lon);
    }
  };

  const fetchLocationDetails = async (lat: number, lon: number) => {
    try {
      setAddPlaceError("");
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "vi,en",
          },
        }
      );

      if (!response.ok) {
        console.warn("Reverse geocoding failed:", response.status);
        return;
      }

      const data = await response.json();
      console.log("📍 Reverse geocoding result:", data);
      const address = data.address || {};
      const city = address.city || address.town || address.county || "";
      const province = address.state || "";
      const ward = address.suburb || address.quarter || address.neighbourhood || "";
      const address_str = data.display_name || "";
      setNewPlaceForm((prev) => ({
        ...prev,
        city: city,
        province: province,
        address: address_str,
      }));

      console.log("✅ Location details auto-filled:", { city, province, ward, address: address_str });
    } catch (err) {
      console.warn("Error fetching location details:", err);
    }
  };

  const handleAddNewPlace = async () => {
    try {
      if (!newPlaceForm.name.trim()) {
        setAddPlaceError("Place name is required");
        return;
      }
      if (!selectedCoords) {
        setAddPlaceError("Please select location on map");
        return;
      }
      const city = newPlaceForm.city.trim() || "Unknown City";
      const province = newPlaceForm.province.trim() || "Unknown Province";

      setIsSubmittingPlace(true);
      setAddPlaceError("");
      const userId = localStorage.getItem("userId") || "anonymous";
      const newPlace = {
        name: newPlaceForm.name.trim(),
        type: newPlaceForm.type,
        types: [newPlaceForm.type],
        city: city,
        province: province,
        description: newPlaceForm.description.trim(),
        address: newPlaceForm.address.trim(),
        location: {
          lat: selectedCoords.lat,
          lng: selectedCoords.lon,
        },
        createdBy: userId,
      };

      console.log("📍 Adding new place:", newPlace);
      const newPlaceId = await placeService.add(newPlace);
      console.log("✅ Place added successfully with ID:", newPlaceId);
      await loadPlaces();
      setIsAddingPlace(false);
      setSelectedCoords(null);
      setNewPlaceForm({
        name: "",
        type: "Other",
        city: "",
        province: "",
        description: "",
        address: "",
      });
      setTimeout(() => {
        navigate(`/places/${newPlaceId}`);
      }, 500);
    } catch (err) {
      console.error("❌ Failed to add place:", err);
      setAddPlaceError(`Failed to add place: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsSubmittingPlace(false);
    }
  };

  const filteredPlaces = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return places.filter((place) => {
      const matchQuery =
        normalizedQuery.length === 0 || place.name.toLowerCase().includes(normalizedQuery);

      let matchCategory = true;
      if (selectedCategory !== "all") {
        const placeTypes = place.types || [];
        matchCategory = placeTypes.some((t) =>
          t.toLowerCase().includes(selectedCategory.toLowerCase())
        );
      }

      return matchQuery && matchCategory;
    });
  }, [places, query, selectedCategory]);

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    places.forEach((place) => {
      (place.types || []).forEach((type) => {
        categories.add(type);
      });
    });
    return Array.from(categories).sort();
  }, [places]);

  const mapMarkers = filteredPlaces.map((place) => ({
    id: place.id,
    lat: place.location.lat,
    lon: place.location.lng,
    name: place.name,
    description: `${place.city}, ${place.province}`,
  }));

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      <div>
        <h1 style={{ margin: 0, fontSize: "28px", color: "#1f2a3d" }}>Place Directory</h1>
        <p style={{ margin: "8px 0 0", color: "#647087" }}>
          Browse places from Firestore database
        </p>
      </div>

      {error && (
        <div
          style={{
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#b91c1c",
            borderRadius: "10px",
            padding: "12px",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

        <div style={{ display: "grid", gap: "12px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 150px auto auto auto",
            gap: "10px",
            background: "#ffffff",
            border: "1px solid #e8ecf3",
            borderRadius: "12px",
            padding: "12px",
          }}
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by place name..."
            style={{
              height: "40px",
              border: "1px solid #d9e0ea",
              borderRadius: "8px",
              padding: "0 12px",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            disabled={availableCategories.length === 0}
            style={{
              height: "40px",
              border: "1px solid #d9e0ea",
              borderRadius: "8px",
              padding: "0 10px",
              fontSize: "14px",
              outline: "none",
              background: "#fff",
              opacity: availableCategories.length === 0 ? 0.5 : 1,
            }}
          >
            <option value="all">All categories</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            onClick={loadPlaces}
            disabled={isLoading}
            style={{
              padding: "8px 16px",
              background: "#1d4ed8",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: isLoading ? "progress" : "pointer",
              fontSize: "13px",
              fontWeight: "600",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? "Loading..." : "Load Places"}
          </button>
          <button
            onClick={() => setShowMap(!showMap)}
            style={{
              padding: "8px 16px",
              background: "#0f766e",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            {showMap ? "Hide Map" : "Show Map"}
          </button>
          <button
            onClick={() => {
              setIsAddingPlace(!isAddingPlace);
              setSelectedCoords(null);
              setAddPlaceError("");
            }}
            style={{
              padding: "8px 16px",
              background: isAddingPlace ? "#dc2626" : "#059669",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            {isAddingPlace ? "Cancel" : "➕ Add Place"}
          </button>
        </div>
      </div>

      {showMap && userLocation && (
        <div style={cardBase}>
          <h2 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#1f2a3d" }}>
            Map View ({filteredPlaces.length} places)
            {isAddingPlace && <span style={{ color: "#dc2626", marginLeft: "8px", fontSize: "13px" }}>📍 Click to select location</span>}
          </h2>
          <MapComponent
            lat={userLocation.lat}
            lon={userLocation.lon}
            zoom={13}
            markers={mapMarkers}
            onMarkerClick={(markerId) => {
              if (!isAddingPlace) {
                const place = filteredPlaces.find((p) => p.id === markerId);
                if (place) {
                  navigate(`/places/${place.id}`);
                }
              }
            }}
            onMapClick={handleMapClick}
            style={{ height: "600px" }}
          />
          {isAddingPlace && selectedCoords && (
            <div style={{ marginTop: "12px", padding: "12px", background: "#f0fdf4", border: "1px solid #22c55e", borderRadius: "6px", fontSize: "13px", color: "#166534" }}>
              ✓ Location selected: {selectedCoords.lat.toFixed(4)}, {selectedCoords.lon.toFixed(4)}
            </div>
          )}
        </div>
      )}

      <div style={{ ...cardBase }}>
        <h2 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#1f2a3d" }}>
          Places ({filteredPlaces.length})
        </h2>

        {isLoading && (
          <div style={{ padding: "20px", textAlign: "center", color: "#647087" }}>
            Loading places...
          </div>
        )}

        {!isLoading && filteredPlaces.length === 0 && !error && (
          <div style={{ padding: "20px", textAlign: "center", color: "#647087" }}>
            No places found
          </div>
        )}

        {!isLoading && filteredPlaces.length > 0 && (
          <div style={{ display: "grid", gap: "12px" }}>
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                onClick={() => {
                  navigate(`/places/${place.id}`);
                }}
                style={{
                  ...cardBase,
                  padding: "12px",
                  border: "1px solid #e8ecf3",
                  cursor: "pointer",
                  background: "#ffffff",
                }}
              >
                <div style={{ display: "grid", gap: "8px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      gap: "12px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600", color: "#1f2a3d" }}>
                        {place.name}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          fontSize: "12px",
                          color: "#647087",
                          flexWrap: "wrap",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <MapPin size={12} />
                          {place.location.lat.toFixed(4)}, {place.location.lng.toFixed(4)}
                        </span>
                        {place.googleRating && (
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Star size={12} fill="#f59e0b" color="#f59e0b" />
                            {place.googleRating}
                          </span>
                        )}
                        <span>{place.type}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/places/${place.id}`);
                      }}
                      style={{
                        padding: "6px 12px",
                        background: "#1d4ed8",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Place Modal */}
      {isAddingPlace && selectedCoords && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
          }}
          onClick={() => {
            setIsAddingPlace(false);
            setSelectedCoords(null);
            setNewPlaceForm({
              name: "",
              type: "Other",
              city: "",
              province: "",
              description: "",
              address: "",
            });
          }}
        >
          <div
            style={{
              ...cardBase,
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
              <h2 style={{ margin: 0, fontSize: "18px", color: "#1f2a3d" }}>Add New Place</h2>
              <button
                onClick={() => {
                  setIsAddingPlace(false);
                  setSelectedCoords(null);
                  setNewPlaceForm({
                    name: "",
                    type: "Other",
                    city: "",
                    province: "",
                    description: "",
                    address: "",
                  });
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#647087",
                }}
              >
                ✕
              </button>
            </div>

            {addPlaceError && (
              <div
                style={{
                  border: "1px solid #fecaca",
                  background: "#fef2f2",
                  color: "#b91c1c",
                  borderRadius: "8px",
                  padding: "10px",
                  fontSize: "13px",
                  marginBottom: "12px",
                }}
              >
                {addPlaceError}
              </div>
            )}

            <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                  Place Name *
                </label>
                <input
                  type="text"
                  value={newPlaceForm.name}
                  onChange={(e) => setNewPlaceForm({ ...newPlaceForm, name: e.target.value })}
                  placeholder="Enter place name"
                  style={{
                    width: "100%",
                    height: "40px",
                    border: "1px solid #d9e0ea",
                    borderRadius: "6px",
                    padding: "0 12px",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                    City (Auto-filled)
                  </label>
                  <input
                    type="text"
                    value={newPlaceForm.city}
                    onChange={(e) => setNewPlaceForm({ ...newPlaceForm, city: e.target.value })}
                    placeholder="Will be auto-filled from location"
                    style={{
                      width: "100%",
                      height: "40px",
                      border: "1px solid #d9e0ea",
                      borderRadius: "6px",
                      padding: "0 12px",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                      background: newPlaceForm.city ? "#f3f4f6" : "#fff",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                    Province (Auto-filled)
                  </label>
                  <input
                    type="text"
                    value={newPlaceForm.province}
                    onChange={(e) => setNewPlaceForm({ ...newPlaceForm, province: e.target.value })}
                    placeholder="Will be auto-filled from location"
                    style={{
                      width: "100%",
                      height: "40px",
                      border: "1px solid #d9e0ea",
                      borderRadius: "6px",
                      padding: "0 12px",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                      background: newPlaceForm.province ? "#f3f4f6" : "#fff",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                  Category
                </label>
                <select
                  value={newPlaceForm.type}
                  onChange={(e) => setNewPlaceForm({ ...newPlaceForm, type: e.target.value })}
                  style={{
                    width: "100%",
                    height: "40px",
                    border: "1px solid #d9e0ea",
                    borderRadius: "6px",
                    padding: "0 12px",
                    fontSize: "13px",
                    outline: "none",
                    background: "#fff",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="Other">Other</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Cafe">Cafe</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Attraction">Attraction</option>
                  <option value="Beach">Beach</option>
                  <option value="Mountain">Mountain</option>
                  <option value="Temple">Temple</option>
                  <option value="Park">Park</option>
                  <option value="Museum">Museum</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                  Address (Auto-filled)
                </label>
                <input
                  type="text"
                  value={newPlaceForm.address}
                  onChange={(e) => setNewPlaceForm({ ...newPlaceForm, address: e.target.value })}
                  placeholder="Will be auto-filled from location"
                  style={{
                    width: "100%",
                    height: "40px",
                    border: "1px solid #d9e0ea",
                    borderRadius: "6px",
                    padding: "0 12px",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                    background: newPlaceForm.address ? "#f3f4f6" : "#fff",
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                  Description
                </label>
                <textarea
                  value={newPlaceForm.description}
                  onChange={(e) => setNewPlaceForm({ ...newPlaceForm, description: e.target.value })}
                  placeholder="Enter description (optional)"
                  style={{
                    width: "100%",
                    height: "80px",
                    border: "1px solid #d9e0ea",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    fontSize: "13px",
                    outline: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ padding: "10px", background: "#f3f4f6", borderRadius: "6px", fontSize: "12px", color: "#6b7280" }}>
                <strong>Location:</strong> {selectedCoords.lat.toFixed(6)}, {selectedCoords.lon.toFixed(6)}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <button
                onClick={() => {
                  setIsAddingPlace(false);
                  setSelectedCoords(null);
                  setNewPlaceForm({
                    name: "",
                    type: "Other",
                    city: "",
                    province: "",
                    description: "",
                    address: "",
                  });
                }}
                style={{
                  padding: "10px",
                  background: "#e5e7eb",
                  color: "#374151",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewPlace}
                disabled={isSubmittingPlace}
                style={{
                  padding: "10px",
                  background: "#059669",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: isSubmittingPlace ? "progress" : "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  opacity: isSubmittingPlace ? 0.6 : 1,
                }}
              >
                {isSubmittingPlace ? "Creating..." : "Create Place"}
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showDetails && selectedPlace && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowDetails(false)}
        >
          <div
            style={{
              ...cardBase,
              maxWidth: "500px",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "16px" }}>
              <h2 style={{ margin: 0, fontSize: "18px", color: "#1f2a3d" }}>{selectedPlace.name}</h2>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#647087",
                }}
              >
                ✕
              </button>
            </div>

            {selectedPlace.image && (
              <img
                src={selectedPlace.image}
                alt={selectedPlace.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "12px",
                }}
              />
            )}

            <div style={{ display: "grid", gap: "12px", fontSize: "13px", color: "#647087" }}>
              {selectedPlace.rating && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ fontWeight: "600" }}>Rating: {selectedPlace.rating.toFixed(1)}</span>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "start", gap: "8px" }}>
                <MapPin size={14} style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontWeight: "600" }}>Location</div>
                  <div>{selectedPlace.lat ? selectedPlace.lat.toFixed(6) : "N/A"}, {selectedPlace.lon ? selectedPlace.lon.toFixed(6) : "N/A"}</div>
                  {selectedPlace.description && <div style={{ marginTop: "4px" }}>{selectedPlace.description}</div>}
                </div>
              </div>

              {selectedPlace.types && selectedPlace.types.length > 0 && (
                <div>
                  <div style={{ fontWeight: "600", marginBottom: "6px" }}>Categories</div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {selectedPlace.types.map((type) => (
                      <span
                        key={type}
                        style={{
                          background: "#e0f2fe",
                          color: "#0369a1",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "16px" }}>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  padding: "10px",
                  background: "#e5e7eb",
                  color: "#374151",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowMap(true);
                  setShowDetails(false);
                  setTimeout(() => {
                    document.querySelector('[style*="height: 600px"]')?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                style={{
                  padding: "10px",
                  background: "#0f766e",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                View on Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
