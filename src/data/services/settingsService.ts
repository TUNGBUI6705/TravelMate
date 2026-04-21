import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import type { AppSettings } from "../../domain/models/Settings";
import { mapDoc } from "./firestoreMapper";

const COLLECTION_NAME = "settings";
const DOCUMENT_ID = "app_settings";

const settingsDoc = () => doc(db, COLLECTION_NAME, DOCUMENT_ID);

export const settingsService = {
  async getSettings(): Promise<AppSettings | null> {
    const snapshot = await getDoc(settingsDoc());
    return mapDoc<AppSettings>(snapshot);
  },

  async updateSettings(data: Partial<AppSettings>): Promise<AppSettings | null> {
    await setDoc(settingsDoc(), data, { merge: true });
    return settingsService.getSettings();
  },
};

