import { useState } from "react";
import { Link } from "react-router-dom";
import { BUSINESSES, LOCATIONS } from "../lib/data";
import Icon from "../components/Icon";

function qrImageUrl(bizId, locationSlug) {
  const url = `${window.location.origin}/scan/${bizId}/${locationSlug}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}&bgcolor=141414&color=F0EDE8&margin=12`;
}

function scanUrl(bizId, locationSlug) {
  return `${window.location.origin}/scan/${bizId}/${locationSlug}`;
}

export default function QRGeneratorPage() {
  const [selectedBiz, setSelectedBiz] = useState("komo");
  const [copied, setCopied] = useState(null);
  const biz = BUSINESSES[selectedBiz];
  const locations = LOCATIONS[selectedBiz] || [];

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "#F0EDE8" }}>

      {/* Top bar */}
      <div style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="scan" size={18} color="#E8C547" />
            <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.5 }}>QRS</span>
          </div>
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: 11, opacity: 0.3, fontFamily: "'DM Mono', monospace" }}>QR GENERATOR</span>
        </div>
        <Link to="/staff/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(240,237,232,0.4)", textDecoration: "none", fontSize: 12, fontFamily: "'DM Mono', monospace" }}>
          <Icon name="grid" size={15} color="rgba(240,237,232,0.4)" /> DASHBOARD
        </Link>
      </div>

      <div style={{ padding: "28px 24px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, margin: "0 0 6px" }}>QR Codes</h2>
          <p style={{ opacity: 0.3, fontSize: 12, fontFamily: "'DM Mono', monospace" }}>One QR code per location. Print and place face-up.</p>
        </div>

        {/* Business tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {Object.values(BUSINESSES).map(b => (
            <button key={b.id} onClick={() => setSelectedBiz(b.id)} style={{ background: selectedBiz === b.id ? b.accent : "#141414", color: selectedBiz === b.id ? "#0A0A0A" : "rgba(240,237,232,0.5)", border: `1px solid ${selectedBiz === b.id ? b.accent : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono', monospace", cursor: "pointer", transition: "all 0.15s" }}>
              {b.name}
            </button>
          ))}
        </div>

        {/* QR grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {locations.map(loc => {
            const url = scanUrl(biz.id, loc.slug);
            return (
              <div key={loc.id} style={{ background: "#141414", borderRadius: 12, padding: 18, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{loc.label}</div>
                <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", opacity: 0.28, marginBottom: 14 }}>
                  /scan/{biz.id}/{loc.slug}
                </div>

                <div style={{ background: "#1A1A1A", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: 8, marginBottom: 12 }}>
                  <img
                    src={qrImageUrl(biz.id, loc.slug)}
                    alt={`QR — ${loc.label}`}
                    width={160} height={160}
                    style={{ display: "block", borderRadius: 4 }}
                    loading="lazy"
                  />
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => copyUrl(url)} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "8px 0", fontSize: 10, fontFamily: "'DM Mono', monospace", color: copied === url ? biz.accent : "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, transition: "color 0.2s" }}>
                    <Icon name="copy" size={12} color={copied === url ? biz.accent : "rgba(255,255,255,0.4)"} />
                    {copied === url ? "COPIED" : "COPY"}
                  </button>
                  <a href={qrImageUrl(biz.id, loc.slug)} download={`qr-${biz.id}-${loc.slug}.png`} style={{ flex: 1, background: biz.accent, borderRadius: 7, padding: "8px 0", fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 700, color: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, textDecoration: "none" }}>
                    <Icon name="download" size={12} color="#0A0A0A" />
                    DOWNLOAD
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* URL format reference */}
        <div style={{ marginTop: 32, background: "#141414", borderRadius: 12, padding: 20, border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", opacity: 0.3, letterSpacing: 2, marginBottom: 10 }}>SCAN URL FORMAT</div>
          <code style={{ fontSize: 13, color: biz.accent, fontFamily: "'DM Mono', monospace" }}>
            {window.location.origin}/scan/<span style={{ opacity: 0.45 }}>{"{business-id}"}</span>/<span style={{ opacity: 0.45 }}>{"{location-slug}"}</span>
          </code>
          <p style={{ fontSize: 11, opacity: 0.3, marginTop: 10, fontFamily: "'DM Mono', monospace", lineHeight: 1.8 }}>
            Add locations in src/lib/data.js → LOCATIONS.<br />
            In production, load from Supabase `locations` table.
          </p>
        </div>
      </div>
    </div>
  );
}
