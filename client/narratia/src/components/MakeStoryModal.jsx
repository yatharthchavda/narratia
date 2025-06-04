import React, { useState } from "react";

const BACKEND_URL = "http://localhost:5000";

// Mock genre options — you can extend or fetch dynamically
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

export default function MakeStoryModal({ isOpen, onClose, currentUserId }) {
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState(GENRE_OPTIONS[0]);
  const [generatedStory, setGeneratedStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Placeholder GPT-4 call simulator
  async function generateStoryWithGPT(promptText, genreText) {
    // Replace this with your actual GPT-4 API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `This is an AI-generated ${genreText} story based on your prompt:\n\n"${promptText}"\n\n[Story content generated here...]`
        );
      }, 2000);
    });
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const storyText = await generateStoryWithGPT(prompt.trim(), genre);
      setGeneratedStory(storyText);
    } catch (err) {
      console.error("Error generating story:", err);
      setError("Failed to generate story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedStory) {
      setError("No generated story to publish.");
      return;
    }
    if (!currentUserId) {
      setError("User not logged in.");
      return;
    }
    setError(null);
    setSuccessMsg(null);
    setPublishLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUserId,
          prompt: prompt.trim(),
          generated_story: generatedStory,
          genre,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to publish story");
      }
      setSuccessMsg("Story published successfully!");
      // Optionally clear inputs or close modal after short delay
      setTimeout(() => {
        resetAndClose();
      }, 1500);
    } catch (err) {
      console.error("Publish error:", err);
      setError("Failed to publish the story.");
    } finally {
      setPublishLoading(false);
    }
  };

  const resetAndClose = () => {
    setPrompt("");
    setGenre(GENRE_OPTIONS[0]);
    setGeneratedStory("");
    setError(null);
    setSuccessMsg(null);
    setLoading(false);
    setPublishLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={resetAndClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          zIndex: 99,
        }}
      />
      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="make-story-title"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: 24,
          width: "90vw",
          maxWidth: 500,
          borderRadius: 8,
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          zIndex: 100,
          maxHeight: "90vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="make-story-title" style={{ margin: 0 }}>
          Make a Story With Your Idea
        </h2>

        {/* Prompt input */}
        <label htmlFor="prompt-input" style={{ fontWeight: "600" }}>
          Enter your story prompt:
        </label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Write your story idea here..."
          style={{ width: "100%", padding: 8, fontSize: 14, borderRadius: 4 }}
          disabled={loading || publishLoading}
        />

        {/* Genre dropdown */}
        <label htmlFor="genre-select" style={{ fontWeight: "600" }}>
          Select genre:
        </label>
        <select
          id="genre-select"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          disabled={loading || publishLoading}
          style={{ width: "100%", padding: 8, fontSize: 14, borderRadius: 4 }}
        >
          {GENRE_OPTIONS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        {/* Error message */}
        {error && (
          <div style={{ color: "red", fontWeight: "600", marginTop: -8 }}>{error}</div>
        )}

        {/* Success message */}
        {successMsg && (
          <div style={{ color: "green", fontWeight: "600", marginTop: -8 }}>
            {successMsg}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {!generatedStory ? (
            <button
              onClick={handleGenerate}
              disabled={loading || publishLoading}
              style={{
                flex: 1,
                padding: "10px 0",
                backgroundColor: "#3182ce",
                color: "white",
                border: "none",
                borderRadius: 4,
                fontWeight: "600",
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "Generating..." : "Generate Story"}
            </button>
          ) : (
            <>
              <button
                onClick={handleGenerate}
                disabled={loading || publishLoading}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  backgroundColor: "#d69e2e",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  fontWeight: "600",
                  cursor: loading ? "wait" : "pointer",
                }}
              >
                {loading ? "Regenerating..." : "Regenerate Story"}
              </button>
              <button
                onClick={handlePublish}
                disabled={publishLoading}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  backgroundColor: "#38a169",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  fontWeight: "600",
                  cursor: publishLoading ? "wait" : "pointer",
                }}
              >
                {publishLoading ? "Publishing..." : "Publish Story"}
              </button>
            </>
          )}

          <button
            onClick={resetAndClose}
            disabled={loading || publishLoading}
            style={{
              padding: "10px 16px",
              backgroundColor: "#e53e3e",
              color: "white",
              border: "none",
              borderRadius: 4,
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>

        {/* Generated story preview */}
        {generatedStory && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              backgroundColor: "#f7fafc",
              borderRadius: 6,
              whiteSpace: "pre-wrap",
              maxHeight: 200,
              overflowY: "auto",
              fontSize: 14,
              lineHeight: 1.4,
              color: "#2d3748",
              border: "1px solid #cbd5e0",
            }}
          >
            {generatedStory}
          </div>
        )}
      </div>
    </>
  );
}