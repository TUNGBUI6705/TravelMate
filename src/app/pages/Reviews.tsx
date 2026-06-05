import { useEffect, useMemo, useState } from "react";
import { reviewService } from "../../data/services/reviewService.js";

type ReviewFilter = "all" | "pending" | "approved" | "hidden";

function statusStyle(status: string) {
  if (status === "approved") return { bg: "#e8f7ef", color: "#137a3d" };
  if (status === "hidden") return { bg: "#f2f4f7", color: "#475467" };
  return { bg: "#fff4e5", color: "#b35a00" };
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    reviewService
      .getAll()
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load reviews:", err);
        setError("Failed to load reviews");
        setLoading(false);
      });
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchQuery =
        query.trim().length === 0 ||
        (review.placeName && review.placeName.toLowerCase().includes(query.toLowerCase())) ||
        (review.reviewerName && review.reviewerName.toLowerCase().includes(query.toLowerCase())) ||
        (review.comment && review.comment.toLowerCase().includes(query.toLowerCase()));
      const matchFilter = filter === "all" || review.status === filter;
      return matchQuery && matchFilter;
    });
  }, [reviews, query, filter]);

  const updateStatus = (reviewId: string, status: "approved" | "hidden") => {
    setReviews((prev) => prev.map((item) => (item.id === reviewId ? { ...item, status } : item)));
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#647087" }}>
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, background: "#fef2f2", color: "#b91c1c", borderRadius: 8 }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>Review Management</h1>
        <p style={{ margin: "8px 0 0", color: "#647087" }}>
          Moderate travel reviews with essential controls only.
        </p>
      </div>

      <div className="toolbar">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by place, user or review text..."
        />
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as ReviewFilter)}
        >
          <option value="all">All status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr className="table-header">
              {["Place", "Reviewer", "Rating", "Comment", "Date", "Status", "Action"].map((col) => (
                <th key={col}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review) => {
              const badge = statusStyle(review.status);
              return (
                <tr key={review.id} className="table-row">
                  <td style={{ fontWeight: 600 }}>{review.placeName || "N/A"}</td>
                  <td style={{ color: "#4d5a72" }}>{review.reviewerName || "N/A"}</td>
                  <td style={{ color: "#4d5a72" }}>{review.rating || 0}/5</td>
                  <td style={{ maxWidth: 420 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                      {review.comment || "N/A"}
                    </span>
                  </td>
                  <td style={{ color: "#4d5a72" }}>{review.submittedAt || review.createdAt || "N/A"}</td>
                  <td>
                    <span className="status-badge" style={{ background: badge.bg, color: badge.color }}>
                      {review.status || "unknown"}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button
                      className="action-button"
                      onClick={() => updateStatus(review.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="action-button"
                      onClick={() => updateStatus(review.id, "hidden")}
                    >
                      Hide
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!filteredReviews.length && (
          <div className="empty-state">
            No review data yet. Reviews will appear after connecting your backend.
          </div>
        )}
      </div>
    </div>
  );
}