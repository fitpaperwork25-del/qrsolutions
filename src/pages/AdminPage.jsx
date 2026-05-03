import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const ACCENT = "#E8C547";
const BG = "#080808";
const SURFACE = "#111";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#F0EDE8";
const MUTED = "#666";

const ADMIN_PIN = "qrs2026";

const planPrice = { starter: 19, pro: 49, enterprise: 99, trial: 0 };
const planColor = { starter: "#4CAF50", pro: "#2196F3", enterprise: "#9C27B0", trial: "#FF9800" };
const statusOrderColor = { new: "#E8C547", preparing: "#FF9800", ready: "#2196F3", done: "#4CAF50", cancelled: "#f44336" };

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 }}>
      <div style={{ color: MUTED, fontSize: 12, marginBottom: 6 }}>{label}</div>
      <div style={{ fontWeight: 900, fontSize: 28, color: color || ACCENT }}>{value}</div>
      {sub && <div style={{ color: MUTED, fontSize: 12, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function BarChart({ title, data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 16, color: TEXT }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.map(d => (
          <div key={d.label}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: MUTED }}>{d.label}</span>
              <span style={{ color: TEXT, fontWeight: 700 }}>{d.value}</span>
            </div>
            <div style={{ background: "#1a1a1a", borderRadius: 4, height: 8, overflow: "hidden" }}>
              <div style={{ width: `${(d.value / max) * 100}%`, background: d.color || ACCENT, height: "100%", borderRadius: 4, transition: "width 0.5s" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ title, data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let offset = 0;
  const r = 50;
  const circ = 2 * Math.PI * r;
  const segments = data.map(d => {
    const pct = d.value / total;
    const seg = { ...d, pct, offset };
    offset += pct;
    return seg;
  });
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 16, color: TEXT }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <svg width={120} height={120} viewBox="0 0 120 120">
          {segments.map((d, i) => (
            <circle key={i}
              cx={60} cy={60} r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={20}
              strokeDasharray={`${d.pct * circ} ${circ}`}
              strokeDashoffset={-d.offset * circ}
              style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px" }}
            />
          ))}
          {total === 0 && <circle cx={60} cy={60} r={r} fill="none" stroke="#1a1a1a" strokeWidth={20} />}
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {data.map(d => (
            <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
              <span style={{ color: MUTED }}>{d.label}</span>
              <span style={{ color: TEXT, fontWeight: 700, marginLeft: "auto" }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getTrialDaysLeft(trial_ends_at) {
  if (!trial_ends_at) return null;
  const diff = new Date(trial_ends_at) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function statusColor(status, plan, trial_ends_at) {
  if (plan === "trial") {
    const days = getTrialDaysLeft(trial_ends_at);
    if (days === 0) return "#f44336";
    if (days <= 2) return "#FF9800";
    return "#2196F3";
  }
  if (status === "active") return "#4CAF50";
  if (status === "pending") return "#FF9800";
  return MUTED;
}

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const handlePin = () => {
    if (pin === ADMIN_PIN) { setAuthed(true); setPinError(false); }
    else setPinError(true);
  };

  useEffect(() => {
    if (!authed) return;
    const load = async () => {
      const { data: biz } = await supabase.from("businesses").select("*").order("created_at", { ascending: false });
      const { data: ord } = await supabase.from("orders").select("id, created_at, total, status");
      setBusinesses(biz || []);
      setOrders(ord || []);
      setLoading(false);
    };
    load();
  }, [authed]);

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 40, width: 320, textAlign: "center" }}>
          <div style={{ fontWeight: 900, fontSize: 20, color: ACCENT, marginBottom: 8 }}>Admin Access</div>
          <div style={{ color: MUTED, fontSize: 13, marginBottom: 24 }}>QRSolutions Control Panel</div>
          <input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={e => setPin(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handlePin()}
            style={{ width: "100%", background: "#141414", border: `1px solid ${pinError ? "#f44336" : BORDER}`, borderRadius: 8, padding: "10px", color: TEXT, boxSizing: "border-box", marginBottom: 12, textAlign: "center", fontSize: 18, letterSpacing: 4 }}
          />
          {pinError && <div style={{ color: "#f44336", fontSize: 12, marginBottom: 10 }}>Incorrect PIN</div>}
          <button onClick={handlePin} style={{ width: "100%", background: ACCENT, color: BG, border: "none", borderRadius: 8, padding: "12px", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
            Enter
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <div style={{ background: BG, minHeight: "100vh", color: MUTED, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>Loading...</div>;

  const active = businesses.filter(b => b.plan !== "trial" && b.active);
  const trials = businesses.filter(b => b.plan === "trial");
  const expired = trials.filter(b => getTrialDaysLeft(b.trial_ends_at) === 0);
  const mrr = active.reduce((sum, b) => sum + (planPrice[b.plan] || 0), 0);
  const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString());
  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

  // chart data
  const planDist = ["starter", "pro", "enterprise", "trial"].map(p => ({
    label: p.charAt(0).toUpperCase() + p.slice(1),
    value: businesses.filter(b => b.plan === p).length,
    color: planColor[p],
  }));

  const orderStatusDist = ["new", "preparing", "ready", "done", "cancelled"].map(s => ({
    label: s.charAt(0).toUpperCase() + s.slice(1),
    value: orders.filter(o => o.status === s).length,
    color: statusOrderColor[s],
  }));

  const conversionRate = trials.length > 0
    ? Math.round((active.length / (active.length + trials.length)) * 100)
    : 0;

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: "sans-serif" }}>
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 20, color: ACCENT }}>QRS Admin</div>
        <div style={{ color: MUTED, fontSize: 13 }}>{new Date().toLocaleDateString()}</div>
      </div>

      <div style={{ padding: 24 }}>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16, marginBottom: 32 }}>
          <StatCard label="Total Businesses" value={businesses.length} />
          <StatCard label="Active (Paid)" value={active.length} color="#4CAF50" />
          <StatCard label="On Trial" value={trials.length} color="#2196F3" />
          <StatCard label="Expired Trials" value={expired.length} color="#f44336" />
          <StatCard label="Est. MRR" value={`$${mrr}`} sub="paid plans only" />
          <StatCard label="Orders Today" value={todayOrders.length} />
          <StatCard label="Total Order Revenue" value={`$${totalRevenue.toFixed(2)}`} sub="all time" />
        </div>

        {/* CHARTS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16, marginBottom: 32 }}>
          <DonutChart title="Plan Distribution" data={planDist} />
          <BarChart title="Orders by Status" data={orderStatusDist} />
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 16, color: TEXT }}>Conversion Health</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: MUTED }}>Trial → Paid Rate</span>
                  <span style={{ color: ACCENT, fontWeight: 700 }}>{conversionRate}%</span>
                </div>
                <div style={{ background: "#1a1a1a", borderRadius: 4, height: 8 }}>
                  <div style={{ width: `${conversionRate}%`, background: ACCENT, height: "100%", borderRadius: 4, transition: "width 0.5s" }} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: MUTED }}>Trial Expiry Risk</span>
                  <span style={{ color: "#f44336", fontWeight: 700 }}>{expired.length} expired</span>
                </div>
                <div style={{ background: "#1a1a1a", borderRadius: 4, height: 8 }}>
                  <div style={{ width: trials.length > 0 ? `${(expired.length / trials.length) * 100}%` : "0%", background: "#f44336", height: "100%", borderRadius: 4 }} />
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[["Total Orders", orders.length], ["Avg Order Value", orders.length > 0 ? `$${(totalRevenue / orders.length).toFixed(2)}` : "$0"]].map(([l, v]) => (
                  <div key={l}>
                    <div style={{ color: MUTED, fontSize: 11 }}>{l}</div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: TEXT }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BUSINESSES TABLE */}
        <div style={{ marginBottom: 12, fontWeight: 700, fontSize: 16 }}>All Businesses</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {businesses.map(b => {
            const days = b.plan === "trial" ? getTrialDaysLeft(b.trial_ends_at) : null;
            return (
              <div
                key={b.id}
                onClick={() => setSelected(selected?.id === b.id ? null : b)}
                style={{ background: SURFACE, border: `1px solid ${selected?.id === b.id ? ACCENT : BORDER}`, borderRadius: 10, padding: "14px 20px", cursor: "pointer" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>{b.name || "—"}</span>
                    <span style={{ color: MUTED, fontSize: 12, marginLeft: 12 }}>{b.email}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: planColor[b.plan] || MUTED, fontWeight: 700 }}>{b.plan || "—"}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: statusColor(b.status, b.plan, b.trial_ends_at) }}>
                      {b.plan === "trial" ? (days === 0 ? "Expired" : `${days}d left`) : (b.active ? "Active" : "Inactive")}
                    </span>
                  </div>
                </div>
                {selected?.id === b.id && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${BORDER}`, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10, fontSize: 13 }}>
                    {[
                      ["ID", b.id],
                      ["Plan", b.plan],
                      ["Status", b.status],
                      ["Active", b.active ? "Yes" : "No"],
                      ["Trial Started", b.trial_started_at ? new Date(b.trial_started_at).toLocaleDateString() : "—"],
                      ["Trial Ends", b.trial_ends_at ? new Date(b.trial_ends_at).toLocaleDateString() : "—"],
                      ["Created", new Date(b.created_at).toLocaleDateString()],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div style={{ color: MUTED, fontSize: 11 }}>{label}</div>
                        <div style={{ fontWeight: 600, wordBreak: "break-all" }}>{value || "—"}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
