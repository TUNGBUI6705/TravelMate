/**
 * Firestore mapper utilities for converting Firestore documents to plain objects
 */

/**
 * Converts a Firestore DocumentSnapshot to a plain JavaScript object
 * @param {import("firebase/firestore").DocumentSnapshot} doc - Firestore document snapshot
 * @returns {Promise<Object>} Document data with id included
 */
export async function mapDoc(doc) {
  if (!doc.exists()) {
    return null;
  }
  return {
    id: doc.id,
    ...doc.data(),
  };
}

/**
 * Converts Firestore timestamp to ISO string if needed
 * @param {*} value - Value to convert
 * @returns {*} Converted value
 */
function convertTimestamps(value) {
  if (!value) return value;

  // Handle Firestore Timestamp
  if (value.toDate && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  // Handle nested objects recursively
  if (typeof value === "object" && !Array.isArray(value)) {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = convertTimestamps(val);
    }
    return result;
  }

  if (Array.isArray(value)) {
    return value.map(convertTimestamps);
  }

  return value;
}

/**
 * Maps a Firestore document query result to plain JavaScript object
 * @param {import("firebase/firestore").QueryDocumentSnapshot} doc - Firestore query document snapshot
 * @returns {Object} Document data with id included
 */
export function mapQueryDoc(doc) {
  const data = doc.data();
  const converted = convertTimestamps(data);
  return {
    id: doc.id,
    ...converted,
  };
}