import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const BACKEND_URL = "http://localhost:5000";

import { useAuth } from "../authContext.jsx";

export default function Login({}) {
  const { login } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  if (!usernameOrEmail.trim() || !password) {
    setError("Please fill in all fields.");
    return;
  }

  setLoading(true);
  try {
    const res = await axios.post(`${BACKEND_URL}/api/login`, {
      usernameOrEmail: usernameOrEmail.trim(),
      password,
    });
      
    console.log("Login response:", res.data); // Log the response data for debugging
    login(res.data.user);
    navigate("/");

  } catch (err) {
    console.error("Login error:", err); // Log the error for debugging
    setError(
      err.response?.data?.error || "Failed to login. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 6,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Log In</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 12 }}
            disabled={loading}
            autoFocus
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 12 }}
            disabled={loading}
          />
        </label>
        {error && (
          <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "#3182ce",
            color: "white",
            fontWeight: "600",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p style={{ marginTop: 20, textAlign: "center" }}>
        Don't have an account?{" "}
        <button
          onClick={() => navigate("/signup")}
          style={{
            color: "#3182ce",
            background: "none",
            border: "none",
            fontWeight: "600",
            cursor: "pointer",
            textDecoration: "underline",
            padding: 0,
            fontSize: "inherit",
          }}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}