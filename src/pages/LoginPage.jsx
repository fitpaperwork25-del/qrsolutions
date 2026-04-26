import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/useAuth";
import Icon from "../components/Icon";

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err = await signIn(email, password);
    setLoading(false);
    if (err) { setError(err.message); return; }
    navigate("/staff/dashboard");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #E8C547, #FF5C3A, #7EC8A4)" }} />

      <div style={{ width: "100%", maxWidth: 380, animation: "fadeUp 0.4s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40 }}>
          <Icon name="scan" size={20} color="#E8C547" />
          <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "#E8C547", letterSpacing: 3 }}>QRS — STAFF</span>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, marginBottom: 8, color: "#F0EDE8" }}>Sign In</h1>
        <p style={{ fontSize: 14, opacity: 0.35, marginBottom: 36, fontFamily: "'DM Mono', monospace" }}>Staff access only</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.4, letterSpacing: 1.5, display: "block", marginBottom: 8 }}>EMAIL</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}><Icon name="mail" size={16} color="rgba(240,237,232,0.3)" /></div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@business.com"
                style={{ width: "100%", background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "14px 14px 14px 44px", color: "#F0EDE8", fontSize: 14, fontFamily: "'Syne', sans-serif", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.4, letterSpacing: 1.5, display: "block", marginBottom: 8 }}>PASSWORD</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}><Icon name="lock" size={16} color="rgba(240,237,232,0.3)" /></div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                style={{ width: "100%", background: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "14px 14px 14px 44px", color: "#F0EDE8", fontSize: 14, fontFamily: "'Syne', sans-serif", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {error && (
            <div style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.25)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#FF5C5C", fontFamily: "'DM Mono', monospace" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ background: "#E8C547", color: "#080808", border: "none", borderRadius: 10, padding: 18, fontSize: 15, fontWeight: 800, cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <Icon name="arrow" size={16} color="#080808" />}
          </button>
        </form>

        <p style={{ marginTop: 24, fontSize: 12, opacity: 0.25, fontFamily: "'DM Mono', monospace", textAlign: "center", lineHeight: 1.8 }}>
          Create staff accounts in Supabase Dashboard<br />→ Authentication → Users → Invite
        </p>
      </div>
    </div>
  );
}
