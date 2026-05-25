import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase.js";
import { mapDoc } from "./firestoreMapper.js";

const COLLECTION_NAME = "settings";
const DOCUMENT_ID = "app_settings";

const settingsDoc = () => doc(db, COLLECTION_NAME, DOCUMENT_ID);

export const settingsService = {
  async getSettings() {
    const snapshot = await getDoc(settingsDoc());
    return mapDoc(snapshot);
  },

  async updateSettings(data) {
    await setDoc(settingsDoc(), data, { merge: true });
    return settingsService.getSettings();
  },
};
