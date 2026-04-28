import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/useAuth";

export default function DashboardPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const cards = [
    {
      title: "Business Profile",
      desc: "Set your business name, logo, contact info, and branding.",
      path: "/settings",
    },
    {
      title: "QR Generator",
      desc: "Create and download QR codes for menus, tables, services, and booking.",
      path: "/qr",
    },
    {
      title: "Menu / Services",
      desc: "Add products, services, prices, photos, and availability.",
      path: "/menu",
    },
    {
      title: "Orders & Bookings",
      desc: "View live customer orders, table requests, and booking activity.",
      path: "/staff",
    },
    {
      title: "Analytics",
      desc: "Track scans, customer activity, popular items, and revenue signals.",
      path: "/analytics",
    },
    {
      title: "Subscription",
      desc: "View your plan, billing status, and upgrade options.",
      path: "/settings",
    },
  ];

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.logo}>QRS Owner Dashboard</h1>
          <p style={styles.subtitle}>Manage your QR business system from one place.</p>
        </div>

        <button
          style={styles.logout}
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
        >
          Sign Out
        </button>
      </header>

      <section style={styles.hero}>
        <h2 style={styles.heroTitle}>Welcome back</h2>
        <p style={styles.heroText}>
          Set up your business, manage your menu, generate QR codes, and monitor customer activity.
        </p>
      </section>

      <section style={styles.grid}>
        {cards.map((card) => (
          <Link key={card.title} to={card.path} style={styles.card}>
            <h3 style={styles.cardTitle}>{card.title}</h3>
            <p style={styles.cardText}>{card.desc}</p>
            <span style={styles.cardAction}>Open →</span>
          </Link>
        ))}
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#080808",
    color: "#F0EDE8",
    padding: "32px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  logo: {
    margin: 0,
    fontSize: "28px",
    color: "#E8C547",
  },
  subtitle: {
    marginTop: "8px",
    color: "#999",
  },
  logout: {
    background: "transparent",
    color: "#E8C547",
    border: "1px solid #E8C547",
    padding: "10px 18px",
    cursor: "pointer",
    borderRadius: "8px",
  },
  hero: {
    background: "#111",
    border: "1px solid #222",
    padding: "32px",
    borderRadius: "16px",
    marginBottom: "32px",
  },
  heroTitle: {
    margin: 0,
    fontSize: "34px",
  },
  heroText: {
    color: "#aaa",
    maxWidth: "700px",
    lineHeight: 1.6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#111",
    border: "1px solid #222",
    padding: "24px",
    borderRadius: "16px",
    color: "#F0EDE8",
    textDecoration: "none",
  },
  cardTitle: {
    margin: 0,
    marginBottom: "10px",
    color: "#E8C547",
  },
  cardText: {
    color: "#aaa",
    lineHeight: 1.5,
    minHeight: "70px",
  },
  cardAction: {
    color: "#E8C547",
    fontWeight: "bold",
  },
};