import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

const DEFAULT_BIZ_STYLE = {
  bg: "#080808",
  surface: "#111111",
  text_color: "#F0EDE8",
  accent: "#E8C547",
  tagline: "Scan, browse, and order.",
  mode: "order",
};

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#E8C547",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      Loading...
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#F0EDE8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div>
        <div style={{ color: "#E8C547", fontSize: 12, letterSpacing: 2, marginBottom: 12 }}>
          QRS
        </div>
        <h1 style={{ margin: 0, fontSize: 26 }}>Scan page unavailable</h1>
        <p style={{ opacity: 0.6 }}>{message}</p>
      </div>
    </div>
  );
}

function SuccessScreen({ biz, location, onAgain }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: biz.bg,
        color: biz.text_color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div>
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: biz.accent,
            color: biz.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 34,
            margin: "0 auto 18px",
          }}
        >
          ✓
        </div>

        <h1 style={{ margin: "0 0 8px", fontSize: 28 }}>Order Sent</h1>

        <p style={{ opacity: 0.65, margin: 0 }}>
          Staff received your order from {location?.label || "your table"}.
        </p>

        <button
          onClick={onAgain}
          style={{
            marginTop: 24,
            background: biz.accent,
            color: biz.bg,
            border: "none",
            borderRadius: 10,
            padding: "14px 20px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Place another order
        </button>
      </div>
    </div>
  );
}

export default function ScanPage() {
  const { bizId, locationSlug } = useParams();

  const [biz, setBiz] = useState(null);
  const [location, setLocation] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [cart, setCart] = useState({});
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadScanPage() {
      if (!bizId || !locationSlug) {
        setLoadError("Missing business or table information.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError("");

      const { data: business, error: bizError } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", bizId)
        .maybeSingle();

      if (bizError || !business) {
        setLoadError("Business not found. Check the QR code URL.");
        setLoading(false);
        return;
      }

      const mergedBiz = {
        ...DEFAULT_BIZ_STYLE,
        ...business,
        bg: business.bg || DEFAULT_BIZ_STYLE.bg,
        surface: business.surface || DEFAULT_BIZ_STYLE.surface,
        text_color: business.text_color || DEFAULT_BIZ_STYLE.text_color,
        accent: business.accent || DEFAULT_BIZ_STYLE.accent,
        tagline: business.tagline || DEFAULT_BIZ_STYLE.tagline,
        mode: business.mode || DEFAULT_BIZ_STYLE.mode,
      };

      const { data: foundLocation } = await supabase
        .from("locations")
        .select("*")
        .eq("business_id", bizId)
        .eq("slug", locationSlug)
        .maybeSingle();

      const { data: menuItems, error: servicesError } = await supabase
        .from("services")
        .select("*")
        .eq("business_id", bizId)
        .order("category")
        .order("name");

      if (servicesError) {
        setLoadError("Menu could not load.");
        setLoading(false);
        return;
      }

      setBiz(mergedBiz);
      setLocation(foundLocation || { id: null, label: locationSlug, slug: locationSlug });
      setServices((menuItems || []).filter((item) => item.available !== false));
      setLoading(false);
    }

    loadScanPage();
  }, [bizId, locationSlug]);

  const categories = useMemo(() => {
    const unique = [...new Set(services.map((s) => s.category).filter(Boolean))];
    return unique.length ? unique : ["Menu"];
  }, [services]);

  const cartItems = Object.values(cart);
  const total = cartItems.reduce((sum, row) => sum + Number(row.item.price || 0) * row.qty, 0);
  const count = cartItems.reduce((sum, row) => sum + row.qty, 0);

  const addToCart = (item, delta) => {
    setCart((prev) => {
      const currentQty = prev[item.id]?.qty || 0;
      const nextQty = currentQty + delta;

      if (nextQty <= 0) {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      }

      return {
        ...prev,
        [item.id]: { item, qty: nextQty },
      };
    });
  };

  const submitOrder = async () => {
    if (!biz || cartItems.length === 0) return;

    setSubmitting(true);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        business_id: biz.id,
        location_id: location?.id || null,
        location_label: location?.label || locationSlug,
        status: "new",
        total,
        note: note.trim() || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      alert("Order could not be submitted. Please tell staff.");
      setSubmitting(false);
      return;
    }

    const orderItems = cartItems.map(({ item, qty }) => ({
      order_id: order.id,
      service_id: item.id,
      service_name: item.name,
      quantity: qty,
      price: Number(item.price || 0),
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) {
      alert("Order was created, but items could not be saved. Please tell staff.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setCart({});
    setNote("");
    setSubmitting(false);
  };

  if (loading) return <LoadingScreen />;

  if (loadError || !biz) {
    return <ErrorScreen message={loadError || "Something went wrong."} />;
  }

  if (submitted) {
    return (
      <SuccessScreen
        biz={biz}
        location={location}
        onAgain={() => setSubmitted(false)}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: biz.bg,
        color: biz.text_color,
        fontFamily: "Arial, sans-serif",
        paddingBottom: count ? 125 : 24,
      }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <header
          style={{
            padding: "28px 20px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              color: biz.accent,
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            QRS / {location?.label || locationSlug}
          </div>

          <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.1 }}>{biz.name}</h1>

          <p style={{ margin: "8px 0 0", opacity: 0.55 }}>{biz.tagline}</p>
        </header>

        <main style={{ padding: 20 }}>
          {services.length === 0 ? (
            <div
              style={{
                background: biz.surface,
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: 22,
                textAlign: "center",
                opacity: 0.7,
              }}
            >
              No menu items available yet.
            </div>
          ) : (
            categories.map((category) => {
              const items =
                category === "Menu"
                  ? services
                  : services.filter((s) => s.category === category);

              return (
                <section key={category} style={{ marginBottom: 26 }}>
                  <div
                    style={{
                      color: biz.accent,
                      fontSize: 11,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    {category}
                  </div>

                  {items.map((item) => {
                    const qty = cart[item.id]?.qty || 0;

                    return (
                      <div
                        key={item.id}
                        style={{
                          background: biz.surface,
                          border: qty
                            ? `1px solid ${biz.accent}`
                            : "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 14,
                          overflow: "hidden",
                          marginBottom: 12,
                        }}
                      >
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            style={{
                              width: "100%",
                              height: 170,
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        )}

                        <div
                          style={{
                            padding: 16,
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 14,
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontSize: 16,
                                fontWeight: 800,
                                marginBottom: 4,
                              }}
                            >
                              {item.name}
                            </div>

                            {item.description && (
                              <div
                                style={{
                                  fontSize: 13,
                                  opacity: 0.55,
                                  marginBottom: 8,
                                }}
                              >
                                {item.description}
                              </div>
                            )}

                            <div style={{ color: biz.accent, fontWeight: 800 }}>
                              {money(item.price)}
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {qty > 0 && (
                              <button
                                onClick={() => addToCart(item, -1)}
                                style={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: 8,
                                  border: "none",
                                  background: "rgba(255,255,255,0.08)",
                                  color: biz.text_color,
                                  cursor: "pointer",
                                  fontSize: 18,
                                }}
                              >
                                −
                              </button>
                            )}

                            {qty > 0 && (
                              <div style={{ minWidth: 20, textAlign: "center", fontWeight: 800 }}>
                                {qty}
                              </div>
                            )}

                            <button
                              onClick={() => addToCart(item, 1)}
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                border: "none",
                                background: biz.accent,
                                color: biz.bg,
                                cursor: "pointer",
                                fontSize: 20,
                                fontWeight: 800,
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </section>
              );
            })
          )}

          {count > 0 && (
            <div
              style={{
                background: biz.surface,
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: 16,
                marginTop: 18,
              }}
            >
              <div
                style={{
                  color: biz.accent,
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Order note
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional: no onions, extra spicy, etc."
                style={{
                  width: "100%",
                  minHeight: 75,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  color: biz.text_color,
                  fontSize: 14,
                  fontFamily: "Arial, sans-serif",
                }}
              />
            </div>
          )}
        </main>
      </div>

      {count > 0 && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.92)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            padding: 16,
          }}
        >
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <button
              onClick={submitOrder}
              disabled={submitting}
              style={{
                width: "100%",
                background: biz.accent,
                color: biz.bg,
                border: "none",
                borderRadius: 12,
                padding: "17px 18px",
                fontSize: 16,
                fontWeight: 900,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              <span>{submitting ? "Sending..." : `Place Order (${count})`}</span>
              <span>{money(total)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
