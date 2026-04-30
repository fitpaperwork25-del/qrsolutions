import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ScanPage() {
  const { bizId, locSlug } = useParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocation() {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("business_id", bizId)
        .eq("slug", locSlug)
        .single();

      console.log("bizId:", bizId, "locSlug:", locSlug);
      console.log("data:", data, "error:", error);

      setLocation(data);
      setLoading(false);
    }

    fetchLocation();
  }, [bizId, locSlug]);

  if (loading) {
    return <div style={{ padding: 40, color: "black" }}>Loading...</div>;
  }

  if (!location) {
    return <div style={{ padding: 40, color: "red" }}>Location not found</div>;
  }

  return (
    <div style={{ padding: 40, color: "black", background: "white" }}>
      <h1>{location.label}</h1>
      <p>{location.slug}</p>
    </div>
  );
}