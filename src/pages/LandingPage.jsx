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
          <div style={styles.badge}>QR MANAGEMENT PLATFORM</div>

          <h1 style={styles.title}>
            We
            <br />
            <span>Square</span>
            <br />
            You.
          </h1>

          <p style={styles.subtitle}>
            Turn any business into a smart, scannable experience — menus,
            bookings, orders, and more — all from one QR-powered platform.
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

          <div style={styles.features}>
            <span>⚡ Fast Setup</span>
            <span>▌</span>
            <span>◇ Secure & Reliable</span>
            <span>▌</span>
            <span>▥ Built for Business</span>
          </div>
        </section>

        <section style={styles.right}>
          <div style={styles.scanFrame}>
            <div style={styles.cornerTL}></div>
            <div style={styles.cornerTR}></div>
            <div style={styles.cornerBL}></div>
            <div style={styles.cornerBR}></div>

            <div style={styles.bigQ}>Q</div>

            <div style={styles.grid}>
              {Array.from({ length: 52 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.square,
                    ...(i % 3 === 0 ? styles.filled : {}),
                    ...(i % 5 === 0 ? styles.large : {}),
                    ...(i % 7 === 0 ? styles.outline : {}),
                  }}
                />
              ))}
            </div>
          </div>
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
      "radial-gradient(circle at 75% 45%, rgba(245,197,66,0.12), transparent 35%), #030303",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    padding: "36px 54px",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "34px",
    fontWeight: "900",
    letterSpacing: "2px",
  },

  qLogo: {
    width: "44px",
    height: "44px",
    border: `5px solid ${gold}`,
    color: gold,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    lineHeight: 1,
  },

  login: {
    background: "transparent",
    border: `1px solid ${gold}`,
    color: gold,
    padding: "12px 28px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  hero: {
    minHeight: "calc(100vh - 90px)",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    alignItems: "center",
    gap: "60px",
  },

  left: {
    maxWidth: "660px",
  },

  badge: {
    color: gold,
    fontSize: "15px",
    letterSpacing: "4px",
    fontWeight: "bold",
    marginBottom: "34px",
  },

  title: {
    fontSize: "clamp(64px, 8vw, 112px)",
    lineHeight: "0.95",
    margin: "0 0 28px",
    fontWeight: "900",
    letterSpacing: "-4px",
  },

  titleSpan: {},

  subtitle: {
    color: "#d0d0d0",
    fontSize: "22px",
    lineHeight: "1.5",
    maxWidth: "620px",
    marginBottom: "36px",
  },

  buttons: {
    display: "flex",
    gap: "18px",
    marginBottom: "56px",
  },

  primary: {
    background: gold,
    color: "#000",
    border: "none",
    padding: "18px 42px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  secondary: {
    background: "transparent",
    color: gold,
    border: `2px solid ${gold}`,
    padding: "16px 42px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  features: {
    display: "flex",
    gap: "18px",
    color: "#ddd",
    fontSize: "16px",
    alignItems: "center",
  },

  right: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  scanFrame: {
    position: "relative",
    width: "560px",
    height: "560px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "70px",
    height: "70px",
    borderTop: `5px solid ${gold}`,
    borderLeft: `5px solid ${gold}`,
  },

  cornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "70px",
    height: "70px",
    borderTop: `5px solid ${gold}`,
    borderRight: `5px solid ${gold}`,
  },

  cornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "70px",
    height: "70px",
    borderBottom: `5px solid ${gold}`,
    borderLeft: `5px solid ${gold}`,
  },

  cornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "70px",
    height: "70px",
    borderBottom: `5px solid ${gold}`,
    borderRight: `5px solid ${gold}`,
  },

  bigQ: {
    position: "absolute",
    top: "50px",
    left: "60px",
    width: "150px",
    height: "150px",
    border: `18px solid ${gold}`,
    color: gold,
    fontSize: "96px",
    fontWeight: "900",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 40px rgba(245,197,66,0.25)",
  },

  grid: {
    marginTop: "100px",
    display: "grid",
    gridTemplateColumns: "repeat(8, 42px)",
    gap: "14px",
  },

  square: {
    width: "28px",
    height: "28px",
    border: `2px solid ${gold}`,
    opacity: 0.9,
  },

  filled: {
    background: gold,
    boxShadow: "0 0 18px rgba(245,197,66,0.25)",
  },

  large: {
    width: "44px",
    height: "44px",
  },

  outline: {
    background: "transparent",
  },
};