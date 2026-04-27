import { useNavigate } from "react-router-dom";

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
            We <span>Square</span>
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
          <div style={styles.scanFrame}>
            <div style={styles.cornerTL}></div>
            <div style={styles.cornerTR}></div>
            <div style={styles.cornerBL}></div>
            <div style={styles.cornerBR}></div>

            <div style={styles.qrGrid}>
              {qrPattern.map((filled, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.qrCell,
                    ...(filled ? styles.qrFilled : {}),
                    ...(i === 0 ? styles.qCell : {}),
                  }}
                >
                  {i === 0 ? "Q" : ""}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const qrPattern = [
  1, 1, 1, 0, 1, 0, 1, 1, 1,
  1, 0, 1, 0, 0, 1, 1, 0, 1,
  1, 1, 1, 1, 0, 1, 0, 1, 1,
  0, 0, 1, 0, 1, 1, 0, 0, 1,
  1, 0, 0, 1, 1, 0, 1, 0, 0,
  0, 1, 1, 0, 0, 1, 0, 1, 1,
  1, 1, 0, 1, 0, 0, 1, 1, 0,
  1, 0, 1, 0, 1, 1, 0, 0, 1,
  1, 1, 1, 0, 1, 0, 1, 1, 1,
];

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
    overflow: "hidden",
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
    letterSpacing: "1px",
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
    letterSpacing: "-3px",
  },

  subtitle: {
    color: "#d2d2d2",
    fontSize: "20px",
    lineHeight: "1.45",
    maxWidth: "620px",
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

  scanFrame: {
    width: "420px",
    height: "420px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "55px",
    height: "55px",
    borderTop: `4px solid ${gold}`,
    borderLeft: `4px solid ${gold}`,
  },

  cornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "55px",
    height: "55px",
    borderTop: `4px solid ${gold}`,
    borderRight: `4px solid ${gold}`,
  },

  cornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "55px",
    height: "55px",
    borderBottom: `4px solid ${gold}`,
    borderLeft: `4px solid ${gold}`,
  },

  cornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "55px",
    height: "55px",
    borderBottom: `4px solid ${gold}`,
    borderRight: `4px solid ${gold}`,
  },

  qrGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(9, 32px)",
    gap: "6px",
  },

  qrCell: {
    width: "32px",
    height: "32px",
    border: `2px solid ${gold}`,
    boxSizing: "border-box",
  },

  qrFilled: {
    background: gold,
    boxShadow: "0 0 14px rgba(245,197,66,0.18)",
  },

  qCell: {
    gridColumn: "1 / span 3",
    gridRow: "1 / span 3",
    width: "108px",
    height: "108px",
    fontSize: "64px",
    fontWeight: "900",
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};