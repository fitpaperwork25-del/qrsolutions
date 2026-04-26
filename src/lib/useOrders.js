import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, LIVE } from "./supabase";

const MOCK_ORDERS = [
  { id: "ORD-001", business_id: "komo",     location_label: "Table 4", items: [{ service_name: "Tonkotsu Ramen", quantity: 2 }, { service_name: "Gyoza (6pc)", quantity: 1 }],    total: 45,   status: "new",      created_at: new Date(Date.now() - 120000).toISOString(), note: "One without egg please" },
  { id: "ORD-002", business_id: "drift",    location_label: "Table 2", items: [{ service_name: "Flat White", quantity: 2 }, { service_name: "Cold Brew", quantity: 1 }],          total: 19.5, status: "preparing", created_at: new Date(Date.now() - 300000).toISOString(), note: "" },
  { id: "ORD-003", business_id: "blade-co", location_label: "Chair 1", items: [{ service_name: "Fade", quantity: 1 }],                                                            total: 40,   status: "new",      created_at: new Date(Date.now() - 60000).toISOString(),  note: "Mid fade, keep length on top" },
  { id: "ORD-004", business_id: "komo",     location_label: "Table 7", items: [{ service_name: "Spicy Miso Ramen", quantity: 1 }, { service_name: "Sapporo Draft", quantity: 2 }], total: 33, status: "ready",    created_at: new Date(Date.now() - 720000).toISOString(), note: "" },
];

export function useOrders() {
  const [orders, setOrders] = useState(LIVE ? [] : MOCK_ORDERS);
  const initialized = useRef(false);

  useEffect(() => {
    if (!LIVE || initialized.current) return;
    initialized.current = true;

    // Initial fetch
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (error) console.error("[QRS] orders fetch:", error.message);
        if (data) setOrders(data.map(normalizeOrder));
      });

    // Realtime — new orders
    const channel = supabase
      .channel("orders-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, payload => {
        supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("id", payload.new.id)
          .single()
          .then(({ data }) => {
            if (data) setOrders(prev => [normalizeOrder(data), ...prev]);
          });
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, payload => {
        setOrders(prev => prev.map(o =>
          o.id === payload.new.id ? { ...o, status: payload.new.status } : o
        ));
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const updateStatus = useCallback(async (orderId, newStatus) => {
    if (LIVE) {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
      if (error) console.error("[QRS] updateStatus:", error.message);
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  }, []);

  const addOrder = useCallback(async ({ businessId, locationId, locationLabel, items, total, note, scheduledAt, customerName, customerEmail }) => {
    if (LIVE) {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({ 
          business_id: businessId, 
          location_label: locationLabel, 
          total, 
          note,
          scheduled_at: scheduledAt || null,
          customer_name: customerName || null,
          customer_email: customerEmail || null,
        })
        .select()
        .single();

      if (error) { console.error("[QRS] addOrder:", error.message); return; }
      try {
  const { data: { session } } = await supabase.auth.getSession();
  await fetch(
    "https://fndxdstclhjwjhijszky.supabase.co/functions/v1/send-booking-email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        to: "fitpaperwork25@gmail.com",
        businessName: businessId,
        customerName: note,
        scheduledAt: scheduledAt,
      }),
    }
  );
} catch (emailErr) {
  console.error("Email failed:", emailErr);
}

      if (order && items.length > 0) {
        await supabase.from("order_items").insert(
          items.map(i => ({
            order_id: order.id,
            service_name: i.name,
            quantity: i.qty,
            unit_price: i.price,
          }))
        );
      }
    } else {
      const mock = {
        id: `ORD-${Date.now()}`,
        business_id: businessId,
        location_label: locationLabel,
        items: items.map(i => ({ service_name: i.name, quantity: i.qty })),
        total, note, status: "new",
        scheduled_at: scheduledAt || null,
        customer_name: customerName || null,
        created_at: new Date().toISOString(),
      };
      setOrders(prev => [mock, ...prev]);
    }
  }, []);

  return { orders, updateStatus, addOrder };
}

function normalizeOrder(raw) {
  return {
    ...raw,
    items: (raw.order_items || []).map(i => ({
      service_name: i.service_name,
      quantity: i.quantity,
    })),
  };
}
