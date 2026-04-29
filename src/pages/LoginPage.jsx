import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const QRIcon = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <rect x="2" y="2" width="30" height="30" rx="3" stroke="currentColor" strokeWidth="3" fill="none"/>
    <rect x="10" y="10" width="14" height="14" fill="currentColor"/>
    <rect x="48" y="2" width="30" height="30" rx="3" stroke="currentColor" strokeWidth="3" fill="none"/>
    <rect x="56" y="10" width="14" height="14" fill="currentColor"/>
    <rect x="2" y="48" width="30" height="30" rx="3" stroke="currentColor" strokeWidth="3" fill="none"/>
    <rect x="10" y="56" width="14" height="14" fill="currentColor"/>
    <rect x="48" y="48" width="8" height="8" fill="currentColor"/>
    <rect x="60" y="48" width="8" height="8" fill="currentColor"/>
    <rect x="72" y="48" width="8" height="8" fill="currentColor"/>
    <rect x="48" y="60" width="8" height="8" fill="currentColor"/>
    <rect x="60" y="60" width="8" height="8" fill="currentColor"/>
    <rect x="72" y="60" width="8" height="8" fill="currentColor"/>
    <rect x="48" y="72" width="8" height="8" fill="currentColor"/>
    <rect x="60" y="72" width="8" height="8" fill="currentColor"/>
    <rect x="72" y="72" width="8" height="8" fill="currentColor"/>
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate("/staff");
    }
  };

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", background: "#080808", color: "#F0EDE8", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .qrs-input { width: 100%; background: #111; border: 1px solid #2a2a2a; color: #F0EDE8; padding: 14px 16px; font-family: 'Syne', sans-serif; font-size: 15px; outline: none; transition: border-color 0.2s; }
        .qrs-input:focus { border-color: #E8C547; }
        .qrs-input::placeholder { color: #444; }
        .login-btn { width: 100%; background: #E8C547; color: #080808; border: none; padding: 16px; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; cursor: pointer; letter-spacing: 1px; transition: background 0.15s, transform 0.15s; clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%); }
        .login-btn:hover:not(:disabled) { background: #fff; transform: scale(1.02); }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 768px) { .login-btn { clip-path: none !important; } }
      `}</style>

      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 5%", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
          <div style={{ color: "#E8C547" }}><QRIcon size={32} /></div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: 2 }}>QRS</span>
        </div>
      </nav>

      {/* FORM */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 5%" }}>
        <div className="fade-up" style={{ width: "100%", maxWidth: 420 }}>

          <div style={{ marginBottom: 40 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 3, color: "#E8C547", marginBottom: 12 }}>STAFF LOGIN</div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, lineHeight: 1.0, letterSpacing: -1 }}>
              Welcome<br />back.
            </h1>
          </div>

          {error && (
            <div style={{ background: "#1a0a0a", border: "1px solid #5a1a1a", color: "#ff6b6b", padding: "12px 16px", marginBottom: 20, fontSize: 14 }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            <input
              className="qrs-input"
              name="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <input
              className="qrs-input"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <button className="login-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "LOGGING IN..." : "LOG IN →"}
          </button>

          <div style={{ marginTop: 24 }}>
            <button
              onClick={() => navigate("/register")}
              style={{ background: "none", border: "none", color: "#555", fontSize: 13, cursor: "pointer", fontFamily: "'Space Mono', monospace" }}
            >
              No account? Register →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}