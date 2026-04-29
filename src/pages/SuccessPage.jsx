import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const QRIcon = ({ size = 40 }) => (
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

const steps = [
  {
    num: "01",
    title: "Log in to your dashboard",
    desc: "Use the email and password you just registered with.",
    action: "Go to Dashboard",
    link: "/staff/login",
  },
  {
    num: "02",
    title: "Set up your first location",
    desc: "Add your business name, address, and details.",
    action: null,
    link: null,
  },
  {
    num: "03",
    title: "Generate your first QR code",
    desc: "Print it, stick it anywhere, and start collecting.",
    action: null,
    link: null,
  },
];

export default function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [visible, setVisible] = useState(false);

  const plan = searchParams.get("plan") || "starter";
  const planLabel = { starter: "Starter", pro: "Pro", enterprise: "Enterprise" }[plan] || "Starter";
  const planPrice = { starter: "$19/mo", pro: "$49/mo", enterprise: "$99/mo" }[plan] || "$19/mo";

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div style={{
      fontFamily: "'Syne', sans-serif",
      background: "#080808",
      color: "#F0EDE8",
      minHeight: "100vh",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        @keyframes checkDraw { from{stroke-dashoffset:100} to{stroke-dashoffset:0} }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.6s ease 0.1s both; }
        .fade-up-2 { animation: fadeUp 0.6s ease 0.25s both; }
        .fade-up-3 { animation: fadeUp 0.6s ease 0.4s both; }
        .fade-up-4 { animation: fadeUp 0.6s ease 0.55s both; }
        .step-card { background: #111; border: 1px solid #2a2a2a; padding: 28px; transition: border-color 0.2s; }
        .step-card:hover { border-color: #E8C547; }
        .dash-btn { background: #E8C547; color: #080808; border: none; padding: 16px 40px; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; cursor: pointer; letter-spacing: 1px; transition: background 0.15s, transform 0.15s; clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%); }
        .dash-btn:hover { background: #fff; transform: scale(1.03); }
        @media (max-width: 768px) {
          .dash-btn { clip-path: none !important; width: 100% !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 5%", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
          <div style={{ color: "#E8C547" }}><QRIcon size={32} /></div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: 2 }}>QRS</span>
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 5%" }}>

        {/* CHECK MARK */}
        <div className="fade-up" style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "#E8C547", display: "inline-flex",
            alignItems: "center", justifyContent: "center",
            animation: "pulse 2s ease-in-out infinite",
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <polyline
                points="6,18 14,26 30,10"
                stroke="#080808" strokeWidth="3.5"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="100" strokeDashoffset="0"
                style={{ animation: "checkDraw 0.5s ease 0.3s both" }}
              />
            </svg>
          </div>
        </div>

        {/* HEADING */}
        <div className="fade-up-1" style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 3, color: "#E8C547", marginBottom: 16 }}>PAYMENT CONFIRMED</div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 800, lineHeight: 1.0, letterSpacing: -2 }}>
            You're <span style={{ color: "#E8C547" }}>squared</span> in.
          </h1>
        </div>

        {/* PLAN BADGE */}
        <div className="fade-up-2" style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{
            display: "inline-block",
            background: "#111", border: "1px solid #E8C547",
            padding: "10px 28px", marginTop: 20,
          }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#E8C547", letterSpacing: 2 }}>
              {planLabel.toUpperCase()} PLAN — {planPrice}
            </span>
          </div>
          <p style={{ color: "#666", fontSize: 15, marginTop: 16, lineHeight: 1.7 }}>
            Your subscription is active. Check your email for a confirmation.
          </p>
        </div>

        {/* STEPS */}
        <div className="fade-up-3" style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 3, color: "#555", marginBottom: 20 }}>WHAT'S NEXT</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {steps.map((s) => (
              <div key={s.num} className="step-card">
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 22, fontWeight: 700, color: "#E8C547", opacity: 0.4, minWidth: 36 }}>{s.num}</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>{s.title}</h3>
                    <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                  {s.action && (
                    <button
                      onClick={() => navigate(s.link)}
                      style={{ background: "transparent", border: "1px solid #E8C547", color: "#E8C547", padding: "8px 20px", fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                    >{s.action} →</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="fade-up-4" style={{ textAlign: "center" }}>
          <button className="dash-btn" onClick={() => navigate("/staff/login")}>
            GO TO DASHBOARD →
          </button>
          <p style={{ color: "#444", fontSize: 13, fontFamily: "'Space Mono', monospace", marginTop: 20 }}>
            Questions? fitpaperwork25@gmail.com
          </p>
        </div>

      </div>
    </div>
  );
}