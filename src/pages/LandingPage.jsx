import { useNavigate } from "react-router-dom";
import QRCodeBox from "../components/QRCodeBox";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.qLogo}>Q</div>
          <span>RS</span>
        </div>

        <button style={styles.login} onClick={() => navigate("/login")}>
          Log In
        </button>
      </header>

      <main style={styles.hero}>
        {/* LEFT */}
        <section style={styles.left}>
          <div style={styles.badge}>QR Solutions</div>

          <h1 style={styles.title}>
            We <span style={styles.gold}>Square</span>
            <br />
            You.
          </h1>

          <p style={styles.subtitle}>
            Turn any business into a smart, scannable experience — menus,
            bookings, orders, and customer action from one QR-powered platform.
          </p>

          <div style={styles.buttons}>
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
        </section>

        {/* RIGHT (REAL QR) */}
        <section style={styles.right}>
          <QRCodeBox />
        </section>
      </main>
    </div>
  );
}

const gold = "#f5c542";

const styles = {
  page: {
    height: "100vh",
    background:
      "radial-gradient(circle at 75% 45%, rgba(245,197,66,0.14), transparent 32%), #030303",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    padding: "28px 54px",
    boxSizing: "border-box",
  },

  header: {
    height: "64px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "32px",
    fontWeight: "900",
  },

  qLogo: {
    width: "44px",
    height: "44px",
    border: `4px solid ${gold}`,
    color: gold,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  login: {
    background: "transparent",
    border: `1px solid ${gold}`,
    color: gold,
    padding: "10px 24px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  hero: {
    height: "calc(100vh - 92px)",
    display: "grid",
    gridTemplateColumns: "1fr 0.9fr",
    alignItems: "center",
    gap: "36px",
  },

  left: {
    maxWidth: "650px",
  },

  badge: {
    color: gold,
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "24px",
  },

  title: {
    fontSize: "clamp(58px, 7vw, 92px)",
    lineHeight: "0.95",
    margin: "0 0 24px",
    fontWeight: "900",
  },

  gold: {
    color: gold,
  },

  subtitle: {
    color: "#d2d2d2",
    fontSize: "20px",
    lineHeight: "1.45",
    marginBottom: "30px",
  },

  buttons: {
    display: "flex",
    gap: "18px",
  },

  primary: {
    background: gold,
    color: "#000",
    border: "none",
    padding: "16px 38px",
    fontSize: "17px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  secondary: {
    background: "transparent",
    color: gold,
    border: `2px solid ${gold}`,
    padding: "14px 38px",
    fontSize: "17px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  right: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};