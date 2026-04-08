import { useMemo, useState } from "react";
import { reviewsSeed } from "../data/adminData";

type ReviewFilter = "all" | "pending" | "approved" | "hidden";

function statusStyle(status: string) {
  if (status === "approved") return { bg: "#e8f7ef", color: "#137a3d" };
  if (status === "hidden") return { bg: "#f2f4f7", color: "#475467" };
  return { bg: "#fff4e5", color: "#b35a00" };
}

export default function Reviews() {
  const [reviews, setReviews] = useState(reviewsSeed);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ReviewFilter>("all");

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const matchQuery =
        query.trim().length === 0 ||
        review.placeName.toLowerCase().includes(query.toLowerCase()) ||
        review.reviewerName.toLowerCase().includes(query.toLowerCase()) ||
        review.comment.toLowerCase().includes(query.toLowerCase());
      const matchFilter = filter === "all" || review.status === filter;
      return matchQuery && matchFilter;
    });
  }, [reviews, query, filter]);

  const updateStatus = (reviewId: string, status: "approved" | "hidden") => {
    setReviews((prev) => prev.map((item) => (item.id === reviewId ? { ...item, status } : item)));
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, color: "#1f2a3d" }}>Review Management</h1>
        <p style={{ margin: "8px 0 0", color: "#647087" }}>
          Moderate travel reviews with essential controls only.
        </p>
      </div>

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
          <option value="approved">Approved</option>
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
              return (
                <tr key={review.id}>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#1f2a3d", fontWeight: 600 }}>
                    {review.placeName}
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#4d5a72" }}>{review.reviewerName}</td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#4d5a72" }}>{review.rating}/5</td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#4d5a72", maxWidth: 420 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                      {review.comment}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #eef2f8", color: "#4d5a72" }}>{review.submittedAt}</td>
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
                      onClick={() => updateStatus(review.id, "approved")}
                      style={{
                        border: "1px solid #d9e0ea",
                        background: "#fff",
                        color: "#344155",
                        padding: "6px 10px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(review.id, "hidden")}
                      style={{
                        border: "1px solid #d9e0ea",
                        background: "#fff",
                        color: "#344155",
                        padding: "6px 10px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      Hide
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredReviews.length === 0 && (
          <div style={{ padding: 28, textAlign: "center", color: "#647087" }}>
            No review data yet. Reviews will appear after connecting your backend.
          </div>
        )}
      </div>
    </div>
  );
}
