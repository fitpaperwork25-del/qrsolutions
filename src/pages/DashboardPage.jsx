function OrdersTab({ bizId }) {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("business_id", bizId)
      .order("created_at", { ascending: false });

    console.log("orders:", data, "error:", error);

    setOrders(data || []);
  };

  useEffect(() => {
    if (bizId) {
      load();
    }
  }, [bizId]);

  return (
    <div>
      <h2>Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: 16,
                marginBottom: 12,
                color: "white",
              }}
            >
              <div style={{ fontWeight: 700 }}>
                {order.location_label || "Unknown table"}
              </div>

              <div style={{ marginTop: 6 }}>
                Status: {order.status}
              </div>

              <div style={{ marginTop: 6 }}>
                Total: ${Number(order.total || 0).toFixed(2)}
              </div>

              {order.note && (
                <div style={{ marginTop: 6 }}>
                  Note: {order.note}
                </div>
              )}

              <div style={{ marginTop: 6, fontSize: 12, color: "#888" }}>
                {order.created_at}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}