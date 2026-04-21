import { useEffect, useRef, useState } from "react";

export interface RouteInfo {
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  coordinates?: Array<[number, number]>;
  distance?: number;
  duration?: number;
  color?: string;
}

interface MapComponentProps {
  lat: number;
  lon: number;
  zoom?: number;
  markers?: Array<{
    id: string;
    lat: number;
    lon: number;
    name: string;
    description?: string;
    icon?: string;
  }>;
  onMarkerClick?: (markerId: string) => void;
  onMapClick?: (coords: { lat: number; lon: number }) => void;
  route?: RouteInfo;
  showUserLocation?: boolean;
  userLocation?: { lat: number; lon: number };
  style?: React.CSSProperties;
}

export function MapComponent({
  lat,
  lon,
  zoom = 15,
  markers = [],
  onMarkerClick,
  onMapClick,
  route,
  showUserLocation = false,
  userLocation,
  style = {},
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routeLayer = useRef<any>(null);
  const isInitialized = useRef<boolean>(false);
  const clickHandlerRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    const script = document.querySelector("script[src*='leaflet.js']");
    if (script) {
      setLeafletLoaded(true);
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);

    const scriptElement = document.createElement("script");
    scriptElement.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    
    scriptElement.onload = () => {
      setLeafletLoaded(true);
      console.log("✅ Leaflet library loaded");
    };
    
    scriptElement.onerror = () => {
      console.error("❌ Failed to load Leaflet library");
    };
    
    document.head.appendChild(scriptElement);
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!leafletLoaded) {
      console.log("⏳ Waiting for Leaflet library to load...");
      return;
    }
    if (!lat || !lon || typeof lat !== "number" || typeof lon !== "number") {
      if (mapContainer.current) {
        mapContainer.current.innerHTML =
          '<div style="padding: 20px; color: #d32f2f; text-align: center;">Invalid location coordinates</div>';
      }
      return;
    }

    const L = (window as any).L;
    if (!L) {
      console.warn("⚠️ Leaflet still not available, retrying...");
      return;
    }

    console.log("🗺️ Initializing map with coordinates:", { lat, lon });

    try {
      if (!map.current) {
        isInitialized.current = true;
        map.current = L.map(mapContainer.current).setView([lat, lon], zoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 1,
        }).addTo(map.current);
        if (onMapClick) {
          const clickHandler = (e: any) => {
            onMapClick({ lat: e.latlng.lat, lon: e.latlng.lng });
          };
          clickHandlerRef.current = clickHandler;
          map.current.on('click', clickHandler);
        }
      } else {
        map.current.setView([lat, lon], zoom);
      }
      markersRef.current.forEach((m) => {
        try {
          if (map.current && m) {
            map.current.removeLayer(m);
          }
        } catch (err) {
        }
      });
      markersRef.current = [];
      if (L && markers.length > 0) {
        markers.forEach((marker) => {
          const markerElement = L.marker([marker.lat, marker.lon], {
            title: marker.name,
          });

          markerElement.bindPopup(`
            <div style="min-width: 200px; font-family: sans-serif;">
              <div style="font-weight: bold; margin-bottom: 6px; font-size: 14px; color: #1f2a3d;">${marker.name}</div>
              ${marker.description ? `<div style="font-size: 12px; color: #666; margin-bottom: 6px;">${marker.description}</div>` : ""}
              <div style="font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 6px;">
                <div>📍 <strong>Coordinates:</strong></div>
                <div style="margin-left: 20px; font-family: monospace;">
                  Lat: ${marker.lat.toFixed(6)}<br/>
                  Lon: ${marker.lon.toFixed(6)}
                </div>
              </div>
            </div>
          `);

          if (onMarkerClick) {
            markerElement.on("click", () => {
              onMarkerClick(marker.id);
            });
          }

          markerElement.addTo(map.current);
          markersRef.current.push(markerElement);
        });
      }
      if (showUserLocation && userLocation && L) {
        const userMarker = L.marker([userLocation.lat, userLocation.lon], {
          title: "Your Location",
          icon: L.icon({
            iconUrl:
              "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        });
        userMarker.bindPopup("Your Location");
        userMarker.addTo(map.current);
        markersRef.current.push(userMarker);
      }

      if (route && route.coordinates && route.coordinates.length > 0 && L && map.current) {
        if (routeLayer.current) {
          try {
            map.current.removeLayer(routeLayer.current);
          } catch (err) {
          }
          routeLayer.current = null;
        }

        const polylineColor = route.color || "#0ea5e9";
        const routePolyline = L.polyline(
          route.coordinates.map((coord) => [coord[1], coord[0]]),
          {
            color: polylineColor,
            weight: 4,
            opacity: 0.8,
            dashArray: "5, 5",
          }
        );

        routePolyline.addTo(map.current);
        routeLayer.current = routePolyline;
        const startMarker = L.circleMarker([route.startLat, route.startLon], {
          radius: 8,
          fillColor: "#00AA00",
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        });
        startMarker.bindPopup("Start");
        startMarker.addTo(map.current);
        markersRef.current.push(startMarker);
        const endMarker = L.circleMarker([route.endLat, route.endLon], {
          radius: 8,
          fillColor: "#FF0000",
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        });
        endMarker.bindPopup("Destination");
        endMarker.addTo(map.current);
        markersRef.current.push(endMarker);
        const allLatLngs = [
          ...route.coordinates.map((coord) => [coord[1], coord[0]]),
          [route.startLat, route.startLon],
          [route.endLat, route.endLon],
        ];
        const bounds = L.latLngBounds(allLatLngs);
        map.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      } else if (markers.length > 1 && map.current && L) {
        const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lon]));
        map.current.fitBounds(bounds, { padding: [50, 50] });
      } else if (markers.length === 1 && map.current) {
        map.current.setView([markers[0].lat, markers[0].lon], zoom);
      }
    } catch (err) {
      console.error("Error updating map:", err);
    }
    return () => {
      try {
        if (map.current && isInitialized.current) {
          try {
            markersRef.current.forEach((m) => {
              try {
                if (m && map.current && typeof map.current.removeLayer === 'function') {
                  map.current.removeLayer(m);
                }
              } catch (e) {
              }
            });
          } catch (e) {
          }
          markersRef.current = [];
          try {
            if (routeLayer.current && map.current && typeof map.current.removeLayer === 'function') {
              map.current.removeLayer(routeLayer.current);
            }
          } catch (e) {
          }
          routeLayer.current = null;
          try {
            if (clickHandlerRef.current && map.current && typeof map.current.off === 'function') {
              map.current.off('click', clickHandlerRef.current);
            }
          } catch (e) {
          }
          clickHandlerRef.current = null;
          try {
            markersRef.current = [];
          } catch (e) {
          }
          try {
            if (map.current && typeof map.current.remove === 'function') {
              map.current.remove();
            }
          } catch (e) {
          }
          map.current = null;
          isInitialized.current = false;
        }
      } catch (err) {
        console.warn("Error during map cleanup:", err);
        map.current = null;
        markersRef.current = [];
        routeLayer.current = null;
        clickHandlerRef.current = null;
        isInitialized.current = false;
      }
    };
  }, [lat, lon, zoom, markers, route, showUserLocation, userLocation, leafletLoaded]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "8px",
        overflow: "hidden",
        ...style,
      }}
    />
  );
}
