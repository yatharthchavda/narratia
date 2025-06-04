import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  // Style for active link
  const activeStyle = {
    fontWeight: "700",
    color: "#3182ce",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#333",
    padding: "8px 0",
    display: "block",
  };

  return (
    <div
      style={{
        width: 200,
        backgroundColor: "#f7fafc",
        height: "100vh",
        padding: 20,
        boxSizing: "border-box",
        borderRight: "1px solid #ddd",
      }}
    >
      <nav style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Link
          to="/"
          style={location.pathname === "/" ? { ...linkStyle, ...activeStyle } : linkStyle}
        >
          Home
        </Link>
        <Link
          to="/mystories"
          style={location.pathname === "/mystories" ? { ...linkStyle, ...activeStyle } : linkStyle}
        >
          My Stories
        </Link>
        <Link
          to="/profile"
          style={location.pathname === "/profile" ? { ...linkStyle, ...activeStyle } : linkStyle}
        >
          Profile
        </Link>
      </nav>
    </div>
  );
}