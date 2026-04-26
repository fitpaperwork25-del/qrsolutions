import { useState, useEffect } from "react";
import { supabase, LIVE } from "./supabase";
import { BUSINESSES } from "./data";

// Fetches a single business from Supabase including logo, hero, accent, tagline.
// Falls back to static data when not live.

export function useBusiness(bizId) {
  const fallback = BUSINESSES[bizId] || null;
  const [biz, setBiz] = useState(fallback);
  const [loading, setLoading] = useState(LIVE);

  useEffect(() => {
    if (!LIVE || !bizId) { setLoading(false); return; }

    setLoading(true);
    supabase
      .from("businesses")
      .select("id, name, tagline, type, mode, accent, bg, surface, text_color, logo_url, hero_image_url, active")
      .eq("id", bizId)
      .single()
      .then(({ data, error }) => {
        if (error) console.error("[QRS] useBusiness:", error.message);
        if (data) setBiz({ ...fallback, ...data });
        setLoading(false);
      });
  }, [bizId]);

  return { biz, loading };
}
