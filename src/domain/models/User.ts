export type UserRole = "user" | "admin";

export type UserStatus = "active" | "banned";

export type DateValue =
  | Date
  | string
  | number
  | {
      seconds: number;
      nanoseconds: number;
    };

export interface UserStats {
  totalTrips: number;
  totalPlaces: number;
  totalReviews: number;
  totalExpense: number;
}

export interface UserPreferences {
  types: string[];
  budget: string;
  travelStyle: string;
}

export interface User {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  photoUrl: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  bannedReason: string | null;
  bannedAt: DateValue | null;
  stats: UserStats;
  preferences: UserPreferences;
  createdAt: DateValue;
}

