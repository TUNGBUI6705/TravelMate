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
import { db } from "../../config/firebase";
import type { Place } from "../../domain/models/Place";
import { mapDoc, mapQueryDoc } from "./firestoreMapper";

const COLLECTION_NAME = "places";

const placeCollection = () => collection(db, COLLECTION_NAME);

const placeDoc = (id: string) => doc(db, COLLECTION_NAME, id);

export interface GooglePlaceInfo {
  googleRating: number | null;
  googleTotalRatings: number | null;
  googleMapsUrl: string | null;
  photos: string[];
}

export type AddPlaceInput = Omit<Place, "id" | "createdAt" | "updatedAt" | "status"> &
  Partial<Pick<Place, "id" | "createdAt" | "updatedAt" | "status">>;

const readGoogleMapsApiKey = () => {
  const env = import.meta.env as Record<string, string | undefined> | undefined;
  return env?.VITE_GOOGLE_MAPS_API_KEY ?? "";
};

const buildPhotoUrl = (photoReference: string, apiKey: string) => {
  const photoUrl = new URL("https://maps.googleapis.com/maps/api/place/photo");
  photoUrl.searchParams.set("maxwidth", "1600");
  photoUrl.searchParams.set("photoreference", photoReference);
  photoUrl.searchParams.set("key", apiKey);
  return photoUrl.toString();
};

export const placeService = {
  async getAll(): Promise<Place[]> {
    const snapshot = await getDocs(placeCollection());
    console.log(`✅ Loaded ${snapshot.docs.length} places from Firebase`);
    return snapshot.docs.map((item) => mapQueryDoc<Place>(item));
  },

  async getById(id: string): Promise<Place | null> {
    const snapshot = await getDoc(placeDoc(id));
    return mapDoc<Place>(snapshot);
  },

  async add(data: AddPlaceInput): Promise<string> {
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

  async update(id: string, data: Partial<Place>): Promise<Place | null> {
    await updateDoc(placeDoc(id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return placeService.getById(id);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(placeDoc(id));
  },

  async hide(id: string): Promise<Place | null> {
    await updateDoc(placeDoc(id), {
      status: "hidden",
      updatedAt: serverTimestamp(),
    });
    return placeService.getById(id);
  },

  async show(id: string): Promise<Place | null> {
    await updateDoc(placeDoc(id), {
      status: "active",
      updatedAt: serverTimestamp(),
    });
    return placeService.getById(id);
  },

  async filterByType(type: string): Promise<Place[]> {
    const placesQuery = query(placeCollection(), where("type", "==", type));
    const snapshot = await getDocs(placesQuery);
    return snapshot.docs.map((item) => mapQueryDoc<Place>(item));
  },

  async search(keyword: string): Promise<Place[]> {
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

  async fetchGooglePlaceInfo(placeId: string, apiKeyInput?: string): Promise<GooglePlaceInfo> {
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

    const payload = (await response.json()) as {
      status?: string;
      error_message?: string;
      result?: {
        rating?: number;
        user_ratings_total?: number;
        url?: string;
        photos?: Array<{ photo_reference?: string }>;
      };
    };

    if (payload.status && payload.status !== "OK") {
      throw new Error(payload.error_message ?? `Google Places request failed with status ${payload.status}`);
    }

    const photos =
      payload.result?.photos
        ?.map((item) => item.photo_reference)
        .filter((value): value is string => Boolean(value))
        .map((photoReference) => buildPhotoUrl(photoReference, apiKey)) ?? [];

    return {
      googleRating: payload.result?.rating ?? null,
      googleTotalRatings: payload.result?.user_ratings_total ?? null,
      googleMapsUrl: payload.result?.url ?? null,
      photos,
    };
  },
};
