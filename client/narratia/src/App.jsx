import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomepageWrapper from "./components/HomepageWrapper";
import MyStoriesWrapper from "./components/MyStoriesWrapper";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useAuth } from "./authContext";

export default function App() {
  const { user, login, logout } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<HomepageWrapper user={user} handleLogout={logout} />}
        />
        <Route
          path="/mystories"
          element={<MyStoriesWrapper user={user} />}
        />
        <Route
          path="/login"
          element={<Login onLoginSuccess={login} />}
        />
        <Route
          path="/signup"
          element={<Signup onSignupSuccess={login} />}
        />
      </Routes>
    </Router>
  );
}
