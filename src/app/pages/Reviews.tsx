import { useEffect, useMemo, useState } from "react";
import { reviewService } from "../../data/services/reviewService";
import type { Review, ReviewStatus } from "../../domain/models/Review";
import { formatDateValue } from "../utils/date";

type ReviewFilter = "all" | ReviewStatus;

function statusStyle(status: ReviewStatus) {
  if (status === "visible") return { bg: "#e8f7ef", color: "#137a3d" };
  if (status === "hidden") return { bg: "#f2f4f7", color: "#475467" };
  return { bg: "#fff4e5", color: "#b35a00" };
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingReviewId, setUpdatingReviewId] = useState<string | null>(null);

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

    void loadReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredReviews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchQuery =
        normalizedQuery.length === 0 ||
        review.placeName.toLowerCase().includes(normalizedQuery) ||
        review.authorName.toLowerCase().includes(normalizedQuery) ||
        review.comment.toLowerCase().includes(normalizedQuery);
      const matchFilter = filter === "all" || review.status === filter;
      return matchQuery && matchFilter;
    });
  }, [reviews, query, filter]);

  const updateStatus = async (reviewId: string, status: "visible" | "hidden") => {
    try {
      setError("");
      setUpdatingReviewId(reviewId);

      const updatedReview =
        status === "visible"
          ? await reviewService.approve(reviewId)
          : await reviewService.hide(reviewId);

      if (!updatedReview) {
        return;
      }

      setReviews((prev) => prev.map((item) => (item.id === reviewId ? updatedReview : item)));
    } catch (updateError) {
      console.error(updateError);
      setError("Cannot update review status right now. Please try again.");
    } finally {
      setUpdatingReviewId(null);
    }
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>Review Management</h1>
        <p style={{ margin: "8px 0 0", color: "#647087" }}>
          Moderate travel reviews directly from backend review documents.
        </p>
      </div>

      {error && (
        <div
          style={{
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#b91c1c",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 180px",
          gap: 10,
          background: "#ffffff",
          border: "1px solid #e8ecf3",
          borderRadius: 12,
          padding: 12,
        }}
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by place, user or review text..."
          style={{
            height: 40,
            border: "1px solid #d9e0ea",
            borderRadius: 8,
            padding: "0 12px",
            fontSize: 14,
            outline: "none",
          }}
        />
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as ReviewFilter)}
          style={{
            height: 40,
            border: "1px solid #d9e0ea",
            borderRadius: 8,
            padding: "0 10px",
            fontSize: 14,
            outline: "none",
            background: "#fff",
          }}
        >
          <option value="all">All status</option>
          <option value="pending">Pending</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8ecf3", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f7f9fc" }}>
              {["Place", "Reviewer", "Rating", "Comment", "Date", "Status", "Action"].map((col) => (
                <th
                  key={col}
                  style={{
                    textAlign: "left",
                    padding: "12px 14px",
                    fontSize: 12,
                    color: "#5e6b81",
                    borderBottom: "1px solid #e8ecf3",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review) => {
              const badge = statusStyle(review.status);
              const isUpdating = updatingReviewId === review.id;
              return (
                <tr key={review.id}>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#1f2a3d", fontWeight: 600 }}>
                    {review.placeName}
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#4d5a72" }}>{review.authorName}</td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#4d5a72" }}>{review.rating}/5</td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#4d5a72", maxWidth: 420 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                      {review.comment}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#4d5a72" }}>
                    {formatDateValue(review.createdAt)}
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: badge.bg,
                        color: badge.color,
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {review.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", display: "flex", gap: 8 }}>
                    <button
                      onClick={() => void updateStatus(review.id, "visible")}
                      disabled={isUpdating || review.status === "visible"}
                      style={{
                        border: "1px solid #d9e0ea",
                        background: isUpdating || review.status === "visible" ? "#f3f6fb" : "#fff",
                        color: "#344155",
                        padding: "6px 10px",
                        borderRadius: 8,
                        cursor: isUpdating || review.status === "visible" ? "not-allowed" : "pointer",
                        fontSize: 12,
                      }}
                    >
                      {isUpdating ? "Saving..." : "Approve"}
                    </button>
                    <button
                      onClick={() => void updateStatus(review.id, "hidden")}
                      disabled={isUpdating || review.status === "hidden"}
                      style={{
                        border: "1px solid #d9e0ea",
                        background: isUpdating || review.status === "hidden" ? "#f3f6fb" : "#fff",
                        color: "#344155",
                        padding: "6px 10px",
                        borderRadius: 8,
                        cursor: isUpdating || review.status === "hidden" ? "not-allowed" : "pointer",
                        fontSize: 12,
                      }}
                    >
                      {isUpdating ? "Saving..." : "Hide"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {isLoading && (
          <div style={{ padding: 28, textAlign: "center", color: "#647087" }}>
            Loading reviews...
          </div>
        )}

        {!isLoading && filteredReviews.length === 0 && (
          <div style={{ padding: 28, textAlign: "center", color: "#647087" }}>
            No reviews match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
