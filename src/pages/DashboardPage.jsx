import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useOrders } from "../lib/useOrders";
import { useAuth } from "../lib/useAuth";
import { BUSINESSES, timeAgo } from "../lib/data";
import { LIVE } from "../lib/supabase";
import Icon from "../components/Icon";

const STATUS_COLOR = { new: "#E8C547", preparing: "#7EC8A4", ready: "#4CAF50", done: "#444", cancelled: "#555" };
const NEXT_STATUS  = { new: "preparing", preparing: "ready", ready: "done" };

export default function DashboardPage() {
  const { orders, updateStatus } = useOrders();
  const { session, signOut } = useAuth();
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const prevNewCount = useRef(0);

  // Toast on new order
  useEffect(() => {
    const newCount = orders.filter(o => o.status === "new").length;
    if (newCount > prevNewCount.current) {
      setToast("New order received");
      setTimeout(() => setToast(null), 3000);
    }
    prevNewCount.current = newCount;
  }, [orders]);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const stats = [
    { label: "TOTAL",     count: orders.length,                                    color: "#F0EDE8" },
    { label: "NEW",       count: orders.filter(o => o.status === "new").length,      color: "#E8C547" },
    { label: "PREPARING", count: orders.filter(o => o.status === "preparing").length, color: "#7EC8A4" },
    { label: "READY",     count: orders.filter(o => o.status === "ready").length,     color: "#4CAF50" },
  ];

  return (
    <div style={{ height: "100vh", background: "#0A0A0A", color: "#F0EDE8", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 16, right: 16, background: "#E8C547", color: "#0A0A0A", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, zIndex: 100, display: "flex", alignItems: "center", gap: 8, animation: "slideIn 0.3s ease" }}>
          <Icon name="bell" size={14} color="#0A0A0A" /> {toast}
        </div>
      )}

      {/* Top bar */}
      <div style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="scan" size={18} color="#E8C547" />
            <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.5 }}>QRS</span>
          </div>
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: 11, opacity: 0.3, fontFamily: "'DM Mono', monospace" }}>STAFF DASHBOARD</span>
          <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", padding: "2px 8px", borderRadius: 4, background: LIVE ? "rgba(76,175,80,0.12)" : "rgba(232,197,71,0.1)", color: LIVE ? "#4CAF50" : "#E8C547" }}>
            {LIVE ? "SUPABASE LIVE" : "DEMO MODE"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/staff/qr" style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(240,237,232,0.4)", textDecoration: "none", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
            <Icon name="qr" size={15} color="rgba(240,237,232,0.4)" /> QR CODES
          </Link>
          <Link to="/staff/menu" style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(240,237,232,0.4)", textDecoration: "none", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
            <Icon name="tag" size={15} color="rgba(240,237,232,0.4)" /> MENU
          </Link>
          <Link to="/staff/settings" style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(240,237,232,0.4)", textDecoration: "none", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
            <Icon name="settings" size={15} color="rgba(240,237,232,0.4)" /> SETTINGS
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4CAF50", boxShadow: "0 0 6px #4CAF50" }} />
            <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.3 }}>LIVE</span>
          </div>
          <button onClick={signOut} title="Sign out" style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "rgba(240,237,232,0.35)", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
            <Icon name="logout" size={16} color="rgba(240,237,232,0.35)" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.04)" }}>
        {stats.map(s => (
          <div key={s.label} style={{ padding: "14px 20px", background: "#0A0A0A" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color, marginBottom: 2 }}>{s.count}</div>
            <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", opacity: 0.3, letterSpacing: 1.5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ padding: "10px 24px", display: "flex", gap: 4, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {["all", "new", "preparing", "ready", "done"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? "rgba(255,255,255,0.09)" : "transparent", border: "none", color: filter === f ? "#F0EDE8" : "rgba(240,237,232,0.3)", borderRadius: 6, padding: "5px 12px", fontSize: 11, fontFamily: "'DM Mono', monospace", cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}>
            {f}
          </button>
        ))}
      </div>

      {/* Orders grid */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", opacity: 0.18, padding: 80, fontFamily: "'DM Mono', monospace", fontSize: 13 }}>NO ORDERS</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
            {filtered.map(order => (
              <div key={order.id} style={{ background: "#141414", borderRadius: 12, padding: 20, border: order.status === "new" ? "1px solid rgba(232,197,71,0.22)" : "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.22, marginBottom: 3 }}>{String(order.id).slice(0, 13)}</div>
                    <div style={{ fontSize: 17, fontWeight: 800 }}>{order.location_label}</div>
                    <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", opacity: 0.25, textTransform: "uppercase", marginTop: 2 }}>
                      {BUSINESSES[order.business_id]?.name || order.business_id}
                    </div>
                  </div>
                  <div style={{ background: `${STATUS_COLOR[order.status]}15`, color: STATUS_COLOR[order.status], borderRadius: 6, padding: "4px 10px", fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 700, letterSpacing: 0.8 }}>
                    {order.status.toUpperCase()}
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  {(order.items || []).map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ opacity: 0.65 }}>{item.service_name}</span>
                      <span style={{ opacity: 0.3, fontFamily: "'DM Mono', monospace" }}>×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                {order.note && (
                  <div style={{ background: "rgba(232,197,71,0.07)", borderRadius: 8, padding: "9px 12px", marginBottom: 12, fontSize: 12, color: "#E8C547", fontStyle: "italic" }}>
                    "{order.note}"
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.22 }}>{timeAgo(order.created_at)}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#E8C547" }}>${Number(order.total).toFixed(2)}</span>
                    {NEXT_STATUS[order.status] && (
                      <button onClick={() => updateStatus(order.id, NEXT_STATUS[order.status])} style={{ background: STATUS_COLOR[NEXT_STATUS[order.status]], border: "none", color: "#0A0A0A", borderRadius: 7, padding: "6px 12px", fontSize: 10, fontWeight: 800, fontFamily: "'DM Mono', monospace", cursor: "pointer", textTransform: "uppercase" }}>
                        → {NEXT_STATUS[order.status]}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
