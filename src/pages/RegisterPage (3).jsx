import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

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
  fontSize: 14, marginBottom: 10, outline: "none",
};

const DISCLAIMERS = {
  terms: {
    title: "Terms of Service",
    body: `By registering, you agree to use QRSolutions only for lawful business purposes. You are responsible for all activity under your account. QRSolutions reserves the right to suspend or terminate accounts that violate these terms. We may update these terms at any time with notice via email.`,
  },
  privacy: {
    title: "Privacy Policy",
    body: `We collect your business name, email, and usage data to provide and improve our service. We do not sell your data to third parties. Your data is stored securely via Supabase. You may request deletion of your account and data at any time by contacting fitpaperwork25@gmail.com.`,
  },
  billing: {
    title: "Billing Terms",
    body: `Paid plans are billed monthly. Payments are processed securely via Stripe. All sales are final — we do not offer refunds for partial months. You may cancel at any time and your access will continue until the end of the billing period. Prices are subject to change with 30 days notice.`,
  },
  trial: {
    title: "Trial Terms",
    body: `Your 7-day free trial begins immediately upon registration. No credit card is required to start. At the end of the trial, your account will be locked until you upgrade to a paid plan. Trial accounts are limited to one per business. Abuse of the trial system may result in account termination.`,
  },
};

function DisclaimerModal({ type, onClose }) {
  const d = DISCLAIMERS[type];
  if (!d) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 32, maxWidth: 480, width: "100%" }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: ACCENT, marginBottom: 16 }}>{d.title}</div>
        <div style={{ color: MUTED, fontSize: 13, lineHeight: 1.8, marginBottom: 24 }}>{d.body}</div>
        <button onClick={onClose} style={{ background: ACCENT, color: BG, border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isTrial = searchParams.get("trial") === "true";
  const plan = isTrial ? "trial" : searchParams.get("plan") || "pro";

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ businessName: "", businessType: "", email: "", password: "" });
  const [agreed, setAgreed] = useState(false);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!agreed) { setError("You must agree to the terms before continuing."); return; }
    setLoading(true);
    setError("");

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (authError) throw authError;

      const { error: dbError } = await supabase.from("businesses").upsert({
        id: authData.user.id,
        name: form.businessName,
        type: form.businessType,
        email: form.email,
        plan: isTrial ? "trial" : plan,
        status: isTrial ? "trial" : "pending",
        trial_started_at: isTrial ? new Date().toISOString() : null,
        trial_ends_at: isTrial ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null,
      });
      if (dbError) throw dbError;

      if (isTrial) { navigate("/dashboard"); return; }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
          body: JSON.stringify({ email: form.email, userId: authData.user.id, plan }),
        }
      );
      const data = await response.json();
      if (!data.url) throw new Error("No checkout URL returned");
      window.location.href = data.url;

    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const planLabel = { trial: "7-day free trial", starter: "$19/mo", pro: "$49/mo", enterprise: "$99/mo" }[plan] || "";

  const link = (type, label) => (
    <span onClick={() => setModal(type)} style={{ color: ACCENT, cursor: "pointer", textDecoration: "underline" }}>{label}</span>
  );

  return (
    <div style={{ background: BG, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: 24 }}>
      {modal && <DisclaimerModal type={modal} onClose={() => setModal(null)} />}

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 36, width: "100%", maxWidth: 420 }}>
        <div style={{ fontWeight: 900, fontSize: 22, color: ACCENT, marginBottom: 4 }}>Register Your Business</div>
        <div style={{ color: MUTED, fontSize: 13, marginBottom: 24 }}>
          Plan: <strong style={{ color: TEXT }}>{plan}</strong> — {planLabel}
        </div>

        {error && (
          <div style={{ background: "#1a0a0a", border: "1px solid #5a1a1a", color: "#ff6b6b", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
            {error}
          </div>
        )}

        {step === 1 && (
          <>
            <input style={inputStyle} name="businessName" placeholder="Business Name" onChange={handleChange} value={form.businessName} />
            <input style={inputStyle} name="businessType" placeholder="Business Type (e.g. Restaurant, Café)" onChange={handleChange} value={form.businessType} />
            <button
              onClick={() => { if (!form.businessName.trim() || !form.businessType.trim()) { setError("Please fill in all fields."); return; } setError(""); setStep(2); }}
              style={{ width: "100%", background: ACCENT, color: BG, border: "none", borderRadius: 8, padding: "13px", fontWeight: 700, cursor: "pointer", fontSize: 15 }}
            >
              Next →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input style={inputStyle} name="email" type="email" placeholder="Email address" onChange={handleChange} value={form.email} />
            <input style={inputStyle} name="password" type="password" placeholder="Password (min 6 characters)" onChange={handleChange} value={form.password} />

            {/* DISCLAIMERS */}
            <div style={{ background: "#0a0a0a", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Before you continue</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: MUTED }}>
                {isTrial && (
                  <div>— Your {link("trial", "7-day free trial")} starts immediately. No credit card required. Account locks after trial ends.</div>
                )}
                {!isTrial && (
                  <div>— {link("billing", "Billing terms")}: charged monthly via Stripe. No refunds for partial months.</div>
                )}
                <div>— By registering you agree to our {link("terms", "Terms of Service")} and {link("privacy", "Privacy Policy")}.</div>
                <div>— We do not sell your data. See our {link("privacy", "Privacy Policy")} for details.</div>
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 20 }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: 2, accentColor: ACCENT, width: 16, height: 16, flexShrink: 0 }}
              />
              <span style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
                I have read and agree to the {link("terms", "Terms of Service")}, {link("privacy", "Privacy Policy")},
                {isTrial ? <> and {link("trial", "Trial Terms")}</> : <> and {link("billing", "Billing Terms")}</>}.
              </span>
            </label>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: "100%", background: loading ? "#333" : ACCENT, color: BG, border: "none", borderRadius: 8, padding: "13px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontSize: 15, marginBottom: 12 }}
            >
              {loading ? "Processing..." : isTrial ? "Start 7-Day Free Trial" : `Register & Pay ${planLabel}`}
            </button>

            <button onClick={() => { setStep(1); setError(""); }} style={{ width: "100%", background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px", color: MUTED, cursor: "pointer", fontSize: 13 }}>
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
