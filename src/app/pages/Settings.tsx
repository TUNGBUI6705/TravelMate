import { useEffect, useState } from "react";
import { settingsService } from "../../data/services/settingsService";
import type { AppSettings } from "../../domain/models/Settings";

const DEFAULT_SETTINGS: AppSettings = {
  platformName: "TravelMate",
  supportEmail: "support@travelmate.local",
  defaultLanguage: "en",
  maintenanceMode: false,
  maintenanceMessage: "",
  mapProvider: "google",
  googleMapsApiKey: "",
  defaultMapCenter: { lat: 16, lng: 108 },
  defaultMapZoom: 6,
  requireReviewApproval: true,
  maxPhotosPerReview: 5,
  totalUsers: 0,
  totalPlaces: 0,
  totalReviews: 0,
  blockedUsers: 0,
  pendingReviews: 0,
};

const mergeSettings = (data: AppSettings | null): AppSettings => {
  if (!data) {
    return DEFAULT_SETTINGS;
  }

  return {
    ...DEFAULT_SETTINGS,
    ...data,
    defaultMapCenter: {
      ...DEFAULT_SETTINGS.defaultMapCenter,
      ...data.defaultMapCenter,
    },
  };
};

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await settingsService.getSettings();
        if (!isMounted) {
          return;
        }
        setSettings(mergeSettings(data));
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        console.error(loadError);
        setError("Cannot load settings from backend. Please try again.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const saveSettings = async () => {
    if (!settings.platformName.trim() || !settings.supportEmail.trim()) {
      setError("Platform name and support email are required.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSaved(false);

      const updated = await settingsService.updateSettings({
        platformName: settings.platformName.trim(),
        supportEmail: settings.supportEmail.trim(),
        defaultLanguage: settings.defaultLanguage,
        maintenanceMode: settings.maintenanceMode,
      });

      setSettings(mergeSettings(updated));
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    } catch (saveError) {
      console.error(saveError);
      setError("Cannot save settings right now. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 14, maxWidth: 760 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>Settings</h1>
        <p style={{ margin: "8px 0 0", color: "#647087" }}>
          Core system settings are synced with backend settings document.
        </p>
      </div>

      {error && (
        <div
          style={{
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#b91c1c",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          background: "#fff",
          border: "1px solid #e8ecf3",
          borderRadius: 12,
          padding: 16,
          display: "grid",
          gap: 14,
        }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#4d5a72", fontWeight: 600 }}>Platform Name</span>
          <input
            value={settings.platformName}
            onChange={(event) => setSettings((prev) => ({ ...prev, platformName: event.target.value }))}
            disabled={isLoading}
            style={{ height: 40, border: "1px solid #d9e0ea", borderRadius: 8, padding: "0 12px", fontSize: 14, outline: "none" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#4d5a72", fontWeight: 600 }}>Support Email</span>
          <input
            type="email"
            value={settings.supportEmail}
            onChange={(event) => setSettings((prev) => ({ ...prev, supportEmail: event.target.value }))}
            disabled={isLoading}
            style={{ height: 40, border: "1px solid #d9e0ea", borderRadius: 8, padding: "0 12px", fontSize: 14, outline: "none" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#4d5a72", fontWeight: 600 }}>Default Language</span>
          <select
            value={settings.defaultLanguage}
            onChange={(event) => setSettings((prev) => ({ ...prev, defaultLanguage: event.target.value }))}
            disabled={isLoading}
            style={{ height: 40, border: "1px solid #d9e0ea", borderRadius: 8, padding: "0 10px", fontSize: 14, outline: "none", background: "#fff" }}
          >
            <option value="en">English</option>
            <option value="vi">Vietnamese</option>
          </select>
        </label>

        <div
          style={{
            border: "1px solid #e8ecf3",
            borderRadius: 10,
            padding: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: 14, color: "#1f2a3d", fontWeight: 600 }}>Maintenance Mode</p>
            <p style={{ margin: "4px 0 0", color: "#647087", fontSize: 13 }}>
              Temporarily disable public traffic while keeping admin access.
            </p>
          </div>
          <button
            onClick={() => setSettings((prev) => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
            disabled={isLoading}
            style={{
              border: "1px solid #d9e0ea",
              background: settings.maintenanceMode ? "#1d4ed8" : "#fff",
              color: settings.maintenanceMode ? "#fff" : "#344155",
              padding: "8px 12px",
              borderRadius: 8,
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {settings.maintenanceMode ? "Enabled" : "Disabled"}
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => void saveSettings()}
            disabled={isLoading || isSaving}
            style={{
              border: "none",
              background: saved ? "#15803d" : "#1d4ed8",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: 8,
              cursor: isLoading || isSaving ? "not-allowed" : "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {isSaving ? "Saving..." : saved ? "Saved" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
