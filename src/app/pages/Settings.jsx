import { useEffect, useState } from "react";
import { settingsService } from "../../data/services/settingsService.js";

const DEFAULT_SETTINGS = {
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

const mergeSettings = (data) => {
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
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
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

    loadSettings();

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
      setError("Cannot save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>Settings</h1>
        <p style={{ margin: "8px 0 0", color: "#647087" }}>
          Manage application settings and configuration.
        </p>
      </div>

      {error && (
        <div style={{ padding: 10, borderRadius: 8, background: "#fef2f2", color: "#b91c1c", fontSize: 13 }}>
          {error}
        </div>
      )}

      {saved && (
        <div style={{ padding: 10, borderRadius: 8, background: "#dcfce7", color: "#166534", fontSize: 13 }}>
          Settings saved successfully!
        </div>
      )}

      {isLoading ? (
        <div style={{ padding: 20, textAlign: "center", color: "#647087" }}>Loading settings...</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ padding: 20, background: "#fff", border: "1px solid #e8ecf3", borderRadius: 8 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "#1f2a3d" }}>Platform Settings</h3>

            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#647087", marginBottom: 4 }}>
                  Platform Name
                </label>
                <input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    border: "1px solid #d9e0ea",
                    borderRadius: 6,
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#647087", marginBottom: 4 }}>
                  Support Email
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    border: "1px solid #d9e0ea",
                    borderRadius: 6,
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  />
                  <span style={{ fontSize: 13, color: "#1f2a3d" }}>Maintenance Mode</span>
                </label>
              </div>

              <button
                onClick={() => saveSettings()}
                disabled={isSaving}
                style={{
                  padding: "10px 14px",
                  background: isSaving ? "#cbd5e1" : "#667eea",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: isSaving ? "wait" : "pointer",
                }}
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
