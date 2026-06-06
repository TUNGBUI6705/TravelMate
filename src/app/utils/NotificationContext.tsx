import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 9999,
        display: 'grid',
        gap: 12,
        pointerEvents: 'none'
      }}>
        {notifications.map((n) => (
          <div key={n.id} style={{
            pointerEvents: 'auto',
            background: '#fff',
            borderLeft: `4px solid ${
              n.type === 'success' ? '#10b981' :
              n.type === 'error' ? '#ef4444' :
              n.type === 'warning' ? '#f59e0b' : '#3b82f6'
            }`,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            borderRadius: 8,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            minWidth: 300,
            maxWidth: 450,
            animation: 'slideIn 0.3s ease-out'
          }}>
            <div style={{
              color:
                n.type === 'success' ? '#10b981' :
                n.type === 'error' ? '#ef4444' :
                n.type === 'warning' ? '#f59e0b' : '#3b82f6'
            }}>
              {n.type === 'success' && <CheckCircle size={20} />}
              {n.type === 'error' && <XCircle size={20} />}
              {n.type === 'warning' && <AlertCircle size={20} />}
              {n.type === 'info' && <Info size={20} />}
            </div>
            <p style={{ margin: 0, fontSize: 14, color: '#1f2a3d', flex: 1, fontWeight: 500 }}>{n.message}</p>
            <button
              onClick={() => removeNotification(n.id)}
              style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
