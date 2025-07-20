import React, { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000";
const ITEMS_PER_PAGE = 4;
const GENRE_OPTIONS = [
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Mystery",
  "Thriller",
  "Horror",
  "Historical",
  "Adventure",
  "Comedy",
];

// Placeholder GPT-4 API call simulator (replace with real API call)
async function generateStoryWithGPT(promptText, genreText) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        `AI-generated ${genreText} story based on your prompt:\n\n"${promptText}"\n\n[Story content generated here...]`
      );
    }, 2000);
  });
}

import { useAuth } from "../authContext"; // adjust the path if needed

export default function MyStories() {
  const { user } = useAuth();

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Track which story is in edit mode (story_id or null)
  const [editingStoryId, setEditingStoryId] = useState(null);

  // Editable fields for the story being edited
  const [editPrompt, setEditPrompt] = useState("");
  const [editGenre, setEditGenre] = useState(GENRE_OPTIONS[0]);
  const [editGeneratedStory, setEditGeneratedStory] = useState("");

  // Loading states for individual story actions
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyStories = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/mystories/${user.id}`, {
        params: { page, limit: ITEMS_PER_PAGE },
      });
      setStories(res.data.stories);
      console.log("Fetched stories:", res.data.stories);
      setTotalPages(Math.ceil(res.data.totalStories / ITEMS_PER_PAGE));
    } catch (err) {
      console.error("Failed to fetch user stories", err);
      setError("Failed to load your stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStories();
  }, [user.id, page]);

  // Begin editing a story: preload values
  const startEditing = (story) => {
    setEditingStoryId(story._id);
    setEditPrompt(story.prompt || "");
    setEditGenre(story.genre || GENRE_OPTIONS[0]);
    setEditGeneratedStory(story.generated_story || "");
    setError(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingStoryId(null);
    setError(null);
  };

  // Regenerate story using GPT API inside edit mode
  const handleRegenerate = async () => {
    if (!editPrompt.trim()) {
      setError("Please enter a prompt to generate the story.");
      return;
    }
    setError(null);
    setGenerating(true);
    try {
      const generated = await generateStoryWithGPT(editPrompt.trim(), editGenre);
      setEditGeneratedStory(generated);
    } catch (err) {
      console.error("Failed to regenerate story", err);
      setError("Failed to regenerate story.");
    } finally {
      setGenerating(false);
    }
  };

  // Save edited story to backend
  const handleSave = async () => {
    if (!editPrompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }
    if (!editGeneratedStory.trim()) {
      setError("Generated story cannot be empty. Regenerate first.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const payload = {
        prompt: editPrompt.trim(),
        genre: editGenre,
        generated_story: editGeneratedStory,
      };
      await axios.put(`${BACKEND_URL}/api/mystories/${editingStoryId}`, payload);
      setEditingStoryId(null);
      fetchMyStories();
    } catch (err) {
      console.error("Failed to save story", err);
      setError("Failed to save story.");
    } finally {
      setSaving(false);
    }
  };

  // Delete a story
  const handleDelete = async (storyId) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    setDeletingId(storyId);
    setError(null);
    try {
      await axios.delete(`${BACKEND_URL}/api/mystories/${storyId}`);
      // If deleting last item on last page, go to previous page if possible
      if (stories.length === 1 && page > 1) setPage(page - 1);
      else fetchMyStories();
    } catch (err) {
      console.error("Failed to delete story", err);
      setError("Failed to delete story.");
    } finally {
      setDeletingId(null);
    }
  };

  // Pagination controls
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));
  const handlePageClick = (num) => setPage(num);

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
            {stories.map((story) => {
              const isEditing = editingStoryId === story._id;
              return (
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
                    minHeight: 300,
                  }}
                >
                  {isEditing ? (
                    <>
                      {/* Editable prompt */}
                      <label style={{ fontWeight: "600", marginBottom: 4 }}>Prompt:</label>
                      <textarea
                        rows={3}
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        disabled={saving || generating}
                        style={{ width: "100%", marginBottom: 8, borderRadius: 4, padding: 6 }}
                      />

                      {/* Editable genre */}
                      <label style={{ fontWeight: "600", marginBottom: 4 }}>Genre:</label>
                      <select
                        value={editGenre}
                        onChange={(e) => setEditGenre(e.target.value)}
                        disabled={saving || generating}
                        style={{ width: "100%", marginBottom: 8, borderRadius: 4, padding: 6 }}
                      >
                        {GENRE_OPTIONS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>

                      {/* Generated story */}
                      <label style={{ fontWeight: "600", marginBottom: 4 }}>Story:</label>
                      <textarea
                        rows={7}
                        value={editGeneratedStory}
                        onChange={(e) => setEditGeneratedStory(e.target.value)}
                        disabled={saving || generating}
                        style={{
                          width: "100%",
                          marginBottom: 8,
                          borderRadius: 4,
                          padding: 6,
                          fontFamily: "inherit",
                          fontSize: 14,
                        }}
                      />

                      {/* Edit action buttons */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={handleRegenerate}
                          disabled={generating || saving}
                          style={{
                            flex: 1,
                            backgroundColor: "#d69e2e",
                            border: "none",
                            color: "white",
                            padding: "8px 0",
                            borderRadius: 4,
                            fontWeight: "600",
                            cursor: generating ? "wait" : "pointer",
                          }}
                          title="Regenerate story via AI"
                        >
                          {generating ? "Regenerating..." : "Regenerate"}
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saving || generating}
                          style={{
                            flex: 1,
                            backgroundColor: "#38a169",
                            border: "none",
                            color: "white",
                            padding: "8px 0",
                            borderRadius: 4,
                            fontWeight: "600",
                            cursor: saving ? "wait" : "pointer",
                          }}
                          title="Save edited story"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={saving || generating}
                          style={{
                            flex: 1,
                            backgroundColor: "#e53e3e",
                            border: "none",
                            color: "white",
                            padding: "8px 0",
                            borderRadius: 4,
                            fontWeight: "600",
                            cursor: saving || generating ? "not-allowed" : "pointer",
                          }}
                          title="Cancel editing"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3
                        style={{
                          margin: "0 0 6px",
                          fontSize: 18,
                          color: "#2c5282",
                          height: 42,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={story.prompt}
                      >
                        {story.prompt || "Untitled"}
                      </h3>

                      <p
                        style={{
                          fontStyle: "italic",
                          fontSize: 13,
                          color: "#666",
                          margin: "0 0 10px",
                          userSelect: "none",
                        }}
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
                          WebkitLineClamp: 8,
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
                          userSelect: "none",
                        }}
                      >
                        {new Date(story.created_at).toLocaleDateString()}
                      </div>

                      {/* Action buttons */}
                      <div
                        style={{
                          marginTop: 12,
                          display: "flex",
                          gap: 10,
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          onClick={() => startEditing(story)}
                          style={{
                            backgroundColor: "#3182ce",
                            color: "white",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: 4,
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(story._id)}
                          disabled={deletingId === story._id}
                          style={{
                            backgroundColor: "#e53e3e",
                            color: "white",
                            border: "none",
                            padding: "6px 14px",
                            borderRadius: 4,
                            fontWeight: "600",
                            cursor:
                              deletingId === story._id ? "wait" : "pointer",
                          }}
                        >
                          {deletingId === story._id ? "Deleting..." : "Remove"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
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