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

const checks = [
  "Restaurant menus (no more sticky laminated cards)",
  "Table ordering (guests scan, they order, you get paid)",
  "Business cards (your Altima deserves better than paper)",
  "Product info (what even IS this ingredient?)",
  "Event check-ins (no more clipboards, ever)",
  "Payment links (square them up, literally)",
];

const steps = [
  { num: "01", title: "Register", desc: "Sign up in 60 seconds. We timed it." },
  { num: "02", title: "Generate", desc: "Create QR codes for every table, product, or door." },
  { num: "03", title: "Print & Place", desc: "Stick 'em anywhere. Your car. Your menu. The moon." },
  { num: "04", title: "Collect", desc: "Customers scan. You win. It's that embarrassingly simple." },
];

export default function LandingPage() {
  const navigate = useNavigate();

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
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .float { animation: float 4s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .cta-btn {
          background: #E8C547;
          color: #080808;
          border: none;
          padding: 18px 48px;
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          cursor: pointer;
          letter-spacing: 1px;
          transition: transform 0.15s, background 0.15s;
          clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
        }
        .cta-btn:hover { background: #fff; transform: scale(1.04); }
        .nav-btn {
          background: transparent;
          color: #E8C547;
          border: 1.5px solid #E8C547;
          padding: 10px 28px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.5px;
        }
        .nav-btn:hover { background: #E8C547; color: #080808; }
        .check-item { display: flex; align-items: flex-start; gap: 14px; padding: 14px 0; border-bottom: 1px solid #1e1e1e; }
        .check-item:last-child { border-bottom: none; }
        .step-card {
          background: #111;
          border: 1px solid #2a2a2a;
          padding: 32px 28px;
          position: relative;
          transition: border-color 0.2s, transform 0.2s;
        }
        .step-card:hover { border-color: #E8C547; transform: translateY(-4px); }
        .marquee { white-space: nowrap; overflow: hidden; }
        .marquee-inner { display: inline-block; animation: marquee 18s linear infinite; }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}</style>

      {/* NAV */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 5%", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ color: "#E8C547" }}><QRIcon size={36} /></div>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: 2, color: "#F0EDE8" }}>QRS</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button className="nav-btn" onClick={() => navigate("/staff/login")}>Log In</button>
          <button className="cta-btn" style={{ padding: "10px 28px", fontSize: 15 }} onClick={() => navigate("/register")}>Start Free</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: "100px 5% 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", maxWidth: 1200, margin: "0 auto" }}>
        <div className="fade-up">
          <div style={{ display: "inline-block", background: "#E8C547", color: "#080808", fontSize: 11, fontWeight: 800, letterSpacing: 3, padding: "6px 16px", marginBottom: 28, fontFamily: "'Space Mono', monospace" }}>
            QR MANAGEMENT PLATFORM
          </div>
          <h1 style={{ fontSize: "clamp(52px, 6vw, 82px)", fontWeight: 800, lineHeight: 1.0, marginBottom: 28, letterSpacing: -2 }}>
            We<br />
            <span style={{ color: "#E8C547" }}>Square</span><br />
            You.
          </h1>
          <p style={{ fontSize: 20, color: "#888", lineHeight: 1.7, marginBottom: 40, maxWidth: 460, fontWeight: 400 }}>
            QR codes for your restaurant, business, event, or your Nissan Altima. 
            If it exists, we can put a square on it.
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
            <button className="cta-btn" onClick={() => navigate("/register")}>
              GET SQUARED → $49/mo
            </button>
            <span style={{ color: "#555", fontSize: 13, fontFamily: "'Space Mono', monospace" }}>No contracts. Cancel anytime.</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className="float">
          <div style={{ position: "relative" }}>
            <div style={{ color: "#E8C547", opacity: 0.15, position: "absolute", top: -40, left: -40 }}><QRIcon size={160} /></div>
            <div style={{ color: "#F0EDE8", position: "relative", zIndex: 1 }}><QRIcon size={220} /></div>
            <div style={{ color: "#E8C547", opacity: 0.15, position: "absolute", bottom: -40, right: -40 }}><QRIcon size={120} /></div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background: "#E8C547", padding: "14px 0", overflow: "hidden" }} className="marquee">
        <div className="marquee-inner">
          {Array(8).fill("WE SQUARE YOU ◆ QR FOR EVERYTHING ◆ SCAN. ORDER. PAY. ◆ DITCH THE LAMINATED MENU ◆ ").map((t, i) => (
            <span key={i} style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: "#080808", fontSize: 14, letterSpacing: 2, marginRight: 0 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* WHAT WE SQUARE */}
      <section style={{ padding: "100px 5%", maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <p style={{ color: "#E8C547", fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 3, marginBottom: 20 }}>WHAT WE SQUARE</p>
          <h2 style={{ fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
            Everything<br />gets a square.
          </h2>
          <p style={{ color: "#666", fontSize: 16, lineHeight: 1.8 }}>
            Seriously. If it has a surface, it gets a QR code. We're not joking about the Altima.
          </p>
        </div>
        <div>
          {checks.map((item, i) => (
            <div key={i} className="check-item">
              <div style={{ width: 22, height: 22, background: "#E8C547", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                <span style={{ color: "#080808", fontSize: 13, fontWeight: 800 }}>✓</span>
              </div>
              <span style={{ color: "#ccc", fontSize: 15, lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 5%", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ color: "#E8C547", fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 3, marginBottom: 20, textAlign: "center" }}>THE PROCESS</p>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, textAlign: "center", marginBottom: 60 }}>Four steps to getting squared.</h2>
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
      <section style={{ padding: "100px 5%", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <p style={{ color: "#E8C547", fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 3, marginBottom: 20 }}>PRICING</p>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, marginBottom: 16 }}>One price. No surprises.</h2>
        <p style={{ color: "#666", marginBottom: 50, fontSize: 16 }}>Unlike your last software vendor, we don't charge extra for breathing.</p>
        <div style={{ background: "#111", border: "2px solid #E8C547", padding: "48px 40px" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 64, fontWeight: 700, color: "#E8C547", lineHeight: 1 }}>$49</div>
          <div style={{ color: "#555", fontSize: 15, marginBottom: 32, fontFamily: "'Space Mono', monospace" }}>/ month</div>
          <div style={{ textAlign: "left", marginBottom: 40 }}>
            {["Unlimited QR codes", "All locations, all tables", "Staff dashboard", "Menu management", "Real-time updates", "Cancel anytime (but why would you)"].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #1a1a1a", alignItems: "center" }}>
                <span style={{ color: "#E8C547", fontWeight: 800 }}>→</span>
                <span style={{ color: "#ccc", fontSize: 15 }}>{f}</span>
              </div>
            ))}
          </div>
          <button className="cta-btn" style={{ width: "100%", textAlign: "center" }} onClick={() => navigate("/register")}>
            GET SQUARED NOW
          </button>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: "#E8C547", padding: "80px 5%", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 800, color: "#080808", marginBottom: 16, lineHeight: 1.1 }}>
          Your menu is embarrassing.<br />Let's fix that.
        </h2>
        <p style={{ color: "#3a3a1a", fontSize: 18, marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
          Join businesses who stopped handing out sticky laminated cards and started printing squares.
        </p>
        <button className="cta-btn" style={{ background: "#080808", color: "#E8C547" }} onClick={() => navigate("/register")}>
          START FOR $49/MONTH →
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 5%", borderTop: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ color: "#E8C547" }}><QRIcon size={28} /></div>
          <span style={{ fontWeight: 800, letterSpacing: 2, fontSize: 16 }}>QRS</span>
        </div>
        <p style={{ color: "#444", fontSize: 13, fontFamily: "'Space Mono', monospace" }}>© 2026 QRSolutions. We square you.</p>
        <div style={{ display: "flex", gap: 24 }}>
          <button onClick={() => navigate("/register")} style={{ background: "none", border: "none", color: "#666", fontSize: 13, cursor: "pointer", fontFamily: "'Space Mono', monospace" }}>Register</button>
          <button onClick={() => navigate("/staff/login")} style={{ background: "none", border: "none", color: "#666", fontSize: 13, cursor: "pointer", fontFamily: "'Space Mono', monospace" }}>Login</button>
        </div>
      </footer>
    </div>
  );
}
