import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
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
  Query,
} from "firebase/firestore";
import { auth, db } from "./firebase";

console.log("🚀 Firebase utilities initialized");

export const signIn = (email: string, password: string) => {
  console.log("🔐 Signing in with email/password...");
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  console.log("👋 Signing out...");
  return signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
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

export const createUser = (uid: string, userData: Record<string, any>) =>
  setDoc(doc(db, "users", uid), userData);

export const getUser = (uid: string) =>
  getDoc(doc(db, "users", uid)).then((doc) => doc.data());

export const updateUser = (uid: string, userData: Record<string, any>) =>
  updateDoc(doc(db, "users", uid), userData);

export const deleteUser = (uid: string) =>
  deleteDoc(doc(db, "users", uid));

export const addDocument = (collectionName: string, data: Record<string, any>) =>
  setDoc(doc(collection(db, collectionName)), data);

export const getDocument = (collectionName: string, docId: string) =>
  getDoc(doc(db, collectionName, docId)).then((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

export const getCollectionDocuments = (collectionName: string) =>
  getDocs(collection(db, collectionName)).then((snapshot) =>
    snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  );

export const queryCollection = (
  collectionName: string,
  field: string,
  operator: any,
  value: any
) => {
  const q = query(
    collection(db, collectionName),
    where(field, operator, value)
  ) as Query;
  return getDocs(q).then((snapshot) =>
    snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  );
};

export const updateDocument = (
  collectionName: string,
  docId: string,
  data: Record<string, any>
) => updateDoc(doc(db, collectionName, docId), data);

export const deleteDocument = (collectionName: string, docId: string) =>
  deleteDoc(doc(db, collectionName, docId));
