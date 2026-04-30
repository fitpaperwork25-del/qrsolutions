import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ScanPage() {
  const { bizId, locSlug } = useParams();

  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    async function load() {
      if (!bizId || !locSlug) return;

      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("biz_id", bizId)
        .eq("slug", locSlug)
        .single();

      if (!error) {
        setLocation(data);
      }

      setLoading(false);
    }

    load();
  }, [bizId, locSlug]);

  if (loading) {
    return (
      <div style={{ padding: 40, color: "white" }}>
        Loading...
      </div>
    );
  }

  if (!location) {
    return (
      <div style={{ padding: 40, color: "red" }}>
        Location not found
      </div>
    );
  }

  return (
    <div style={{ padding: 40, color: "white" }}>
      <h1>{location.label}</h1>
      <p>{location.slug}</p>

      <div style={{ marginTop: 20 }}>
        ✅ Scan working
      </div>
    </div>
  );
}