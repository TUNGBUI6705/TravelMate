import { useEffect, useMemo, useState } from "react";
import { reviewService } from "../../data/services/reviewService.js";
import { formatDateValue } from "../utils/date.js";

function statusStyle(status) {
  if (status === "visible") return { bg: "#e8f7ef", color: "#137a3d" };
  if (status === "hidden") return { bg: "#f2f4f7", color: "#475467" };
  return { bg: "#fff4e5", color: "#b35a00" };
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingReviewId, setUpdatingReviewId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await reviewService.getAll();
        if (!isMounted) {
          return;
        }
        setReviews(data);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }
        console.error(loadError);
        setError("Cannot load reviews from backend. Please try again.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredReviews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return reviews.filter((review) => {
      const matchQuery =
        normalizedQuery.length === 0 ||
        (review.placeName || "").toLowerCase().includes(normalizedQuery) ||
        (review.authorName || "").toLowerCase().includes(normalizedQuery) ||
        (review.comment || "").toLowerCase().includes(normalizedQuery);
      const matchFilter = filter === "all" || review.status === filter;
      return matchQuery && matchFilter;
    });
  }, [reviews, query, filter]);

  const updateReviewStatus = async (reviewId, newStatus) => {
    try {
      setUpdatingReviewId(reviewId);
      setError("");

      let updated;
      if (newStatus === "visible") {
        updated = await reviewService.approve(reviewId);
      } else if (newStatus === "hidden") {
        updated = await reviewService.hide(reviewId);
      }

      if (updated) {
        setReviews((prev) => prev.map((r) => (r.id === reviewId ? updated : r)));
      }
    } catch (updateError) {
      console.error(updateError);
      setError("Cannot update review status. Please try again.");
    } finally {
      setUpdatingReviewId(null);
    }
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>Review Management</h1>
        <p style={{ margin: "8px 0 0", color: "#647087" }}>
          Manage user reviews and moderate content.
        </p>
      </div>

      {error && (
        <div style={{ padding: 10, borderRadius: 8, background: "#fef2f2", color: "#b91c1c", fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Search reviews..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #d9e0ea",
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #d9e0ea",
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      {isLoading ? (
        <div style={{ padding: 20, textAlign: "center", color: "#647087" }}>Loading reviews...</div>
      ) : filteredReviews.length === 0 ? (
        <div style={{ padding: 20, textAlign: "center", color: "#647087" }}>No reviews found</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              style={{
                padding: 12,
                background: "#fff",
                border: "1px solid #e8ecf3",
                borderRadius: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: "#1f2a3d" }}>{review.placeName || "Unknown Place"}</span>
                    <span
                      style={{
                        padding: "2px 6px",
                        borderRadius: 3,
                        fontSize: 12,
                        fontWeight: 600,
                        ...statusStyle(review.status || "pending"),
                      }}
                    >
                      {review.status || "Unknown"}
                    </span>
                  </div>
                  <p style={{ margin: "4px 0", fontSize: 12, color: "#647087" }}>
                    By {review.authorName || "Unknown"} • Rating: {review.rating || 0}/5
                  </p>
                  <p style={{ margin: "4px 0", fontSize: 13, color: "#475467" }}>{review.comment || "No comment"}</p>
                  <p style={{ margin: "8px 0 0", fontSize: 12, color: "#999" }}>
                    {formatDateValue(review.createdAt || new Date())}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    onClick={() => updateReviewStatus(review.id, "visible")}
                    disabled={updatingReviewId === review.id || review.status === "visible"}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 4,
                      border: "1px solid #d9e0ea",
                      background: review.status === "visible" ? "#dbeafe" : "#fff",
                      color: review.status === "visible" ? "#0369a1" : "#647087",
                      cursor: updatingReviewId === review.id ? "wait" : "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateReviewStatus(review.id, "hidden")}
                    disabled={updatingReviewId === review.id || review.status === "hidden"}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 4,
                      border: "1px solid #d9e0ea",
                      background: review.status === "hidden" ? "#fee2e2" : "#fff",
                      color: review.status === "hidden" ? "#b91c1c" : "#647087",
                      cursor: updatingReviewId === review.id ? "wait" : "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Hide
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
