import React, { useEffect, useMemo, useState } from "react";
import { placeService } from "../../data/services/placeService.js";
import { reviewService } from "../../data/services/reviewService.js";
import { MapPin, Plus, Edit, Trash2, Image as ImageIcon, ChevronDown, ChevronUp, Star, MessageSquare } from "lucide-react";
import PlaceFormModal from "../components/PlaceFormModal.js";
import { useTheme } from "../utils/ThemeContext";

export default function PlaceList() {
  const { theme } = useTheme();
  const [places, setPlaces] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [query, setQuery] = useState("");
  const [interestFilter, setInterestFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Sử dụng subscribe để cập nhật dữ liệu thời gian thực cho Places
    const unsubscribePlaces = placeService.subscribe((data) => {
      setPlaces(data);
      setLoading(false);
    });

    // Tải danh sách review để hiển thị dropdown
    const loadReviews = async () => {
      try {
        const data = await reviewService.getAll();
        setReviews(data);
      } catch (err) {
        console.error("Error loading reviews for dropdown:", err);
      }
    };
    loadReviews();

    return () => {
      if (unsubscribePlaces) unsubscribePlaces();
    };
  }, []);

  const allInterests = useMemo(() => {
    const set = new Set();
    places.forEach(p => {
      if (p.categoryTags) p.categoryTags.forEach(tag => set.add(tag));
    });
    return ["all", ...Array.from(set)];
  }, [places]);

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const name = place.name || place.title || "";
      const location = place.location || place.address || place.city || "";
      const matchQuery =
        query.trim().length === 0 ||
        name.toLowerCase().includes(query.toLowerCase()) ||
        location.toLowerCase().includes(query.toLowerCase());

      const matchInterest = interestFilter === "all" || (place.categoryTags && place.categoryTags.includes(interestFilter));

      return matchQuery && matchInterest;
    });
  }, [places, query, interestFilter]);

  const handleOpenMap = (place) => {
    const searchQuery = encodeURIComponent(`${place.name} ${place.location || ""}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, "_blank");
  };

  const handleEdit = (place) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedPlace(null);
    setIsModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedPlace) {
        await placeService.update(selectedPlace.id, data);
      } else {
        await placeService.add(data);
      }
      // Không cần gọi loadPlaces() nữa vì subscribe sẽ tự động cập nhật
    } catch (err) {
      console.error("Save error:", err);
      throw err;
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      // 1. Kiểm tra các ràng buộc dữ liệu
      const { hasDependencies, trips, reviews } = await placeService.checkDependencies(id);

      let message = "Bạn có chắc chắn muốn xóa địa điểm này?";
      if (hasDependencies) {
        message = `CẢNH BÁO: Địa điểm này đang được gắn với ${trips.length} chuyến đi và ${reviews.length} đánh giá. \n\nNếu bạn xóa, TẤT CẢ các chuyến đi và đánh giá liên quan cũng sẽ bị xóa vĩnh viễn. Bạn vẫn muốn tiếp tục?`;
      }

      if (window.confirm(message)) {
        setLoading(true);
        await placeService.delete(id);
        // State sẽ tự cập nhật qua subscription
      }
    } catch (err) {
      alert("Lỗi khi xóa: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, color: isDark ? "#f8fafc" : "#1f2a3d" }}>Destination Management</h1>
          <p style={{ margin: "8px 0 0", color: "#94a3b8" }}>
            Manage your travel locations and their details.
          </p>
        </div>
        <button
          className="action-button"
          style={{ background: "#1d4ed8", color: "#fff", border: "none", padding: "10px 20px" }}
          onClick={handleAdd}
        >
          <Plus size={18} />
          Add Destination
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 200px",
          gap: 10,
          background: isDark ? "#1e293b" : "#ffffff",
          border: isDark ? "1px solid #334155" : "1px solid #e8ecf3",
          borderRadius: 12,
          padding: 12,
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by place name or location..."
          style={{
            height: 40,
            border: isDark ? "1px solid #334155" : "1px solid #d9e0ea",
            borderRadius: 8,
            padding: "0 12px",
            fontSize: 14,
            outline: "none",
            background: isDark ? "#0f172a" : "#fff",
            color: isDark ? "#f8fafc" : "#1f2a3d"
          }}
        />
        <select
          value={interestFilter}
          onChange={(event) => setInterestFilter(event.target.value)}
          style={{
            height: 40,
            border: isDark ? "1px solid #334155" : "1px solid #d9e0ea",
            borderRadius: 8,
            padding: "0 10px",
            fontSize: 14,
            outline: "none",
            background: isDark ? "#0f172a" : "#fff",
            color: isDark ? "#f8fafc" : "#1f2a3d"
          }}
        >
          {allInterests.map((item: any) => (
            <option key={item} value={item}>
              {item === "all" ? "Tất cả sở thích" : item}
            </option>
          ))}
        </select>
      </div>

      <div style={{ background: isDark ? "#1e293b" : "#fff", border: isDark ? "1px solid #334155" : "1px solid #e8ecf3", borderRadius: 12, overflow: "hidden" }}>
        {loading && places.length === 0 && (
          <div style={{ padding: 28, textAlign: "center", color: "#647087" }}>
            Loading places from backend...
          </div>
        )}
        {error && (
          <div style={{ padding: 28, textAlign: "center", color: "#b42318" }}>
            Error loading places: {error}
          </div>
        )}
        {!error && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: isDark ? "#334155" : "#f7f9fc" }}>
              {["Name", "Location", "Status", "Actions"].map((col) => (
                <th
                  key={col}
                  style={{
                    textAlign: "left",
                    padding: "12px 14px",
                    fontSize: 12,
                    color: isDark ? "#94a3b8" : "#5e6b81",
                    borderBottom: isDark ? "1px solid #1e293b" : "1px solid #e8ecf3",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPlaces.map((place) => (
              <React.Fragment key={place.id}>
                <tr
                  className="table-row"
                  onClick={() => setExpandedRowId(expandedRowId === place.id ? null : place.id)}
                  style={{ cursor: "pointer", transition: "background 0.2s", borderBottom: isDark ? "1px solid #334155" : "1px solid #eef2f8" }}
                >
                  <td style={{ padding: "12px 14px", color: isDark ? "#f8fafc" : "#1f2a3d", fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {expandedRowId === place.id ? <ChevronUp size={16} color="#647087" /> : <ChevronDown size={16} color="#647087" />}
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: isDark ? "#0f172a" : "#f1f5f9", overflow: "hidden", flexShrink: 0 }}>
                        {place.coverImage ? (
                          <img src={place.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8" }}>
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: 15, color: isDark ? "#f8fafc" : "#1f2a3d", fontWeight: 600 }}>{place.name || place.title}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
                          {/* Tính toán Rating từ Reviews table */}
                          {(() => {
                            const placeReviews = reviews.filter(r => r.placeId === place.id);
                            const hasReviews = placeReviews.length > 0;
                            const avgRating = hasReviews
                              ? (placeReviews.reduce((s, r) => s + (r.rating || 0), 0) / placeReviews.length).toFixed(1)
                              : (place.rating || 0).toFixed(1);
                            const totalReviews = hasReviews ? placeReviews.length : (place.reviewCount || 0);

                            if (parseFloat(avgRating) > 0 || totalReviews > 0) {
                              return (
                                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                  <div style={{ display: "flex", alignItems: "center" }}>
                                    <Star size={12} fill="#f59e0b" color="#f59e0b" />
                                    <span style={{ fontSize: 12, fontWeight: 700, color: isDark ? "#f8fafc" : "#1f2a3d", marginLeft: 4 }}>{avgRating}</span>
                                  </div>
                                  <span style={{ fontSize: 12, color: "#94a3b8" }}>•</span>
                                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#647087" }}>
                                    <MessageSquare size={11} />
                                    <span style={{ fontSize: 11 }}>{totalReviews.toLocaleString()} reviews</span>
                                  </div>
                                </div>
                              );
                            }
                            return <span style={{ fontSize: 11, color: "#94a3b8" }}>No ratings yet</span>;
                          })()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", color: isDark ? "#cbd5e1" : "#4d5a72" }}>
                    {place.location || place.address || place.city}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: place.status === 'active' ? (isDark ? "rgba(16,185,129,0.1)" : '#dcfce7') : (isDark ? "rgba(239,68,68,0.1)" : '#fee2e2'),
                      color: place.status === 'active' ? '#10b981' : '#ef4444'
                    }}>
                      {place.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        title="View on Google Maps"
                        onClick={(e) => { e.stopPropagation(); handleOpenMap(place); }}
                        style={{ border: "none", background: isDark ? "#064e3b" : "#f0fdf4", color: "#10b981", padding: 8, borderRadius: 6, cursor: "pointer" }}
                      >
                        <MapPin size={16} />
                      </button>
                      <button
                        title="Edit"
                        onClick={(e) => { e.stopPropagation(); handleEdit(place); }}
                        style={{ border: "none", background: isDark ? "#1e3a8a" : "#eff6ff", color: "#3b82f6", padding: 8, borderRadius: 6, cursor: "pointer" }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        title="Delete"
                        onClick={(e) => handleDelete(e, place.id)}
                        style={{ border: "none", background: isDark ? "#7f1d1d" : "#fef2f2", color: "#ef4444", padding: 8, borderRadius: 6, cursor: "pointer" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>

                {expandedRowId === place.id && (
                  <tr>
                    <td colSpan={5} style={{ padding: "0 14px 20px", borderBottom: isDark ? "1px solid #334155" : "1px solid #eef2f8", background: isDark ? "#0f172a" : "#fcfdfe" }}>
                      <div style={{ padding: 20, background: isDark ? "#1e293b" : "#fff", border: isDark ? "1px solid #334155" : "1px solid #e8ecf3", borderRadius: 12, marginTop: -8, display: "grid", gap: 20 }}>

                        {/* Tags Section */}
                        {place.categoryTags && place.categoryTags.length > 0 && (
                          <div>
                             <h4 style={{ margin: "0 0 12px", fontSize: 14, color: isDark ? "#94a3b8" : "#647087", fontWeight: 600 }}>Sở thích & Phân loại</h4>
                             <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                               {place.categoryTags.map((tag: string) => (
                                 <span key={tag} style={{
                                   background: isDark ? "#1e3a8a" : "#eff6ff",
                                   color: isDark ? "#3b82f6" : "#1d4ed8",
                                   padding: "4px 12px",
                                   borderRadius: 100,
                                   fontSize: 12,
                                   fontWeight: 600,
                                   border: isDark ? "1px solid #1e40af" : "1px solid #dbeafe"
                                 }}>
                                   #{tag}
                                 </span>
                               ))}
                             </div>
                          </div>
                        )}

                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                             <h4 style={{ margin: 0, fontSize: 15, color: isDark ? "#f8fafc" : "#1f2a3d", display: "flex", alignItems: "center", gap: 8 }}>
                               <MessageSquare size={18} color="#3b82f6" />
                               Cộng đồng đánh giá ({reviews.filter(r => r.placeId === place.id).length})
                             </h4>
                           <button
                            onClick={(e) => { e.stopPropagation(); window.location.href = `/reviews?place=${place.id}`; }}
                            style={{ border: "none", background: "none", color: "#3b82f6", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                           >
                            Quản lý đánh giá
                           </button>
                        </div>

                        {reviews.filter(r => r.placeId === place.id).length > 0 ? (
                          <div style={{ display: "grid", gap: 12 }}>
                            {reviews.filter(r => r.placeId === place.id).slice(0, 3).map((rev) => (
                              <div key={rev.id} style={{ padding: "12px 16px", borderRadius: 10, background: isDark ? "#0f172a" : "#f8fafc", border: isDark ? "1px solid #334155" : "1px solid #f1f5f9" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                  <span style={{ fontWeight: 600, fontSize: 14, color: isDark ? "#f8fafc" : "#334155" }}>{rev.reviewerName || "Người dùng"}</span>
                                  <div style={{ display: "flex", gap: 2 }}>
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} size={12} fill={i < (rev.rating || 0) ? "#f59e0b" : "none"} color={i < (rev.rating || 0) ? "#f59e0b" : "#d1d5db"} />
                                    ))}
                                  </div>
                                </div>
                                <p style={{ margin: 0, fontSize: 13, color: isDark ? "#cbd5e1" : "#647087", lineHeight: 1.5 }}>{rev.comment}</p>
                              </div>
                            ))}
                            {reviews.filter(r => r.placeId === place.id).length > 3 && (
                              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
                                Và {reviews.filter(r => r.placeId === place.id).length - 3} đánh giá khác...
                              </p>
                            )}
                          </div>
                        ) : (
                          <div style={{ padding: "20px 0", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
                            Chưa có đánh giá nào cho địa điểm này.
                          </div>
                        )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        )}

        {!loading && !error && filteredPlaces.length === 0 && (
          <div style={{ padding: 28, textAlign: "center", color: "#647087" }}>
            No place data yet. Add real data from your backend source.
          </div>
        )}
      </div>

      <PlaceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedPlace}
      />
    </div>
  );
}
