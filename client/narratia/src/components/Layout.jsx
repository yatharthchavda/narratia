import React from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
        }}
      >
        {/* Header */}
        <header
          style={{
            padding: "12px 24px",
            backgroundColor: "#3182ce",
            color: "white",
            fontWeight: "700",
            fontSize: 22,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>Narratia</div>
          {/* You can add user info or make a story button here if desired */}
        </header>

        {/* Main content */}
        <main style={{ flex: 1, padding: 20, backgroundColor: "#f9fafb" }}>{children}</main>

        {/* Footer */}
        <footer
          style={{
            padding: 12,
            textAlign: "center",
            backgroundColor: "#edf2f7",
            fontSize: 14,
            color: "#555",
          }}
        >
          &copy; {new Date().getFullYear()} Narratia. All rights reserved.
        </footer>
      </div>
    </div>
  );
}