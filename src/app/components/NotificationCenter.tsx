import { useEffect, useState, useRef } from "react";
import { Bell, User, MapPin, MessageSquare, Clock, X } from "lucide-react";
import { ref, onValue, limitToLast, query } from "firebase/database";
import { db } from "../../config/firebase";
import { useTheme } from "../utils/ThemeContext";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
}

export default function NotificationCenter() {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for recent activities/notifications
    // Note: In a real app, this might be a 'logs' or 'notifications' collection
    // For this demo, we'll try to find some data to show
    const recentRef = query(ref(db, "notifications"), limitToLast(10));
    const unsubscribe = onValue(recentRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Notifications are nested under userId in seed_rtdb.cjs
        const flatList: Notification[] = [];
        Object.entries(data).forEach(([userId, userNotifs]: [string, any]) => {
          Object.entries(userNotifs).forEach(([id, notif]: [string, any]) => {
            flatList.push({ id, ...notif });
          });
        });
        setNotifications(flatList.sort((a, b) => b.timestamp - a.timestamp));
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ border: "none", background: "none", color: "#647087", cursor: "pointer", position: "relative", padding: 8 }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <div style={{
            position: "absolute", top: 6, right: 6, width: 8, height: 8,
            background: "#ef4444", borderRadius: "50%", border: theme === 'dark' ? "2px solid #1e293b" : "2px solid #fff"
          }}></div>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: "absolute", top: "100%", right: 0, marginTop: 12, width: 320,
          background: theme === 'dark' ? "#1e293b" : "#fff",
          border: theme === 'dark' ? "1px solid #334155" : "1px solid #e8ecf3",
          borderRadius: 16, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
          zIndex: 1000, overflow: "hidden"
        }}>
          <div style={{ padding: "16px 20px", borderBottom: theme === 'dark' ? "1px solid #334155" : "1px solid #eef2f8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}>Thông báo</h3>
            <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 600 }}>{unreadCount} mới</span>
          </div>

          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            {notifications.length > 0 ? notifications.map((notif) => (
              <div key={notif.id} style={{
                padding: "16px 20px", borderBottom: theme === 'dark' ? "1px solid #334155" : "1px solid #f8fafc",
                display: "flex", gap: 12, background: notif.isRead ? "transparent" : (theme === 'dark' ? "rgba(59, 130, 246, 0.05)" : "#f0f7ff"),
                cursor: "pointer", transition: "background 0.2s"
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  background: notif.type === 'welcome' ? "#ecfdf5" : "#eff6ff",
                  color: notif.type === 'welcome' ? "#10b981" : "#3b82f6"
                }}>
                  {notif.type === 'welcome' ? <User size={18} /> : <Clock size={18} />}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}>{notif.title}</p>
                  <p style={{ margin: "2px 0 4px", fontSize: 13, color: "#647087", lineHeight: 1.4 }}>{notif.message}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{new Date(notif.timestamp).toLocaleString()}</p>
                </div>
              </div>
            )) : (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
                <Bell size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
                <p style={{ margin: 0, fontSize: 14 }}>Không có thông báo nào</p>
              </div>
            )}
          </div>

          <div style={{ padding: "12px 20px", textAlign: "center", borderTop: theme === 'dark' ? "1px solid #334155" : "1px solid #eef2f8" }}>
            <button style={{ border: "none", background: "none", color: "#3b82f6", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Xem tất cả</button>
          </div>
        </div>
      )}
    </div>
  );
}
