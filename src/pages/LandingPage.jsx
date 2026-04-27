import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.logoWrap}>
          <div style={styles.logoBox}>Q</div>
          <div style={styles.logoText}>RS</div>
        </div>

        <button style={styles.login} onClick={() => navigate("/login")}>
          Log In
        </button>
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        {/* LEFT */}
        <div style={styles.left}>
          <div style={styles.badge}>QR Solutions</div>

          <h1 style={styles.title}>
            We Square You.
          </h1>

          <p style={styles.subtitle}>
            Turn any business into a smart, scannable experience —
            menus, bookings, orders, and customer action from one QR-powered platform.
          </p>

          <div style={styles.cta}>
  <button
    style={{
      ...styles.primary,
      width: "100%",
      minHeight: "52px",
      fontSize: "16px",
      cursor: "pointer"
    }}
    onClick={() => window.location.href = "/register"}
  >
    Start Free
  </button>

  <button
    style={{
      ...styles.secondary,
      width: "100%",
      minHeight: "52px",
      fontSize: "16px",
      marginTop: "12px",
      cursor: "pointer"
    }}
    onClick={() => window.location.href = "/register"}
  >
    $19/mo Plan
  </button>
</div>

    Start Free
  </button>

  <button
    style={{
      ...styles.secondary,
      width: "100%",
      minHeight: "52px",
      fontSize: "16px",
      marginTop: "12px",
      cursor: "pointer"
    }}
    onClick={() => window.location.href = "/register"}
  >
    $19/mo Plan
  </button>
</div>
        </div>

        {/* RIGHT */}
        <div style={styles.right}>
          <div style={styles.qrBox}>
            <div style={styles.qrGlow}></div>

            <div style={styles.qrGrid}>
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.qrCell,
                    background:
                      [0, 4, 20, 24, 12].includes(i)
                        ? "#f5c542"
                        : "transparent",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#000",
    color: "#fff",
    minHeight: "100vh",
    padding: "0 5vw",
    boxSizing: "border-box",
    overflowX: "hidden",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 0",
  },

  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  logoBox: {
    width: "40px",
    height: "40px",
    border: "2px solid #f5c542",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "#f5c542",
  },

  logoText: {
    fontSize: "20px",
    fontWeight: "bold",
  },

  login: {
    border: "1px solid #f5c542",
    background: "transparent",
    color: "#f5c542",
    padding: "8px 16px",
    cursor: "pointer",
  },

  hero: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "40px",
    flexWrap: "wrap",
    maxWidth: "1200px",
    margin: "0 auto",
    paddingTop: "40px",
  },

  left: {
    flex: "1 1 500px",
    maxWidth: "600px",
  },

  badge: {
    color: "#f5c542",
    marginBottom: "20px",
    fontWeight: "bold",
  },

  title: {
    fontSize: "clamp(36px, 6vw, 72px)",
    lineHeight: "1.1",
    marginBottom: "20px",
  },

  subtitle: {
    color: "#aaa",
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "30px",
  },

  cta: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },

  primary: {
    background: "#f5c542",
    color: "#000",
    border: "none",
    padding: "14px 24px",
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
    flex: "1 1 400px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  qrBox: {
    position: "relative",
    width: "260px",
    height: "260px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  qrGlow: {
    position: "absolute",
    width: "260px",
    height: "260px",
    borderRadius: "20px",
    background: "radial-gradient(circle, rgba(245,197,66,0.2), transparent)",
  },

  qrGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 40px)",
    gap: "10px",
  },

  qrCell: {
    width: "40px",
    height: "40px",
    border: "2px solid #f5c542",
  },
};