import { useState } from "react";

export default function StaffDashboardPage() {
  const [orders, setOrders] = useState([
    { id: 1, table: "Table 3", item: "Burger", status: "Pending" },
    { id: 2, table: "Table 1", item: "Coffee", status: "Ready" },
  ]);

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Live Orders</h1>

      {orders.map((order) => (
        <div key={order.id} style={styles.card}>
          <div>
            <strong>{order.item}</strong>
            <p>{order.table}</p>
          </div>

          <div>
            <span style={styles.status}>{order.status}</span>

            <div style={styles.actions}>
              <button onClick={() => updateStatus(order.id, "Ready")}>
                Ready
              </button>
              <button onClick={() => updateStatus(order.id, "Served")}>
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
    padding: 20,
    background: "#080808",
    color: "#fff",
    minHeight: "100vh",
  },
  title: {
    color: "#E8C547",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: 16,
    border: "1px solid #222",
    borderRadius: 10,
    marginBottom: 12,
    background: "#111",
  },
  status: {
    color: "#E8C547",
    fontWeight: "bold",
  },
  actions: {
    marginTop: 8,
    display: "flex",
    gap: 8,
  },
};