import { useState } from "react";

export default function StaffDashboardPage() {
  const [orders, setOrders] = useState([
    { id: 1, table: "Table 3", item: "Burger", status: "Pending" },
    { id: 2, table: "Table 1", item: "Coffee", status: "Ready" },
  ]);

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: newStatus } : o
      )
    );
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Live Orders</h1>

      {orders.map((order) => (
        <div key={order.id} style={styles.card}>
          
          {/* LEFT SIDE */}
          <div>
            <h3 style={styles.item}>{order.item}</h3>
            <p style={styles.table}>{order.table}</p>
          </div>

          {/* RIGHT SIDE */}
          <div style={styles.right}>
            <span style={styles.status}>{order.status}</span>

            <div style={styles.actions}>
              <button
                style={styles.btn}
                onClick={() => updateStatus(order.id, "Ready")}
              >
                Ready
              </button>

              <button
                style={styles.btn}
                onClick={() => updateStatus(order.id, "Served")}
              >
                Served
              </button>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}

const styles = {
  page: {
    padding: 30,
    background: "#080808",
    color: "#fff",
    minHeight: "100vh",
  },

  title: {
    color: "#E8C547",
    marginBottom: 20,
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    border: "1px solid #222",
    borderRadius: 12,
    marginBottom: 16,
    background: "#111",
  },

  item: {
    margin: 0,
  },

  table: {
    margin: "4px 0 0 0",
    color: "#aaa",
  },

  right: {
    textAlign: "right",
  },

  status: {
    color: "#E8C547",
    fontWeight: "bold",
    display: "block",
    marginBottom: 8,
  },

  actions: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
  },

  btn: {
    background: "#222",
    color: "#fff",
    border: "1px solid #444",
    padding: "6px 12px",
    cursor: "pointer",
    borderRadius: 6,
  },
};
