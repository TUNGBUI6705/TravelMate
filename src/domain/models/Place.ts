import type { DateValue } from "./User";

export type MapProvider = "google" | "openstreetmap" | "manual";

export type PlaceStatus = "active" | "hidden";

export interface PlaceLocation {
  lat: number;
  lng: number;
}

export interface PlaceStats {
  avgRating: number;
  totalReviews: number;
  totalVisits: number;
}

export interface Place {
  id: string;
  name: string;
  province: string;
  city: string;
  type: string;
  description: string;
  address: string;
  location: PlaceLocation;
  googleMapsUrl: string | null;
  googlePlaceId: string | null;
  googleRating: number | null;
  googleTotalRatings: number | null;
  mapProvider: MapProvider;
  osmNodeId: string | number | null;
  images: string[];
  coverImage: string;
  tags: string[];
  openingHours: string;
  entryFee: number;
  stats: PlaceStats;
  status: PlaceStatus;
  createdAt: DateValue;
  updatedAt: DateValue;
  createdBy: string;
}

