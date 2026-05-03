import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const ACCENT = "#E8C547";
const BG = "#080808";
const SURFACE = "#111";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#F0EDE8";
const MUTED = "#666";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase fires onAuthStateChange with SIGNED_IN when the recovery link is clicked
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!password) { setError("Enter a new password."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 40, width: 360, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
          <div style={{ fontWeight: 700, fontSize: 18, color: TEXT, marginBottom: 8 }}>Password updated</div>
          <div style={{ color: MUTED, fontSize: 13 }}>Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 40, width: 360 }}>
        <div style={{ fontWeight: 900, fontSize: 20, color: ACCENT, marginBottom: 6 }}>Reset Password</div>
        <div style={{ color: MUTED, fontSize: 13, marginBottom: 24 }}>Enter your new password below.</div>

        {!ready && (
          <div style={{ color: MUTED, fontSize: 13, marginBottom: 16 }}>Verifying your reset link...</div>
        )}

        {error && (
          <div style={{ background: "#1a0a0a", border: "1px solid #5a1a1a", color: "#ff6b6b", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", background: "#141414", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "12px", color: TEXT, boxSizing: "border-box", fontSize: 14 }}
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{ width: "100%", background: "#141414", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "12px", color: TEXT, boxSizing: "border-box", fontSize: 14 }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !ready}
          style={{ width: "100%", background: loading || !ready ? "#333" : ACCENT, color: BG, border: "none", borderRadius: 8, padding: "13px", fontWeight: 700, cursor: loading || !ready ? "not-allowed" : "pointer", fontSize: 15 }}
        >
          {loading ? "Updating..." : "Set New Password"}
        </button>
      </div>
    </div>
  );
}
