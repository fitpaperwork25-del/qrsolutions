import { useState } from "react";
import { Link } from "react-router-dom";
import { useAllServices } from "../lib/useServices";
import { BUSINESSES } from "../lib/data";
import { LIVE, supabase } from "../lib/supabase";

// ─── ICONS ───────────────────────────────────────────────────────────────────

const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { width: size, height: size, display: "block", flexShrink: 0 };
  const icons = {
    plus:   <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    edit:   <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash:  <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    scan:   <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="3" y1="12" x2="21" y2="12"/></svg>,
    grid:   <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    check:  <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>,
    x:      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    eye:    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    eyeoff: <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
    image:  <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>,
  };
  return icons[name] || null;
};

// ─── ITEM MODAL ──────────────────────────────────────────────────────────────

const EMPTY = { name: "", description: "", price: "", category: "", duration_min: "" };

function ItemModal({ item, businessId, onSave, onClose }) {
  const isEdit = !!item;
  const [form, setForm] = useState(item ? {
    name: item.name,
    description: item.description || "",
    price: String(item.price),
    category: item.category || "",
    duration_min: item.duration_min ? String(item.duration_min) : "",
  } : EMPTY);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(item?.image_url || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (!form.price || isNaN(Number(form.price))) { setError("Valid price is required"); return; }
    setSaving(true);

    let image_url = item?.image_url || null;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `services/${businessId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("service-images").upload(path, imageFile, { upsert: true });
      if (uploadError) {
        setError("Image upload failed. Try again.");
        setSaving(false);
        return;
      }
      const { data } = supabase.storage.from("service-images").getPublicUrl(path);
      image_url = data.publicUrl;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category.trim() || null,
      duration_min: form.duration_min ? Number(form.duration_min) : null,
      image_url,
    };
    const ok = await onSave(payload);
    if (!ok) { setError("Failed to save. Try again."); setSaving(false); return; }
    onClose();
  };

  const inputStyle = {
    width: "100%", background: "#141414", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8, padding: "12px 14px", color: "#F0EDE8", fontSize: 14,
    fontFamily: "'Syne', sans-serif", outline: "none", boxSizing: "border-box",
  };
  const labelStyle = { fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.4, letterSpacing: 1.5, display: "block", marginBottom: 6 };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#F0EDE8", fontFamily: "'Syne', sans-serif" }}>
            {isEdit ? "Edit item" : "Add item"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#F0EDE8" }}>
            <Icon name="x" size={22} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Image upload */}
          <div>
            <label style={labelStyle}>ITEM IMAGE</label>
            <div style={{ position: "relative", width: "100%", height: 160, borderRadius: 10, overflow: "hidden", border: "1px dashed rgba(255,255,255,0.15)", background: "#141414", cursor: "pointer" }}
              onClick={() => document.getElementById("img-upload").click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8, opacity: 0.3 }}>
                  <Icon name="image" size={32} color="#F0EDE8" />
                  <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace" }}>CLICK TO UPLOAD</span>
                </div>
              )}
            </div>
            <input id="img-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
          </div>

          <div>
            <label style={labelStyle}>NAME *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Classic Cut" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>DESCRIPTION</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Brief description..." style={{ ...inputStyle, resize: "none", minHeight: 70 }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>PRICE ($) *</label>
              <input value={form.price} onChange={e => set("price", e.target.value)} placeholder="0.00" type="number" step="0.01" min="0" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>CATEGORY</label>
              <input value={form.category} onChange={e => set("category", e.target.value)} placeholder="e.g. Haircuts" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>DURATION (MIN) — for bookings only</label>
            <input value={form.duration_min} onChange={e => set("duration_min", e.target.value)} placeholder="e.g. 30" type="number" min="0" style={inputStyle} />
          </div>
        </div>

        {error && (
          <div style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 8, padding: "10px 14px", marginTop: 16, fontSize: 13, color: "#FF6B6B", fontFamily: "'DM Mono', monospace" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#F0EDE8", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 2, background: "#E8C547", color: "#0A0A0A", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 800, cursor: saving ? "default" : "pointer", fontFamily: "'Syne', sans-serif", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving..." : (isEdit ? "Save changes" : "Add item")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MENU PAGE ────────────────────────────────────────────────────────────────

export default function MenuPage() {
  const [selectedBiz, setSelectedBiz] = useState(Object.keys(BUSINESSES)[0]);
  const { services, loading, updateService, addService, deleteService } = useAllServices(selectedBiz);
  const [editItem, setEditItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const categories = [...new Set(services.map(s => s.category).filter(Boolean))];
  const grouped = categories.length > 0
    ? categories.map(cat => ({ cat, items: services.filter(s => s.category === cat) }))
    : [{ cat: null, items: services }];
  const uncategorized = services.filter(s => !s.category);
  if (categories.length > 0 && uncategorized.length > 0) grouped.push({ cat: "Other", items: uncategorized });

  const handleToggle = async (item) => {
    const ok = await updateService(item.id, { available: !item.available });
    if (ok) showToast(item.available ? `"${item.name}" hidden` : `"${item.name}" visible`);
  };

  const handleEdit = async (payload) => {
    return await updateService(editItem.id, payload);
  };

  const handleAdd = async (payload) => {
    const ok = await addService(payload);
    if (ok) showToast(`"${payload.name}" added`);
    return ok;
  };

  const handleDelete = async () => {
    const item = services.find(s => s.id === confirmDelete);
    const ok = await deleteService(confirmDelete);
    if (ok && item) showToast(`"${item.name}" deleted`);
    setConfirmDelete(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "#F0EDE8", fontFamily: "'Syne', sans-serif" }}>

      {toast && (
        <div style={{ position: "fixed", top: 16, right: 16, background: "#E8C547", color: "#0A0A0A", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, zIndex: 300, fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="check" size={14} color="#0A0A0A" /> {toast}
        </div>
      )}

      {showAdd && <ItemModal businessId={selectedBiz} onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {editItem && <ItemModal item={editItem} businessId={selectedBiz} onSave={handleEdit} onClose={() => setEditItem(null)} />}

      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 28, maxWidth: 360, width: "100%" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 800 }}>Delete item?</h3>
            <p style={{ margin: "0 0 24px", opacity: 0.5, fontSize: 14 }}>This cannot be undone.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#F0EDE8", borderRadius: 9, padding: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, background: "#FF5C5C", border: "none", color: "#fff", borderRadius: 9, padding: 12, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Syne', sans-serif" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="scan" color="#E8C547" />
            <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.5 }}>QRS</span>
          </div>
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: 11, opacity: 0.3, fontFamily: "'DM Mono', monospace" }}>MENU MANAGER</span>
          <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", padding: "2px 8px", borderRadius: 4, background: LIVE ? "rgba(76,175,80,0.12)" : "rgba(232,197,71,0.1)", color: LIVE ? "#4CAF50" : "#E8C547" }}>
            {LIVE ? "LIVE" : "DEMO"}
          </span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/staff/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(240,237,232,0.4)", textDecoration: "none", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
            <Icon name="grid" size={15} color="rgba(240,237,232,0.4)" /> DASHBOARD
          </Link>
          <button onClick={() => setShowAdd(true)} style={{ background: "#E8C547", color: "#0A0A0A", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Syne', sans-serif" }}>
            <Icon name="plus" size={14} color="#0A0A0A" /> Add item
          </button>
        </div>
      </div>

      <div style={{ padding: "14px 24px", display: "flex", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {Object.values(BUSINESSES).map(b => (
          <button key={b.id} onClick={() => setSelectedBiz(b.id)} style={{
            background: selectedBiz === b.id ? `${b.accent}20` : "transparent",
            color: selectedBiz === b.id ? b.accent : "rgba(240,237,232,0.4)",
            border: `1px solid ${selectedBiz === b.id ? b.accent : "rgba(255,255,255,0.1)"}`,
            borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 700,
            fontFamily: "'DM Mono', monospace", cursor: "pointer", transition: "all 0.15s"
          }}>
            {b.name}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 1, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)" }}>
        {[
          { label: "TOTAL ITEMS", val: services.length },
          { label: "VISIBLE", val: services.filter(s => s.available).length, color: "#4CAF50" },
          { label: "HIDDEN", val: services.filter(s => !s.available).length, color: "#888" },
          { label: "CATEGORIES", val: categories.length },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, padding: "14px 20px", background: "#0A0A0A" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color || "#F0EDE8", marginBottom: 2 }}>{s.val}</div>
            <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", opacity: 0.3, letterSpacing: 1.5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "20px 24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", opacity: 0.3, padding: 60, fontFamily: "'DM Mono', monospace", fontSize: 13 }}>LOADING...</div>
        ) : services.length === 0 ? (
          <div style={{ textAlign: "center", opacity: 0.2, padding: 60, fontFamily: "'DM Mono', monospace", fontSize: 13 }}>
            NO ITEMS — ADD YOUR FIRST ONE
          </div>
        ) : (
          grouped.map(({ cat, items }) => (
            <div key={cat || "all"} style={{ marginBottom: 28 }}>
              {cat && (
                <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.35, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
                  {cat}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
                {items.map(item => (
                  <div key={item.id} style={{
                    background: "#141414", borderRadius: 12, overflow: "hidden",
                    border: `1px solid ${item.available ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)"}`,
                    opacity: item.available ? 1 : 0.5,
                  }}>
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
                    )}
                    <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1, paddingRight: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 15, fontWeight: 700 }}>{item.name}</span>
                          {!item.available && (
                            <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", background: "rgba(255,255,255,0.07)", padding: "2px 7px", borderRadius: 4, opacity: 0.6 }}>HIDDEN</span>
                          )}
                        </div>
                        {item.description && (
                          <div style={{ fontSize: 12, opacity: 0.4, marginBottom: 8, lineHeight: 1.4 }}>{item.description}</div>
                        )}
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: "#E8C547" }}>${item.price}</span>
                          {item.duration_min && <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.35 }}>{item.duration_min} MIN</span>}
                          {item.category && <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.35 }}>{item.category}</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button onClick={() => handleToggle(item)} title={item.available ? "Hide" : "Show"} style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: item.available ? "#4CAF50" : "rgba(255,255,255,0.3)" }}>
                          <Icon name={item.available ? "eye" : "eyeoff"} size={15} color="currentColor" />
                        </button>
                        <button onClick={() => setEditItem(item)} title="Edit" style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(240,237,232,0.6)" }}>
                          <Icon name="edit" size={15} color="currentColor" />
                        </button>
                        <button onClick={() => setConfirmDelete(item.id)} title="Delete" style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,80,80,0.6)" }}>
                          <Icon name="trash" size={15} color="currentColor" />
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
    </div>
  );
}