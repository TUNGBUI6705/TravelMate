const OPENROUTE_API_KEY = import.meta.env.VITE_OPENROUTE_SERVICE_API_KEY;
const OPENROUTE_BASE_URL = "https://api.openrouteservice.org/v2";

/**
 * @typedef {Object} RouteLeg
 * @property {number} distance
 * @property {number} duration
 * @property {Array} steps
 */

/**
 * @typedef {Object} RouteResponse
 * @property {Array} routes
 * @property {Object} metadata
 */

/**
 * @typedef {Object} RouteCoordinates
 * @property {number} lat
 * @property {number} lon
 */

export const openRouteService = {
  async getDirections(
    startLat,
    startLon,
    endLat,
    endLon,
    profile = "driving-car"
  ) {
    console.log("🗺️ Getting directions from OpenRoute Service...", {
      start: { lat: startLat, lon: startLon },
      end: { lat: endLat, lon: endLon },
      profile,
    });

    try {
      if (!OPENROUTE_API_KEY) {
        console.warn("OpenRoute Service API key not configured");
        return null;
      }

      const url = `${OPENROUTE_BASE_URL}/directions/${profile}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: OPENROUTE_API_KEY,
        },
        body: JSON.stringify({
          coordinates: [
            [startLon, startLat],
            [endLon, endLat],
          ],
          format: "geojson",
          instructions: true,
          language: "vi",
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRoute Service error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Route found:", {
        distance: data.routes[0]?.summary.distance,
        duration: data.routes[0]?.summary.duration,
      });

      return data;
    } catch (error) {
      console.error("❌ Failed to get directions:", error);
      return null;
    }
  },

  async getMultipleWaypoints(
    coordinates,
    profile = "driving-car"
  ) {
    console.log("🗺️ Getting multi-waypoint route...", { count: coordinates.length, profile });

    try {
      if (!OPENROUTE_API_KEY || coordinates.length < 2) {
        console.warn("Invalid configuration or insufficient coordinates");
        return null;
      }

      const url = `${OPENROUTE_BASE_URL}/directions/${profile}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: OPENROUTE_API_KEY,
        },
        body: JSON.stringify({
          coordinates: coordinates.map((c) => [c.lon, c.lat]),
          format: "geojson",
          instructions: true,
          language: "vi",
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRoute Service error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Multi-waypoint route found");

      return data;
    } catch (error) {
      console.error("❌ Failed to get multi-waypoint route:", error);
      return null;
    }
  },

  async getDistanceMatrix(
    locations,
    metrics = ["distance", "duration"]
  ) {
    console.log("📊 Getting distance matrix...", { locations: locations.length, metrics });

    try {
      if (!OPENROUTE_API_KEY) {
        console.warn("OpenRoute Service API key not configured");
        return null;
      }

      const url = `${OPENROUTE_BASE_URL}/matrix/${metrics.includes("distance") ? "driving-car" : "foot"}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: OPENROUTE_API_KEY,
        },
        body: JSON.stringify({
          locations: locations.map((l) => [l.lon, l.lat]),
          metrics,
          units: "m",
        }),
      });

      if (!response.ok) {
        throw new Error(`Distance matrix error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Distance matrix calculated");

      return data;
    } catch (error) {
      console.error("❌ Failed to get distance matrix:", error);
      return null;
    }
  },

  async getIsochroneAnalysis(
    lat,
    lon,
    rangeInSeconds,
    rangeType = "time"
  ) {
    console.log("🔍 Getting isochrone analysis...", { lat, lon, rangeInSeconds });

    try {
      if (!OPENROUTE_API_KEY) {
        console.warn("OpenRoute Service API key not configured");
        return null;
      }

      const url = `${OPENROUTE_BASE_URL}/isochrones/driving-car`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: OPENROUTE_API_KEY,
        },
        body: JSON.stringify({
          locations: [[lon, lat]],
          range: [rangeInSeconds],
          range_type: rangeType,
          format: "geojson",
        }),
      });

      if (!response.ok) {
        throw new Error(`Isochrone error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Isochrone analysis completed");

      return data;
    } catch (error) {
      console.error("❌ Failed to get isochrone analysis:", error);
      return null;
    }
  },
};
