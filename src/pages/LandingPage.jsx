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
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 75% 45%, rgba(245,197,66,0.14), transparent 32%), #030303",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    padding: "24px",
    boxSizing: "border-box",
    overflowX: "hidden",
  },

  header: {
    minHeight: "64px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "28px",
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
    padding: "10px 22px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  hero: {
    minHeight: "calc(100vh - 120px)",
    display: "grid",
    gridTemplateColumns: "1fr",
    alignItems: "center",
    gap: "40px",
    paddingTop: "28px",
  },

  left: {
    maxWidth: "650px",
  },

  badge: {
    color: gold,
    fontSize: "17px",
    fontWeight: "bold",
    marginBottom: "22px",
  },

  title: {
    fontSize: "clamp(42px, 12vw, 82px)",
    lineHeight: "0.95",
    margin: "0 0 24px",
    fontWeight: "900",
  },

  gold: {
    color: gold,
  },

  subtitle: {
    color: "#d2d2d2",
    fontSize: "clamp(17px, 4vw, 20px)",
    lineHeight: "1.45",
    marginBottom: "30px",
  },

  buttons: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
  },

  primary: {
    background: gold,
    color: "#000",
    border: "none",
    padding: "15px 32px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  secondary: {
    background: "transparent",
    color: gold,
    border: `2px solid ${gold}`,
    padding: "13px 32px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  right: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingBottom: "30px",
  },
};