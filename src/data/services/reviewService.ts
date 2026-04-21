import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import type { Review, ReviewStatus } from "../../domain/models/Review";
import { mapDoc, mapQueryDoc } from "./firestoreMapper";

const COLLECTION_NAME = "reviews";

const reviewCollection = () => collection(db, COLLECTION_NAME);

const reviewDoc = (id: string) => doc(db, COLLECTION_NAME, id);

export const reviewService = {
  async getAll(): Promise<Review[]> {
    const reviewsQuery = query(reviewCollection(), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(reviewsQuery);
    console.log(`✅ Loaded ${snapshot.docs.length} reviews from Firebase`);
    return snapshot.docs.map((item) => mapQueryDoc<Review>(item));
  },

  async getPending(): Promise<Review[]> {
    const reviewsQuery = query(reviewCollection(), where("status", "==", "pending"));
    const snapshot = await getDocs(reviewsQuery);
    return snapshot.docs.map((item) => mapQueryDoc<Review>(item));
  },

  async getById(id: string): Promise<Review | null> {
    const snapshot = await getDoc(reviewDoc(id));
    return mapDoc<Review>(snapshot);
  },

  async approve(id: string): Promise<Review | null> {
    await updateDoc(reviewDoc(id), {
      status: "visible",
      updatedAt: serverTimestamp(),
    });
    return reviewService.getById(id);
  },

  async hide(id: string): Promise<Review | null> {
    await updateDoc(reviewDoc(id), {
      status: "hidden",
      updatedAt: serverTimestamp(),
    });
    return reviewService.getById(id);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(reviewDoc(id));
  },

  async filterByStatus(status: ReviewStatus): Promise<Review[]> {
    const reviewsQuery = query(reviewCollection(), where("status", "==", status));
    const snapshot = await getDocs(reviewsQuery);
    return snapshot.docs.map((item) => mapQueryDoc<Review>(item));
  },

  async filterByRating(rating: number): Promise<Review[]> {
    const reviewsQuery = query(reviewCollection(), where("rating", "==", rating));
    const snapshot = await getDocs(reviewsQuery);
    return snapshot.docs.map((item) => mapQueryDoc<Review>(item));
  },

  async search(keyword: string): Promise<Review[]> {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) {
      return reviewService.getAll();
    }

    const reviews = await reviewService.getAll();
    return reviews.filter((item) => {
      const placeName = item.placeName.toLowerCase();
      const authorName = item.authorName.toLowerCase();
      const comment = item.comment.toLowerCase();
      return placeName.includes(normalized) || authorName.includes(normalized) || comment.includes(normalized);
    });
  },
};

