import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase, LIVE } from "../lib/supabase";
import { BUSINESSES } from "../lib/data";

// ─── ICONS ───────────────────────────────────────────────────────────────────

const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const s = { width: size, height: size, display: "block", flexShrink: 0 };
  const icons = {
    scan:    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="3" y1="12" x2="21" y2="12"/></svg>,
    grid:    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    upload:  <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    check:   <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>,
    x:       <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    image:   <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>,
    settings:<svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  };
  return icons[name] || null;
};

// ─── IMAGE UPLOAD ZONE ───────────────────────────────────────────────────────

function ImageUpload({ label, hint, currentUrl, onUpload, folder }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || null);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  useEffect(() => { setPreview(currentUrl || null); }, [currentUrl]);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5MB"); return; }

    setError(null);
    setUploading(true);

    // Show preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    if (LIVE) {
      const ext = file.name.split(".").pop();
      const path = `${folder}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("business-assets")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from("business-assets").getPublicUrl(path);
      onUpload(data.publicUrl);
    } else {
      onUpload(localUrl);
    }

    setUploading(false);
  };

  return (
    <div>
      <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.4, letterSpacing: 1.5, marginBottom: 8 }}>{label}</div>
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          border: `1px dashed rgba(255,255,255,0.2)`, borderRadius: 12,
          overflow: "hidden", cursor: "pointer", position: "relative",
          minHeight: 120, display: "flex", alignItems: "center", justifyContent: "center",
          background: "#141414", transition: "border-color 0.2s",
        }}
      >
        {preview ? (
          <img src={preview} alt={label} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 24, opacity: 0.4 }}>
            <Icon name="image" size={28} color="#F0EDE8" />
            <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "#F0EDE8" }}>Click to upload</span>
          </div>
        )}
        {uploading && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "#E8C547" }}>UPLOADING...</span>
          </div>
        )}
        {preview && !uploading && (
          <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.6)", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#F0EDE8" }}>
            Click to change
          </div>
        )}
      </div>
      {hint && <div style={{ fontSize: 11, opacity: 0.3, marginTop: 6, fontFamily: "'DM Mono', monospace" }}>{hint}</div>}
      {error && <div style={{ fontSize: 12, color: "#FF6B6B", marginTop: 6, fontFamily: "'DM Mono', monospace" }}>{error}</div>}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
    </div>
  );
}

// ─── COLOR SWATCHES ──────────────────────────────────────────────────────────

const PRESET_COLORS = [
  "#E8C547", "#FF5C3A", "#7EC8A4", "#4D9EFF", "#FF6B9D",
  "#A78BFA", "#34D399", "#FB923C", "#F0EDE8", "#E8E5DF",
];

function ColorPicker({ value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.4, letterSpacing: 1.5, marginBottom: 10 }}>ACCENT COLOR</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {PRESET_COLORS.map(c => (
          <button key={c} onClick={() => onChange(c)} style={{
            width: 32, height: 32, borderRadius: 8, background: c, border: "none", cursor: "pointer",
            outline: value === c ? `2px solid #F0EDE8` : "none",
            outlineOffset: 2,
          }} />
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          style={{ width: 40, height: 32, borderRadius: 6, border: "none", cursor: "pointer", background: "none", padding: 0 }} />
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", color: "#F0EDE8", fontSize: 14, fontFamily: "'DM Mono', monospace", width: 100, outline: "none" }} />
        <div style={{ width: 32, height: 32, borderRadius: 8, background: value }} />
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [selectedBiz, setSelectedBiz] = useState(Object.keys(BUSINESSES)[0]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  // Load business data
  useEffect(() => {
    const biz = BUSINESSES[selectedBiz];
    if (!LIVE) {
      setForm({
        name: biz.name,
        tagline: biz.tagline || "",
        accent: biz.accent || "#E8C547",
        logo_url: null,
        hero_image_url: null,
      });
      return;
    }

    supabase
      .from("businesses")
      .select("name, tagline, accent, logo_url, hero_image_url")
      .eq("id", selectedBiz)
      .single()
      .then(({ data }) => {
        if (data) setForm(data);
        else setForm({ name: biz.name, tagline: biz.tagline || "", accent: biz.accent, logo_url: null, hero_image_url: null });
      });
  }, [selectedBiz]);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    if (LIVE) {
      const { error: err } = await supabase
        .from("businesses")
        .update({
          name: form.name,
          tagline: form.tagline,
          accent: form.accent,
          logo_url: form.logo_url,
          hero_image_url: form.hero_image_url,
        })
        .eq("id", selectedBiz);

      if (err) { setError(err.message); setSaving(false); return; }
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputStyle = {
    width: "100%", background: "#141414", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8, padding: "12px 14px", color: "#F0EDE8", fontSize: 15,
    fontFamily: "'Syne', sans-serif", outline: "none", boxSizing: "border-box",
  };
  const labelStyle = { fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.4, letterSpacing: 1.5, display: "block", marginBottom: 8 };
  const sectionStyle = { background: "#141414", borderRadius: 14, padding: 24, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16 };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "#F0EDE8", fontFamily: "'Syne', sans-serif" }}>

      {/* Toast */}
      {saved && (
        <div style={{ position: "fixed", top: 16, right: 16, background: "#4CAF50", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, zIndex: 100, display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Mono', monospace" }}>
          <Icon name="check" size={14} color="#fff" /> Saved
        </div>
      )}

      {/* Top bar */}
      <div style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="scan" color="#E8C547" />
            <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.5 }}>QRS</span>
          </div>
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: 11, opacity: 0.3, fontFamily: "'DM Mono', monospace" }}>BUSINESS SETTINGS</span>
        </div>
        <Link to="/staff/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(240,237,232,0.4)", textDecoration: "none", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
          <Icon name="grid" size={15} color="rgba(240,237,232,0.4)" /> DASHBOARD
        </Link>
      </div>

      {/* Business tabs */}
      <div style={{ padding: "14px 24px", display: "flex", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {Object.values(BUSINESSES).map(b => (
          <button key={b.id} onClick={() => setSelectedBiz(b.id)} style={{
            background: selectedBiz === b.id ? `${b.accent}20` : "transparent",
            color: selectedBiz === b.id ? b.accent : "rgba(240,237,232,0.4)",
            border: `1px solid ${selectedBiz === b.id ? b.accent : "rgba(255,255,255,0.1)"}`,
            borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 700,
            fontFamily: "'DM Mono', monospace", cursor: "pointer",
          }}>
            {b.name}
          </button>
        ))}
      </div>

      {/* Form */}
      {form && (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 24px 100px" }}>

          {/* Basic info */}
          <div style={sectionStyle}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, opacity: 0.6, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>BASIC INFO</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>BUSINESS NAME</label>
                <input value={form.name} onChange={e => set("name", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>TAGLINE</label>
                <input value={form.tagline || ""} onChange={e => set("tagline", e.target.value)} placeholder="Short description shown on the scan page" style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Images */}
          <div style={sectionStyle}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, opacity: 0.6, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>IMAGES</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <ImageUpload
                label="LOGO"
                hint="Square image recommended. Max 5MB."
                currentUrl={form.logo_url}
                onUpload={url => set("logo_url", url)}
                folder={`${selectedBiz}/logo`}
              />
              <ImageUpload
                label="HERO IMAGE"
                hint="Wide image, shown at top of scan page."
                currentUrl={form.hero_image_url}
                onUpload={url => set("hero_image_url", url)}
                folder={`${selectedBiz}/hero`}
              />
            </div>
          </div>

          {/* Color */}
          <div style={sectionStyle}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, opacity: 0.6, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>BRAND COLOR</div>
            <ColorPicker value={form.accent || "#E8C547"} onChange={val => set("accent", val)} />
            <div style={{ marginTop: 16, background: "#0A0A0A", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: form.accent || "#E8C547" }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Preview</div>
                <div style={{ fontSize: 12, opacity: 0.4 }}>This color appears on buttons and highlights</div>
              </div>
            </div>
          </div>

          {error && (
            <div style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#FF6B6B", fontFamily: "'DM Mono', monospace" }}>
              {error}
            </div>
          )}
        </div>
      )}

      {/* Save bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "16px 24px", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={handleSave} disabled={saving || !form} style={{
          background: "#E8C547", color: "#0A0A0A", border: "none", borderRadius: 10,
          padding: "13px 32px", fontSize: 15, fontWeight: 800,
          fontFamily: "'Syne', sans-serif", cursor: saving ? "default" : "pointer",
          opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", gap: 8,
        }}>
          {saving ? "Saving..." : saved ? <><Icon name="check" size={16} color="#0A0A0A" /> Saved</> : "Save changes"}
        </button>
      </div>
    </div>
  );
}
