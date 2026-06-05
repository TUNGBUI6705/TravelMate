import { get, push, query, ref, remove, set, update } from "firebase/database";
import { db } from "../../config/firebase.js";

const COLLECTION_NAME = "trips";
const tripsRef = () => ref(db, COLLECTION_NAME);
const tripRef = (id) => ref(db, `${COLLECTION_NAME}/${id}`);

const normalizeSnapshotValue = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item, index) => ({ id: String(index), ...(item || {}) })).filter(Boolean);
  }
  return Object.entries(value)
    .map(([key, item]) => ({ id: key, ...(item || {}) }))
    .filter(Boolean);
};

export const tripService = {
  async getAll() {
    try {
      const snapshot = await get(tripsRef());
      const trips = normalizeSnapshotValue(snapshot.val());
      console.log(`✅ Loaded ${trips.length} trips from Firebase Realtime Database`);
      return trips;
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
    const snapshot = await get(tripRef(id));
    return snapshot.exists() ? { id: snapshot.key, ...(snapshot.val() || {}) } : null;
  },

  async add(data) {
    const payload = {
      ...data,
      createdAt: data.createdAt ?? Date.now(),
    };

    if (data.id) {
      await set(tripRef(data.id), payload);
      return data.id;
    }

    const result = await push(tripsRef(), payload);
    return result.key;
  },

  async update(id, data) {
    await update(tripRef(id), {
      ...data,
      updatedAt: Date.now(),
    });
    return tripService.getById(id);
  },

  async delete(id) {
    await remove(tripRef(id));
  },
};