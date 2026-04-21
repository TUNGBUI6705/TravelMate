const OPENROUTE_API_KEY = import.meta.env.VITE_OPENROUTE_SERVICE_API_KEY;
const OPENROUTE_BASE_URL = "https://api.openrouteservice.org/v2";

export interface RouteLeg {
  distance: number;
  duration: number;
  steps: Array<{
    distance: number;
    duration: number;
    instruction: string;
  }>;
}

export interface RouteResponse {
  routes: Array<{
    summary: {
      distance: number;
      duration: number;
    };
    geometry: {
      coordinates: Array<[number, number]>;
      type: string;
    };
    segments: RouteLeg[];
  }>;
  metadata: {
    query: {
      coordinates: Array<[number, number]>;
      profile: string;
    };
    service: string;
    timestamp: number;
    info: {
      engine: {
        version: string;
        build_date: string;
      };
      timestamp: number;
    };
  };
}

export interface RouteCoordinates {
  lat: number;
  lon: number;
}

export const openRouteService = {
  async getDirections(
    startLat: number,
    startLon: number,
    endLat: number,
    endLon: number,
    profile: string = "driving-car"
  ): Promise<RouteResponse | null> {
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

      const data = await response.json() as RouteResponse;
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
    coordinates: RouteCoordinates[],
    profile: string = "driving-car"
  ): Promise<RouteResponse | null> {
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

      const data = await response.json() as RouteResponse;
      console.log("✅ Multi-waypoint route found");

      return data;
    } catch (error) {
      console.error("❌ Failed to get multi-waypoint route:", error);
      return null;
    }
  },

  async getDistanceMatrix(
    locations: RouteCoordinates[],
    metrics: string[] = ["distance", "duration"]
  ): Promise<
    {
      distances: number[][];
      durations: number[][];
    } | null
  > {
    console.log("📊 Getting distance matrix...", { locations: locations.length });

    try {
      if (!OPENROUTE_API_KEY || locations.length < 2) {
        console.warn("Invalid configuration or insufficient locations");
        return null;
      }

      const url = `${OPENROUTE_BASE_URL}/matrix/driving-car`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: OPENROUTE_API_KEY,
        },
        body: JSON.stringify({
          locations: locations.map((loc) => [loc.lon, loc.lat]),
          metrics,
          units: "km",
        }),
      });

      if (!response.ok) {
        throw new Error(`Matrix API error: ${response.status}`);
      }

      const data = await response.json() as {
        distances: number[][];
        durations: number[][];
      };
      console.log("✅ Distance matrix retrieved");

      return data;
    } catch (error) {
      console.error("❌ Failed to get distance matrix:", error);
      return null;
    }
  },

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  },

  formatDistance(meters: number): string {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  },
};
