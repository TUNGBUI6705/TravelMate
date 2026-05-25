import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase.js";

console.log("🚀 Firebase utilities initialized");

export const signIn = (email, password) => {
  console.log("🔐 Signing in with email/password...");
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  console.log("👋 Signing out...");
  return signOut(auth);
};

export const onAuthChange = (callback) => {
  console.log("📋 Setting up auth state listener...");
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("✅ User authenticated:", user.email, "uid:", user.uid);
    } else {
      console.log("⚠️ No authenticated user");
    }
    callback(user);
  });
};

export const createUser = (uid, userData) =>
  setDoc(doc(db, "users", uid), userData);

export const getUser = (uid) =>
  getDoc(doc(db, "users", uid)).then((doc) => doc.data());

export const updateUser = (uid, userData) =>
  updateDoc(doc(db, "users", uid), userData);

export const deleteUser = (uid) =>
  deleteDoc(doc(db, "users", uid));

export const addDocument = (collectionName, data) =>
  setDoc(doc(collection(db, collectionName)), data);

export const getDocument = (collectionName, docId) =>
  getDoc(doc(db, collectionName, docId)).then((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

export const getCollectionDocuments = (collectionName) =>
  getDocs(collection(db, collectionName)).then((snapshot) =>
    snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  );

export const queryCollection = (
  collectionName,
  field,
  operator,
  value
) => {
  const q = query(
    collection(db, collectionName),
    where(field, operator, value)
  );
  return getDocs(q).then((snapshot) =>
    snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  );
};

export const updateDocument = (
  collectionName,
  docId,
  data
) => updateDoc(doc(db, collectionName, docId), data);

export const deleteDocument = (collectionName, docId) =>
  deleteDoc(doc(db, collectionName, docId));
