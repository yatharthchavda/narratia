import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const BACKEND_URL = "http://localhost:5000";

export default function Signup({}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Basic email regex
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/signup`, {
        username: username.trim(),
        email: email.trim(),
        password,
      });
      onSignupSuccess(res.data);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to sign up. Please try again."
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
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 12 }}
            disabled={loading}
            autoFocus
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4, marginBottom: 12 }}
            disabled={loading}
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
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <p style={{ marginTop: 20, textAlign: "center" }}>
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
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
          Log In
        </button>
      </p>
    </div>
  );
}