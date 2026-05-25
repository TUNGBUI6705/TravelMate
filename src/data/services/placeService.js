import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase.js";
import { mapDoc, mapQueryDoc } from "./firestoreMapper.js";

const COLLECTION_NAME = "places";

const placeCollection = () => collection(db, COLLECTION_NAME);

const placeDoc = (id) => doc(db, COLLECTION_NAME, id);

/**
 * @typedef {Object} GooglePlaceInfo
 * @property {number|null} googleRating
 * @property {number|null} googleTotalRatings
 * @property {string|null} googleMapsUrl
 * @property {string[]} photos
 */

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

export const placeService = {
  async getAll() {
    const snapshot = await getDocs(placeCollection());
    console.log(`✅ Loaded ${snapshot.docs.length} places from Firebase`);
    return snapshot.docs.map((item) => mapQueryDoc(item));
  },

  async getById(id) {
    const snapshot = await getDoc(placeDoc(id));
    return mapDoc(snapshot);
  },

  async add(data) {
    const payload = {
      ...data,
      createdAt: data.createdAt ?? serverTimestamp(),
      updatedAt: data.updatedAt ?? serverTimestamp(),
      status: data.status ?? "active",
    };

    if (data.id) {
      await setDoc(placeDoc(data.id), payload);
      return data.id;
    }

    const ref = await addDoc(placeCollection(), payload);
    return ref.id;
  },

  async update(id, data) {
    await updateDoc(placeDoc(id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return placeService.getById(id);
  },

  async delete(id) {
    await deleteDoc(placeDoc(id));
  },

  async hide(id) {
    await updateDoc(placeDoc(id), {
      status: "hidden",
      updatedAt: serverTimestamp(),
    });
    return placeService.getById(id);
  },

  async show(id) {
    await updateDoc(placeDoc(id), {
      status: "active",
      updatedAt: serverTimestamp(),
    });
    return placeService.getById(id);
  },

  async filterByType(type) {
    const placesQuery = query(placeCollection(), where("type", "==", type));
    const snapshot = await getDocs(placesQuery);
    return snapshot.docs.map((item) => mapQueryDoc(item));
  },

  async search(keyword) {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) {
      return placeService.getAll();
    }

    const places = await placeService.getAll();
    return places.filter((item) => {
      const name = item.name.toLowerCase();
      const province = item.province.toLowerCase();
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
