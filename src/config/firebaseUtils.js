import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase.js";

console.log("🚀 Firebase utilities initialized");

export const signIn = (email, password) => {
  console.log("🔐 Signing in with email/password...");
  if (!isFirebaseConfigured) {
    const err = new Error("Firebase is not configured. Check VITE_FIREBASE_* env vars.");
    err.code = "auth/api-key-not-valid";
    return Promise.reject(err);
  }

  return signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = () => {
  console.log("🚪 Signing out...");
  return firebaseSignOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(`👤 User signed in: ${user.email}`);
    } else {
      console.log("👤 User signed out");
    }
    callback(user);
  });
};