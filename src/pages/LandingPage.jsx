import React from "react";

export default function LandingPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>We Square You.</h1>

      <p style={styles.subtitle}>
        Turn any business into a smart, scannable experience —
        menus, bookings, orders, and customer action from one QR-powered platform.
      </p>

      <div style={styles.cta}>
        <button
          style={styles.primary}
          onClick={() => window.location.href = "/register"}
        >
          Start Free
        </button>

        <button
          style={styles.secondary}
          onClick={() => window.location.href = "/register"}
        >
          $19/mo Plan
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    textAlign: "center"
  },

  title: {
    fontSize: "28px",
    marginBottom: "12px"
  },

  subtitle: {
    fontSize: "16px",
    maxWidth: "500px",
    marginBottom: "24px"
  },

  cta: {
    width: "100%",
    maxWidth: "320px"
  },

  primary: {
    width: "100%",
    minHeight: "52px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "none",
    background: "black",
    color: "white",
    cursor: "pointer"
  },

  secondary: {
    width: "100%",
    minHeight: "52px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid black",
    background: "white",
    color: "black",
    marginTop: "12px",
    cursor: "pointer"
  }
};