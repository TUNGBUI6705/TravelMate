import { beforeEach, describe, expect, it, vi } from "vitest";

const firebaseConfigMock = vi.hoisted(() => ({
  db: {},
}));

const firestoreMock = vi.hoisted(() => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock("../../config/firebase", () => firebaseConfigMock);
vi.mock("firebase/firestore", () => firestoreMock);

import { settingsService } from "./settingsService";

describe("settingsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestoreMock.doc.mockReturnValue("settings-doc-app_settings");
  });

  it("getSettings returns null when app_settings does not exist", async () => {
    firestoreMock.getDoc.mockResolvedValue({
      exists: () => false,
    });

    const result = await settingsService.getSettings();

    expect(result).toBeNull();
  });

  it("getSettings returns app settings document", async () => {
    firestoreMock.getDoc.mockResolvedValue({
      id: "app_settings",
      exists: () => true,
      data: () => ({
        platformName: "TravelMate",
        supportEmail: "support@travelmate.local",
      }),
    });

    const result = await settingsService.getSettings();

    expect(result?.platformName).toBe("TravelMate");
  });

  it("updateSettings merges new values and returns latest settings", async () => {
    firestoreMock.setDoc.mockResolvedValue(undefined);
    firestoreMock.getDoc.mockResolvedValue({
      id: "app_settings",
      exists: () => true,
      data: () => ({
        platformName: "TravelMate Pro",
        maintenanceMode: true,
      }),
    });

    const result = await settingsService.updateSettings({
      platformName: "TravelMate Pro",
      maintenanceMode: true,
    });

    expect(firestoreMock.setDoc).toHaveBeenCalledWith(
      "settings-doc-app_settings",
      { platformName: "TravelMate Pro", maintenanceMode: true },
      { merge: true },
    );
    expect(result?.platformName).toBe("TravelMate Pro");
    expect(result?.maintenanceMode).toBe(true);
  });
});
