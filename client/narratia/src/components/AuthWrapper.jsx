import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function AuthWrapper() {
  const [userData, setUserData] = useState(null); // holds { user, token }
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    // On mount, load from localStorage if exists
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setUserData({ token, user: JSON.parse(user) });
    }
  }, []);

  const onLoginSuccess = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUserData({ token, user });
  };

  const onSignupSuccess = onLoginSuccess; // same handler

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserData(null);
  };

  if (userData) {
    // Show logged-in UI or your app here (pass userData.user.id as currentUserId etc.)
    return (
      <div>
        <p>Welcome, {userData.user.username}!</p>
        <button onClick={handleLogout}>Log Out</button>
        {/* Render the app/main component here, your stories etc. */}
      </div>
    );
  }

  return showSignup ? (
    <Signup
      onSignupSuccess={onSignupSuccess}
      switchToLogin={() => setShowSignup(false)}
    />
  ) : (
    <Login
      onLoginSuccess={onLoginSuccess}
      switchToSignup={() => setShowSignup(true)}
    />
  );
}