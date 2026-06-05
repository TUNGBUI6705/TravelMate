/**
 * OpenRoute Service API helper for directions
 */

const getApiKey = () => {
  const env = import.meta.env;
  return env.VITE_OPENROUTE_API_KEY || null;
};

const buildDirectionsUrl = (startLat, startLng, endLat, endLng, profile = "driving-car") => {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const url = new URL("https://api.openrouteservice.org/v2/directions/" + profile);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("start", `${startLng},${startLat}`);
  url.searchParams.set("end", `${endLng},${endLat}`);
  return url.toString();
};

export const openRouteService = {
  async getDirections(startLat, startLng, endLat, endLng, profile = "driving-car") {
    const apiKey = getApiKey();
    if (!apiKey) {
      console.warn("⚠️ OpenRoute API key not configured, falling back to Google Maps");
      return null;
    }

    try {
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/${profile}?api_key=${apiKey}&start=${startLng},${startLat}&end=${endLng},${endLat}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        console.warn(`⚠️ OpenRoute API error: ${response.status}`);
        return null;
      }

      const data = await response.json();
      console.log("✅ OpenRoute directions fetched successfully");
      return data;
    } catch (err) {
      console.error("❌ OpenRoute API failed:", err);
      return null;
    }
  },
};