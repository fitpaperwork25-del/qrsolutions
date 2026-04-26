import { useState, useEffect, useCallback } from "react";
import { supabase, LIVE } from "./supabase";
import { SERVICES as MOCK_SERVICES } from "./data";

// Fetches services for a given business from Supabase.
// Falls back to mock data when not live.

export function useServices(businessId) {
  const [services, setServices] = useState(
    LIVE ? [] : (MOCK_SERVICES[businessId] || [])
  );
  const [loading, setLoading] = useState(LIVE);

  useEffect(() => {
    if (!LIVE || !businessId) return;

    setLoading(true);
    supabase
      .from("services")
      .select("*")
      .eq("business_id", businessId)
      .eq("available", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error("[QRS] useServices:", error.message);
        if (data) setServices(data.map(normalizeService));
        setLoading(false);
      });
  }, [businessId]);

  return { services, loading };
}

// Fetches ALL services for a business (including unavailable) — for staff management
export function useAllServices(businessId) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!LIVE) {
      const mock = (MOCK_SERVICES[businessId] || []).map(s => ({ ...s, available: true }));
      setServices(mock);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("business_id", businessId)
      .order("sort_order", { ascending: true });
    if (error) console.error("[QRS] useAllServices:", error.message);
    if (data) setServices(data.map(normalizeService));
    setLoading(false);
  }, [businessId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateService = useCallback(async (id, updates) => {
    if (LIVE) {
      const { error } = await supabase
        .from("services")
        .update(updates)
        .eq("id", id);
      if (error) { console.error("[QRS] updateService:", error.message); return false; }
    }
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    return true;
  }, []);

  const addService = useCallback(async (newItem) => {
    if (LIVE) {
      const { data, error } = await supabase
        .from("services")
        .insert({ ...newItem, business_id: businessId, available: true })
        .select()
        .single();
      if (error) { console.error("[QRS] addService:", error.message); return false; }
      if (data) setServices(prev => [...prev, normalizeService(data)]);
    } else {
      const mock = { ...newItem, id: `mock-${Date.now()}`, business_id: businessId, available: true };
      setServices(prev => [...prev, mock]);
    }
    return true;
  }, [businessId]);

  const deleteService = useCallback(async (id) => {
    if (LIVE) {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) { console.error("[QRS] deleteService:", error.message); return false; }
    }
    setServices(prev => prev.filter(s => s.id !== id));
    return true;
  }, []);

  return { services, loading, updateService, addService, deleteService, refresh: fetchAll };
}

function normalizeService(s) {
  return {
    id: s.id,
    name: s.name,
    description: s.description || "",
    price: Number(s.price),
    category: s.category || null,
    duration_min: s.duration_min || null,
    available: s.available !== false,
    sort_order: s.sort_order || 0,
    business_id: s.business_id,image_url: s.image_url || null,
  };
}
