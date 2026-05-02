import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/useAuth";

const ACCENT = "#E8C547";
const BG = "#080808";
const SURFACE = "#111";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#F0EDE8";
const MUTED = "#666";

const btn = (extra = {}) => ({
  border: "none", borderRadius: 8, cursor: "pointer",
  fontWeight: 700, display: "flex", alignItems: "center",
  justifyContent: "center", ...extra,
});

const inputStyle = {
  width: "100%", background: "#141414",
  border: `1px solid ${BORDER}`, borderRadius: 8,
  padding: "10px", color: TEXT, boxSizing: "border-box",
};

function OverviewTab({ biz }) {
  if (!biz) return <div style={{ color: MUTED }}>Loading...</div>;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
      {[["Business Name", biz.name], ["Email", biz.email], ["Plan", biz.plan || "Free"], ["Status", biz.active ? "Active" : "Inactive"]].map(([label, value]) => (
        <div key={label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 }}>
          <div style={{ color: MUTED, fontSize: 12, marginBottom: 6 }}>{label}</div>
          <div style={{ fontWeight: 700 }}>{value || "—"}</div>
        </div>
      ))}
    </div>
  );
}

function TablesTab({ bizId }) {
  const [locations, setLocations] = useState([]);
  const [newLabel, setNewLabel] = useState("");

  const load = async () => {
    const { data } = await supabase.from("locations").select("*").eq("business_id", bizId).order("label");
    setLocations(data || []);
  };

  useEffect(() => { if (bizId) load(); }, [bizId]);

  const addLocation = async () => {
    if (!newLabel.trim()) return;
    const slug = newLabel.toLowerCase().replace(/\s+/g, "-");
    await supabase.from("locations").insert({ business_id: bizId, label: newLabel, slug });
    setNewLabel("");
    load();
  };

  const deleteLocation = async (id) => {
    await supabase.from("locations").delete().eq("id", id);
    load();
  };

  const downloadQR = (slug) => {
    const canvas = document.getElementById(`qr-${slug}`);
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${slug}.png`;
    a.click();
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input style={inputStyle} value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Table name..." />
        <button onClick={addLocation} style={btn({ background: ACCENT, color: BG, padding: "10px 20px", whiteSpace: "nowrap" })}>Add</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
        {locations.map(loc => {
          const scanUrl = `${window.location.origin}/scan/${bizId}/${loc.slug}`;
          return (
            <div key={loc.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, color: ACCENT }}>{loc.label}</div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{loc.slug}</div>
                </div>
                <button onClick={() => deleteLocation(loc.id)} style={btn({ background: "#1a1a1a", color: "red", width: 32, height: 32 })}>🗑</button>
              </div>
              <div style={{ display: "flex", justifyContent: "center", background: "white", borderRadius: 8, padding: 12, marginBottom: 10 }}>
                <QRCodeCanvas id={`qr-${loc.slug}`} value={scanUrl} size={150} />
              </div>
              <button onClick={() => downloadQR(loc.slug)} style={btn({ background: ACCENT, color: BG, padding: "8px 16px", width: "100%" })}>
                ⬇ Download QR
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MenuTab({ bizId }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "", image_url: "" });
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("services").select("*").eq("business_id", bizId).order("name");
    setItems(data || []);
  };

  useEffect(() => { if (bizId) load(); }, [bizId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `menu/${bizId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("service-images").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("service-images").getPublicUrl(path);
      setForm(f => ({ ...f, image_url: data.publicUrl }));
    }
    setUploading(false);
  };

  const addItem = async () => {
    if (!form.name.trim()) return;
    await supabase.from("services").insert({ business_id: bizId, name: form.name, price: parseFloat(form.price) || 0, description: form.description, image_url: form.image_url });
    setForm({ name: "", price: "", description: "", image_url: "" });
    load();
  };

  const deleteItem = async (id) => {
    await supabase.from("services").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <input style={inputStyle} placeholder="Item name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input style={inputStyle} placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        </div>
        <input style={{ ...inputStyle, marginBottom: 10 }} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <div style={{ marginBottom: 14 }}>
          <div style={{ color: MUTED, fontSize: 12, marginBottom: 6 }}>Photo (optional)</div>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ color: TEXT }} />
          {uploading && <span style={{ color: MUTED, fontSize: 12, marginLeft: 10 }}>Uploading...</span>}
          {form.image_url && <img src={form.image_url} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, marginTop: 8, display: "block" }} />}
        </div>
        <button onClick={addItem} style={btn({ background: ACCENT, color: BG, padding: "10px 20px" })}>Add Item</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
        {items.map(item => (
          <div key={item.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
            {item.image_url && <img src={item.image_url} alt={item.name} style={{ width: "100%", height: 140, objectFit: "cover" }} />}
            <div style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{item.name}</div>
                <div style={{ color: ACCENT, marginTop: 4 }}>${parseFloat(item.price || 0).toFixed(2)}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{item.description}</div>
              </div>
              <button onClick={() => deleteItem(item.id)} style={btn({ background: "#1a1a1a", color: "red", width: 32, height: 32 })}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersTab({ bizId }) {
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const { data: locs } = await supabase.from("locations").select("id, label").eq("business_id", bizId);
    const locationIds = (locs || []).map(l => l.id);
    const locMap = Object.fromEntries((locs || []).map(l => [l.id, l.label]));
    if (locationIds.length === 0) { setOrders([]); return; }
   const { data: ordersData } = await supabase.from("orders").select("*").in("location_id", locationIds).order("created_at", { ascending: false });
setOrders((ordersData || []).map(o => ({ ...o, location_label: locMap[o.location_id] || "Unknown table" })));
};useEffect(() => {
  if (!bizId) return;
  const channel = supabase.channel("orders-realtime")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, () => { load(); })
    .subscribe();
  return () => supabase.removeChannel(channel);
}, [bizId]);
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
                <span style={{ fontWeight: 700 }}>{order.location_label || "Unknown table"}</span>
                <span style={{ color: ACCENT }}>${parseFloat(order.total || 0).toFixed(2)}</span>
              </div>
              <div style={{ fontSize: 12, color: MUTED }}>{new Date(order.created_at).toLocaleString()}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                <span style={{ fontSize: 12, color: statusColor(order.status), fontWeight: 700 }}>{order.status}</span>
                <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)} style={{ background: "#1a1a1a", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}>
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

function BlockedDatesTab({ bizId }) {
  const [dates, setDates] = useState([]);
  const [newDate, setNewDate] = useState("");

  const load = async () => {
    const { data } = await supabase.from("blocked_dates").select("*").eq("business_id", bizId).order("date");
    setDates(data || []);
  };

  useEffect(() => { if (bizId) load(); }, [bizId]);

  const addDate = async () => {
    if (!newDate) return;
    await supabase.from("blocked_dates").insert({ business_id: bizId, date: newDate });
    setNewDate("");
    load();
  };

  const deleteDate = async (id) => {
    await supabase.from("blocked_dates").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input type="date" style={inputStyle} value={newDate} onChange={e => setNewDate(e.target.value)} />
        <button onClick={addDate} style={btn({ background: ACCENT, color: BG, padding: "10px 20px", whiteSpace: "nowrap" })}>Block Date</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {dates.map(d => (
          <div key={d.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{d.date}</span>
            <button onClick={() => deleteDate(d.id)} style={btn({ background: "#1a1a1a", color: "red", width: 32, height: 32 })}>🗑</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = ["overview", "tables", "menu", "orders", "blocked"];

export default function DashboardPage() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [biz, setBiz] = useState(null);
  const [tab, setTab] = useState("overview");
  useEffect(() => {
    if (!session?.user?.email) return;
    
  supabase.from("businesses").select("*").eq("id", session.user.id).order("created_at", { ascending: false })
.limit(1).then(({ data }) => {
  console.log("DATA:", data);
  if (data?.length) setBiz(data[0]);
});
}, [session]);
  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: "sans-serif" }}>
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 20, color: ACCENT }}>QRS Dashboard</div>
        <button onClick={async () => { await signOut(); navigate("/"); }} style={btn({ background: "#1a1a1a", color: TEXT, padding: "8px 16px", border: `1px solid ${BORDER}` })}>Sign out</button>
      </div>
      <div style={{ borderBottom: `1px solid ${BORDER}`, display: "flex", padding: "0 24px" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", cursor: "pointer", padding: "14px 16px", color: tab === t ? ACCENT : MUTED, borderBottom: tab === t ? `2px solid ${ACCENT}` : "2px solid transparent", fontWeight: 700, textTransform: "capitalize", fontSize: 14 }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ padding: 24 }}>
        {tab === "overview" && <OverviewTab biz={biz} />}
        {tab === "tables" && biz && <TablesTab bizId={biz.id} />}
        {tab === "menu" && biz && <MenuTab bizId={biz.id} />}
        {tab === "orders" && biz && <OrdersTab bizId={biz.id} />}
        {tab === "blocked" && biz && <BlockedDatesTab bizId={biz.id} />}
      </div>
    </div>
  );
}