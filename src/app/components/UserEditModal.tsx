import React, { useState, useEffect } from "react";
import { X, Save, User as UserIcon } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (uid: string, data: any) => Promise<void>;
  user: any;
}

export default function UserEditModal({ isOpen, onClose, onSave, user }: UserEditModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    displayName: "",
    email: "",
    photoURL: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        status: user.status || "active",
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(user.id, formData);
      onClose();
    } catch (error: any) {
      alert("Lỗi khi cập nhật người dùng: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 20
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        width: "100%",
        maxWidth: 500,
        maxHeight: "90vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid #e8ecf3",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 1
        }}>
          <h2 style={{ margin: 0, fontSize: 20, color: "#1f2a3d" }}>
            Chỉnh sửa thông tin người dùng
          </h2>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "#647087" }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24, display: "grid", gap: 16 }}>
          {/* Supabase Image Upload for User Avatar */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
             <div style={{ width: 150 }}>
                <ImageUpload
                  label="Ảnh đại diện"
                  currentImageUrl={formData.photoURL}
                  folder="users"
                  aspectRatio="1/1"
                  onUploadSuccess={(url) => setFormData(prev => ({ ...prev, photoURL: url }))}
                  onDeleteSuccess={() => setFormData(prev => ({ ...prev, photoURL: '' }))}
                />
             </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#344155" }}>Họ và tên</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="VD: Nguyễn Văn A"
              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d9e0ea", outline: "none" }}
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#344155" }}>Tên hiển thị</label>
            <input
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="VD: Teo Nguyen"
              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d9e0ea", outline: "none" }}
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#344155" }}>Email</label>
            <input
              type="email"
              name="email"
              disabled
              value={formData.email}
              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d9e0ea", outline: "none", background: "#f8fafc", cursor: "not-allowed" }}
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#344155" }}>Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d9e0ea", outline: "none", background: "#fff" }}
            >
              <option value="active">Đang hoạt động</option>
              <option value="blocked">Đã chặn</option>
              <option value="banned">Bị cấm</option>
              <option value="pending">Chờ duyệt</option>
            </select>
          </div>

          <div style={{
            marginTop: 8,
            paddingTop: 16,
            borderTop: "1px solid #e8ecf3",
            display: "flex",
            justifyContent: "flex-end",
            gap: 12
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #d9e0ea", background: "#fff", cursor: "pointer" }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 24px",
                borderRadius: 8,
                border: "none",
                background: "#1d4ed8",
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 600
              }}
            >
              <Save size={18} />
              {loading ? "Đang lưu..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
