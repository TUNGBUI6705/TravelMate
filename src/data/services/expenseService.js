import { get, push, query, ref, remove, set, update } from "firebase/database";
import { db } from "../../config/firebase.js";

const COLLECTION_NAME = "expenses";
const expensesRef = () => ref(db, COLLECTION_NAME);
const expenseRef = (id) => ref(db, `${COLLECTION_NAME}/${id}`);

const normalizeSnapshotValue = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item, index) => ({ id: String(index), ...(item || {}) })).filter(Boolean);
  }
  return Object.entries(value)
    .map(([key, item]) => ({ id: key, ...(item || {}) }))
    .filter(Boolean);
};

export const expenseService = {
  async getAll() {
    try {
      const snapshot = await get(expensesRef());
      const expenses = normalizeSnapshotValue(snapshot.val());
      console.log(`✅ Loaded ${expenses.length} expenses from Firebase Realtime Database`);
      return expenses;
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
    const snapshot = await get(expenseRef(id));
    return snapshot.exists() ? { id: snapshot.key, ...(snapshot.val() || {}) } : null;
  },

  async add(data) {
    const payload = {
      ...data,
      createdAt: data.createdAt ?? Date.now(),
    };

    if (data.id) {
      await set(expenseRef(data.id), payload);
      return data.id;
    }

    const result = await push(expensesRef(), payload);
    return result.key;
  },

  async update(id, data) {
    await update(expenseRef(id), {
      ...data,
      updatedAt: Date.now(),
    });
    return expenseService.getById(id);
  },

  async delete(id) {
    await remove(expenseRef(id));
  },
};