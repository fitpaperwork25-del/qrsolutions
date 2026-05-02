import { useNavigate } from "react-router-dom";

const QRIcon = ({ size = 80 }) => (
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

const tiers = [
  {
    name: "Starter",
    price: "$19",
    desc: "Get your foot in the door. One location, one square.",
    color: "#888",
    border: "#2a2a2a",
    features: ["1 location","Unlimited QR codes","Digital menu display","Real-time menu updates","Basic analytics","Email support"],
    cta: "Start Squaring",
    plan: "starter",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    desc: "For businesses serious about getting squared.",
    color: "#E8C547",
    border: "#E8C547",
    features: ["Up to 5 locations","Everything in Starter","Table booking system","Customer ordering","Blocked dates management","Staff dashboard","Priority email support"],
    cta: "Go Pro",
    plan: "pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    desc: "For chains, franchises, and people with ambition.",
    color: "#F0EDE8",
    border: "#444",
    features: ["Unlimited locations","Everything in Pro","White label / custom branding","Advanced analytics","Custom domain support","Dedicated support","Early access to new features"],
    cta: "Go Enterprise",
    plan: "enterprise",
    popular: false,
  },
];

const steps = [
  { num: "01", title: "Register", desc: "Sign up in 60 seconds. We timed it." },
  { num: "02", title: "Generate", desc: "Create QR codes for every table, product, or door." },
  { num: "03", title: "Print & Place", desc: "Stick them anywhere. Your car. Your menu. The moon." },
  { num: "04", title: "Collect", desc: "Customers scan. You win. It is that embarrassingly simple." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const handlePlan = (plan) => navigate(`/register?plan=${plan}`);

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", background: "#080808", color: "#F0EDE8", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .float { animation: float 4s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .marquee-inner { display: inline-block; animation: marquee 18s linear infinite; white-space: nowrap; }
        .cta-btn { background: #E8C547; color: #080808; border: none; padding: 18px 48px; font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; cursor: pointer; letter-spacing: 1px; transition: transform 0.15s, background 0.15s; clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%); }
        .cta-btn:hover { background: #fff; transform: scale(1.04); }
        .nav-btn { background: transparent; color: #E8C547; border: 1.5px solid #E8C547; padding: 10px 28px; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.15s; }
        .nav-btn:hover { background: #E8C547; color: #080808; }
        .tier-card { background: #111; padding: 40px 32px; display: flex; flex-direction: column; transition: transform 0.2s; position: relative; }
        .tier-card:hover { transform: translateY(-6px); }
        .tier-btn { width: 100%; padding: 16px; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; cursor: pointer; border: none; letter-spacing: 1px; transition: all 0.15s; margin-top: 24px; clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%); }
        .step-card { background: #111; border: 1px solid #2a2a2a; padding: 32px 28px; transition: border-color 0.2s, transform 0.2s; }
        .step-card:hover { border-color: #E8C547; transform: translateY(-4px); }
        @media (max-width: 768px) {
          .hero-section { grid-template-columns: 1fr !important; padding: 60px 6% 40px !important; }
          .hero-qr { display: none !important; }
          .cta-btn { clip-path: none !important; padding: 16px 24px !important; font-size: 15px !important; width: 100% !important; }
          .cta-btn-nav { width: auto !important; padding: 10px 16px !important; font-size: 13px !important; }
          .tier-btn { clip-path: none !important; }
          .nav-btn { padding: 8px 14px !important; font-size: 13px !important; }
          .footer-row { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 5%", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ color: "#E8C547" }}><QRIcon size={36} /></div>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: 2 }}>QRS</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="nav-btn" onClick={() => navigate("/login")}>Log In</button>
          <button className="cta-btn cta-btn-nav" style={{ padding: "10px 20px", fontSize: 14 }} onClick={() => navigate("/register?trial=true")}>Start Free</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section" style={{ padding: "100px 5% 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", maxWidth: 1200, margin: "0 auto" }}>
        <div className="fade-up">
          <div style={{ display: "inline-block", background: "#E8C547", color: "#080808", fontSize: 11, fontWeight: 800, letterSpacing: 3, padding: "6px 16px", marginBottom: 28, fontFamily: "'Space Mono', monospace" }}>QR MANAGEMENT PLATFORM</div>
          <h1 style={{ fontSize: "clamp(48px, 6vw, 82px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 28, letterSpacing: -2 }}>
            We<br /><span style={{ color: "#E8C547" }}>Square</span><br />You.
          </h1>
          <p style={{ fontSize: 18, color: "#888", lineHeight: 1.7, marginBottom: 40, maxWidth: 460 }}>
            QR codes for your restaurant, business, event, or your Nissan Altima. If it exists, we can put a square on it.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <button className="cta-btn" onClick={() => handlePlan("pro")}>GET SQUARED — FROM $19/MO</button>
            <span style={{ color: "#555", fontSize: 13, fontFamily: "'Space Mono', monospace" }}>No contracts. Cancel anytime.</span>
          </div>
        </div>
        <div className="hero-qr float" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <div style={{ color: "#E8C547", opacity: 0.15, position: "absolute", top: -40, left: -40 }}><QRIcon size={160} /></div>
            <div style={{ color: "#F0EDE8", position: "relative", zIndex: 1 }}><QRIcon size={220} /></div>
            <div style={{ color: "#E8C547", opacity: 0.15, position: "absolute", bottom: -40, right: -40 }}><QRIcon size={120} /></div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background: "#E8C547", padding: "14px 0", overflow: "hidden" }}>
        <div className="marquee-inner">
          {Array(8).fill("WE SQUARE YOU ◆ QR FOR EVERYTHING ◆ SCAN. ORDER. PAY. ◆ DITCH THE LAMINATED MENU ◆ ").map((t, i) => (
            <span key={i} style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: "#080808", fontSize: 14, letterSpacing: 2 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 5%", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ color: "#E8C547", fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 3, marginBottom: 20, textAlign: "center" }}>THE PROCESS</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, textAlign: "center", marginBottom: 60 }}>Four steps to getting squared.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {steps.map((s) => (
              <div key={s.num} className="step-card">
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 36, fontWeight: 700, color: "#E8C547", opacity: 0.3, marginBottom: 16 }}>{s.num}</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: "#666", fontSize: 15, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "80px 5%", maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ color: "#E8C547", fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 3, marginBottom: 20, textAlign: "center" }}>PRICING</p>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, textAlign: "center", marginBottom: 16 }}>Pick your square.</h2>
        <p style={{ color: "#666", textAlign: "center", marginBottom: 60, fontSize: 16 }}>No hidden fees. No surprise bills. Just squares.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {tiers.map((tier) => (
            <div key={tier.name} className="tier-card" style={{ border: `2px solid ${tier.border}` }}>
              {tier.popular && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#E8C547", color: "#080808", fontSize: 11, fontWeight: 800, letterSpacing: 2, padding: "4px 16px", fontFamily: "'Space Mono', monospace", whiteSpace: "nowrap" }}>MOST POPULAR</div>
              )}
              <p style={{ color: "#555", fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 2, marginBottom: 12 }}>{tier.name.toUpperCase()}</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 56, fontWeight: 800, color: tier.color, fontFamily: "'Space Mono', monospace", lineHeight: 1 }}>{tier.price}</span>
                <span style={{ color: "#555", fontSize: 15 }}>/month</span>
              </div>
              <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>{tier.desc}</p>
              <div style={{ flex: 1 }}>
                {tier.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #1a1a1a", alignItems: "center" }}>
                    <span style={{ color: tier.popular ? "#E8C547" : "#444", fontWeight: 800, fontSize: 14 }}>→</span>
                    <span style={{ color: "#ccc", fontSize: 14 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                className="tier-btn"
                style={{ background: tier.popular ? "#E8C547" : "transparent", color: tier.popular ? "#080808" : tier.color, border: tier.popular ? "none" : `1.5px solid ${tier.border}` }}
                onClick={() => handlePlan(tier.plan)}
              >{tier.cta} →</button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: "#E8C547", padding: "80px 5%", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(28px, 5vw, 64px)", fontWeight: 800, color: "#080808", marginBottom: 16, lineHeight: 1.1 }}>
          Your menu is embarrassing.<br />Let us fix that.
        </h2>
        <p style={{ color: "#3a3a1a", fontSize: 18, maxWidth: 500, margin: "0 auto 40px" }}>
          Join businesses who stopped handing out sticky laminated cards.
        </p>
        <button className="cta-btn" style={{ background: "#080808", color: "#E8C547" }} onClick={() => handlePlan("pro")}>START FROM $19/MONTH →</button>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 5%", borderTop: "1px solid #1a1a1a" }}>
        <div className="footer-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ color: "#E8C547" }}><QRIcon size={28} /></div>
            <span style={{ fontWeight: 800, letterSpacing: 2, fontSize: 16 }}>QRS</span>
          </div>
          <p style={{ color: "#444", fontSize: 13, fontFamily: "'Space Mono', monospace" }}>© 2026 QRSolutions. We square you.</p>
          <div style={{ display: "flex", gap: 24 }}>
            <button onClick={() => navigate("/register")} style={{ background: "none", border: "none", color: "#666", fontSize: 13, cursor: "pointer", fontFamily: "'Space Mono', monospace" }}>Register</button>
            <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", color: "#666", fontSize: 13, cursor: "pointer", fontFamily: "'Space Mono', monospace" }}>Login</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
