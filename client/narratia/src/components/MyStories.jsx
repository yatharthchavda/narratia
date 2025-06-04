import React, { useEffect, useState } from "react";
import axios from "axios";

const ITEMS_PER_PAGE = 4; // 2 columns × 2 rows

export default function MyStories({ currentUserId }) {
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BACKEND_URL = "http://localhost:5000";

useEffect(() => {
  async function fetchMyStories() {
    if (!currentUserId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/mystories/${currentUserId}`, {
        params: { page, limit: ITEMS_PER_PAGE },
      });
      setStories(res.data.stories);
      setTotalPages(Math.ceil(res.data.totalStories / ITEMS_PER_PAGE));
    } catch (err) {
      console.error("Failed to fetch user stories", err);
      setError("Failed to load your stories");
    } finally {
      setLoading(false);
    }
  }
  fetchMyStories();
}, [currentUserId, page]);

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));
  const handlePageClick = (num) => setPage(num);

  if (!currentUserId) {
    return <p>Please log in to see your stories.</p>;
  }

  return (
    <div style={{ maxWidth: 900, margin: "30px auto" }}>
      <h2>My Stories</h2>

      {loading ? (
        <p>Loading your stories...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : stories.length === 0 ? (
        <p>You have no stories yet.</p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 20,
            }}
          >
            {stories.map((story) => (
              <div
                key={story._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  padding: 16,
                  backgroundColor: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "220px",
                  overflow: "hidden",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 10px",
                    fontSize: 18,
                    color: "#2c5282",
                    height: 48,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={story.prompt}
                >
                  {story.prompt || "Untitled"}
                </h3>
                {/* Add genre display */}
<p
  style={{ fontStyle: "italic", fontSize: 13, color: "#666", margin: "4px 0" }}
>
  Genre: {story.genre || "Unknown"}
</p>
                <p
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: "#555",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 6,
                    WebkitBoxOrient: "vertical",
                  }}
                  title={story.generated_story}
                >
                  {story.generated_story || "No story content."}
                </p>

                <div
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    color: "#999",
                    textAlign: "right",
                  }}
                >
                  Created:{" "}
                  {new Date(story.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div
            style={{
              marginTop: 30,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
            }}
          >
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              style={{
                padding: "6px 14px",
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const pNum = i + 1;
              return (
                <button
                  key={pNum}
                  onClick={() => handlePageClick(pNum)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: pNum === page ? "#3182ce" : "#eee",
                    color: pNum === page ? "white" : "black",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  {pNum}
                </button>
              );
            })}
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              style={{
                padding: "6px 14px",
                cursor: page === totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}