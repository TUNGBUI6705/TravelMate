import { useState } from "react";
import { Globe, Mail, Bell, Shield, Moon, Save, Sun, CheckCircle } from "lucide-react";
import { useTheme } from "../utils/ThemeContext";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [platformName, setPlatformName] = useState("TravelMate");
  const [supportEmail, setSupportEmail] = useState("support@travelmate.com");
  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const cardStyle = {
    background: theme === 'dark' ? "#1e293b" : "#fff",
    border: theme === 'dark' ? "1px solid #334155" : "1px solid #e8ecf3",
    borderRadius: 16,
    padding: 24,
    color: theme === 'dark' ? "#f8fafc" : "#1f2a3d"
  };

  const inputStyle = {
    padding: "12px",
    borderRadius: 8,
    border: theme === 'dark' ? "1px solid #334155" : "1px solid #d9e0ea",
    outline: "none",
    fontSize: 14,
    background: theme === 'dark' ? "#0f172a" : "#fff",
    color: theme === 'dark' ? "#f8fafc" : "#1f2a3d",
    width: "100%"
  };

  return (
    <div style={{ display: "grid", gap: 24, maxWidth: 900 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 32, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d", fontWeight: 700 }}>Thiết lập hệ thống</h1>
        <p style={{ margin: "8px 0 0", color: "#94a3b8", fontSize: 16 }}>
          Cấu hình tùy chọn nền tảng và các tham số toàn cục.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: 32 }}>
        {/* Navigation Sidebar */}
        <div style={{ display: "grid", gap: 8, height: "fit-content" }}>
          {[
            { icon: Globe, label: "Tổng quan", active: true },
            { icon: Bell, label: "Thông báo", active: false },
            { icon: Shield, label: "Bảo mật", active: false },
            { icon: Moon, label: "Giao diện", active: false },
          ].map(item => (
            <button key={item.label} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", border: "none",
              background: item.active ? (theme === 'dark' ? "#334155" : "#eff6ff") : "transparent",
              color: item.active ? (theme === 'dark' ? "#3b82f6" : "#1d4ed8") : "#647087",
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
          <section style={cardStyle}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 600 }}>Thông tin chung</h3>
            <div style={{ display: "grid", gap: 20 }}>
              <div style={{ display: "grid", gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: theme === 'dark' ? "#94a3b8" : "#344155" }}>Tên nền tảng</label>
                <input
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: theme === 'dark' ? "#94a3b8" : "#344155" }}>Email hỗ trợ Admin</label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 40 }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section style={cardStyle}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 600 }}>Giao diện</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderRadius: 10, background: theme === 'dark' ? "#0f172a" : "#f8fafc" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {theme === 'dark' ? <Moon size={20} color="#3b82f6" /> : <Sun size={20} color="#f59e0b" />}
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Chế độ tối (Dark Mode)</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94a3b8" }}>Chuyển đổi giữa giao diện sáng và tối</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                style={{
                  width: 48, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                  background: theme === 'dark' ? "#1d4ed8" : "#cbd5e1", position: "relative", transition: "background 0.2s"
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", background: "#fff",
                  position: "absolute", top: 3, left: theme === 'dark' ? 27 : 3, transition: "left 0.2s"
                }}></div>
              </button>
            </div>
          </section>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
            <button style={{ padding: "12px 24px", borderRadius: 10, border: "1px solid #d9e0ea", background: "transparent", cursor: "pointer", fontWeight: 600, color: "#647087" }}>
              Khôi phục mặc định
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
              {saved ? "Đã lưu" : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
