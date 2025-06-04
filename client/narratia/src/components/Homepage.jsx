import React, { useEffect, useState } from "react";
import axios from "axios";

const ITEMS_PER_PAGE = 4; // 2 columns × 2 rows

export default function Homepage({ currentUserId }) {
  const [user, setUser] = useState(null);
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingStories, setLoadingStories] = useState(false);
  const [errorUser, setErrorUser] = useState(null);
  const [errorStories, setErrorStories] = useState(null);

  const BACKEND_URL = "http://localhost:5000";

  // Fetch current user info
  useEffect(() => {
    async function fetchUser() {
      if (!currentUserId) return;
      setLoadingUser(true);
      setErrorUser(null);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/users/${currentUserId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
        setErrorUser("Failed to load user info");
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, [currentUserId]);

  // Fetch stories (all users)
  useEffect(() => {
    async function fetchStories() {
      setLoadingStories(true);
      setErrorStories(null);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/stories`, {
          params: { page, limit: ITEMS_PER_PAGE },
        });
        setStories(res.data.stories);
        setTotalPages(Math.ceil(res.data.totalStories / ITEMS_PER_PAGE));
      } catch (err) {
        console.error("Failed to fetch stories", err);
        setErrorStories("Failed to load stories");
      } finally {
        setLoadingStories(false);
      }
    }
    fetchStories();
  }, [page]);

  // Pagination handlers
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));
  const handlePageClick = (num) => setPage(num);

  // User initials for logo
  const userInitials =
    user && user.username
      ? user.username
          .split(" ")
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "";

  return (
    <div style={{ maxWidth: 900, margin: "30px auto" }}>
      {/* Page header with app name, make a story button, and user info */}
      <header
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>Narratia</h1>

        <button
          style={{
            backgroundColor: "#3182ce",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: "600",
          }}
          onClick={() => alert("Make story button clicked!")}
        >
          Make a story with your idea
        </button>

        {/* User logo and username */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontWeight: "600",
            color: "#333",
          }}
        >
          {loadingUser ? (
            <div>Loading user...</div>
          ) : errorUser ? (
            <div style={{ color: "red" }}>{errorUser}</div>
          ) : user ? (
            <>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "#3182ce",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "700",
                  fontSize: 18,
                  userSelect: "none",
                }}
              >
                {userInitials}
              </div>
              <span>{user.username}</span>
            </>
          ) : (
            <div>User not found</div>
          )}
        </div>
      </header>

      {/* Stories grid */}
      {loadingStories ? (
        <p>Loading stories...</p>
      ) : errorStories ? (
        <p style={{ color: "red" }}>{errorStories}</p>
      ) : stories.length === 0 ? (
        <p>No stories found.</p>
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
                  {new Date(story.created_at).toLocaleDateString()}
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