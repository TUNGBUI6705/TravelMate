const FOURSQUARE_API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY;
const FOURSQUARE_BASE_URL = "https://api.foursquare.com/v3";

/**
 * @typedef {Object} FoursquarePlace
 * @property {string} fsq_id
 * @property {string} name
 * @property {Object} location
 * @property {Array} categories
 * @property {number} [rating]
 */

/**
 * @typedef {Object} FoursquareVenue
 * @property {string} id
 * @property {string} name
 * @property {Object} location
 * @property {Array} categories
 * @property {number} [rating]
 */

export const foursquareService = {
  async searchPlaces(lat, lon, query, limit = 30) {
    console.log("🔍 Searching Foursquare places...", { lat, lon, query });

    try {
      const params = new URLSearchParams({
        ll: `${lat},${lon}`,
        limit: limit.toString(),
        ...(query && { query }),
      });

      const url = `${FOURSQUARE_BASE_URL}/places/search?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${FOURSQUARE_API_KEY}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Foursquare API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Foursquare places found:", data.results?.length || 0);

      return data.results || [];
    } catch (error) {
      console.error("❌ Foursquare search failed:", error);
      throw error;
    }
  },

  async getPlaceDetails(placeId) {
    console.log("📍 Getting Foursquare place details:", placeId);

    try {
      const url = `${FOURSQUARE_BASE_URL}/places/${placeId}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${FOURSQUARE_API_KEY}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Foursquare details error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Place details loaded:", data.name);

      return data;
    } catch (error) {
      console.error("❌ Failed to get place details:", error);
      return null;
    }
  },

  async getTips(placeId, limit = 10) {
    console.log("💡 Getting Foursquare tips:", placeId);

    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        sort: "recent",
      });

      const url = `${FOURSQUARE_BASE_URL}/places/${placeId}/tips?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${FOURSQUARE_API_KEY}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Foursquare tips error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Tips loaded:", data.results?.length || 0);

      return data.results || [];
    } catch (error) {
      console.error("❌ Failed to get tips:", error);
      return [];
    }
  },

  async searchByExplore(
    lat,
    lon,
    section = "topPicks",
    limit = 30
  ) {
    console.log("🎯 Exploring Foursquare venues...", { lat, lon, section });

    try {
      const params = new URLSearchParams({
        ll: `${lat},${lon}`,
        limit: limit.toString(),
        section,
        sortByDistance: "1",
      });

      const url = `${FOURSQUARE_BASE_URL}/places/explore?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${FOURSQUARE_API_KEY}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Foursquare explore error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Venues explored:", data.response?.groups?.[0]?.items?.length || 0);

      return data.response?.groups?.[0]?.items?.map((item) => item.venue) || [];
    } catch (error) {
      console.error("❌ Explore failed:", error);
      return [];
    }
  },

  async searchPhotos(placeId, limit = 10) {
    console.log("📸 Getting Foursquare photos:", placeId);

    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
      });

      const url = `${FOURSQUARE_BASE_URL}/places/${placeId}/photos?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${FOURSQUARE_API_KEY}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Foursquare photos error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Photos loaded:", data.results?.length || 0);

      return data.results || [];
    } catch (error) {
      console.error("❌ Failed to get photos:", error);
      return [];
    }
  },
};
