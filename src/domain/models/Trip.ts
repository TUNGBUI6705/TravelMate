import type { DateValue } from "./User";

export type TripStatus = "planning" | "completed" | "cancelled";

export type TripVisibility = "private" | "shared";

export interface Trip {
  id: string;
  ownerUid: string;
  title: string;
  description: string;
  coverImage: string;
  startDate: DateValue;
  endDate: DateValue;
  duration: number;
  destinations: string[];
  status: TripStatus;
  visibility: TripVisibility;
  shareCode: string | null;
  sharedWith: string[];
  totalBudget: number;
  totalExpense: number;
  memberCount: number;
  createdAt: DateValue;
  updatedAt: DateValue;
}

