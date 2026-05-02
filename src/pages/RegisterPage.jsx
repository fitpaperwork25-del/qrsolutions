import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function RegisterPage() {
  const [searchParams] = useSearchParams();

  const isTrial = searchParams.get("trial") === "true";
  const plan = isTrial ? "trial" : searchParams.get("plan") || "pro";

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
      // 1. Create user
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });

      if (authError) throw authError;

      // 2. Create business
      const { error: dbError } = await supabase.from("businesses").upsert({
        id: authData.user.id,
        name: form.businessName,
        type: form.businessType,
        email: form.email,
       
        plan: isTrial ? "trial" : plan,
        status: isTrial ? "trial" : "pending",
      }); 

      if (dbError) throw dbError;

      // 3. TRIAL FLOW (NO STRIPE)
      if (isTrial) {
        await supabase
          .from("businesses")
          .upsert({ plan: "starter", status: "trial" })
          trial_started_at: isTrial ? new Date().toISOString() : null,
trial_ends_at: isTrial ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null,
          .eq("id", authData.user.id);

        window.location.href = "/dashboard";
        return;
      }

      // 4. PAID FLOW (STRIPE)
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email: form.email,
            userId: authData.user.id,
            plan,
          }),
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

  const planLabel = {
    trial: "7-day free trial",
    starter: "$19/mo",
    pro: "$49/mo",
    enterprise: "$99/mo",
  }[plan] || "";

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: 24 }}>
      <h2>Register Your Business</h2>

      <p>
        Selected plan: <strong>{plan}</strong> — {planLabel}
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {step === 1 && (
        <>
          <input
            name="businessName"
            placeholder="Business Name"
            onChange={handleChange}
          />
          <input
            name="businessType"
            placeholder="Business Type"
            onChange={handleChange}
          />
          <button onClick={() => setStep(2)}>Next</button>
        </>
      )}

      {step === 2 && (
        <>
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <button onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Processing..."
              : isTrial
              ? "Start 7-Day Free Trial"
              : `Register & Pay ${planLabel}`}
          </button>
        </>
      )}
    </div>
  );
}