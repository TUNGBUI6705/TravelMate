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

const COLLECTION_NAME = "users";

const userCollection = () => collection(db, COLLECTION_NAME);

const userDoc = (uid) => doc(db, COLLECTION_NAME, uid);

export const userService = {
  async getAll() {
    const usersQuery = query(userCollection(), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(usersQuery);
    console.log(`✅ Loaded ${snapshot.docs.length} users from Firebase`);
    return snapshot.docs.map((item) => mapQueryDoc(item));
  },

  async getById(uid) {
    const snapshot = await getDoc(userDoc(uid));
    return mapDoc(snapshot);
  },

  async update(uid, data) {
    await updateDoc(userDoc(uid), data);
    return userService.getById(uid);
  },

  async ban(uid, reason) {
    await updateDoc(userDoc(uid), {
      status: "banned",
      bannedReason: reason,
      bannedAt: serverTimestamp(),
    });
    return userService.getById(uid);
  },

  async unban(uid) {
    await updateDoc(userDoc(uid), {
      status: "active",
      bannedReason: null,
      bannedAt: null,
    });
    return userService.getById(uid);
  },

  async delete(uid) {
    await deleteDoc(userDoc(uid));
  },

  async filterByStatus(status) {
    const usersQuery = query(userCollection(), where("status", "==", status));
    const snapshot = await getDocs(usersQuery);
    return snapshot.docs.map((item) => mapQueryDoc(item));
  },

  async search(keyword) {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) {
      return userService.getAll();
    }

    const users = await userService.getAll();
    return users.filter((item) => {
      const displayName = item.displayName.toLowerCase();
      const email = item.email.toLowerCase();
      return displayName.includes(normalized) || email.includes(normalized);
    });
  },
};
