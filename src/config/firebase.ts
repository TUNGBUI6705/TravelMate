import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBSMqqxa_p2Zv_uTBYOUwz24v0P4qW-Guw",
  authDomain: "travelmate-app-7bcbc.firebaseapp.com",
  databaseURL: "https://travelmate-app-7bcbc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "travelmate-app-7bcbc",
  storageBucket: "travelmate-app-7bcbc.firebasestorage.app",
  messagingSenderId: "125294106149",
  appId: "1:125294106149:web:03e9069944fe71161e91cc",
  measurementId: "G-H9S1F96L23"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

export default app;
