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
import { db } from "../../config/firebase.js";
import { mapDoc, mapQueryDoc } from "./firestoreMapper.js";

const COLLECTION_NAME = "reviews";

const reviewCollection = () => collection(db, COLLECTION_NAME);

const reviewDoc = (id) => doc(db, COLLECTION_NAME, id);

export const reviewService = {
  async getAll() {
    const reviewsQuery = query(reviewCollection(), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(reviewsQuery);
    console.log(`✅ Loaded ${snapshot.docs.length} reviews from Firebase`);
    return snapshot.docs.map((item) => mapQueryDoc(item));
  },

  async getPending() {
    const reviewsQuery = query(reviewCollection(), where("status", "==", "pending"));
    const snapshot = await getDocs(reviewsQuery);
    return snapshot.docs.map((item) => mapQueryDoc(item));
  },

  async getById(id) {
    const snapshot = await getDoc(reviewDoc(id));
    return mapDoc(snapshot);
  },

  async approve(id) {
    await updateDoc(reviewDoc(id), {
      status: "visible",
      updatedAt: serverTimestamp(),
    });
    return reviewService.getById(id);
  },

  async hide(id) {
    await updateDoc(reviewDoc(id), {
      status: "hidden",
      updatedAt: serverTimestamp(),
    });
    return reviewService.getById(id);
  },

  async delete(id) {
    await deleteDoc(reviewDoc(id));
  },

  async filterByStatus(status) {
    const reviewsQuery = query(reviewCollection(), where("status", "==", status));
    const snapshot = await getDocs(reviewsQuery);
    return snapshot.docs.map((item) => mapQueryDoc(item));
  },

  async filterByRating(rating) {
    const reviewsQuery = query(reviewCollection(), where("rating", "==", rating));
    const snapshot = await getDocs(reviewsQuery);
    return snapshot.docs.map((item) => mapQueryDoc(item));
  },

  async search(keyword) {
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
