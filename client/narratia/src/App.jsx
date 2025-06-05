import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomepageWrapper from "./components/HomepageWrapper";
import MyStoriesWrapper from "./components/MyStoriesWrapper";

export default function App() {
  // Replace this with actual logged-in user ID from your auth/session logic
  const currentUserId = "6841d8b64ecff6fd01384c65";

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomepageWrapper currentUserId={currentUserId} />} />
        <Route path="/mystories" element={<MyStoriesWrapper currentUserId={currentUserId} />} />
        {/* Add more routes like /profile here as needed */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}