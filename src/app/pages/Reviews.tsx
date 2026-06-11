import { useEffect, useMemo, useState } from "react";
import { reviewService } from "../../data/services/reviewService.js";
import { storageService } from "../../data/services/storageService.js";
import {
  Star, MessageSquare, CheckCircle, XCircle, Trash2, User, MapPin,
  BarChart3, PieChart as PieIcon, ThumbsUp, AlertTriangle, X
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useTheme } from "../utils/ThemeContext";

type ReviewFilter = "all" | "active" | "hidden";

const COLORS = ['#10b981', '#94a3b8', '#ef4444'];

export default function Reviews() {
  const { theme } = useTheme();
  const [reviews, setReviews] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getAll();
      setReviews(data);
    } catch (err) {
      console.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const stats = useMemo(() => {
    const total = reviews.length;
    const active = reviews.filter(r => r.status === 'active' || r.status === 'approved' || !r.status).length;
    const hidden = reviews.filter(r => r.status === 'hidden').length;
    const avgRating = total > 0 ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / total).toFixed(1) : 0;

    return { total, active, hidden, avgRating };
  }, [reviews]);

  const chartData = useMemo(() => {
    return [
      { name: 'Đang hiện', value: stats.active },
      { name: 'Đang ẩn', value: stats.hidden },
    ];
  }, [stats]);

  const ratingDist = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
      const rating = Math.round(r.rating || 0);
      if (rating >= 1 && rating <= 5) dist[rating - 1]++;
    });
    return dist.map((count, i) => ({ name: `${i + 1}⭐`, count })).reverse();
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const pName = String(review.placeName || "").toLowerCase();
      const uName = String(review.reviewerName || "").toLowerCase();
      const comment = String(review.comment || "").toLowerCase();
      const matchQuery =
        query.trim().length === 0 ||
        pName.includes(query.toLowerCase()) ||
        uName.includes(query.toLowerCase()) ||
        comment.includes(query.toLowerCase());

      let matchFilter = filter === "all";
      if (filter === "active") matchFilter = review.status === "active" || review.status === "approved" || !review.status;
      else if (filter === "hidden") matchFilter = review.status === "hidden";

      return matchQuery && matchFilter;
    });
  }, [reviews, query, filter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await reviewService.updateStatus(id, status);
      await loadReviews();
      if (selectedReview?.id === id) {
        setSelectedReview({ ...selectedReview, status });
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (review: any) => {
    if (window.confirm("Xóa vĩnh viễn đánh giá này? Dữ liệu không thể khôi phục.")) {
      try {
        const photos = review.photos || review.images || [];
        if (photos.length > 0) {
          await storageService.deleteMultipleFiles(photos);
        }
        await reviewService.delete(review.id);
        setReviews(reviews.filter((r: any) => r.id !== review.id));
        setSelectedReview(null);
      } catch (err) {
        alert("Lỗi khi xóa đánh giá");
      }
    }
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d", fontWeight: 700 }}>Review Moderation</h1>
          <p style={{ margin: "8px 0 0", color: "#94a3b8", fontSize: 16 }}>
            Manage and analyze user feedback to ensure content quality.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {[
          { label: "Tổng số đánh giá", value: stats.total, icon: <MessageSquare size={20} />, color: "#3b82f6", bg: theme === 'dark' ? "rgba(59,130,246,0.1)" : "#eff6ff" },
          { label: "Rating trung bình", value: stats.avgRating + "/5", icon: <Star size={20} />, color: "#f59e0b", bg: theme === 'dark' ? "rgba(245,158,11,0.1)" : "#fff7ed" },
          { label: "Đang hiển thị", value: stats.active, icon: <ThumbsUp size={20} />, color: "#10b981", bg: theme === 'dark' ? "rgba(16,185,129,0.1)" : "#ecfdf5" },
        ].map((s, i) => (
          <div key={i} style={{ background: theme === 'dark' ? "#1e293b" : "#fff", border: theme === 'dark' ? "1px solid #334155" : "1px solid #e8ecf3", borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ background: s.bg, color: s.color, padding: 10, borderRadius: 12 }}>{s.icon}</div>
              <span style={{ fontSize: 14, color: "#647087", fontWeight: 500 }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: 24 }}>
        <div style={{ display: "grid", gap: 20 }}>
          {/* Filter Bar */}
          <div style={{ display: "flex", gap: 12, background: theme === 'dark' ? "#1e293b" : "#fff", padding: 16, borderRadius: 12, border: theme === 'dark' ? "1px solid #334155" : "1px solid #e8ecf3" }}>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by user, place or comment..."
              style={{ flex: 1, height: 42, border: theme === 'dark' ? "1px solid #334155" : "1px solid #d9e0ea", borderRadius: 8, padding: "0 12px", fontSize: 14, outline: "none", background: theme === 'dark' ? "#0f172a" : "#fff", color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}
            />
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as ReviewFilter)}
              style={{ width: 160, height: 42, border: theme === 'dark' ? "1px solid #334155" : "1px solid #d9e0ea", borderRadius: 8, padding: "0 12px", fontSize: 14, background: theme === 'dark' ? "#0f172a" : "#fff", color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hiện</option>
              <option value="hidden">Đang ẩn</option>
            </select>
          </div>

          {/* Review List */}
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#647087" }}>Loading reviews...</div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    onClick={() => setSelectedReview(review)}
                    style={{
                      background: theme === 'dark' ? "#1e293b" : "#fff",
                      border: theme === 'dark' ? "1px solid #334155" : "1px solid #e8ecf3",
                      borderRadius: 12,
                      padding: 20,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      position: "relative",
                      overflow: "hidden"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = "#3b82f6"}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = theme === 'dark' ? "#334155" : "#e8ecf3"}
                  >
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: review.status === 'hidden' ? '#94a3b8' : '#10b981' }}></div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div style={{ display: "flex", gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: theme === 'dark' ? "#0f172a" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <User size={20} color="#94a3b8" />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: 16, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}>{review.reviewerName || "Anonymous User"}</h4>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, color: "#647087", fontSize: 13 }}>
                            <MapPin size={14} />
                            {review.placeName || "Unknown Place"}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "end", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < (review.rating || 0) ? "#f59e0b" : "none"} color={i < (review.rating || 0) ? "#f59e0b" : "#d1d5db"} />
                          ))}
                        </div>
                        <span style={{
                          padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                          background: review.status === 'hidden' ? (theme === 'dark' ? "#334155" : '#f1f5f9') : (theme === 'dark' ? "rgba(16,185,129,0.2)" : '#dcfce7'),
                          color: review.status === 'hidden' ? '#94a3b8' : '#10b981'
                        }}>
                          {review.status === 'hidden' ? 'Đã ẩn' : 'Đang hiện'}
                        </span>
                      </div>
                    </div>
                    <p style={{ margin: "16px 0 0", color: theme === 'dark' ? "#cbd5e1" : "#475569", fontSize: 14, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {review.comment}
                    </p>
                    <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>{new Date(review.createdAt || Date.now()).toLocaleDateString()}</span>
                      {review.photos && review.photos.length > 0 && <span style={{ fontSize: 12, color: "#3b82f6", fontWeight: 600 }}>+{review.photos.length} photos</span>}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: 60, textAlign: "center", background: theme === 'dark' ? "#1e293b" : "#fff", borderRadius: 12, border: theme === 'dark' ? "1px solid #334155" : "1px solid #e8ecf3" }}>
                  <h3 style={{ color: theme === 'dark' ? "#f8fafc" : "#1f2a3d", margin: 0 }}>No reviews found</h3>
                  <p style={{ color: "#647087", marginTop: 8 }}>All caught up! No reviews match your current filters.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Charts Sidebar */}
        <div style={{ display: "grid", gap: 20, height: "fit-content" }}>
          <div style={{ background: theme === 'dark' ? "#1e293b" : "#fff", border: theme === 'dark' ? "1px solid #334155" : "1px solid #e8ecf3", borderRadius: 16, padding: 20 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}>
              <PieIcon size={18} color="#3b82f6" /> Status Distribution
            </h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: theme === 'dark' ? "#1e293b" : "#fff", border: "none", borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: theme === 'dark' ? "#1e293b" : "#fff", border: theme === 'dark' ? "1px solid #334155" : "1px solid #e8ecf3", borderRadius: 16, padding: 20 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}>
              <BarChart3 size={18} color="#3b82f6" /> Rating Analysis
            </h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingDist} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme === 'dark' ? "#334155" : "#f1f5f9"} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={40} fontSize={12} tick={{ fill: "#94a3b8" }} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ background: theme === 'dark' ? "#1e293b" : "#fff", border: "none" }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Modal */}
      {selectedReview && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: theme === 'dark' ? "#1e293b" : "#fff", borderRadius: 20, width: "100%", maxWidth: 650, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", border: theme === 'dark' ? "1px solid #334155" : "none" }}>
            <div style={{ padding: "20px 24px", borderBottom: theme === 'dark' ? "1px solid #334155" : "1px solid #eef2f8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: 20, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}>Review Details</h2>
              <button onClick={() => setSelectedReview(null)} style={{ border: "none", background: "none", cursor: "pointer", color: "#647087" }}><X size={24} /></button>
            </div>
            <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
               <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                  <div style={{ width: 60, height: 60, borderRadius: "50%", background: theme === 'dark' ? "#0f172a" : "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", border: theme === 'dark' ? "1px solid #334155" : "1px solid #e2e8f0" }}>
                    <User size={30} color="#94a3b8" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 18, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}>{selectedReview.reviewerName || "Anonymous"}</h3>
                    <p style={{ margin: "4px 0 0", color: "#647087", fontSize: 14 }}>{selectedReview.reviewerEmail || "No email available"}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                       <div style={{ display: "flex", gap: 2 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < (selectedReview.rating || 0) ? "#f59e0b" : "none"} color={i < (selectedReview.rating || 0) ? "#f59e0b" : "#d1d5db"} />
                        ))}
                      </div>
                      <span style={{ fontSize: 13, color: "#94a3b8" }}>•</span>
                      <span style={{ fontSize: 13, color: "#647087" }}>{new Date(selectedReview.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
               </div>

               <div style={{ background: theme === 'dark' ? "#0f172a" : "#f8fafc", padding: 20, borderRadius: 16, marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, color: "#3b82f6", fontWeight: 600 }}>
                    <MapPin size={18} /> {selectedReview.placeName}
                  </div>
                  <p style={{ margin: 0, fontSize: 16, color: theme === 'dark' ? "#cbd5e1" : "#334155", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {selectedReview.comment}
                  </p>
               </div>
...

               {selectedReview.photos && selectedReview.photos.length > 0 && (
                 <div style={{ marginBottom: 24 }}>
                   <h4 style={{ margin: "0 0 12px", fontSize: 15, color: theme === 'dark' ? "#f8fafc" : "#1f2a3d" }}>Attached Photos ({selectedReview.photos.length})</h4>
                   <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                     {selectedReview.photos.map((url: string, i: number) => (
                       <img key={i} src={url} alt="" style={{ width: 120, height: 120, borderRadius: 12, objectFit: "cover", cursor: "zoom-in", border: "1px solid #e2e8f0" }} />
                     ))}
                   </div>
                 </div>
               )}
            </div>
            <div style={{ padding: "16px 24px", background: "#f8fafc", borderTop: "1px solid #eef2f8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => handleDelete(selectedReview)} style={{ display: "flex", alignItems: "center", gap: 8, border: "none", background: "none", color: "#ef4444", fontWeight: 600, cursor: "pointer" }}>
                <Trash2 size={18} /> Xóa vĩnh viễn
              </button>
              <div style={{ display: "flex", gap: 12 }}>
                {selectedReview.status === 'hidden' ? (
                  <button onClick={() => handleUpdateStatus(selectedReview.id, 'active')} style={{ display: "flex", alignItems: "center", gap: 8, border: "none", background: "#10b981", color: "#fff", padding: "10px 20px", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>
                    <CheckCircle size={18} /> Hiện đánh giá
                  </button>
                ) : (
                  <button onClick={() => handleUpdateStatus(selectedReview.id, 'hidden')} style={{ display: "flex", alignItems: "center", gap: 8, border: theme === 'dark' ? "1px solid #334155" : "1px solid #d9e0ea", background: theme === 'dark' ? "#1e293b" : "#fff", color: "#647087", padding: "10px 20px", borderRadius: 10, fontWeight: 600, cursor: "pointer" }}>
                    <XCircle size={18} /> Ẩn đánh giá
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
