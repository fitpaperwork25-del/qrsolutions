/* ── MENU TAB ── */
function MenuTab({ bizId }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "", image_url: "" });
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("services").select("*").eq("business_id", bizId).order("name");
    setItems(data || []);
  };

  useEffect(() => { if (bizId) load(); }, [bizId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `menu/${bizId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("menu-images").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
      setForm(f => ({ ...f, image_url: data.publicUrl }));
    }
    setUploading(false);
  };

  const addItem = async () => {
    if (!form.name.trim()) return;
    await supabase.from("services").insert({ business_id: bizId, name: form.name, price: parseFloat(form.price) || 0, description: form.description, image_url: form.image_url });
    setForm({ name: "", price: "", description: "", image_url: "" });
    load();
  };

  const deleteItem = async (id) => {
    await supabase.from("services").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <input style={inputStyle} placeholder="Item name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input style={inputStyle} placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        </div>
        <input style={{ ...inputStyle, marginBottom: 10 }} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <div style={{ marginBottom: 10 }}>
          <label style={{ color: MUTED, fontSize: 12, display: "block", marginBottom: 6 }}>Photo (optional)</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ color: TEXT }} />
          {uploading && <span style={{ color: MUTED, fontSize: 12, marginLeft: 10 }}>Uploading...</span>}
          {form.image_url && <img src={form.image_url} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, marginTop: 8 }} />}
        </div>
        <button onClick={addItem} style={btn({ background: ACCENT, color: BG, padding: "10px 20px" })}>Add Item</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
        {items.map(item => (
          <div key={item.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
            {item.image_url && <img src={item.image_url} alt={item.name} style={{ width: "100%", height: 140, objectFit: "cover" }} />}
            <div style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{item.name}</div>
                <div style={{ color: ACCENT, marginTop: 4 }}>${parseFloat(item.price || 0).toFixed(2)}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{item.description}</div>
              </div>
              <button onClick={() => deleteItem(item.id)} style={btn({ background: "#1a1a1a", color: "red", width: 32, height: 32 })}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}