import { useState } from "react";
import { useParams } from "react-router-dom";
import { LOCATIONS } from "../lib/data";
import { useBusiness } from "../lib/useBusiness";
import { useServices } from "../lib/useServices";
import { useOrders } from "../lib/useOrders";
import Icon from "../components/Icon";

// ─── LANDING ─────────────────────────────────────────────────────────────────

function Landing({ biz, location, onNavigate }) {
  return (
    <div style={{ minHeight: "100vh", background: biz.bg, color: biz.text_color, display: "flex", flexDirection: "column", position: "relative" }}>
      {biz.hero_image_url ? (
        <div style={{ position: "relative", height: "55vw", maxHeight: 320, minHeight: 200, overflow: "hidden" }}>
          <img src={biz.hero_image_url} alt={biz.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "right center", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.75) 100%)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: biz.accent }} />
          <div style={{ position: "absolute", top: 16, left: 16, right: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            {biz.logo_url ? (
              <div style={{ width: 72, height: 72 }}>
                <img src={biz.logo_url} alt="logo" style={{ width: 72, height: 72, objectFit: "contain", background: "white", borderRadius: 8, padding: 4 }} />
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="scan" size={14} color={biz.accent} />
                <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: biz.accent, letterSpacing: 2 }}>QRS</span>
              </div>
            )}
            <button onClick={() => onNavigate("assist")} style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", gap: 6, backdropFilter: "blur(4px)" }}>
              <Icon name="help" size={13} color="#fff" /> Help
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: biz.accent, opacity: 0.07, filter: "blur(60px)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: biz.accent }} />
          <div style={{ padding: "24px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {biz.logo_url ? (
              <img src={biz.logo_url} alt="logo" style={{ height: 32, objectFit: "contain" }} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="scan" size={14} color={biz.accent} />
                <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: biz.accent, letterSpacing: 2 }}>QRS — {biz.type.toUpperCase()}</span>
              </div>
            )}
            <button onClick={() => onNavigate("assist")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: biz.text_color, borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontFamily: "'DM Mono', monospace", display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="help" size={13} color={biz.text_color} /> Help
            </button>
          </div>
        </>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "32px 24px 32px", animation: "fadeUp 0.45s ease both" }}>
        {location && (
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: biz.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>
            SCAN / {location.label.toUpperCase()}
          </div>
        )}
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px", lineHeight: 1.15, letterSpacing: 0, textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{biz.name}</h1>
        <p style={{ fontSize: 15, opacity: 0.5, margin: "0 0 28px" }}>{biz.tagline}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={() => onNavigate("browse")} style={{ background: biz.accent, color: biz.bg, border: "none", borderRadius: 8, padding: "18px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {biz.mode === "book" ? "Book Appointment" : "Order Now"}
            <Icon name="arrow" size={18} color={biz.bg} />
          </button>
          <button onClick={() => onNavigate("assist")} style={{ background: "transparent", color: biz.text_color, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "16px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name="help" size={16} color="rgba(255,255,255,0.3)" />Request Assistance</span>
            <Icon name="arrow" size={16} color="rgba(255,255,255,0.3)" />
          </button>
        </div>
      </div>

      <div style={{ padding: "16px 24px 40px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4CAF50", boxShadow: "0 0 6px #4CAF50" }} />
        <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.3, letterSpacing: 1 }}>LIVE — NO ACCOUNT NEEDED</span>
      </div>
    </div>
  );
}

// ─── BROWSE ──────────────────────────────────────────────────────────────────

function Browse({ biz, services, cart, onAdd, onBack, onNavigate }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const categories = biz.mode === "order" ? ["all", ...new Set(services.map(s => s.category).filter(Boolean))] : ["all"];
  const filtered = activeCategory === "all" ? services : services.filter(s => s.category === activeCategory);
  const cartTotal = Object.values(cart).reduce((a, { item, qty }) => a + item.price * qty, 0);
  const cartCount = Object.values(cart).reduce((a, { qty }) => a + qty, 0);

  return (
    <div style={{ minHeight: "100vh", background: biz.bg, color: biz.text_color, paddingBottom: cartCount > 0 ? 100 : 0 }}>
      <div style={{ position: "sticky", top: 0, background: biz.bg, zIndex: 10, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", color: biz.text_color, padding: 0, display: "flex" }}><Icon name="back" size={22} color={biz.text_color} /></button>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{biz.mode === "book" ? "Services" : "Menu"}</h2>
        </div>
        {categories.length > 1 && (
          <div style={{ display: "flex", gap: 8, padding: "14px 20px", overflowX: "auto" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background: activeCategory === cat ? biz.accent : "transparent", color: activeCategory === cat ? biz.bg : biz.text_color, border: `1px solid ${activeCategory === cat ? biz.accent : "rgba(255,255,255,0.15)"}`, borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 600, fontFamily: "'DM Mono', monospace", cursor: "pointer", whiteSpace: "nowrap", textTransform: "capitalize" }}>{cat}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "16px 20px" }}>
        {filtered.map(item => {
          const inCart = cart[item.id];
          return (
            <div key={item.id} style={{ background: biz.surface, borderRadius: 12, marginBottom: 10, overflow: "hidden", border: inCart ? `1px solid ${biz.accent}40` : "1px solid transparent" }}>
              {item.image_url && (
                <img src={item.image_url} alt={item.name} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
              )}
              <div style={{ padding: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>{item.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.45, marginBottom: 7 }}>{item.description}</div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: biz.accent }}>${item.price}</span>
                    {item.duration_min && <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.35 }}>{item.duration_min} MIN</span>}
                  </div>
                </div>
                <div style={{ marginLeft: 16 }}>
                  {inCart ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => onAdd(item, -1)} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "none", color: biz.text_color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="minus" size={14} color={biz.text_color} /></button>
                      <span style={{ fontSize: 15, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{inCart.qty}</span>
                      <button onClick={() => onAdd(item, 1)} style={{ width: 32, height: 32, borderRadius: 8, background: biz.accent, border: "none", color: biz.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="plus" size={14} color={biz.bg} /></button>
                    </div>
                  ) : (
                    <button onClick={() => onAdd(item, 1)} style={{ width: 36, height: 36, borderRadius: 8, background: biz.accent, border: "none", color: biz.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="plus" size={18} color={biz.bg} /></button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {cartCount > 0 && (
        <div style={{ position: "fixed", bottom: 24, left: 20, right: 20, zIndex: 20 }}>
          <button
            onClick={() => onNavigate(biz.mode === "book" ? "booking" : "checkout")}
            style={{ width: "100%", background: biz.accent, color: biz.bg, border: "none", borderRadius: 12, padding: "18px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <span style={{ background: `${biz.bg}30`, borderRadius: 6, padding: "2px 10px", fontSize: 13 }}>{cartCount}</span>
            <span>{biz.mode === "book" ? "Continue" : "View Order"}</span>
            <span>${cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── BOOKING STEP ─────────────────────────────────────────────────────────────

function BookingStep({ biz, cart, onBack, onConfirm }) {
  const [step, setStep] = useState("date");
  const [currentMonth, setCurrentMonth] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const cartItems = Object.values(cart);
  const totalDuration = cartItems.reduce((a, { item, qty }) => a + (item.duration_min || 30) * qty, 0);
  const slotDuration = 30;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["S","M","T","W","T","F","S"];

  const isDisabled = (day) => {
    const d = new Date(year, month, day);
    return d.getDay() === 0 || d < today;
  };

  const generateSlots = () => {
    const slots = [];
    for (let m = 9 * 60; m + slotDuration <= 21 * 60; m += slotDuration) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
      slots.push({ label: `${displayH}:${min.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`, h, min });
    }
    return slots;
  };

  const handleConfirm = async () => {
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    const scheduled = new Date(selectedDate);
    scheduled.setHours(selectedSlot.h, selectedSlot.min, 0, 0);
    await onConfirm({ scheduledAt: scheduled.toISOString(), customerName: name.trim(), customerEmail: email.trim() });
  };

  const inputStyle = {
    width: "100%", background: biz.surface, border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, padding: "14px 16px", color: biz.text_color, fontSize: 15,
    fontFamily: "'Syne', sans-serif", outline: "none", boxSizing: "border-box", marginBottom: 12,
  };

  const goBack = () => {
    if (step === "date") onBack();
    else if (step === "time") setStep("date");
    else setStep("time");
  };

  return (
    <div style={{ minHeight: "100vh", background: biz.bg, color: biz.text_color, paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={goBack} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
          <Icon name="back" size={22} color={biz.text_color} />
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
            {step === "date" ? "Pick a Date" : step === "time" ? "Pick a Time" : "Your Details"}
          </h2>
          {selectedDate && step !== "date" && (
            <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: biz.accent, letterSpacing: 1, marginTop: 2 }}>
              {selectedDate.toDateString()}{selectedSlot && step === "info" ? ` · ${selectedSlot.label}` : ""}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", gap: 6, padding: "12px 20px 0" }}>
        {["date", "time", "info"].map((s, i) => (
          <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: (step === "date" && i === 0) || (step === "time" && i <= 1) || (step === "info") ? biz.accent : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
        ))}
      </div>

      <div style={{ padding: "20px 20px" }}>

        {/* ── DATE ── */}
        {step === "date" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: biz.text_color, borderRadius: 8, width: 36, height: 36, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
              <span style={{ fontWeight: 700, fontSize: 16 }}>{monthNames[month]} {year}</span>
              <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: biz.text_color, borderRadius: 8, width: 36, height: 36, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 10 }}>
              {dayNames.map((d, i) => (
                <div key={i} style={{ textAlign: "center", fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: i === 0 ? 0.2 : 0.4, paddingBottom: 8 }}>{d}</div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {Array.from({ length: firstDay }).map((_, i) => <div key={`blank-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const disabled = isDisabled(day);
                const thisDate = new Date(year, month, day);
                const isSelected = selectedDate && thisDate.toDateString() === selectedDate.toDateString();
                const isToday = thisDate.toDateString() === today.toDateString();
                return (
                  <button key={day} onClick={() => { if (!disabled) { setSelectedDate(thisDate); setStep("time"); }}}
                    style={{ aspectRatio: "1", borderRadius: 8, border: isToday && !isSelected ? `1px solid ${biz.accent}50` : "1px solid transparent", background: isSelected ? biz.accent : "transparent", color: isSelected ? biz.bg : disabled ? "rgba(255,255,255,0.15)" : biz.text_color, fontWeight: isSelected ? 700 : 400, fontSize: 14, cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {day}
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: 16, fontSize: 11, opacity: 0.3, fontFamily: "'DM Mono', monospace", textAlign: "center", letterSpacing: 1 }}>CLOSED SUNDAYS · MON–SAT 9AM–9PM</div>
          </>
        )}

        {/* ── TIME ── */}
        {step === "time" && (
          <>
            <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.35, marginBottom: 16, letterSpacing: 1 }}>
              EST. DURATION: {slotDuration} MIN
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {generateSlots().map((slot, i) => {
                const isSelected = selectedSlot?.label === slot.label;
                return (
                  <button key={i} onClick={() => { setSelectedSlot(slot); setStep("info"); }}
                    style={{ background: isSelected ? biz.accent : biz.surface, color: isSelected ? biz.bg : biz.text_color, border: `1px solid ${isSelected ? biz.accent : "rgba(255,255,255,0.08)"}`, borderRadius: 10, padding: "14px 8px", fontSize: 13, fontFamily: "'DM Mono', monospace", fontWeight: 600, cursor: "pointer" }}>
                    {slot.label}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── INFO ── */}
        {step === "info" && (
          <>
            <div style={{ background: biz.surface, borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.35, letterSpacing: 2, marginBottom: 12 }}>BOOKING SUMMARY</div>
              {cartItems.map(({ item, qty }) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{item.name}{qty > 1 ? ` ×${qty}` : ""}</span>
                  <span style={{ fontSize: 14, color: biz.accent }}>${(item.price * qty).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 13, opacity: 0.5 }}>
                <span>{selectedDate?.toDateString()}</span>
                <span>{selectedSlot?.label}</span>
              </div>
            </div>

            <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.35, letterSpacing: 2, marginBottom: 12 }}>YOUR DETAILS</div>
            <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            <input placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            <div style={{ fontSize: 11, opacity: 0.3, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>CONFIRMATION WILL BE SENT TO YOUR EMAIL</div>
          </>
        )}
      </div>

      {step === "info" && (
        <div style={{ position: "fixed", bottom: 24, left: 20, right: 20 }}>
          <button onClick={handleConfirm} disabled={!name.trim() || !email.trim() || submitting}
            style={{ width: "100%", background: biz.accent, color: biz.bg, border: "none", borderRadius: 12, padding: 20, fontSize: 16, fontWeight: 800, cursor: "pointer", opacity: (!name.trim() || !email.trim()) ? 0.4 : 1 }}>
            {submitting ? "Confirming..." : "Confirm Booking"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── CHECKOUT ────────────────────────────────────────────────────────────────

function Checkout({ biz, cart, location, onBack, onSubmit }) {
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const cartItems = Object.values(cart);
  const total = cartItems.reduce((a, { item, qty }) => a + item.price * qty, 0);

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit({ businessId: biz.id, locationId: location?.id, locationLabel: location?.label || "Unknown", items: cartItems.map(({ item, qty }) => ({ name: item.name, qty, price: item.price })), total, note });
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: biz.bg, color: biz.text_color, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: biz.accent, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, animation: "popIn 0.35s ease" }}><Icon name="check" size={36} color={biz.bg} /></div>
        <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px", textAlign: "center" }}>Order Sent!</h2>
        <p style={{ opacity: 0.45, textAlign: "center", fontSize: 14 }}>Your order is being prepared.</p>
        <div style={{ marginTop: 24, fontFamily: "'DM Mono', monospace", fontSize: 12, color: biz.accent, letterSpacing: 2, animation: "blink 1s infinite" }}>NOTIFYING STAFF...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: biz.bg, color: biz.text_color, paddingBottom: 120 }}>
      <div style={{ padding: "20px 20px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}><Icon name="back" size={22} color={biz.text_color} /></button>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Your Order</h2>
      </div>
      <div style={{ padding: "24px 20px" }}>
        <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.35, letterSpacing: 2, marginBottom: 8 }}>ORDER SUMMARY</div>
        {cartItems.map(({ item, qty }) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div><div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div><div style={{ fontSize: 12, opacity: 0.35 }}>Qty: {qty}</div></div>
            <div style={{ fontSize: 15, fontWeight: 700, color: biz.accent }}>${(item.price * qty).toFixed(2)}</div>
          </div>
        ))}
        <div style={{ marginTop: 24, marginBottom: 24, background: biz.surface, borderRadius: 12, padding: 18 }}>
          <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", opacity: 0.35, letterSpacing: 1, marginBottom: 10 }}>ADD A NOTE (OPTIONAL)</div>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. no onion, extra spicy..." style={{ width: "100%", background: "transparent", border: "none", color: biz.text_color, fontSize: 14, fontFamily: "'Syne', sans-serif", resize: "none", outline: "none", minHeight: 72, boxSizing: "border-box" }} />
        </div>
        <div style={{ background: biz.surface, borderRadius: 12, padding: 18, marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, opacity: 0.45, fontSize: 13 }}><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800 }}><span>Total</span><span style={{ color: biz.accent }}>${total.toFixed(2)}</span></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 0", opacity: 0.3 }}>
          <Icon name="tag" size={12} color={biz.text_color} />
          <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace" }}>PAY AT COUNTER</span>
        </div>
      </div>
      <div style={{ position: "fixed", bottom: 24, left: 20, right: 20 }}>
        <button onClick={handleSubmit} style={{ width: "100%", background: biz.accent, color: biz.bg, border: "none", borderRadius: 12, padding: 20, fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
          Place Order
        </button>
      </div>
    </div>
  );
}

// ─── BOOKING CONFIRMATION ─────────────────────────────────────────────────────

function BookingConfirmation({ biz, scheduledAt, customerName }) {
  const date = new Date(scheduledAt);
  const dateStr = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div style={{ minHeight: "100vh", background: biz.bg, color: biz.text_color, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: biz.accent, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, animation: "popIn 0.35s ease" }}>
        <Icon name="check" size={36} color={biz.bg} />
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px", textAlign: "center" }}>You're Booked!</h2>
      <p style={{ opacity: 0.45, textAlign: "center", fontSize: 14, margin: "0 0 28px" }}>
        See you soon, {customerName.split(" ")[0]}.
      </p>
      <div style={{ background: biz.surface, borderRadius: 16, padding: 24, width: "100%", maxWidth: 320, textAlign: "center" }}>
        <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: biz.accent, letterSpacing: 2, marginBottom: 12 }}>YOUR APPOINTMENT</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{dateStr}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: biz.accent }}>{timeStr}</div>
        <div style={{ marginTop: 16, fontSize: 12, opacity: 0.35, fontFamily: "'DM Mono', monospace" }}>
          
          @ {biz.name.toUpperCase()}
        </div>
      </div>
      <div style={{ marginTop: 24, fontFamily: "'DM Mono', monospace", fontSize: 11, color: biz.accent, letterSpacing: 2, opacity: 0.6 }}>
        CONFIRMATION SENT TO YOUR EMAIL<button
  onClick={() => window.location.href = `/${biz.id}`}
  style={{ marginTop: 24, background: "transparent", border: `1px solid ${biz.accent}`, color: biz.accent, padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}
>
  ← Back to Home
</button>  
      </div>
    </div>
  );
}

// ─── ASSIST ──────────────────────────────────────────────────────────────────

function Assist({ biz, location, onBack }) {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!msg.trim()) return;
    setSent(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: biz.bg, color: biz.text_color }}>
      <div style={{ padding: "20px 20px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}><Icon name="back" size={22} color={biz.text_color} /></button>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Request Assistance</h2>
      </div>
      {sent ? (
        <div style={{ padding: 40, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: biz.accent, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", animation: "popIn 0.35s ease" }}><Icon name="check" size={30} color={biz.bg} /></div>
          <h3 style={{ fontSize: 22, margin: "0 0 8px" }}>Staff Notified</h3>
          <p style={{ opacity: 0.45, fontSize: 14 }}>Someone will be with you shortly.</p>
        </div>
      ) : (
        <div style={{ padding: 20 }}>
          <p style={{ opacity: 0.45, fontSize: 14, marginBottom: 20 }}>Describe what you need — staff will see this immediately.</p>
          <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="e.g. Need another menu, spilled water, question about..." style={{ width: "100%", background: biz.surface, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 16, color: biz.text_color, fontSize: 14, fontFamily: "'Syne', sans-serif", resize: "none", outline: "none", minHeight: 120, boxSizing: "border-box" }} />
          <button onClick={handleSend} disabled={!msg.trim()} style={{ width: "100%", marginTop: 16, background: msg.trim() ? biz.accent : "rgba(255,255,255,0.08)", color: msg.trim() ? biz.bg : "rgba(255,255,255,0.25)", border: "none", borderRadius: 12, padding: 18, fontSize: 15, fontWeight: 700, cursor: msg.trim() ? "pointer" : "default" }}>
            Send Request
          </button>
        </div>
      )}
    </div>
  );
}

// ─── SCAN PAGE ───────────────────────────────────────────────────────────────

export default function ScanPage() {
  const { bizId, locationSlug } = useParams();
  const { addOrder } = useOrders();
  const { biz, loading } = useBusiness(bizId);
  const { services } = useServices(bizId);
  const locations = LOCATIONS[bizId] || [];
  const location = locations.find(l => l.slug === locationSlug) || null;
  const [view, setView] = useState("landing");
  const [cart, setCart] = useState({});
  const [bookingInfo, setBookingInfo] = useState(null); // { scheduledAt, customerName, customerEmail }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E8C547", animation: "blink 1s infinite" }} />
      </div>
    );
  }

  if (!biz) {
    return (
      <div style={{ minHeight: "100vh", background: "#080808", color: "#F0EDE8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 11, color: "#E8C547", letterSpacing: 2 }}>QRS — INVALID</div>
        <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>Business not found</div>
        <div style={{ opacity: 0.35, fontSize: 13 }}>Check your QR code URL.</div>
      </div>
    );
  }

  const handleAdd = (item, delta) => {
    setCart(prev => {
      const curr = prev[item.id]?.qty || 0;
      const next = curr + delta;
      if (next <= 0) { const c = { ...prev }; delete c[item.id]; return c; }
      return { ...prev, [item.id]: { item, qty: next } };
    });
  };

  const handleBookingConfirm = async ({ scheduledAt, customerName, customerEmail }) => {
    const cartItems = Object.values(cart);
    const total = cartItems.reduce((a, { item, qty }) => a + item.price * qty, 0);
    setBookingInfo({ scheduledAt, customerName, customerEmail });
    await addOrder({
      businessId: biz.id,
      locationId: location?.id,
      locationLabel: location?.label || "Unknown",
      items: cartItems.map(({ item, qty }) => ({ name: item.name, qty, price: item.price })),
      total,
      note: "",
      scheduledAt,
      customerName,
      customerEmail,
    });
    setCart({});
    setView("bookingConfirmed");
  };

  const handleSubmit = async (payload) => {
    await addOrder(payload);
    setCart({});
    setTimeout(() => setView("landing"), 3200);
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      {view === "landing"          && <Landing biz={biz} location={location} onNavigate={setView} />}
      {view === "browse"           && <Browse biz={biz} services={services} cart={cart} onAdd={handleAdd} onBack={() => setView("landing")} onNavigate={setView} />}
      {view === "booking"          && <BookingStep biz={biz} cart={cart} onBack={() => setView("browse")} onConfirm={handleBookingConfirm} />}
      {view === "bookingConfirmed" && bookingInfo && <BookingConfirmation biz={biz} scheduledAt={bookingInfo.scheduledAt} customerName={bookingInfo.customerName} />}
      {view === "checkout"         && <Checkout biz={biz} cart={cart} location={location} onBack={() => setView("browse")} onSubmit={handleSubmit} />}
      {view === "assist"           && <Assist biz={biz} location={location} onBack={() => setView("landing")} />}
    </div>);
}