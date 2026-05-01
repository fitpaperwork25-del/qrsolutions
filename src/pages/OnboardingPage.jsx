import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/useAuth";

const ACCENT = "#E8C547";
const BG = "#080808";
const SURFACE = "#111";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#F0EDE8";
const MUTED = "#666";

const inputStyle = {
  width: "100%", background: "#141414",
  border: `1px solid ${BORDER}`, borderRadius: 8,
  padding: "12px", color: TEXT, boxSizing: "border-box",
  fontSize: 15,
};

const BUSINESS_TYPES = ["Restaurant", "Cafe", "Bar", "Food Truck", "Bakery", "Other"];

export default function OnboardingPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    type: "",
    phone: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [heroFile, setHeroFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleHero = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setHeroFile(file);
    setHeroPreview(URL.createObjectURL(file));
  };

  const uploadFile = async (file, path) => {
    const { error } = await supabase.storage.from("service-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("service-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.type) {
      setError("Business name and type are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const userId = session.user.id;
      let logo_url = null;
      let hero_image_url = null;

      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        logo_url = await uploadFile(logoFile, `logos/${userId}/logo.${ext}`);
      }
      if (heroFile) {
        const ext = heroFile.name.split(".").pop();
        hero_image_url = await uploadFile(heroFile, `heroes/${userId}/hero.${ext}`);
      }

      const { error: dbError } = await supabase
        .from("businesses")
        .update({
          name: form.name,
          type: form.type,
          phone: form.phone,
          logo_url,
          hero_image_url,
          status: "active",
        })
        .eq("id", userId);

      if (dbError) throw dbError;
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: "sans-serif", padding: "40px 24px" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ color: ACCENT, fontWeight: 900, fontSize: 22, marginBottom: 8 }}>Set up your business</div>
          <div style={{ color: MUTED, fontSize: 14 }}>This takes 2 minutes. You can update everything later.</div>
        </div>

        {error && <div style={{ color: "red", marginBottom: 16, fontSize: 14 }}>{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ color: MUTED, fontSize: 12, marginBottom: 6 }}>Business Name *</div>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Red Sea Bar" style={inputStyle} />
          </div>

          <div>
            <div style={{ color: MUTED, fontSize: 12, marginBottom: 6 }}>Business Type *</div>
            <select name="type" value={form.type} onChange={handleChange} style={{ ...inputStyle, appearance: "none" }}>
              <option value="">Select type...</option>
              {BUSINESS_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
            </select>
          </div>

          <div>
            <div style={{ color: MUTED, fontSize: 12, marginBottom: 6 }}>Phone Number</div>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 6122830200" style={inputStyle} />
          </div>

          <div>
            <div style={{ color: MUTED, fontSize: 12, marginBottom: 6 }}>Logo</div>
            <input type="file" accept="image/*" onChange={handleLogo} style={{ color: TEXT }} />
            {logoPreview && <img src={logoPreview} alt="logo" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, marginTop: 8 }} />}
          </div>

          <div>
            <div style={{ color: MUTED, fontSize: 12, marginBottom: 6 }}>Hero / Cover Photo</div>
            <input type="file" accept="image/*" onChange={handleHero} style={{ color: TEXT }} />
            {heroPreview && <img src={heroPreview} alt="hero" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8, marginTop: 8 }} />}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ background: ACCENT, color: BG, border: "none", borderRadius: 8, padding: "14px", fontWeight: 900, fontSize: 16, cursor: "pointer", marginTop: 8 }}
          >
            {loading ? "Saving..." : "Complete Setup →"}
          </button>
        </div>
      </div>
    </div>
  );
}