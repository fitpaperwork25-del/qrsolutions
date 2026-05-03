import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ACCENT = "#E8C547";
const BG = "#080808";
const SURFACE = "#111";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#F0EDE8";
const MUTED = "#666";

const SUPPORT_EMAIL = "fitpaperwork25@gmail.com";

const FAQS = [
  {
    category: "Login & Access",
    items: [
      { q: "I forgot my password and can't log in.", a: "Go to the login page and click 'Forgot Password'. You'll receive a reset link in your email. Check your spam folder if you don't see it within 2 minutes." },
      { q: "I signed up but can't access my dashboard.", a: "Make sure you confirmed your email address. Check your inbox for a confirmation email and click the link inside. If the issue persists, contact support." },
      { q: "I used the wrong email when signing up.", a: "Contact support with your business name and the correct email you'd like to use." },
    ],
  },
  {
    category: "Trial & Billing",
    items: [
      { q: "My trial expired. How do I keep access?", a: "Click 'Upgrade Now' on the expired screen or contact support to manually extend your trial while you complete your upgrade." },
      { q: "I paid but my account still shows trial or inactive.", a: "This usually resolves within 1-2 minutes. If it's been longer, contact support with your payment confirmation and we'll activate your account manually." },
      { q: "My payment was declined.", a: "Try a different card or contact your bank. Make sure your billing address matches your card on file." },
    ],
  },
  {
    category: "QR Codes",
    items: [
      { q: "My QR code isn't scanning.", a: "Make sure the QR code is printed clearly and not distorted. Try scanning with a different phone. Minimum recommended print size is 2x2 inches." },
      { q: "The scan page shows blank or an error.", a: "Your menu may be empty. Go to the Menu tab and add at least one item, then try scanning again." },
      { q: "The QR code is going to the wrong table.", a: "Each QR code is tied to a specific table. Re-download the QR code from the Tables tab and replace the printed one." },
    ],
  },
  {
    category: "Menu & Orders",
    items: [
      { q: "My menu items aren't showing on the scan page.", a: "Go to the Menu tab and confirm your items are saved. If items exist but still don't show, contact support." },
      { q: "A customer placed an order but I didn't see it.", a: "Go to the Orders tab and refresh. If you still don't see it, check that your table is correctly set up under the Tables tab." },
      { q: "Image upload isn't working.", a: "Make sure the image is under 5MB and in JPG or PNG format. Try a different browser if the issue continues." },
    ],
  },
  {
    category: "Setup",
    items: [
      { q: "How do I add tables?", a: "Go to the Tables tab, type a table name (e.g. 'Table 1') and click Add. A QR code is generated automatically." },
      { q: "My business name is showing blank or wrong.", a: "This is set during registration. Contact support to update your business name." },
      { q: "The dashboard is loading forever.", a: "Refresh the page. If it continues, try signing out and back in. If the issue persists, contact support." },
    ],
  },
];

export default function HelpPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const toggle = (key) => setOpen(open === key ? null : key);

  const openEmail = () => {
    const subject = encodeURIComponent("QRSolutions Support Request");
    const body = encodeURIComponent("Hi Support,\n\nBusiness Name: \nIssue:\n\n");
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: "sans-serif" }}>
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 20, color: ACCENT }}>Help & Support</div>
        <button onClick={() => navigate("/dashboard")} style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, color: MUTED, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>
          Back to Dashboard
        </button>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
        <div style={{ background: SURFACE, border: `1px solid ${ACCENT}`, borderRadius: 12, padding: 24, marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Can't find your answer?</div>
            <div style={{ color: MUTED, fontSize: 13 }}>Email us and we'll respond within 24 hours.</div>
          </div>
          <button onClick={openEmail} style={{ background: ACCENT, color: BG, border: "none", borderRadius: 8, padding: "12px 24px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            Contact Support
          </button>
        </div>

        {FAQS.map((section) => (
          <div key={section.category} style={{ marginBottom: 28 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              {section.category}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {section.items.map((item, i) => {
                const key = `${section.category}-${i}`;
                const isOpen = open === key;
                return (
                  <div key={key} style={{ background: SURFACE, border: `1px solid ${isOpen ? ACCENT : BORDER}`, borderRadius: 10, overflow: "hidden" }}>
                    <button onClick={() => toggle(key)} style={{ width: "100%", background: "none", border: "none", padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", color: TEXT, fontWeight: 600, fontSize: 14, textAlign: "left" }}>
                      <span>{item.q}</span>
                      <span style={{ color: ACCENT, fontSize: 20, marginLeft: 12, flexShrink: 0 }}>{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: "0 16px 14px", color: MUTED, fontSize: 13, lineHeight: 1.7 }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
