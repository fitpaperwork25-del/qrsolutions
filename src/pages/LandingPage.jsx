export default function LandingPage() {
  const goRegister = () => {
    window.location.href = "/register";
  };

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.left}>
          <div style={styles.badge}>QR-powered business system</div>

          <h1 style={styles.title}>
            We Square Your Business.
          </h1>

          <p style={styles.subtitle}>
            Turn any restaurant, barbershop, café, or service business into a smart QR experience — menus, bookings, orders, alerts, and customer action in one simple platform.
          </p>

          <div style={styles.cta}>
            <button style={styles.primary} onClick={goRegister}>
              Start Free
            </button>

            <button style={styles.secondary} onClick={goRegister}>
              $19/mo Plan
            </button>
          </div>

          <p style={styles.note}>
            Scan. Choose. Order. Book. Done.
          </p>
        </div>

        <div style={styles.right}>
          <div style={styles.phone}>
            <div style={styles.qrBox}>
              <div style={styles.qrGrid}>
                {[...Array(25)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.qrCell,
                      background:
                        [0, 1, 5, 6, 18, 19, 23, 24, 12, 7, 17].includes(i)
                          ? "#111"
                          : "#fff",
                    }}
                  />
                ))}
              </div>
            </div>

            <h3 style={styles.phoneTitle}>Business Menu</h3>
            <p style={styles.phoneText}>Order, book, or request help instantly.</p>

            <div style={styles.option}>🍽 Menu</div>
            <div style={styles.option}>📅 Booking</div>
            <div style={styles.option}>🔔 Staff Alert</div>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f7f7f7 0%, #ffffff 45%, #eef5ff 100%)",
    padding: "32px 18px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif",
  },

  hero: {
    maxWidth: "1100px",
    margin: "0 auto",
    minHeight: "85vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "40px",
    flexWrap: "wrap",
  },

  left: {
    flex: "1 1 420px",
  },

  badge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#111",
    color: "#fff",
    fontSize: "13px",
    marginBottom: "18px",
  },

  title: {
    fontSize: "clamp(38px, 7vw, 72px)",
    lineHeight: "1.02",
    margin: "0 0 18px",
    color: "#111",
    letterSpacing: "-2px",
  },

  subtitle: {
    fontSize: "18px",
    lineHeight: "1.6",
    color: "#333",
    maxWidth: "620px",
    marginBottom: "26px",
  },

  cta: {
    width: "100%",
    maxWidth: "360px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  primary: {
    width: "100%",
    minHeight: "56px",
    borderRadius: "14px",
    border: "none",
    background: "#000",
    color: "#fff",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    touchAction: "manipulation",
  },

  secondary: {
    width: "100%",
    minHeight: "56px",
    borderRadius: "14px",
    border: "1px solid #111",
    background: "#fff",
    color: "#111",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    touchAction: "manipulation",
  },

  note: {
    marginTop: "18px",
    fontSize: "15px",
    color: "#555",
  },

  right: {
    flex: "1 1 320px",
    display: "flex",
    justifyContent: "center",
  },

  phone: {
    width: "310px",
    borderRadius: "34px",
    background: "#111",
    color: "#fff",
    padding: "24px",
    boxShadow: "0 24px 70px rgba(0,0,0,0.25)",
  },

  qrBox: {
    background: "#fff",
    borderRadius: "22px",
    padding: "18px",
    marginBottom: "20px",
  },

  qrGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "6px",
  },

  qrCell: {
    aspectRatio: "1",
    borderRadius: "4px",
  },

  phoneTitle: {
    fontSize: "24px",
    margin: "8px 0",
  },

  phoneText: {
    color: "#ccc",
    lineHeight: "1.5",
    marginBottom: "18px",
  },

  option: {
    background: "#222",
    padding: "14px",
    borderRadius: "14px",
    marginTop: "10px",
    fontSize: "15px",
  },
};