import {
  equalTo,
  get,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  remove,
  update,
  set,
  off,
} from "firebase/database";
import { db } from "../../config/firebase.js";
import { tripService } from "./tripService.js";
import { reviewService } from "./reviewService.js";

const COLLECTION_NAME = "destinations";
const placesRef = () => ref(db, COLLECTION_NAME);
const placeRef = (id) => ref(db, `${COLLECTION_NAME}/${id}`);

const readGoogleMapsApiKey = () => {
  const env = import.meta.env;
  return env?.VITE_GOOGLE_MAPS_API_KEY ?? "";
};

const buildPhotoUrl = (photoReference, apiKey) => {
  const photoUrl = new URL("https://maps.googleapis.com/maps/api/place/photo");
  photoUrl.searchParams.set("maxwidth", "1600");
  photoUrl.searchParams.set("photoreference", photoReference);
  photoUrl.searchParams.set("key", apiKey);
  return photoUrl.toString();
};

const formatTimestamp = (value) => {
  if (value == null) return "";
  if (typeof value === "number") return new Date(value).toLocaleDateString();
  if (typeof value === "string") {
    const numberValue = Number(value);
    if (!Number.isNaN(numberValue)) return new Date(numberValue).toLocaleDateString();
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date.toLocaleDateString();
  }
  return String(value);
};

const normalizePlaceRecord = (record, id) => {
  if (!record) return null;

  return {
    id,
    name: record.name || record.title || "Untitled place",
    location: record.location || record.address || "Unknown location",
    status: record.status || "draft",
    createdAt: formatTimestamp(record.createdAt),
    updatedAt: formatTimestamp(record.updatedAt),
    ...record,
  };
};

const normalizeSnapshotValue = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item, index) => normalizePlaceRecord(item, String(index)))
      .filter(Boolean);
  }
  return Object.entries(value)
    .map(([key, item]) => normalizePlaceRecord(item, key))
    .filter(Boolean);
};

export const placeService = {
  async getAll() {
    try {
      const snapshot = await get(placesRef());
      const places = normalizeSnapshotValue(snapshot.val());
      console.log(`✅ Loaded ${places.length} places from Firebase Realtime Database`);
      return places;
    } catch (err) {
      if (err && err.code && err.code.includes("permission")) {
        const e = new Error("Realtime Database permission denied. Check your database rules and authenticated user permissions.");
        e.code = err.code;
        throw e;
      }
      throw err;
    }
  },

  async getById(id) {
    const snapshot = await get(placeRef(id));
    return snapshot.exists() ? normalizePlaceRecord(snapshot.val(), snapshot.key) : null;
  },

  async add(data) {
    const payload = {
      ...data,
      createdAt: data.createdAt ?? Date.now(),
      updatedAt: data.updatedAt ?? Date.now(),
      status: data.status ?? "active",
    };

    if (data.id) {
      await set(placeRef(data.id), payload);
      return data.id;
    }

    const result = await push(placesRef(), payload);
    return result.key;
  },

  async update(id, data) {
    const updateData = {
      ...data,
      updatedAt: Date.now(),
    };
    // Đảm bảo không update trường id vào data payload của Firebase
    if (updateData.id) delete updateData.id;

    await update(placeRef(id), updateData);
    return placeService.getById(id);
  },

  /**
   * Lắng nghe thay đổi thời gian thực từ Firebase
   * @param {Function} callback - Hàm được gọi khi dữ liệu thay đổi
   * @returns {Function} - Hàm để hủy lắng nghe (unsubscribe)
   */
  subscribe(callback) {
    const r = placesRef();
    const listener = onValue(r, (snapshot) => {
      const places = normalizeSnapshotValue(snapshot.val());
      callback(places);
    }, (error) => {
      console.error("Firebase subscription error:", error);
    });

    return () => off(r, "value", listener);
  },

  /**
   * Kiểm tra xem địa điểm có đang được sử dụng trong Trip hoặc Review nào không
   * @param {string} placeId
   */
  async checkDependencies(placeId) {
    const [allTrips, allReviews] = await Promise.all([
      tripService.getAll(),
      reviewService.getAll()
    ]);

    const linkedTrips = allTrips.filter(t => t.destinationId === placeId || t.destination === placeId);
    const linkedReviews = allReviews.filter(r => r.placeId === placeId);

    return {
      trips: linkedTrips,
      reviews: linkedReviews,
      hasDependencies: linkedTrips.length > 0 || linkedReviews.length > 0
    };
  },

  async delete(id) {
    // 1. Kiểm tra và xóa các review liên quan
    const allReviews = await reviewService.getAll();
    const linkedReviews = allReviews.filter(r => r.placeId === id);
    if (linkedReviews.length > 0) {
      console.log(`Deleting ${linkedReviews.length} linked reviews for place ${id}`);
      await Promise.all(linkedReviews.map(r => reviewService.delete(r.id)));
    }

    // 2. Kiểm tra và xóa các trip liên quan (nếu có logic destinationId)
    const allTrips = await tripService.getAll();
    const linkedTrips = allTrips.filter(t => t.destinationId === id);
    if (linkedTrips.length > 0) {
      console.log(`Deleting ${linkedTrips.length} linked trips for place ${id}`);
      await Promise.all(linkedTrips.map(t => tripService.delete(t.id)));
    }

    // 3. Xóa chính địa điểm đó
    await remove(placeRef(id));
  },

  async hide(id) {
    await update(placeRef(id), {
      status: "hidden",
      updatedAt: Date.now(),
    });
    return placeService.getById(id);
  },

  async show(id) {
    await update(placeRef(id), {
      status: "active",
      updatedAt: Date.now(),
    });
    return placeService.getById(id);
  },

  async filterByType(type) {
    const placesQuery = query(placesRef(), orderByChild("type"), equalTo(type));
    const snapshot = await get(placesQuery);
    return normalizeSnapshotValue(snapshot.val());
  },

  async search(keyword) {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) {
      return placeService.getAll();
    }

    const places = await placeService.getAll();
    return places.filter((item) => {
      const name = (item.name || "").toLowerCase();
      const province = (item.province || "").toLowerCase();
      return name.includes(normalized) || province.includes(normalized);
    });
  },

  async fetchGooglePlaceInfo(placeId, apiKeyInput) {
    const apiKey = apiKeyInput ?? readGoogleMapsApiKey();
    if (!apiKey) {
      throw new Error("Google Maps API key is not configured");
    }

    const endpoint = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    endpoint.searchParams.set("place_id", placeId);
    endpoint.searchParams.set("fields", "rating,user_ratings_total,url,photos");
    endpoint.searchParams.set("key", apiKey);

    const response = await fetch(endpoint.toString());
    if (!response.ok) {
      throw new Error(`Google Places request failed with status ${response.status}`);
    }

    const payload = await response.json();

    if (payload.status && payload.status !== "OK") {
      throw new Error(payload.error_message ?? `Google Places request failed with status ${payload.status}`);
    }

    const photos =
      payload.result?.photos
        ?.map((item) => item.photo_reference)
        .filter((value) => Boolean(value))
        .map((photoReference) => buildPhotoUrl(photoReference, apiKey)) ?? [];

    return {
      googleRating: payload.result?.rating ?? null,
      googleTotalRatings: payload.result?.user_ratings_total ?? null,
      googleMapsUrl: payload.result?.url ?? null,
      photos,
    };
  },
};
