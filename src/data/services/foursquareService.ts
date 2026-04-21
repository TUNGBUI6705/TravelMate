const FOURSQUARE_API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY;
const FOURSQUARE_BASE_URL = "https://api.foursquare.com/v3";

export interface FoursquarePlace {
  fsq_id: string;
  name: string;
  location: {
    address: string;
    country?: string;
    region?: string;
    postcode?: string;
    lat: number;
    lon: number;
    formatted_address?: string;
  };
  categories: Array<{
    id: number;
    name: string;
    short_name: string;
    plural_name: string;
    icon: {
      prefix: string;
      suffix: string;
    };
  }>;
  chains?: Array<{
    id: string;
    name: string;
  }>;
  rating?: number;
  popularity?: number;
  tips_count?: number;
  verified?: boolean;
  distance?: number;
}

export interface FoursquareVenue {
  id: string;
  name: string;
  location: {
    address: string;
    lat: number;
    lng: number;
    country?: string;
    state?: string;
    postalCode?: string;
    formattedAddress: string[];
  };
  categories: Array<{
    id: string;
    name: string;
    pluralName: string;
    shortName: string;
    icon: {
      prefix: string;
      suffix: string;
    };
  }>;
  stats: {
    tipCount: number;
    usersCount: number;
    checkinsCount: number;
  };
  rating?: number;
  ratingColor?: string;
  ratingSignals?: number;
  hours?: {
    status: string;
    richStatus: {
      entities: any[];
      text: string;
    };
    timeframes: any[];
  };
  url?: string;
  phone?: string;
  canonicalUrl?: string;
  description?: string;
}

export const foursquareService = {
  async searchPlaces(lat: number, lon: number, query?: string, limit: number = 30): Promise<FoursquarePlace[]> {
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

  async getPlaceDetails(placeId: string): Promise<FoursquarePlace | null> {
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

  async getTips(placeId: string, limit: number = 10): Promise<Array<{
    id: string;
    createdAt: number;
    text: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      canonicalUrl: string;
      canonicalPhotoUrl: string;
    };
    likes: { count: number };
  }>> {
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
    lat: number,
    lon: number,
    section: string = "topPicks",
    limit: number = 30
  ): Promise<FoursquareVenue[]> {
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

      return data.response?.groups?.[0]?.items?.map((item: any) => item.venue) || [];
    } catch (error) {
      console.error("❌ Explore failed:", error);
      return [];
    }
  },

  async searchPhotos(placeId: string, limit: number = 10): Promise<Array<{
    id: string;
    createdAt: number;
    source: {
      name: string;
      url: string;
    };
    prefix: string;
    suffix: string;
    width: number;
    height: number;
    user: {
      id: string;
      firstName: string;
    };
  }>> {
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
