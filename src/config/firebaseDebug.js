import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

export async function testFirestoreConnection() {
  console.group("🔍 Firestore Connection Test");
  
  try {
    console.log("Testing connection to Firestore...");
    
    console.log("📋 Test 1: Reading 'users' collection...");
    const usersSnap = await getDocs(collection(db, "users"));
    console.log(`✅ Users collection: ${usersSnap.size} documents found`);
    
    console.log("📋 Test 2: Reading 'places' collection...");
    const placesSnap = await getDocs(collection(db, "places"));
    console.log(`✅ Places collection: ${placesSnap.size} documents found`);
    
    console.log("📋 Test 3: Reading 'reviews' collection...");
    const reviewsSnap = await getDocs(collection(db, "reviews"));
    console.log(`✅ Reviews collection: ${reviewsSnap.size} documents found`);
    
    console.log("📋 Test 4: Reading 'settings' collection...");
    const settingsSnap = await getDocs(collection(db, "settings"));
    console.log(`✅ Settings collection: ${settingsSnap.size} documents found`);
    
    console.log("✅ All Firestore tests passed!");
    console.groupEnd();
    return true;
    
  } catch (error) {
    console.error("❌ Firestore Connection Test Failed:", error);
    
    if (error instanceof Error) {
      console.error("Error Code:", error.name);
      console.error("Error Message:", error.message);
      
      if (error.message.includes("ERR_BLOCKED_BY_CLIENT")) {
        console.warn("⚠️ BLOCKED_BY_CLIENT: Check for browser extensions or ad blockers blocking firestore.googleapis.com");
      }
      if (error.message.includes("permission-denied")) {
        console.warn("⚠️ PERMISSION_DENIED: Firestore Security Rules are blocking access. Check your rules.");
      }
      if (error.message.includes("CORS")) {
        console.warn("⚠️ CORS Error: Cross-origin request blocked. Check Firebase configuration.");
      }
    }
    
    console.groupEnd();
    return false;
  }
}
