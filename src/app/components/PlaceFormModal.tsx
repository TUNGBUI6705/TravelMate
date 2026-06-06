import React, { useState, useEffect } from "react";
import { X, Save, MapPin, Check } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface PlaceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

const INTERESTS = [
  { id: "BEACH", label: "Beach", icon: "🏖️" },
  { id: "CULTURE", label: "Culture", icon: "🏛️" },
  { id: "NATURE", label: "Nature", icon: "🌿" },
  { id: "FOOD", label: "Street Food", icon: "🍲" },
  { id: "PHOTOGRAPHY", label: "Photography", icon: "📷" },
  { id: "BUDGET", label: "Budget Travel", icon: "💰" },
  { id: "ADVENTURE", label: "Adventure", icon: "🧗" },
  { id: "SHOPPING", label: "Shopping", icon: "🛍️" },
  { id: "NIGHTLIFE", label: "Nightlife", icon: "💃" },
  { id: "HISTORY", label: "History", icon: "📜" },
  { id: "RELAXATION", label: "Relaxation", icon: "🛀" },
];

export default function PlaceFormModal({ isOpen, onClose, onSave, initialData }: PlaceFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    category: "",
    description: "",
    coverImage: "",
    coordinates: { lat: 0, lng: 0 },
    status: "active",
    categoryTags: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        coordinates: initialData.coordinates || { lat: 0, lng: 0 },
        categoryTags: initialData.categoryTags || []
      });
    } else {
      setFormData({
        name: "",
        location: "",
        category: "",
        description: "",
        coverImage: "",
        coordinates: { lat: 0, lng: 0 },
        status: "active",
        categoryTags: [],
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error: any) {
      alert("Lỗi khi lưu địa điểm: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setFormData(prev => {
      const tags = [...prev.categoryTags];
      const index = tags.indexOf(tagId);
      if (index > -1) {
        tags.splice(index, 1);
      } else {
        tags.push(tagId);
      }
      return { ...prev, categoryTags: tags };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parseFloat(value) || value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
        maxWidth: 600,
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
            {initialData ? "Chỉnh sửa địa điểm" : "Thêm địa điểm mới"}
          </h2>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "#647087" }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24, display: "grid", gap: 16 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#344155" }}>Tên địa điểm *</label>
            <input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: Vịnh Hạ Long"
              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d9e0ea", outline: "none" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: "#344155" }}>Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d9e0ea", outline: "none", background: "#fff" }}
              >
                <option value="active">Hoạt động</option>
                <option value="draft">Bản nháp</option>
                <option value="hidden">Ẩn</option>
              </select>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: "#344155" }}>Phân loại chính</label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="VD: Thiên nhiên, Biển"
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d9e0ea", outline: "none" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#344155" }}>Sở thích du lịch (Tags)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {INTERESTS.map((interest) => {
                const isSelected = formData.categoryTags.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleTag(interest.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 16px",
                      borderRadius: 100,
                      border: isSelected ? "2px solid #3b82f6" : "1px solid #d9e0ea",
                      background: isSelected ? "#fff" : "rgba(255, 255, 255, 0.1)",
                      color: isSelected ? "#3b82f6" : "#475569",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: isSelected ? 600 : 500,
                      transition: "all 0.2s",
                      boxShadow: isSelected ? "0 4px 6px -1px rgba(59, 130, 246, 0.1)" : "none"
                    }}
                  >
                    {isSelected && <Check size={14} />}
                    <span>{interest.icon}</span>
                    <span>{interest.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#344155" }}>Địa chỉ / Vị trí</label>
            <div style={{ position: "relative" }}>
              <MapPin size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Thành phố, Tỉnh hoặc Địa chỉ chi tiết"
                style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 8, border: "1px solid #d9e0ea", outline: "none" }}
              />
            </div>
          </div>

          {/* Supabase Image Upload Section */}
          <ImageUpload
            label="Ảnh bìa địa điểm"
            currentImageUrl={formData.coverImage}
            folder="destinations"
            onUploadSuccess={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
            onDeleteSuccess={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: "#344155" }}>Vĩ độ (Lat)</label>
              <input
                type="number"
                step="any"
                name="coordinates.lat"
                value={formData.coordinates.lat}
                onChange={handleChange}
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d9e0ea", outline: "none" }}
              />
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: "#344155" }}>Kinh độ (Lng)</label>
              <input
                type="number"
                step="any"
                name="coordinates.lng"
                value={formData.coordinates.lng}
                onChange={handleChange}
                style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d9e0ea", outline: "none" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#344155" }}>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Giới thiệu về địa điểm này..."
              style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d9e0ea", outline: "none", resize: "vertical" }}
            />
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
                padding: "10px 24px",
                borderRadius: 8,
                border: "none",
                background: "#1d4ed8",
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 600
              }}
            >
              {loading ? "Đang lưu..." : "Lưu địa điểm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
