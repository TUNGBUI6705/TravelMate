import type { MapProvider } from "./Place";

export interface MapCenter {
  lat: number;
  lng: number;
}

export interface AppSettings {
  platformName: string;
  supportEmail: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  mapProvider: MapProvider;
  googleMapsApiKey: string;
  defaultMapCenter: MapCenter;
  defaultMapZoom: number;
  requireReviewApproval: boolean;
  maxPhotosPerReview: number;
  totalUsers: number;
  totalPlaces: number;
  totalReviews: number;
  blockedUsers: number;
  pendingReviews: number;
}

