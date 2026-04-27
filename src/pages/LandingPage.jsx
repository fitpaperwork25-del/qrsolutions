import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  // simple animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % 9);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logo}>QRS</div>

        <button style={styles.login} onClick={() => navigate("/login")}>
          Log In
        </button>
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        {/* LEFT */}
        <div style={styles.left}>
          <div style={styles.badge}>QR MANAGEMENT PLATFORM</div>

          <h1 style={styles.title}>
            We <span style={styles.gold}>Square</span> You.
          </h1>

          <p style={styles.subtitle}>
            QR codes for your restaurant, business, event, or anything. If it
            exists, we can put a square on it.
          </p>

          <div style={styles.ctaRow}>
            <button
              style={styles.primary}
              onClick={() => navigate("/register?plan=free")}
            >
              Start Free
            </button>

            <button
              style={styles.secondary}
              onClick={() => navigate("/register?plan=starter")}
            >
              $19/mo Plan
            </button>
          </div>
        </div>

        {/* RIGHT (ANIMATED QR) */}
        <div style={styles.right}>
          <div style={styles.qrVisual}>
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                style={{
                  ...styles.qrCell,
                  background:
                    i === active
                      ? "#f5c542"
                      : i % 2 === 0
                      ? "#f5c54233"
                      : "transparent",
                  transform: i === active ? "scale(1.2)" : "scale(1)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#000",
    color: "#fff",
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    fontWeight: "bold",
    fontSize: "24px",
  },

  login: {
    background: "transparent",
    border: "1px solid #f5c542",
    color: "#f5c542",
    padding: "8px 16px",
    cursor: "pointer",
  },

  hero: {
    display: "flex",
    marginTop: "80px",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    maxWidth: "600px",
  },

  badge: {
    background: "#f5c542",
    color: "#000",
    display: "inline-block",
    padding: "6px 12px",
    fontSize: "12px",
    marginBottom: "20px",
  },

  title: {
    fontSize: "64px",
    lineHeight: "1.1",
    marginBottom: "20px",
  },

  gold: {
    color: "#f5c542",
  },

  subtitle: {
    color: "#aaa",
    marginBottom: "30px",
    fontSize: "18px",
  },

  ctaRow: {
    display: "flex",
    gap: "12px",
  },

  primary: {
    background: "#f5c542",
    color: "#000",
    padding: "14px 24px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },

  secondary: {
    background: "transparent",
    border: "1px solid #f5c542",
    color: "#f5c542",
    padding: "14px 24px",
    cursor: "pointer",
  },

  right: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "280px",
  },

  qrVisual: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 60px)",
    gap: "12px",
  },

  qrCell: {
    width: "60px",
    height: "60px",
    border: "3px solid #f5c542",
  },
};
