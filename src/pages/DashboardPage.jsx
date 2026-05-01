function OrdersTab({ bizId }) {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const { data: locs } = await supabase
      .from("locations")
      .select("id")
      .eq("business_id", bizId);

    const locationIds = (locs || []).map(l => l.id);

    if (locationIds.length === 0) {
      setOrders([]);
      return;
    }

    const { data } = await supabase
      .from("orders")
      .select("*, locations(label)")
      .in("location_id", locationIds)
      .order("created_at", { ascending: false });

    setOrders(data || []);
  };

  useEffect(() => { if (bizId) load(); }, [bizId]);

  const updateStatus = async (orderId, status) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    load();
  };

  const statusColor = (s) => {
    if (s === "done") return "#4CAF50";
    if (s === "preparing") return "#FF9800";
    if (s === "ready") return "#2196F3";
    if (s === "cancelled") return "#f44336";
    return TEXT;
  };

  return (
    <div>
      {orders.length === 0 ? <div style={{ color: MUTED }}>No orders yet.</div> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 700 }}>{order.locations?.label || "Unknown table"}</span>
                <span style={{ color: ACCENT }}>${parseFloat(order.total || 0).toFixed(2)}</span>
              </div>
              <div style={{ fontSize: 12, color: MUTED }}>{new Date(order.created_at).toLocaleString()}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                <span style={{ fontSize: 12, color: statusColor(order.status), fontWeight: 700 }}>{order.status}</span>
                <select
                  value={order.status}
                  onChange={e => updateStatus(order.id, e.target.value)}
                  style={{ background: "#1a1a1a", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}
                >
                  <option value="new">new</option>
                  <option value="preparing">preparing</option>
                  <option value="ready">ready</option>
                  <option value="done">done</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
              {order.items && (
                <div style={{ marginTop: 8, fontSize: 12, color: MUTED }}>
                  {order.items.map((item, i) => (
                    <div key={i}>{item.qty}× {item.name} — ${(item.price * item.qty).toFixed(2)}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}