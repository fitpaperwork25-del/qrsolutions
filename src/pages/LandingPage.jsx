import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
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
            Turn any business into a smart, scannable experience — menus,
            bookings, orders, and more — all from one QR-powered platform.
          </p>

          <div style={styles.buttons}>
            <button
              style={styles.primary}
              onClick={() => navigate("/register")}
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

        {/* RIGHT VISUAL */}
        <div style={styles.right}>
          <div style={styles.visual}>
            {[0, 1, 2].map((row) => (
              <div key={row} style={styles.row}>
                {[0, 1, 2].map((col) => {
                  const index = row * 3 + col;

                  return (
                    <div
                      key={index}
                      style={{
                        ...styles.block,
                        ...(index % 2 === 0
                          ? styles.blockGold
                          : styles.blockOutline),
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const gold = "#f5c542";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    padding: "40px 60px",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "60px",
  },

  logo: {
    fontSize: "26px",
    fontWeight: "bold",
    letterSpacing: "2px",
  },

  login: {
    background: "transparent",
    border: `1px solid ${gold}`,
    color: gold,
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  hero: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    alignItems: "center",
    gap: "60px",
  },

  left: {
    maxWidth: "650px",
  },

  badge: {
    background: gold,
    color: "#000",
    display: "inline-block",
    padding: "6px 14px",
    fontSize: "12px",
    letterSpacing: "3px",
    marginBottom: "24px",
    fontWeight: "bold",
  },

  title: {
    fontSize: "72px",
    lineHeight: "1.05",
    marginBottom: "20px",
    fontWeight: "900",
  },

  gold: {
    color: gold,
  },

  subtitle: {
    color: "#bbb",
    fontSize: "20px",
    lineHeight: "1.5",
    marginBottom: "30px",
  },

  buttons: {
    display: "flex",
    gap: "14px",
  },

  primary: {
    background: gold,
    color: "#000",
    padding: "14px 26px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },

  secondary: {
    background: "transparent",
    color: gold,
    padding: "14px 26px",
    border: `1px solid ${gold}`,
    fontWeight: "bold",
    cursor: "pointer",
  },

  right: {
    display: "flex",
    justifyContent: "center",
  },

  visual: {
    border: `2px solid ${gold}`,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    boxShadow: "0 0 40px rgba(245,197,66,0.2)",
  },

  row: {
    display: "flex",
    gap: "14px",
  },

  block: {
    width: "70px",
    height: "70px",
  },

  blockGold: {
    background: gold,
  },

  blockOutline: {
    border: `2px solid ${gold}`,
  },
};