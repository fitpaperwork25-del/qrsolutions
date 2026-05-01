import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

const BG = "#080808";
const SURFACE = "#111";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#F0EDE8";
const ACCENT = "#E8C547";
const MUTED = "#666";

export default function ScanPage() {
  const { bizId, locSlug } = useParams();
  const [location, setLocation] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: loc } = await supabase
        .from("locations")
        .select("*")
        .eq("business_id", bizId)
        .eq("slug", locSlug)
        .single();

      if (loc) {
        setLocation(loc);
        const { data: items } = await supabase
          .from("services")
          .select("*")
          .eq("business_id", bizId)
          .order("name");
        setMenuItems(items || []);
      }
      setLoading(false);
    }
    load();
  }, [bizId, locSlug]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (existing?.qty === 1) return prev.filter(c => c.id !== id);
      return prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c);
    });
  };

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setOrdering(true);

    const { data: order } = await supabase
      .from("orders")
      .insert({
        business_id: bizId,
        location_id: location.id,
        total: total,
        status: "new",
        items: cart.map(c => ({ id: c.id, name: c.name, price: c.price, qty: c.qty })),
      })
      .select()
      .single();

    setOrdering(false);
    if (order) {
      setOrdered(true);
      setCart([]);
    }
  };

  if (loading) return (
    <div style={{ background: BG, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: TEXT }}>
      Loading...
    </div>
  );

  if (!location) return (
    <div style={{ background: BG, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "red" }}>
      Location not found
    </div>
  );

  if (ordered) return (
    <div style={{ background: BG, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: TEXT, padding: 24 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <h2 style={{ color: ACCENT, marginBottom: 8 }}>Order Placed!</h2>
      <p style={{ color: MUTED }}>Your order is being prepared.</p>
      <button onClick={() => setOrdered(false)} style={{ marginTop: 24, background: ACCENT, color: BG, border: "none", borderRadius: 8, padding: "12px 24px", fontWeight: 700, cursor: "pointer" }}>
        Order More
      </button>
    </div>
  );

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT, fontFamily: "sans-serif" }}>
      <div style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}`, padding: "16px 20px" }}>
        <div style={{ fontWeight: 900, fontSize: 18, color: ACCENT }}>Menu</div>
        <div style={{ color: MUTED, fontSize: 13, marginTop: 2 }}>{location.label}</div>
      </div>

      <div style={{ padding: 16, paddingBottom: cart.length > 0 ? 160 : 16 }}>
        {menuItems.length === 0 ? (
          <div style={{ color: MUTED, textAlign: "center", marginTop: 40 }}>No menu items yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {menuItems.map(item => {
              const inCart = cart.find(c => c.id === item.id);
              return (
                <div key={item.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden", display: "flex" }}>
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} style={{ width: 100, height: 100, objectFit: "cover", flexShrink: 0 }} />
                  )}
                  <div style={{ padding: 14, flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{item.name}</div>
                      <div style={{ color: MUTED, fontSize: 12, marginTop: 2 }}>{item.description}</div>
                      <div style={{ color: ACCENT, fontWeight: 700, marginTop: 4 }}>${parseFloat(item.price).toFixed(2)}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 12 }}>
                      {inCart ? (
                        <>
                          <button onClick={() => removeFromCart(item.id)} style={{ background: "#222", border: "none", color: TEXT, width: 30, height: 30, borderRadius: 6, cursor: "pointer", fontSize: 16 }}>−</button>
                          <span style={{ fontWeight: 700, minWidth: 16, textAlign: "center" }}>{inCart.qty}</span>
                          <button onClick={() => addToCart(item)} style={{ background: ACCENT, border: "none", color: BG, width: 30, height: 30, borderRadius: 6, cursor: "pointer", fontSize: 16 }}>+</button>
                        </>
                      ) : (
                        <button onClick={() => addToCart(item)} style={{ background: ACCENT, border: "none", color: BG, width: 30, height: 30, borderRadius: 6, cursor: "pointer", fontSize: 20 }}>+</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: SURFACE, borderTop: `1px solid ${BORDER}`, padding: 16 }}>
          <div style={{ marginBottom: 10 }}>
            {cart.map(c => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span>{c.qty}× {c.name}</span>
                <span style={{ color: ACCENT }}>${(c.price * c.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <button
            onClick={placeOrder}
            disabled={ordering}
            style={{ width: "100%", background: ACCENT, color: BG, border: "none", borderRadius: 10, padding: "14px", fontWeight: 900, fontSize: 16, cursor: "pointer" }}
          >
            {ordering ? "Placing Order..." : `Place Order · $${total.toFixed(2)}`}
          </button>
        </div>
      )}
    </div>
  );
}