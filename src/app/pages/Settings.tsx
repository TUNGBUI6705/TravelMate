import { useState } from "react";
import { systemDefaults } from "../data/adminData";

export default function Settings() {
  const [platformName, setPlatformName] = useState(systemDefaults.platformName);
  const [supportEmail, setSupportEmail] = useState(systemDefaults.supportEmail);
  const [language, setLanguage] = useState(systemDefaults.defaultLanguage);
  const [maintenance, setMaintenance] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div style={{ display: "grid", gap: 14, maxWidth: 760 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>Settings</h1>
        <p style={{ margin: "8px 0 0", color: "#647087" }}>
          Keep only essential system settings for day to day operation.
        </p>
      </div>

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
            value={platformName}
            onChange={(event) => setPlatformName(event.target.value)}
            style={{ height: 40, border: "1px solid #d9e0ea", borderRadius: 8, padding: "0 12px", fontSize: 14, outline: "none" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#4d5a72", fontWeight: 600 }}>Support Email</span>
          <input
            type="email"
            value={supportEmail}
            onChange={(event) => setSupportEmail(event.target.value)}
            style={{ height: 40, border: "1px solid #d9e0ea", borderRadius: 8, padding: "0 12px", fontSize: 14, outline: "none" }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#4d5a72", fontWeight: 600 }}>Default Language</span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
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
            onClick={() => setMaintenance((prev) => !prev)}
            style={{
              border: "1px solid #d9e0ea",
              background: maintenance ? "#1d4ed8" : "#fff",
              color: maintenance ? "#fff" : "#344155",
              padding: "8px 12px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {maintenance ? "Enabled" : "Disabled"}
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={saveSettings}
            style={{
              border: "none",
              background: saved ? "#15803d" : "#1d4ed8",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {saved ? "Saved" : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
