import {
  equalTo,
  get,
  orderByChild,
  query,
  ref,
  remove,
  update,
} from "firebase/database";
import { db } from "../../config/firebase.js";

const COLLECTION_NAME = "users";
const usersRef = () => ref(db, COLLECTION_NAME);
const userRef = (uid) => ref(db, `${COLLECTION_NAME}/${uid}`);

const normalizeSnapshotValue = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item, index) => ({ id: String(index), ...(item || {}) })).filter(Boolean);
  }

  return Object.entries(value)
    .map(([key, item]) => ({ id: key, ...(item || {}) }))
    .filter(Boolean);
};

export const userService = {
  async getAll() {
    try {
      const snapshot = await get(usersRef());
      const users = normalizeSnapshotValue(snapshot.val()).sort((a, b) => {
        const aCreated = Number(a.createdAt) || 0;
        const bCreated = Number(b.createdAt) || 0;
        return bCreated - aCreated;
      });
      console.log(`✅ Loaded ${users.length} users from Firebase Realtime Database`);
      return users;
    } catch (err) {
      if (err && err.code && err.code.includes("permission")) {
        const e = new Error("Realtime Database permission denied. Check your database rules and authenticated user permissions.");
        e.code = err.code;
        throw e;
      }
      throw err;
    }
  },

  async getById(uid) {
    const snapshot = await get(userRef(uid));
    return snapshot.exists() ? { id: snapshot.key, ...(snapshot.val() || {}) } : null;
  },

  async update(uid, data) {
    await update(userRef(uid), data);
    return userService.getById(uid);
  },

  async block(uid, reason) {
    await update(userRef(uid), {
      status: "blocked",
      isBlocked: true,
      blockedReason: reason,
      blockedAt: Date.now(),
    });
    return userService.getById(uid);
  },

  async unblock(uid) {
    await update(userRef(uid), {
      status: "active",
      isBlocked: false,
      blockedReason: null,
      blockedAt: null,
    });
    return userService.getById(uid);
  },

  async delete(uid) {
    await remove(userRef(uid));
  },

  async filterByStatus(status) {
    const usersQuery = query(usersRef(), orderByChild("status"), equalTo(status));
    const snapshot = await get(usersQuery);
    return normalizeSnapshotValue(snapshot.val());
  },

  async search(keyword) {
    const normalized = keyword.trim().toLowerCase();
    const users = await userService.getAll();
    return users.filter((item) => {
      const displayName = String(item.fullName || item.displayName || "").toLowerCase();
      const email = String(item.email || "").toLowerCase();
      const id = String(item.id || "").toLowerCase();
      return displayName.includes(normalized) || email.includes(normalized) || id.includes(normalized);
    });
  },
};