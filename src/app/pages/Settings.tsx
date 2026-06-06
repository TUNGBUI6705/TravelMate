import { useState } from "react";
import { Globe, Mail, Bell, Shield, Moon, Save, RefreshCw } from "lucide-react";

export default function Settings() {
  const [platformName, setPlatformName] = useState("TravelMate");
  const [supportEmail, setSupportEmail] = useState("support@travelmate.com");
  const [language, setLanguage] = useState("en");
  const [maintenance, setMaintenance] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 900 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 32, color: "#1f2a3d", fontWeight: 700 }}>System Settings</h1>
        <p style={{ margin: "8px 0 0", color: "#647087", fontSize: 16 }}>
          Configure your platform preferences and global parameters.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: 32 }}>
        {/* Navigation Sidebar */}
        <div style={{ display: "grid", gap: 8, height: "fit-content" }}>
          {[
            { icon: Globe, label: "General", active: true },
            { icon: Bell, label: "Notifications", active: false },
            { icon: Shield, label: "Security", active: false },
            { icon: Moon, label: "Appearance", active: false },
          ].map(item => (
            <button key={item.label} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", border: "none",
              background: item.active ? "#eff6ff" : "transparent",
              color: item.active ? "#1d4ed8" : "#647087",
              borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, textAlign: "left"
            }}>
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ display: "grid", gap: 24 }}>
          {/* General Section */}
          <section style={{ background: "#fff", border: "1px solid #e8ecf3", borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, color: "#1f2a3d", fontWeight: 600 }}>General Information</h3>
            <div style={{ display: "grid", gap: 20 }}>
              <div style={{ display: "grid", gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: "#344155" }}>Platform Name</label>
                <input
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  style={{ padding: "12px", borderRadius: 8, border: "1px solid #d9e0ea", outline: "none", fontSize: 14 }}
                />
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: "#344155" }}>Admin Support Email</label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    style={{ width: "100%", padding: "12px 12px 12px 40px", borderRadius: 8, border: "1px solid #d9e0ea", outline: "none", fontSize: 14 }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: "#344155" }}>System Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ padding: "12px", borderRadius: 8, border: "1px solid #d9e0ea", outline: "none", fontSize: 14, background: "#fff" }}
                >
                  <option value="en">English (US)</option>
                  <option value="vi">Tiếng Việt</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </section>

          {/* System Control Section */}
          <section style={{ background: "#fff", border: "1px solid #e8ecf3", borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, color: "#1f2a3d", fontWeight: 600 }}>System Control</h3>
            <div style={{ display: "grid", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderRadius: 10, background: "#f8fafc" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1f2a3d" }}>Maintenance Mode</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#647087" }}>Offline for public users</p>
                </div>
                <button
                  onClick={() => setMaintenance(!maintenance)}
                  style={{
                    width: 48, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                    background: maintenance ? "#1d4ed8" : "#cbd5e1", position: "relative", transition: "background 0.2s"
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", background: "#fff",
                    position: "absolute", top: 3, left: maintenance ? 27 : 3, transition: "left 0.2s"
                  }}></div>
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderRadius: 10, background: "#f8fafc" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1f2a3d" }}>Push Notifications</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#647087" }}>Enable system alerts</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  style={{
                    width: 48, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                    background: notifications ? "#10b981" : "#cbd5e1", position: "relative", transition: "background 0.2s"
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", background: "#fff",
                    position: "absolute", top: 3, left: notifications ? 27 : 3, transition: "left 0.2s"
                  }}></div>
                </button>
              </div>
            </div>
          </section>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
            <button style={{ padding: "12px 24px", borderRadius: 10, border: "1px solid #d9e0ea", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#647087" }}>
              Reset Defaults
            </button>
            <button
              onClick={saveSettings}
              disabled={saved}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 10, border: "none",
                background: saved ? "#10b981" : "#1d4ed8", color: "#fff", cursor: saved ? "default" : "pointer", fontWeight: 600,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            >
              {saved ? <CheckCircle size={18} /> : <Save size={18} />}
              {saved ? "Changes Saved" : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}

