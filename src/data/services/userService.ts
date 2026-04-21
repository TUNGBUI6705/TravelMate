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
import type { User, UserStatus } from "../../domain/models/User";
import { mapDoc, mapQueryDoc } from "./firestoreMapper";

const COLLECTION_NAME = "users";

const userCollection = () => collection(db, COLLECTION_NAME);

const userDoc = (uid: string) => doc(db, COLLECTION_NAME, uid);

export const userService = {
  async getAll(): Promise<User[]> {
    const usersQuery = query(userCollection(), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(usersQuery);
    console.log(`✅ Loaded ${snapshot.docs.length} users from Firebase`);
    return snapshot.docs.map((item) => mapQueryDoc<User>(item));
  },

  async getById(uid: string): Promise<User | null> {
    const snapshot = await getDoc(userDoc(uid));
    return mapDoc<User>(snapshot);
  },

  async update(uid: string, data: Partial<User>): Promise<User | null> {
    await updateDoc(userDoc(uid), data);
    return userService.getById(uid);
  },

  async ban(uid: string, reason: string): Promise<User | null> {
    await updateDoc(userDoc(uid), {
      status: "banned",
      bannedReason: reason,
      bannedAt: serverTimestamp(),
    });
    return userService.getById(uid);
  },

  async unban(uid: string): Promise<User | null> {
    await updateDoc(userDoc(uid), {
      status: "active",
      bannedReason: null,
      bannedAt: null,
    });
    return userService.getById(uid);
  },

  async delete(uid: string): Promise<void> {
    await deleteDoc(userDoc(uid));
  },

  async filterByStatus(status: UserStatus): Promise<User[]> {
    const usersQuery = query(userCollection(), where("status", "==", status));
    const snapshot = await getDocs(usersQuery);
    return snapshot.docs.map((item) => mapQueryDoc<User>(item));
  },

  async search(keyword: string): Promise<User[]> {
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
