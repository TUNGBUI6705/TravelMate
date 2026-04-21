import type { DateValue } from "./User";

export type ReviewStatus = "visible" | "hidden" | "pending";

export interface Review {
  id: string;
  placeId: string;
  placeName: string;
  authorUid: string;
  authorName: string;
  authorPhoto: string;
  rating: number;
  comment: string;
  photos: string[];
  visitedDate: DateValue;
  status: ReviewStatus;
  helpfulCount: number;
  reportCount: number;
  createdAt: DateValue;
  updatedAt: DateValue;
}

