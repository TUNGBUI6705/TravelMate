export type UserStatus = "active" | "blocked" | "pending";
export type PlaceStatus = "draft" | "published" | "archived";
export type ReviewStatus = "pending" | "approved" | "hidden";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  joinedAt: string;
  status: UserStatus;
}

export interface AdminPlace {
  id: string;
  name: string;
  location: string;
  category: string;
  status: PlaceStatus;
}

export interface AdminReview {
  id: string;
  placeName: string;
  reviewerName: string;
  rating: number;
  comment: string;
  submittedAt: string;
  status: ReviewStatus;
}

// Intentionally empty: this admin app is ready to connect to real API data.
export const usersSeed: AdminUser[] = [];
export const placesSeed: AdminPlace[] = [];
export const reviewsSeed: AdminReview[] = [];

export const systemDefaults = {
  platformName: "TravelMate",
  supportEmail: "support@travelmate.local",
  defaultLanguage: "en",
};
