import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/useAuth";

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { width: size, height: size, display: "block", flexShrink: 0 };
  const icons = {
    home:    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    menu:    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    table:   <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/></svg>,
    orders:  <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>,
    block:   <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="16" y2="20"/><line x1="16" y1="14" x2="8" y2="20"/></svg>,
    qr:      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="5" y="5" width="3" height="3" fill={color}/><rect x="16" y="5" width="3" height="3" fill={color}/><rect x="5" y="16" width="3" height="3" fill={color}/><line x1="14" y1="14" x2="14" y2="14"/><rect x="14" y="14" width="3" height="3" fill={color}/><rect x="19" y="14" width="2" height="2" fill={color}/><rect x="14" y="19" width="2" height="2" fill={color}/><rect x="19" y="19" width="2" height="2" fill={color}/><rect x="17" y="17" width="2" height="2" fill={color}/></svg>,
    plus:    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trash:   <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    edit:    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    logout:  <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    check:   <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>,
    eye:     <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeoff:  <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  };
  return icons[name] || null;
};

const ACCENT = "#E8C547";
const BG = "#080808";
const SURFACE = "#111";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#F0EDE8";
const MUTED = "#666";

const btn = (extra = {}) => ({
  border: "none", borderRadius: 8, cursor: "pointer",
  fontFamily: "'Syne', sans-serif", fontWeight: 700,
  display: "flex", alignItems: "center", gap: 6,
  ...extra,
});

const input = {
  width: "100%", background: "#141414", border: `1px solid ${BORDER}`,
  borderRadius: 8, padding: "11px 14px", color: TEXT, fontSize: 14,
  fontFamily: "'Syne', sans-serif", outline: "none", boxSizing: "border-box",
};

function Toast({ msg }) {
  return msg ? (
    <div style={{ position: "fixed", top: 20, right: 20, background: ACCENT, color: BG, padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, zIndex: 999, display: "flex", alignItems: "center", gap: 8 }}>
      <Icon name="check" size={14} color={BG} /> {msg}
    </div>
  ) : null;
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#0A0A0A", border: `1px solid ${BORDER}`, borderRadius: 16, padding: 28, width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: TEXT }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab({ biz, orders, services, locations }) {
  const total = orders.length;
  const today = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length;
  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pending = orders.filter(o => o.status === "new" || o.status === "pending").length;

  const stats = [
    { label: "Total Orders", val: total, color: ACCENT },
    { label: "Today", val: today, color: "#4CAF50" },
    { label: "Pending", val: pending, color: "#FF9800" },
    { label: "Revenue", val: `$${revenue.toFixed(2)}`, color: "#7EC8A4" },
    { label: "Menu Items", val: services.length, color: TEXT },
    { label: "Tables", val: locations.length, color: TEXT },
  ];

  return (
    <div>
      {/* Business Info */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24, marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: MUTED, letterSpacing: 2, marginBottom: 12, fontFamily: "monospace" }}>BUSINESS INFO</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          {[
            { label: "Name", val: biz?.name || "—" },
            { label: "Email", val: biz?.email || "—" },
            { label: "Plan", val: (biz?.plan || "—").toUpperCase() },
            { label: "Status", val: biz?.status === "active" ? "✓ Active" : biz?.status || "—" },
            { label: "Type", val: biz?.type || "—" },
            { label: "Tagline", val: biz?.tagline || "—" },
          ].map(({ label, val }) => (
            <div key={label}>
              <div style={{ fontSize: 10, color: MUTED, letterSpacing: 1.5, fontFamily: "monospace", marginBottom: 4 }}>{label.toUpperCase()}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: label === "Status" ? "#4CAF50" : TEXT }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: MUTED, fontFamily: "monospace", letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 11, color: MUTED, letterSpacing: 2, marginBottom: 14, fontFamily: "monospace" }}>RECENT ORDERS</div>
        {orders.length === 0 ? (
          <div style={{ color: MUTED, fontSize: 13, textAlign: "center", padding: "20px 0" }}>No orders yet</div>
        ) : (
          orders.slice(0, 5).map(o => (
            <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${BORDER}` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{o.location_label || "—"}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{o.items?.map(i => i.service_name).join(", ") || "—"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>${(o.total || 0).toFixed(2)}</div>
                <div style={{ fontSize: 10, color: MUTED, marginTop: 2, fontFamily: "monospace" }}>{o.status?.toUpperCase()}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── MENU TAB ────────────────────────────────────────────────────────────────
function MenuTab({ bizId, showToast }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "" });
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = useCallback(async () => {
    if (!bizId) return;
    const { data } = await supabase.from("services").select("*").eq("business_id", bizId).order("category").order("name");
    setServices(data || []);
    setLoading(false);
  }, [bizId]);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => setForm({ name: "", description: "", price: "", category: "" });

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, description: item.description || "", price: String(item.price), category: item.category || "" });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) return;
    setSaving(true);
    const payload = { name: form.name.trim(), description: form.description.trim(), price: Number(form.price), category: form.category.trim() || null, business_id: bizId };
    if (editItem) {
      await supabase.from("services").update(payload).eq("id", editItem.id);
      showToast(`"${form.name}" updated`);
      setEditItem(null);
    } else {
      await supabase.from("services").insert({ ...payload, available: true });
      showToast(`"${form.name}" added`);
      setShowAdd(false);
    }
    resetForm();
    setSaving(false);
    load();
  };

  const handleDelete = async () => {
    await supabase.from("services").delete().eq("id", confirmDelete);
    showToast("Item deleted");
    setConfirmDelete(null);
    load();
  };

  const handleToggle = async (item) => {
    await supabase.from("services").update({ available: !item.available }).eq("id", item.id);
    load();
  };

  const categories = [...new Set(services.map(s => s.category).filter(Boolean))];
  const grouped = categories.length > 0
    ? [...categories.map(cat => ({ cat, items: services.filter(s => s.category === cat) })),
       ...(services.filter(s => !s.category).length > 0 ? [{ cat: "Uncategorized", items: services.filter(s => !s.category) }] : [])]
    : [{ cat: null, items: services }];

  const FormContent = (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div style={{ fontSize: 10, color: MUTED, letterSpacing: 1.5, fontFamily: "monospace", marginBottom: 6 }}>NAME *</div>
        <input style={input} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Tonkotsu Ramen" />
      </div>
      <div>
        <div style={{ fontSize: 10, color: MUTED, letterSpacing: 1.5, fontFamily: "monospace", marginBottom: 6 }}>DESCRIPTION</div>
        <textarea style={{ ...input, resize: "none", minHeight: 60 }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: MUTED, letterSpacing: 1.5, fontFamily: "monospace", marginBottom: 6 }}>PRICE ($) *</div>
          <input style={input} type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="0.00" />
        </div>
        <div>
          <div style={{ fontSize: 10, color: MUTED, letterSpacing: 1.5, fontFamily: "monospace", marginBottom: 6 }}>CATEGORY</div>
          <input style={input} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} placeholder="e.g. Mains" />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <button onClick={() => { setShowAdd(false); setEditItem(null); resetForm(); }} style={btn({ flex: 1, background: "transparent", border: `1px solid ${BORDER}`, color: TEXT, padding: "12px" })}>Cancel</button>
        <button onClick={handleSave} disabled={saving} style={btn({ flex: 2, background: ACCENT, color: BG, padding: "12px", opacity: saving ? 0.6 : 1 })}>{saving ? "Saving..." : (editItem ? "Save changes" : "Add item")}</button>
      </div>
    </div>
  );

  return (
    <div>
      {confirmDelete && (
        <Modal title="Delete item?" onClose={() => setConfirmDelete(null)}>
          <p style={{ color: MUTED, fontSize: 14, marginBottom: 24 }}>This cannot be undone.</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setConfirmDelete(null)} style={btn({ flex: 1, background: "transparent", border: `1px solid ${BORDER}`, color: TEXT, padding: "12px" })}>Cancel</button>
            <button onClick={handleDelete} style={btn({ flex: 1, background: "#FF5C5C", color: "#fff", padding: "12px" })}>Delete</button>
          </div>
        </Modal>
      )}
      {(showAdd || editItem) && (
        <Modal title={editItem ? "Edit item" : "Add item"} onClose={() => { setShowAdd(false); setEditItem(null); resetForm(); }}>
          {FormContent}
        </Modal>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { label: "TOTAL", val: services.length },
            { label: "VISIBLE", val: services.filter(s => s.available).length, color: "#4CAF50" },
            { label: "HIDDEN", val: services.filter(s => !s.available).length },
          ].map(s => (
            <div key={s.label}>
              <span style={{ fontSize: 20, fontWeight: 800, color: s.color || TEXT }}>{s.val}</span>
              <span style={{ fontSize: 10, color: MUTED, fontFamily: "monospace", marginLeft: 6 }}>{s.label}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setShowAdd(true)} style={btn({ background: ACCENT, color: BG, padding: "9px 16px", fontSize: 13 })}>
          <Icon name="plus" size={14} color={BG} /> Add item
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: MUTED, padding: 60, fontFamily: "monospace", fontSize: 13 }}>LOADING...</div>
      ) : services.length === 0 ? (
        <div style={{ textAlign: "center", color: MUTED, padding: 60, fontFamily: "monospace", fontSize: 13 }}>NO ITEMS — ADD YOUR FIRST ONE</div>
      ) : (
        grouped.map(({ cat, items }) => (
          <div key={cat || "all"} style={{ marginBottom: 24 }}>
            {cat && <div style={{ fontSize: 10, color: MUTED, fontFamily: "monospace", letterSpacing: 2, marginBottom: 10 }}>{cat.toUpperCase()}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
              {items.map(item => (
                <div key={item.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 16px", opacity: item.available ? 1 : 0.5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{item.name}
                        {!item.available && <span style={{ fontSize: 10, fontFamily: "monospace", background: "rgba(255,255,255,0.07)", padding: "2px 7px", borderRadius: 4, marginLeft: 8 }}>HIDDEN</span>}
                      </div>
                      {item.description && <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>{item.description}</div>}
                      <div style={{ fontSize: 16, fontWeight: 800, color: ACCENT }}>${Number(item.price).toFixed(2)}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginLeft: 10 }}>
                      <button onClick={() => handleToggle(item)} style={btn({ width: 32, height: 32, background: "rgba(255,255,255,0.05)", color: item.available ? "#4CAF50" : MUTED, justifyContent: "center" })}>
                        <Icon name={item.available ? "eye" : "eyeoff"} size={14} />
                      </button>
                      <button onClick={() => openEdit(item)} style={btn({ width: 32, height: 32, background: "rgba(255,255,255,0.05)", color: TEXT, justifyContent: "center" })}>
                        <Icon name="edit" size={14} />
                      </button>
                      <button onClick={() => setConfirmDelete(item.id)} style={btn({ width: 32, height: 32, background: "rgba(255,255,255,0.05)", color: "#FF5C5C", justifyContent: "center" })}>
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── TABLES TAB ──────────────────────────────────────────────────────────────
function TablesTab({ bizId, showToast }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = useCallback(async () => {
    if (!bizId) return;
    const { data } = await supabase.from("locations").select("*").eq("business_id", bizId).order("label");
    setLocations(data || []);
    setLoading(false);
  }, [bizId]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!newLabel.trim()) return;
    setAdding(true);
    const slug = newLabel.trim().toLowerCase().replace(/\s+/g, "-");
    await supabase.from("locations").insert({ business_id: bizId, label: newLabel.trim(), slug });
    showToast(`"${newLabel.trim()}" added`);
    setNewLabel("");
    setAdding(false);
    load();
  };

  const handleDelete = async () => {
    await supabase.from("locations").delete().eq("id", confirmDelete);
    showToast("Table removed");
    setConfirmDelete(null);
    load();
  };

  return (
    <div>
      {confirmDelete && (
        <Modal title="Remove table?" onClose={() => setConfirmDelete(null)}>
          <p style={{ color: MUTED, fontSize: 14, marginBottom: 24 }}>This cannot be undone.</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setConfirmDelete(null)} style={btn({ flex: 1, background: "transparent", border: `1px solid ${BORDER}`, color: TEXT, padding: "12px" })}>Cancel</button>
            <button onClick={handleDelete} style={btn({ flex: 1, background: "#FF5C5C", color: "#fff", padding: "12px" })}>Remove</button>
          </div>
        </Modal>
      )}

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: MUTED, fontFamily: "monospace", letterSpacing: 1.5, marginBottom: 14 }}>ADD TABLE / LOCATION</div>
        <div style={{ display: "flex", gap: 10 }}>
          <input style={{ ...input, flex: 1 }} value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="e.g. Table 5, Counter, Patio" onKeyDown={e => e.key === "Enter" && handleAdd()} />
          <button onClick={handleAdd} disabled={adding} style={btn({ background: ACCENT, color: BG, padding: "11px 18px", fontSize: 13 })}>
            <Icon name="plus" size={14} color={BG} /> Add
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: MUTED, padding: 60, fontFamily: "monospace", fontSize: 13 }}>LOADING...</div>
      ) : locations.length === 0 ? (
        <div style={{ textAlign: "center", color: MUTED, padding: 60, fontFamily: "monospace", fontSize: 13 }}>NO TABLES YET</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {locations.map(loc => (
            <div key={loc.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{loc.label}</div>
                <div style={{ fontSize: 11, color: MUTED, fontFamily: "monospace", marginTop: 2 }}>{loc.slug}</div>
              </div>
              <button onClick={() => setConfirmDelete(loc.id)} style={btn({ width: 32, height: 32, background: "rgba(255,255,255,0.05)", color: "#FF5C5C", justifyContent: "center" })}>
                <Icon name="trash" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ORDERS TAB ──────────────────────────────────────────────────────────────
function OrdersTab({ bizId, showToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    if (!bizId) return;
    const { data } = await supabase.from("orders").select("*, order_items(*)").eq("business_id", bizId).order("created_at", { ascending: false }).limit(50);
    setOrders((data || []).map(o => ({ ...o, items: o.order_items || [] })));
    setLoading(false);
  }, [bizId]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    showToast(`Order marked ${status}`);
    load();
  };

  const statuses = ["all", "new", "preparing", "ready", "served"];
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const statusColor = { new: "#FF9800", preparing: "#2196F3", ready: "#4CAF50", served: MUTED, pending: "#FF9800" };

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={btn({
            background: filter === s ? ACCENT : "transparent",
            color: filter === s ? BG : MUTED,
            border: `1px solid ${filter === s ? ACCENT : BORDER}`,
            padding: "7px 14px", fontSize: 11, fontFamily: "monospace", letterSpacing: 1,
          })}>
            {s.toUpperCase()} {s !== "all" && `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: MUTED, padding: 60, fontFamily: "monospace", fontSize: 13 }}>LOADING...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", color: MUTED, padding: 60, fontFamily: "monospace", fontSize: 13 }}>NO ORDERS</div>
      ) : (
        filtered.map(order => (
          <div key={order.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 18, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{order.location_label || "—"}</div>
                <div style={{ fontSize: 11, color: MUTED, fontFamily: "monospace", marginTop: 2 }}>{timeAgo(order.created_at)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: ACCENT }}>${(order.total || 0).toFixed(2)}</div>
                <div style={{ fontSize: 11, fontFamily: "monospace", color: statusColor[order.status] || MUTED, marginTop: 2 }}>{(order.status || "—").toUpperCase()}</div>
              </div>
            </div>

            <div style={{ fontSize: 13, color: MUTED, marginBottom: 12 }}>
              {order.items.map(i => `${i.service_name}${i.quantity > 1 ? ` ×${i.quantity}` : ""}`).join(", ") || "No items"}
            </div>
            {order.note && <div style={{ fontSize: 12, color: "#aaa", background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "7px 10px", marginBottom: 12 }}>📝 {order.note}</div>}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["new", "preparing", "ready", "served"].map(s => (
                <button key={s} onClick={() => updateStatus(order.id, s)} style={btn({
                  background: order.status === s ? statusColor[s] : "rgba(255,255,255,0.05)",
                  color: order.status === s ? "#fff" : MUTED,
                  border: `1px solid ${order.status === s ? statusColor[s] : BORDER}`,
                  padding: "6px 12px", fontSize: 11, fontFamily: "monospace",
                })}>
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── BLOCKED DATES TAB ───────────────────────────────────────────────────────
function BlockedDatesTab({ bizId, showToast }) {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: "", reason: "" });
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    if (!bizId) return;
    const { data } = await supabase.from("blocked_dates").select("*").eq("business_id", bizId).order("date");
    setDates(data || []);
    setLoading(false);
  }, [bizId]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!form.date) return;
    setAdding(true);
    await supabase.from("blocked_dates").insert({ business_id: bizId, date: form.date, reason: form.reason.trim() || null });
    showToast("Date blocked");
    setForm({ date: "", reason: "" });
    setAdding(false);
    load();
  };

  const handleDelete = async (id) => {
    await supabase.from("blocked_dates").delete().eq("id", id);
    showToast("Date unblocked");
    load();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: MUTED, fontFamily: "monospace", letterSpacing: 1.5, marginBottom: 14 }}>BLOCK A DATE</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input style={{ ...input, flex: "0 0 160px" }} type="date" min={today} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          <input style={{ ...input, flex: 1, minWidth: 180 }} value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} placeholder="Reason (optional)" />
          <button onClick={handleAdd} disabled={adding || !form.date} style={btn({ background: ACCENT, color: BG, padding: "11px 18px", fontSize: 13, opacity: !form.date ? 0.5 : 1 })}>
            <Icon name="plus" size={14} color={BG} /> Block
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: MUTED, padding: 60, fontFamily: "monospace", fontSize: 13 }}>LOADING...</div>
      ) : dates.length === 0 ? (
        <div style={{ textAlign: "center", color: MUTED, padding: 60, fontFamily: "monospace", fontSize: 13 }}>NO BLOCKED DATES</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {dates.map(d => (
            <div key={d.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{new Date(d.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</div>
                {d.reason && <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{d.reason}</div>}
              </div>
              <button onClick={() => handleDelete(d.id)} style={btn({ background: "rgba(255,255,255,0.05)", color: "#FF5C5C", padding: "7px 12px", fontSize: 12 })}>
                Unblock
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [biz, setBiz] = useState(null);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  // Fetch business by logged-in email
  useEffect(() => {
    if (!session?.user?.email) return;
    console.log("fetching for:", session.user.email);
    supabase.from("businesses").select("*").eq("email", session.user.email)
   .then(({ data, error }) => {
      console.log("biz fetch:", data, error);
      if (data && data.length > 0) setBiz(data[0]);
    });
  }, [session]);

  // Fetch overview data
  useEffect(() => {
    if (!biz?.id) return;
    supabase.from("orders").select("*, order_items(*)").eq("business_id", biz.id).order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => setOrders((data || []).map(o => ({ ...o, items: o.order_items || [] }))));
    supabase.from("services").select("*").eq("business_id", biz.id)
      .then(({ data }) => setServices(data || []));
    supabase.from("locations").select("*").eq("business_id", biz.id)
      .then(({ data }) => setLocations(data || []));
  }, [biz]);

  const tabs = [
    { id: "overview", label: "Overview", icon: "home" },
    { id: "menu", label: "Menu", icon: "menu" },
    { id: "tables", label: "Tables", icon: "table" },
    { id: "orders", label: "Orders", icon: "orders" },
    { id: "blocked", label: "Blocked Dates", icon: "block" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "'Syne', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&display=swap'); * { box-sizing: border-box; }`}</style>
      <Toast msg={toast} />

      {/* HEADER */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 28px", borderBottom: `1px solid ${BORDER}` }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: ACCENT }}>QRS</div>
          <div style={{ fontSize: 11, color: MUTED, fontFamily: "monospace", marginTop: 2 }}>{biz?.name || "Loading..."}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, fontFamily: "monospace", background: "rgba(76,175,80,0.12)", color: "#4CAF50", padding: "4px 10px", borderRadius: 6 }}>
            {(biz?.plan || "starter").toUpperCase()}
          </span>
          <button onClick={async () => { await signOut(); navigate("/"); }} style={btn({ background: "transparent", border: `1px solid ${BORDER}`, color: MUTED, padding: "8px 14px", fontSize: 12 })}>
            <Icon name="logout" size={14} color={MUTED} /> Sign out
          </button>
        </div>
      </header>

      {/* TABS */}
      <div style={{ display: "flex", gap: 2, padding: "0 28px", borderBottom: `1px solid ${BORDER}`, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={btn({
            background: "transparent", color: tab === t.id ? ACCENT : MUTED,
            borderBottom: `2px solid ${tab === t.id ? ACCENT : "transparent"}`,
            borderRadius: 0, padding: "14px 16px", fontSize: 13,
            borderTop: "none", borderLeft: "none", borderRight: "none",
            whiteSpace: "nowrap",
          })}>
            <Icon name={t.icon} size={15} color={tab === t.id ? ACCENT : MUTED} /> {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding: "28px", maxWidth: 1100, margin: "0 auto" }}>
        {tab === "overview" && <OverviewTab biz={biz} orders={orders} services={services} locations={locations} />}
        {tab === "menu"     && biz && <MenuTab bizId={biz.id} showToast={showToast} />}
        {tab === "tables"   && biz && <TablesTab bizId={biz.id} showToast={showToast} />}
        {tab === "orders"   && biz && <OrdersTab bizId={biz.id} showToast={showToast} />}
        {tab === "blocked"  && biz && <BlockedDatesTab bizId={biz.id} showToast={showToast} />}
        {!biz && tab !== "overview" && (
          <div style={{ textAlign: "center", color: MUTED, padding: 80, fontFamily: "monospace" }}>LOADING BUSINESS DATA...</div>
        )}
      </div>
    </div>
  );
}