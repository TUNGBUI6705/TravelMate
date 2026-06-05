import {
  equalTo,
  get,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { db } from "../../config/firebase.js";

const COLLECTION_NAME = "reviews";
const reviewsRef = () => ref(db, COLLECTION_NAME);
const reviewRef = (id) => ref(db, `${COLLECTION_NAME}/${id}`);

const normalizeSnapshotValue = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item, index) => ({ id: String(index), ...(item || {}) })).filter(Boolean);
  }

  return Object.entries(value)
    .map(([key, item]) => ({ id: key, ...(item || {}) }))
    .filter(Boolean);
};

export const reviewService = {
  async getAll() {
    try {
      const snapshot = await get(reviewsRef());
      const reviews = normalizeSnapshotValue(snapshot.val());
      console.log(`✅ Loaded ${reviews.length} reviews from Firebase Realtime Database`);
      return reviews;
    } catch (err) {
      if (err && err.code && err.code.includes("permission")) {
        const e = new Error("Realtime Database permission denied. Check your database rules and authenticated user permissions.");
        e.code = err.code;
        throw e;
      }
      throw err;
    }
  },

  async getById(id) {
    const snapshot = await get(reviewRef(id));
    return snapshot.exists() ? { id: snapshot.key, ...(snapshot.val() || {}) } : null;
  },

  async add(data) {
    const payload = {
      ...data,
      createdAt: data.createdAt ?? Date.now(),
    };

    if (data.id) {
      await set(reviewRef(data.id), payload);
      return data.id;
    }

    const result = await push(reviewsRef(), payload);
    return result.key;
  },

  async update(id, data) {
    await update(reviewRef(id), {
      ...data,
      updatedAt: Date.now(),
    });
    return reviewService.getById(id);
  },

  async delete(id) {
    await remove(reviewRef(id));
  },

  async updateStatus(id, status) {
    await update(reviewRef(id), {
      status,
      updatedAt: Date.now(),
    });
    return reviewService.getById(id);
  },
};