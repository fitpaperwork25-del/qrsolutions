import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan") || "pro"; // default to pro if none

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    businessName: "",
    businessType: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (authError) throw authError;

      const { error: dbError } = await supabase.from("businesses").insert({
        id: authData.user.id,
        name: form.businessName,
        type: form.businessType,
        email: form.email,
        plan: plan,
        status: "pending",
      });
      if (dbError) throw dbError;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
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

  const planLabel = { starter: "$19/mo", pro: "$49/mo", enterprise: "$99/mo" }[plan] || "";

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: 24, fontFamily: "sans-serif" }}>
      <h2>Register Your Business</h2>
      {plan && (
        <p style={{ background: "#f5f5f5", padding: "8px 12px", borderRadius: 6, marginBottom: 20, fontSize: 14 }}>
          Selected plan: <strong style={{ textTransform: "capitalize" }}>{plan}</strong> — {planLabel}
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {step === 1 && (
        <>
          <input name="businessName" placeholder="Business Name" value={form.businessName} onChange={handleChange} style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }} />
          <input name="businessType" placeholder="Business Type" value={form.businessType} onChange={handleChange} style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }} />
          <button onClick={() => setStep(2)} style={{ padding: "10px 20px" }}>Next</button>
        </>
      )}
      {step === 2 && (
        <>
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }} />
          <button onClick={handleSubmit} disabled={loading} style={{ padding: "10px 20px" }}>
            {loading ? "Processing..." : `Register & Pay ${planLabel}`}
          </button>
        </>
      )}
    </div>
  );
}
