import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/useAuth";

/* ================= STYLES ================= */
const ACCENT = "#E8C547";
const BG = "#080808";
const SURFACE = "#111";
const BORDER = "rgba(255,255,255,0.08)";
const TEXT = "#F0EDE8";
const MUTED = "#666";

const btn = (extra = {}) => ({
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ...extra,
});

const input = {
  width: "100%",
  background: "#141414",
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  padding: "10px",
  color: TEXT,
};

/* ================= TABLES TAB ================= */
function TablesTab({ bizId }) {
  const [locations, setLocations] = useState([]);
  const [newLabel, setNewLabel] = useState("");

  const load = async () => {
    const { data } = await supabase
      .from("locations")
      .select("*")
      .eq("business_id", bizId)
      .order("label");

    setLocations(data || []);
  };

  useEffect(() => {
    if (bizId) load();
  }, [bizId]);

  const addLocation = async () => {
    if (!newLabel.trim()) return;

    const slug = newLabel.toLowerCase().replace(/\s+/g, "-");

    await supabase.from("locations").insert({
      business_id: bizId,
      label: newLabel,
      slug,
    });

    setNewLabel("");
    load();
  };

  const deleteLocation = async (id) => {
    await supabase.from("locations").delete().eq("id", id);
    load();
  };

  return (
    <div>
      {/* ADD */}
      <div style={{ marginBottom: 20 }}>
        <input
          style={input}
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Add table..."
        />
        <button
          onClick={addLocation}
          style={btn({
            background: ACCENT,
            color: BG,
            padding: "10px 16px",
            marginTop: 10,
          })}
        >
          Add
        </button>
      </div>

      {/* LIST */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))",
          gap: 12,
        }}
      >
        {locations.map((loc) => {
          const scanUrl = `${window.location.origin}/scan/${bizId}/${loc.slug}`;

          return (
            <div
              key={loc.id}
              style={{
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                borderRadius: 10,
                padding: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                {/* CLICKABLE */}
                <a
                  href={scanUrl}
                  target="_blank"
                  style={{
                    color: "#4CAF50",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  {loc.label}
                </a>

                <div
                  style={{
                    fontSize: 11,
                    color: MUTED,
                    marginTop: 4,
                  }}
                >
                  {loc.slug}
                </div>
              </div>

              {/* DELETE */}
              <button
                onClick={() => deleteLocation(loc.id)}
                style={btn({
                  background: "#222",
                  color: "red",
                  width: 32,
                  height: 32,
                })}
              >
                🗑
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= MAIN ================= */
export default function DashboardPage() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const [biz, setBiz] = useState(null);
  const [tab, setTab] = useState("tables");

  useEffect(() => {
    if (!session?.user?.email) return;

    supabase
      .from("businesses")
      .select("*")
      .eq("email", session.user.email)
      .then(({ data }) => {
        if (data?.length) setBiz(data[0]);
      });
  }, [session]);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT }}>
      {/* HEADER */}
      <div style={{ padding: 20 }}>
        <h2>Dashboard</h2>

        <button
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
        >
          Sign out
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ padding: 20 }}>
        {biz ? (
          <TablesTab bizId={biz.id} />
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
}