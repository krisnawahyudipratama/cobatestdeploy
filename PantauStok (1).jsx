import { useState, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────
   DESIGN SYSTEM — Luxury Editorial Dark
   Palette: deep obsidian + warm gold + off-white
   Fonts: Playfair Display (headers) + DM Sans (body)
───────────────────────────────────────────── */
const G = {
  bg:       "#0a0a08",
  bg1:      "#111110",
  bg2:      "#191917",
  bg3:      "#222220",
  border:   "#2a2a27",
  borderHi: "#3a3a36",
  gold:     "#c9a84c",
  goldDim:  "#8a6e2f",
  goldFaint:"#c9a84c18",
  cream:    "#f0ead8",
  creamDim: "#a09880",
  creamFaint:"#f0ead808",
  red:      "#e05c5c",
  redFaint: "#e05c5c15",
  amber:    "#e8a84a",
  amberFaint:"#e8a84a15",
  green:    "#5aaa7a",
  greenFaint:"#5aaa7a15",
};

const FONT_DISPLAY = `'Playfair Display', Georgia, 'Times New Roman', serif`;
const FONT_BODY    = `'DM Sans', 'Helvetica Neue', Arial, sans-serif`;

/* ─── Data ─────────────────────────────────── */
const SEED_ITEMS = [
  { id:"1", name:"Arabica Beans",   category:"Coffee",     quantity:24.5, unit:"kg",  expiryDate:"2026-06-15", status:"fresh" },
  { id:"2", name:"Fresh Milk",      category:"Dairy",      quantity:12.0, unit:"L",   expiryDate:"2026-05-24", status:"approaching" },
  { id:"3", name:"Tomato",          category:"Vegetables", quantity:4.2,  unit:"kg",  expiryDate:"2026-05-21", status:"critical" },
  { id:"4", name:"Heavy Cream",     category:"Dairy",      quantity:8.0,  unit:"L",   expiryDate:"2026-06-05", status:"fresh" },
  { id:"5", name:"Onion",           category:"Vegetables", quantity:15.5, unit:"kg",  expiryDate:"2026-05-26", status:"approaching" },
  { id:"6", name:"Oat Milk",        category:"Dairy",      quantity:2.0,  unit:"box", expiryDate:"2026-05-27", status:"critical" },
  { id:"7", name:"Robusta Blend",   category:"Coffee",     quantity:18.0, unit:"kg",  expiryDate:"2026-07-20", status:"fresh" },
  { id:"8", name:"Cane Sugar",      category:"Dry Goods",  quantity:30.0, unit:"kg",  expiryDate:"2027-01-01", status:"fresh" },
];
const SEED_ALERTS = [
  { id:"a1", type:"critical", title:"Oat Milk — Stok Kritis", body:"Hanya tersisa 2 box. Lakukan pemesanan ulang segera.", item:"Oat Milk" },
  { id:"a2", type:"expiry",   title:"Tomato — Kadaluarsa Besok", body:"Pindahkan ke area promo atau segera gunakan hari ini.", item:"Tomato" },
];
const CATS = ["Coffee","Dairy","Vegetables","Dry Goods"];
const UNITS = { Coffee:"kg", Dairy:"L", Vegetables:"kg", "Dry Goods":"box" };
const CAT_SYMBOL = { Coffee:"◆", Dairy:"○", Vegetables:"△", "Dry Goods":"□" };

/* ─── Utils ────────────────────────────────── */
function calcStatus(exp, qty) {
  if (!qty || qty === 0) return "critical";
  const diff = Math.ceil((new Date(exp) - new Date("2026-05-22")) / 86400000);
  return diff <= 1 ? "critical" : diff <= 5 ? "approaching" : "fresh";
}
function daysLabel(exp) {
  const d = Math.ceil((new Date(exp) - new Date("2026-05-22")) / 86400000);
  if (d < 0) return "Expired";
  if (d === 0) return "Hari ini";
  if (d === 1) return "Besok";
  return `${d} hari`;
}
function useLS(key, def) {
  const [v, set] = useState(() => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; } });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, set];
}
function fmtN(n) { return Number.isInteger(n) ? String(n) : n.toFixed(1); }

/* ─── Shared micro-components ──────────────── */
function Divider() {
  return <div style={{ height:1, background:`linear-gradient(90deg, transparent, ${G.border}, transparent)` }} />;
}

function StatusDot({ status, size=6 }) {
  const c = status==="fresh" ? G.green : status==="approaching" ? G.amber : G.red;
  return <span style={{ display:"inline-block", width:size, height:size, borderRadius:"50%", background:c, flexShrink:0 }} />;
}

function Tag({ children, color }) {
  return (
    <span style={{
      fontSize:9, fontFamily:FONT_BODY, fontWeight:600,
      letterSpacing:"0.12em", textTransform:"uppercase",
      color: color || G.creamDim,
      border:`0.5px solid ${color ? color+"40" : G.border}`,
      padding:"2px 7px", borderRadius:2,
    }}>{children}</span>
  );
}

function GoldLine() {
  return <div style={{ width:24, height:1.5, background:G.gold, borderRadius:1 }} />;
}

/* ─── Welcome ──────────────────────────────── */
function WelcomeView({ onStart }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  return (
    <div style={{
      minHeight:"100vh", background:G.bg,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"space-between",
      padding:"0 28px",
      fontFamily:FONT_BODY,
    }}>
      {/* Top wordmark */}
      <div style={{ paddingTop:64, textAlign:"center", opacity: visible?1:0,
        transform: visible?"translateY(0)":"translateY(12px)", transition:"all 0.7s ease" }}>
        <div style={{ fontSize:11, fontFamily:FONT_BODY, fontWeight:500,
          letterSpacing:"0.35em", color:G.gold, textTransform:"uppercase", marginBottom:20 }}>
          Café Inventory Suite
        </div>
        <h1 style={{ fontFamily:FONT_DISPLAY, fontSize:46, fontWeight:700,
          color:G.cream, margin:0, lineHeight:1.08, letterSpacing:"-0.02em" }}>
          Pantau<br/>
          <span style={{ color:G.gold, fontStyle:"italic" }}>Stok</span>
        </h1>
        <div style={{ marginTop:16, height:1,
          background:`linear-gradient(90deg, transparent, ${G.gold}60, transparent)` }} />
      </div>

      {/* Centre illustration */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"center", gap:32, opacity: visible?1:0,
        transform: visible?"translateY(0)":"translateY(20px)", transition:"all 0.9s ease 0.15s" }}>

        {/* Abstract inventory grid */}
        <div style={{ position:"relative", width:200, height:200 }}>
          {/* Grid lines */}
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              position:"absolute", left:`${i*33}%`, top:0, bottom:0,
              width:0.5, background:G.border,
            }}/>
          ))}
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              position:"absolute", top:`${i*33}%`, left:0, right:0,
              height:0.5, background:G.border,
            }}/>
          ))}
          {/* Data bars */}
          {[
            { x:14, y:120, w:36, h:64, c:G.gold },
            { x:64, y:80,  w:36, h:104, c:G.gold+"99" },
            { x:114, y:100, w:36, h:84, c:G.gold+"66" },
            { x:164, y:60,  w:36, h:124, c:G.gold+"44" },
          ].map((b,i) => (
            <div key={i} style={{
              position:"absolute", left:b.x, top:b.y, width:b.w, height:b.h,
              background:`linear-gradient(to top, ${b.c}, ${b.c}44)`,
              borderRadius:"2px 2px 0 0",
            }}/>
          ))}
          {/* Centre label */}
          <div style={{ position:"absolute", inset:0, display:"flex",
            alignItems:"center", justifyContent:"center" }}>
            <div style={{ background:G.bg1, border:`1px solid ${G.border}`,
              borderRadius:8, padding:"8px 14px", backdropFilter:"blur(4px)" }}>
              <div style={{ color:G.gold, fontSize:11, fontWeight:600,
                letterSpacing:"0.1em", textTransform:"uppercase" }}>Stok Aktif</div>
              <div style={{ color:G.cream, fontSize:24, fontWeight:700,
                fontFamily:FONT_DISPLAY, textAlign:"center", marginTop:2 }}>
                {SEED_ITEMS.length}
              </div>
            </div>
          </div>
        </div>

        {/* Feature list */}
        <div style={{ display:"flex", flexDirection:"column", gap:10, width:"100%", maxWidth:300 }}>
          {[
            ["Pantau kadaluarsa secara real-time", "◆"],
            ["Notifikasi otomatis stok kritis", "◆"],
            ["Laporan ekspor seketika", "◆"],
          ].map(([t, sym]) => (
            <div key={t} style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ color:G.gold, fontSize:8 }}>{sym}</span>
              <span style={{ color:G.creamDim, fontSize:13 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ paddingBottom:52, width:"100%", maxWidth:320,
        opacity: visible?1:0, transition:"all 0.8s ease 0.3s" }}>
        <button onClick={onStart} style={{
          width:"100%", height:56, background:G.gold,
          color:G.bg, border:"none", borderRadius:4,
          fontFamily:FONT_BODY, fontSize:13, fontWeight:700,
          letterSpacing:"0.2em", textTransform:"uppercase",
          cursor:"pointer",
        }}>
          Mulai Sekarang
        </button>
        <button onClick={onStart} style={{
          width:"100%", height:44, marginTop:10,
          background:"transparent", color:G.creamDim,
          border:`0.5px solid ${G.border}`, borderRadius:4,
          fontFamily:FONT_BODY, fontSize:12, cursor:"pointer",
          letterSpacing:"0.08em",
        }}>
          Sudah punya akun?
        </button>
      </div>
    </div>
  );
}

/* ─── DashboardView ────────────────────────── */
function DashboardView({ items, alerts, onNav, onQuickAdd, onReset }) {
  const [scanOpen, setScanOpen] = useState(false);
  const [scanMsg, setScanMsg]   = useState(null);
  const [exporting, setExp]     = useState(false);

  const fresh      = items.filter(i => i.status==="fresh").length;
  const approaching= items.filter(i => i.status==="approaching").length;
  const critical   = items.filter(i => i.status==="critical").length;
  const total      = items.length || 1;

  const catCounts = CATS.reduce((a,c) => { a[c]=items.filter(i=>i.category===c).length; return a; }, {});

  const handleScan = (item) => {
    onQuickAdd(item.id, 5);
    setScanMsg(`+5 ${item.unit} — ${item.name}`);
    setTimeout(() => { setScanMsg(null); setScanOpen(false); }, 2400);
  };

  const handleExport = () => {
    setExp(true);
    setTimeout(() => {
      setExp(false);
      const w = window.open("","_blank");
      if (!w) return;
      const rows = items.map(i =>
        `<tr><td>${i.name}</td><td>${i.category}</td><td>${i.quantity} ${i.unit}</td>
         <td>${i.expiryDate}</td><td>${i.status}</td></tr>`
      ).join("");
      w.document.write(`<html><head><title>PantauStok — Laporan</title>
        <style>body{font-family:Georgia,serif;padding:40px;color:#111;background:#faf9f6}
        h1{font-size:28px;letter-spacing:-0.02em}p{color:#666;font-size:13px}
        table{width:100%;border-collapse:collapse;margin-top:20px}
        th,td{padding:10px 12px;text-align:left;border-bottom:1px solid #e8e4dc}
        th{font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#888}
        </style></head><body>
        <h1>PantauStok</h1><p>Laporan Inventaris Kafe · ${new Date().toLocaleDateString("id-ID",{dateStyle:"full"})}</p>
        <table><thead><tr><th>Nama</th><th>Kategori</th><th>Kuantitas</th><th>Kadaluarsa</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody></table><script>window.print();<\/script></body></html>`);
      w.document.close();
    }, 1200);
  };

  const StatCard = ({ label, value, sub, color, onClick }) => (
    <div onClick={onClick} style={{ flex:1, background:G.bg1, border:`0.5px solid ${G.border}`,
      borderRadius:3, padding:"16px 14px", cursor: onClick?"pointer":"default",
      transition:"border-color 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = G.borderHi}
      onMouseLeave={e => e.currentTarget.style.borderColor = G.border}>
      <div style={{ fontSize:9, fontFamily:FONT_BODY, fontWeight:600,
        letterSpacing:"0.14em", textTransform:"uppercase", color:G.creamDim, marginBottom:8 }}>
        {label}
      </div>
      <div style={{ fontSize:28, fontFamily:FONT_DISPLAY, fontWeight:700,
        color: color || G.cream, lineHeight:1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize:10, color:G.creamDim, marginTop:5, fontFamily:FONT_BODY }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>

      {/* Header */}
      <div>
        <div style={{ fontSize:10, fontFamily:FONT_BODY, fontWeight:500,
          letterSpacing:"0.25em", textTransform:"uppercase", color:G.gold, marginBottom:8 }}>
          Selamat datang kembali
        </div>
        <h2 style={{ fontFamily:FONT_DISPLAY, fontSize:26, fontWeight:700,
          color:G.cream, margin:0, letterSpacing:"-0.02em" }}>
          Dashboard
        </h2>
        <GoldLine />
      </div>

      {/* Alert banner — only if any */}
      {alerts.length > 0 && (
        <div onClick={() => onNav("alerts")} style={{
          background:G.bg1, border:`0.5px solid ${G.red}50`,
          borderLeft:`2px solid ${G.red}`,
          borderRadius:3, padding:"12px 14px", cursor:"pointer",
          display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <div>
            <div style={{ fontSize:9, fontFamily:FONT_BODY, fontWeight:600,
              letterSpacing:"0.15em", textTransform:"uppercase", color:G.red, marginBottom:3 }}>
              Memerlukan Perhatian
            </div>
            <div style={{ fontSize:13, color:G.cream, fontFamily:FONT_BODY }}>
              {alerts[0].title}
            </div>
          </div>
          <span style={{ color:G.creamDim, fontSize:16 }}>→</span>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display:"flex", gap:8 }}>
        <StatCard label="Total SKU" value={items.length} sub="item aktif" onClick={() => onNav("catalog")} />
        <StatCard label="Kritis" value={critical} sub="perlu tindakan" color={critical > 0 ? G.red : G.creamDim} onClick={() => onNav("catalog")} />
        <StatCard label="Aman" value={fresh} sub="stok fresh" color={G.green} />
      </div>

      {/* Status distribution */}
      <div style={{ background:G.bg1, border:`0.5px solid ${G.border}`, borderRadius:3, padding:"18px 16px" }}>
        <div style={{ fontSize:9, fontFamily:FONT_BODY, fontWeight:600,
          letterSpacing:"0.14em", textTransform:"uppercase", color:G.creamDim, marginBottom:14 }}>
          Distribusi Status
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[
            { label:"Fresh", count:fresh, color:G.green },
            { label:"Approaching", count:approaching, color:G.amber },
            { label:"Kritis", count:critical, color:G.red },
          ].map(s => (
            <div key={s.label} style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:72, fontSize:11, color:G.creamDim, fontFamily:FONT_BODY,
                display:"flex", alignItems:"center", gap:7 }}>
                <StatusDot status={s.label==="Fresh"?"fresh":s.label==="Approaching"?"approaching":"critical"} />
                {s.label}
              </div>
              <div style={{ flex:1, height:2, background:G.bg3, borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(s.count/total)*100}%`,
                  background:s.color, transition:"width 0.8s ease", borderRadius:99 }} />
              </div>
              <div style={{ fontSize:12, color:s.color, fontFamily:"monospace",
                fontWeight:600, width:16, textAlign:"right" }}>{s.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div style={{ background:G.bg1, border:`0.5px solid ${G.border}`, borderRadius:3, padding:"18px 16px" }}>
        <div style={{ fontSize:9, fontFamily:FONT_BODY, fontWeight:600,
          letterSpacing:"0.14em", textTransform:"uppercase", color:G.creamDim, marginBottom:14 }}>
          Komposisi Kategori
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
          {CATS.map((cat, i) => {
            const pct = Math.round((catCounts[cat] / total) * 100);
            return (
              <div key={cat}>
                {i > 0 && <div style={{ height:0.5, background:G.border, margin:"0" }} />}
                <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0" }}>
                  <span style={{ fontSize:11, color:G.gold, width:12, textAlign:"center" }}>
                    {CAT_SYMBOL[cat]}
                  </span>
                  <span style={{ flex:1, fontSize:12, color:G.cream, fontFamily:FONT_BODY }}>{cat}</span>
                  <div style={{ width:60, height:1.5, background:G.bg3, borderRadius:99, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:G.gold+"80", borderRadius:99 }} />
                  </div>
                  <span style={{ fontSize:11, color:G.creamDim, fontFamily:"monospace",
                    width:26, textAlign:"right" }}>{catCounts[cat]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        <button onClick={() => { setScanOpen(true); setScanMsg(null); }} style={{
          height:48, background:G.gold, color:G.bg, border:"none",
          borderRadius:3, fontFamily:FONT_BODY, fontSize:11, fontWeight:700,
          letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer",
        }}>
          Scan Barcode
        </button>
        <button onClick={handleExport} disabled={exporting} style={{
          height:48, background:"transparent", color:G.creamDim,
          border:`0.5px solid ${G.border}`, borderRadius:3,
          fontFamily:FONT_BODY, fontSize:11, fontWeight:600,
          letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer",
        }}>
          {exporting ? "Exporting…" : "Export PDF"}
        </button>
      </div>

      {/* Scanner modal */}
      {scanOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(10,10,8,0.94)",
          backdropFilter:"blur(16px)", display:"flex", alignItems:"flex-end",
          justifyContent:"center", zIndex:100, padding:"0 0 80px" }}>
          <div style={{ background:G.bg1, border:`0.5px solid ${G.border}`,
            borderRadius:"8px 8px 0 0", width:"100%", maxWidth:420,
            padding:"24px 20px 20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
              <div>
                <div style={{ fontSize:9, fontFamily:FONT_BODY, fontWeight:600,
                  letterSpacing:"0.2em", textTransform:"uppercase", color:G.gold, marginBottom:6 }}>
                  Simulasi
                </div>
                <h3 style={{ fontFamily:FONT_DISPLAY, fontSize:20, fontWeight:700,
                  color:G.cream, margin:0 }}>Barcode Scanner</h3>
              </div>
              <button onClick={() => setScanOpen(false)} style={{
                background:G.bg2, border:`0.5px solid ${G.border}`,
                color:G.creamDim, borderRadius:2, width:30, height:30,
                cursor:"pointer", fontSize:14, fontFamily:FONT_BODY,
              }}>×</button>
            </div>
            <div style={{ height:0.5, background:G.border, marginBottom:16 }} />
            <div style={{ display:"flex", flexDirection:"column", gap:1 }}>
              {items.slice(0,4).map((item, i) => (
                <div key={item.id}>
                  {i > 0 && <div style={{ height:0.5, background:G.border }} />}
                  <button onClick={() => handleScan(item)} style={{
                    width:"100%", background:"transparent", border:"none",
                    padding:"13px 4px", display:"flex", justifyContent:"space-between",
                    alignItems:"center", cursor:"pointer", color:G.cream,
                    fontFamily:FONT_BODY,
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = G.bg2}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span style={{ fontSize:13 }}>{item.name}</span>
                    <span style={{ fontSize:11, color:G.gold, fontFamily:"monospace" }}>
                      +5 {item.unit}
                    </span>
                  </button>
                </div>
              ))}
            </div>
            {scanMsg && (
              <div style={{ marginTop:14, background:G.goldFaint, border:`0.5px solid ${G.gold}40`,
                borderRadius:3, padding:"10px 14px", color:G.gold,
                fontSize:12, fontFamily:FONT_BODY, textAlign:"center" }}>
                {scanMsg}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── CatalogView ──────────────────────────── */
function CatalogView({ items, onDelete, onUpdateQty, onAdd }) {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [detail, setDetail]   = useState(null);

  const filtered = items.filter(i => {
    const m = i.name.toLowerCase().includes(search.toLowerCase()) ||
              i.category.toLowerCase().includes(search.toLowerCase());
    return filter==="all" ? m : m && i.status===filter;
  });

  const statusColor = s => s==="fresh" ? G.green : s==="approaching" ? G.amber : G.red;
  const statusLabel = s => s==="fresh" ? "Fresh" : s==="approaching" ? "Mendekati" : "Kritis";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* Header */}
      <div>
        <div style={{ fontSize:10, fontFamily:FONT_BODY, fontWeight:500,
          letterSpacing:"0.25em", textTransform:"uppercase", color:G.gold, marginBottom:8 }}>
          Inventaris
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
          <h2 style={{ fontFamily:FONT_DISPLAY, fontSize:26, fontWeight:700,
            color:G.cream, margin:0, letterSpacing:"-0.02em" }}>
            Katalog Bahan
          </h2>
          <button onClick={onAdd} style={{
            background:G.gold, color:G.bg, border:"none", borderRadius:2,
            fontFamily:FONT_BODY, fontSize:10, fontWeight:700,
            letterSpacing:"0.15em", textTransform:"uppercase",
            padding:"8px 14px", cursor:"pointer",
          }}>+ Tambah</button>
        </div>
        <GoldLine />
      </div>

      {/* Search */}
      <div style={{ position:"relative" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama atau kategori…"
          style={{
            width:"100%", height:42, background:G.bg1, border:`0.5px solid ${G.border}`,
            borderRadius:2, padding:"0 14px", color:G.cream,
            fontFamily:FONT_BODY, fontSize:13, outline:"none", boxSizing:"border-box",
            letterSpacing:"0.01em",
          }}
        />
      </div>

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:0, borderBottom:`0.5px solid ${G.border}` }}>
        {["all","fresh","approaching","critical"].map(f => {
          const active = filter===f;
          const label = f==="all"?"Semua":f==="fresh"?"Fresh":f==="approaching"?"Approaching":"Kritis";
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              flex:1, height:34, background:"transparent", border:"none",
              borderBottom: active ? `1.5px solid ${G.gold}` : "1.5px solid transparent",
              color: active ? G.gold : G.creamDim,
              fontFamily:FONT_BODY, fontSize:10, fontWeight: active ? 700 : 500,
              letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer",
              transition:"all 0.15s", paddingBottom:2,
            }}>{label}</button>
          );
        })}
      </div>

      {/* Item list */}
      <div style={{ display:"flex", flexDirection:"column" }}>
        {filtered.length === 0 ? (
          <div style={{ padding:"48px 0", textAlign:"center" }}>
            <div style={{ fontSize:11, color:G.creamDim, fontFamily:FONT_BODY,
              letterSpacing:"0.08em" }}>Tidak ada bahan yang cocok</div>
          </div>
        ) : filtered.map((item, i) => (
          <div key={item.id}>
            {i > 0 && <div style={{ height:0.5, background:G.border }} />}
            <div onClick={() => setDetail(item)} style={{
              padding:"14px 0", display:"flex", alignItems:"center",
              gap:14, cursor:"pointer",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              {/* Status indicator */}
              <div style={{ width:2, height:36, background:statusColor(item.status),
                borderRadius:99, flexShrink:0 }} />
              {/* Info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, color:G.cream, fontFamily:FONT_BODY,
                  fontWeight:500, marginBottom:4, letterSpacing:"0.01em" }}>
                  {item.name}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <Tag>{item.category}</Tag>
                  <span style={{ fontSize:10, color:G.creamDim, fontFamily:FONT_BODY }}>
                    {daysLabel(item.expiryDate)}
                  </span>
                </div>
              </div>
              {/* Qty */}
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ fontSize:18, fontFamily:FONT_DISPLAY, fontWeight:700,
                  color: statusColor(item.status), lineHeight:1 }}>
                  {fmtN(item.quantity)}
                </div>
                <div style={{ fontSize:9, color:G.creamDim, fontFamily:FONT_BODY,
                  letterSpacing:"0.1em", textTransform:"uppercase", marginTop:2 }}>
                  {item.unit}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button onClick={onAdd} style={{
        position:"fixed", right:20, bottom:90,
        width:48, height:48, background:G.gold, color:G.bg,
        border:"none", borderRadius:2, fontSize:20, fontWeight:300,
        cursor:"pointer", zIndex:40,
        boxShadow:`0 4px 24px ${G.gold}40`,
      }}>+</button>

      {/* Detail drawer */}
      {detail && (
        <div style={{ position:"fixed", inset:0, background:"rgba(10,10,8,0.92)",
          backdropFilter:"blur(16px)", display:"flex", alignItems:"flex-end",
          justifyContent:"center", zIndex:100, padding:"0 0 80px" }}>
          <div style={{ background:G.bg1, border:`0.5px solid ${G.border}`,
            borderTop:`1px solid ${G.border}`, borderRadius:"8px 8px 0 0",
            width:"100%", maxWidth:420, overflow:"hidden" }}>
            {/* Status stripe */}
            <div style={{ height:2, background:statusColor(detail.status) }} />
            <div style={{ padding:"22px 20px 20px" }}>
              {/* Title */}
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"flex-start", marginBottom:18 }}>
                <div>
                  <Tag>{detail.category}</Tag>
                  <h3 style={{ fontFamily:FONT_DISPLAY, fontSize:22, fontWeight:700,
                    color:G.cream, margin:"8px 0 0", letterSpacing:"-0.01em" }}>
                    {detail.name}
                  </h3>
                </div>
                <button onClick={() => setDetail(null)} style={{
                  background:G.bg2, border:`0.5px solid ${G.border}`,
                  color:G.creamDim, borderRadius:2, width:30, height:30,
                  cursor:"pointer", fontSize:14,
                }}>×</button>
              </div>

              <Divider />

              {/* Qty row */}
              <div style={{ padding:"16px 0", display:"flex",
                justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:9, fontFamily:FONT_BODY, fontWeight:600,
                    letterSpacing:"0.14em", textTransform:"uppercase",
                    color:G.creamDim, marginBottom:6 }}>Kuantitas</div>
                  <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                    <span style={{ fontSize:32, fontFamily:FONT_DISPLAY, fontWeight:700,
                      color:statusColor(detail.status), lineHeight:1 }}>
                      {fmtN(detail.quantity)}
                    </span>
                    <span style={{ fontSize:12, color:G.creamDim, fontFamily:FONT_BODY }}>
                      {detail.unit}
                    </span>
                  </div>
                </div>
                <div style={{ display:"flex", gap:1 }}>
                  {["−","+"].map((sym, idx) => (
                    <button key={sym} onClick={() => {
                      const nq = idx===0 ? Math.max(0,detail.quantity-1) : detail.quantity+1;
                      onUpdateQty(detail.id, nq);
                      setDetail({...detail, quantity:nq});
                    }} style={{
                      width:38, height:38, background:G.bg2,
                      border:`0.5px solid ${G.border}`,
                      borderRadius: idx===0 ? "2px 0 0 2px" : "0 2px 2px 0",
                      color: idx===0 ? G.red : G.green,
                      fontSize:18, fontWeight:300, cursor:"pointer",
                      fontFamily:FONT_BODY,
                    }}>{sym}</button>
                  ))}
                </div>
              </div>

              <Divider />

              {/* Meta */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
                gap:12, padding:"16px 0" }}>
                {[
                  { label:"Kadaluarsa", value:detail.expiryDate, sub:daysLabel(detail.expiryDate) },
                  { label:"Status", value:statusLabel(detail.status),
                    sub:"kelayakan stok", color:statusColor(detail.status) },
                ].map(m => (
                  <div key={m.label} style={{ background:G.bg2,
                    border:`0.5px solid ${G.border}`, borderRadius:2, padding:"12px" }}>
                    <div style={{ fontSize:9, fontFamily:FONT_BODY, fontWeight:600,
                      letterSpacing:"0.12em", textTransform:"uppercase",
                      color:G.creamDim, marginBottom:6 }}>{m.label}</div>
                    <div style={{ fontSize:13, fontFamily:FONT_BODY, fontWeight:500,
                      color: m.color || G.cream }}>{m.value}</div>
                    <div style={{ fontSize:10, color:G.creamDim, marginTop:2 }}>{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* Delete */}
              <button onClick={() => { onDelete(detail.id); setDetail(null); }} style={{
                width:"100%", height:40, background:"transparent",
                border:`0.5px solid ${G.red}40`, color:G.red,
                borderRadius:2, fontFamily:FONT_BODY, fontSize:11,
                fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase",
                cursor:"pointer",
              }}>
                Hapus dari Katalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── AddStockView ─────────────────────────── */
function AddStockView({ onAdd, existingItems }) {
  const [type, setType]     = useState("In");
  const [name, setName]     = useState("");
  const [cat, setCat]       = useState("Coffee");
  const [qty, setQty]       = useState(1);
  const [suggs, setSuggs]   = useState([]);
  const [day, setDay]       = useState(22);
  const [month, setMonth]   = useState(5);
  const [year, setYear]     = useState(2026);
  const [done, setDone]     = useState(false);

  const MO = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

  useEffect(() => {
    if (!name) { setSuggs([]); return; }
    const s = [...new Set(existingItems.map(i=>i.name))]
      .filter(n => n.toLowerCase().includes(name.toLowerCase()) && n.toLowerCase()!==name.toLowerCase());
    setSuggs(s.slice(0,4));
  }, [name, existingItems]);

  const submit = () => {
    if (!name.trim()) return;
    const mo = String(month).padStart(2,"0"), d2 = String(day).padStart(2,"0");
    onAdd({ name:name.trim(), category:cat, quantity:qty,
      unit:UNITS[cat]||"kg", expiryDate:`${year}-${mo}-${d2}`, type });
    setDone(true);
    setTimeout(() => { setDone(false); setName(""); setQty(1); }, 1800);
  };

  const FieldLabel = ({ children }) => (
    <div style={{ fontSize:9, fontFamily:FONT_BODY, fontWeight:600,
      letterSpacing:"0.14em", textTransform:"uppercase", color:G.creamDim, marginBottom:7 }}>
      {children}
    </div>
  );

  const inputStyle = { height:42, background:G.bg1, border:`0.5px solid ${G.border}`,
    borderRadius:2, padding:"0 14px", color:G.cream, fontFamily:FONT_BODY,
    fontSize:13, outline:"none", width:"100%", boxSizing:"border-box" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:22 }}>

      {/* Header */}
      <div>
        <div style={{ fontSize:10, fontFamily:FONT_BODY, fontWeight:500,
          letterSpacing:"0.25em", textTransform:"uppercase", color:G.gold, marginBottom:8 }}>
          Transaksi
        </div>
        <h2 style={{ fontFamily:FONT_DISPLAY, fontSize:26, fontWeight:700,
          color:G.cream, margin:0, letterSpacing:"-0.02em" }}>
          Tambah Stok
        </h2>
        <GoldLine />
      </div>

      {/* Type toggle */}
      <div>
        <FieldLabel>Tipe Transaksi</FieldLabel>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0,
          border:`0.5px solid ${G.border}`, borderRadius:2, overflow:"hidden" }}>
          {[["In","Masuk"],["Out","Keluar"]].map(([t,l]) => (
            <button key={t} onClick={() => setType(t)} style={{
              height:42, background: type===t ? G.gold : "transparent",
              color: type===t ? G.bg : G.creamDim,
              border:"none", fontFamily:FONT_BODY, fontSize:11, fontWeight:700,
              letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer",
              borderRight: t==="In" ? `0.5px solid ${G.border}` : "none",
              transition:"all 0.15s",
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div style={{ position:"relative" }}>
        <FieldLabel>Nama Barang</FieldLabel>
        <input value={name} onChange={e=>setName(e.target.value)}
          placeholder="Contoh: Arabica Beans" style={inputStyle} />
        {suggs.length > 0 && (
          <div style={{ position:"absolute", left:0, right:0, top:"100%",
            background:G.bg1, border:`0.5px solid ${G.border}`,
            borderTop:"none", zIndex:50 }}>
            {suggs.map((s,i) => (
              <div key={i} onClick={() => {
                setName(s);
                const m = existingItems.find(x=>x.name.toLowerCase()===s.toLowerCase());
                if (m) setCat(m.category);
                setSuggs([]);
              }} style={{
                padding:"11px 14px", fontSize:13, color:G.cream,
                fontFamily:FONT_BODY, cursor:"pointer",
                borderBottom: i<suggs.length-1 ? `0.5px solid ${G.border}` : "none",
              }}
                onMouseEnter={e => e.currentTarget.style.background = G.bg2}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cat + Qty */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <div>
          <FieldLabel>Kategori</FieldLabel>
          <select value={cat} onChange={e=>setCat(e.target.value)} style={{
            ...inputStyle, appearance:"none", cursor:"pointer",
          }}>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <FieldLabel>Jumlah ({UNITS[cat]||"kg"})</FieldLabel>
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr",
            height:42, background:G.bg1, border:`0.5px solid ${G.border}`, borderRadius:2 }}>
            <button onClick={() => setQty(q=>Math.max(1,q-1))} style={{
              background:"none", border:"none", borderRight:`0.5px solid ${G.border}`,
              color:G.red, fontSize:16, cursor:"pointer", fontFamily:FONT_BODY,
            }}>−</button>
            <input type="number" value={qty}
              onChange={e=>setQty(Math.max(1,parseInt(e.target.value)||1))}
              style={{ width:46, background:"none", border:"none", textAlign:"center",
                color:G.cream, fontSize:14, fontFamily:"monospace",
                fontWeight:600, outline:"none" }}
            />
            <button onClick={() => setQty(q=>q+1)} style={{
              background:"none", border:"none", borderLeft:`0.5px solid ${G.border}`,
              color:G.green, fontSize:16, cursor:"pointer", fontFamily:FONT_BODY,
            }}>+</button>
          </div>
        </div>
      </div>

      {/* Date */}
      <div>
        <FieldLabel>Tanggal Kadaluarsa</FieldLabel>
        <div style={{ background:G.bg1, border:`0.5px solid ${G.border}`,
          borderRadius:2, padding:"14px" }}>
          <div style={{ fontFamily:FONT_DISPLAY, fontSize:15, fontWeight:600,
            color:G.gold, marginBottom:12 }}>
            {day} {MO[month-1]} {year}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr 1.3fr", gap:8 }}>
            {[
              { label:"Tgl", val:day, set:setDay, opts:Array.from({length:31},(_,i)=>({v:i+1,l:String(i+1)})) },
              { label:"Bln", val:month, set:setMonth, opts:MO.map((m,i)=>({v:i+1,l:m})) },
              { label:"Thn", val:year, set:setYear, opts:[2025,2026,2027,2028].map(y=>({v:y,l:String(y)})) },
            ].map(f => (
              <div key={f.label}>
                <div style={{ fontSize:8, fontFamily:FONT_BODY, fontWeight:600,
                  letterSpacing:"0.14em", textTransform:"uppercase",
                  color:G.creamDim, marginBottom:5, textAlign:"center" }}>
                  {f.label}
                </div>
                <select value={f.val} onChange={e=>f.set(Number(e.target.value))} style={{
                  width:"100%", background:G.bg2, border:`0.5px solid ${G.border}`,
                  borderRadius:2, padding:"6px 4px", color:G.cream,
                  fontFamily:FONT_BODY, fontSize:12, textAlign:"center", outline:"none",
                }}>
                  {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Note */}
      <div style={{ display:"flex", gap:10, alignItems:"flex-start",
        borderLeft:`1.5px solid ${G.gold}50`, paddingLeft:12 }}>
        <p style={{ color:G.creamDim, fontSize:11, fontFamily:FONT_BODY,
          lineHeight:1.6, margin:0 }}>
          Notifikasi otomatis akan dikirim 7 hari sebelum tanggal kadaluarsa yang dipilih.
        </p>
      </div>

      {/* Submit */}
      <button onClick={submit} disabled={done} style={{
        width:"100%", height:52, background: done ? G.goldDim : G.gold,
        color:G.bg, border:"none", borderRadius:2, fontFamily:FONT_BODY,
        fontSize:12, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase",
        cursor:"pointer", transition:"background 0.2s",
      }}>
        {done ? "✓ Tersimpan" : "Simpan Data"}
      </button>
    </div>
  );
}

/* ─── AlertsView ───────────────────────────── */
function AlertsView({ alerts, onDismiss, onNav }) {
  const [toast, setToast] = useState(null);
  const typeColor = t => t==="critical" ? G.red : G.amber;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:22 }}>

      {/* Header */}
      <div>
        <div style={{ fontSize:10, fontFamily:FONT_BODY, fontWeight:500,
          letterSpacing:"0.25em", textTransform:"uppercase", color:G.gold, marginBottom:8 }}>
          Sistem
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
          <h2 style={{ fontFamily:FONT_DISPLAY, fontSize:26, fontWeight:700,
            color:G.cream, margin:0, letterSpacing:"-0.02em" }}>
            Pemberitahuan
          </h2>
          {alerts.length > 0 && (
            <span style={{ fontSize:11, fontFamily:"monospace", color:G.creamDim }}>
              {alerts.length} aktif
            </span>
          )}
        </div>
        <GoldLine />
      </div>

      {alerts.length === 0 ? (
        <div style={{ padding:"48px 0", textAlign:"center", display:"flex",
          flexDirection:"column", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, border:`0.5px solid ${G.border}`,
            borderRadius:2, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:6, height:6, borderRadius:99, background:G.green }} />
          </div>
          <div>
            <div style={{ fontSize:13, color:G.cream, fontFamily:FONT_BODY, marginBottom:4 }}>
              Semua Stok Optimal
            </div>
            <div style={{ fontSize:11, color:G.creamDim, fontFamily:FONT_BODY }}>
              Tidak ada item kritis saat ini
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {alerts.map(a => (
            <div key={a.id} style={{ background:G.bg1, border:`0.5px solid ${G.border}`,
              borderLeft:`2px solid ${typeColor(a.type)}`, borderRadius:3 }}>
              <div style={{ padding:"16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"flex-start", marginBottom:8 }}>
                  <div>
                    <div style={{ fontSize:9, fontFamily:FONT_BODY, fontWeight:600,
                      letterSpacing:"0.14em", textTransform:"uppercase",
                      color:typeColor(a.type), marginBottom:5 }}>
                      {a.type==="critical" ? "Stok Kritis" : "Kadaluarsa Dekat"}
                    </div>
                    <div style={{ fontSize:14, color:G.cream, fontFamily:FONT_BODY,
                      fontWeight:500, letterSpacing:"0.01em" }}>{a.title}</div>
                  </div>
                  <button onClick={() => onDismiss(a.id)} style={{
                    background:"none", border:"none", color:G.creamDim,
                    cursor:"pointer", fontSize:16, padding:2,
                  }}>×</button>
                </div>
                <p style={{ color:G.creamDim, fontSize:12, fontFamily:FONT_BODY,
                  lineHeight:1.6, margin:"0 0 14px" }}>{a.body}</p>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => onNav("catalog")} style={{
                    flex:1, height:36, background:typeColor(a.type), color:G.bg,
                    border:"none", borderRadius:2, fontFamily:FONT_BODY,
                    fontSize:10, fontWeight:700, letterSpacing:"0.15em",
                    textTransform:"uppercase", cursor:"pointer",
                  }}>Cek Stok</button>
                  <button onClick={() => onDismiss(a.id)} style={{
                    padding:"0 16px", height:36, background:"transparent",
                    border:`0.5px solid ${G.border}`, color:G.creamDim, borderRadius:2,
                    fontFamily:FONT_BODY, fontSize:10, fontWeight:600,
                    letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer",
                  }}>Abaikan</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Send report */}
      <Divider />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"6px 0" }}>
        <div>
          <div style={{ fontSize:9, fontFamily:FONT_BODY, fontWeight:600,
            letterSpacing:"0.12em", textTransform:"uppercase", color:G.creamDim, marginBottom:4 }}>
            Laporan Harian
          </div>
          <div style={{ fontSize:12, color:G.cream, fontFamily:FONT_BODY }}>
            Kirim ringkasan ke manajer
          </div>
        </div>
        <button onClick={() => {
          setToast("Laporan berhasil dikirim");
          setTimeout(()=>setToast(null),3200);
        }} style={{
          background:G.bg1, border:`0.5px solid ${G.border}`,
          color:G.gold, borderRadius:2, padding:"9px 16px",
          fontFamily:FONT_BODY, fontSize:10, fontWeight:700,
          letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer",
        }}>Kirim →</button>
      </div>

      {toast && (
        <div style={{ position:"fixed", bottom:90, left:20, right:20, maxWidth:400, margin:"0 auto",
          background:G.bg1, border:`0.5px solid ${G.border}`,
          borderLeft:`2px solid ${G.gold}`, borderRadius:3,
          padding:"12px 16px", zIndex:60, display:"flex",
          justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:12, color:G.cream, fontFamily:FONT_BODY }}>{toast}</span>
          <button onClick={() => setToast(null)} style={{
            background:"none", border:"none", color:G.creamDim, cursor:"pointer", fontSize:12,
          }}>×</button>
        </div>
      )}
    </div>
  );
}

/* ─── ProfileView ──────────────────────────── */
function ProfileView({ onReset, itemsCount }) {
  const [outlet,  setOutlet]  = useState("Sentosa Coffee & Bakery");
  const [manager, setManager] = useState("Budi Setiawan");
  const [saved,   setSaved]   = useState(false);
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };

  const inputStyle = {
    width:"100%", height:42, background:G.bg1, border:`0.5px solid ${G.border}`,
    borderRadius:2, padding:"0 14px", color:G.cream, fontFamily:FONT_BODY,
    fontSize:13, outline:"none", boxSizing:"border-box",
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:22 }}>

      {/* Header */}
      <div>
        <div style={{ fontSize:10, fontFamily:FONT_BODY, fontWeight:500,
          letterSpacing:"0.25em", textTransform:"uppercase", color:G.gold, marginBottom:8 }}>
          Akun
        </div>
        <h2 style={{ fontFamily:FONT_DISPLAY, fontSize:26, fontWeight:700,
          color:G.cream, margin:0, letterSpacing:"-0.02em" }}>
          Profil
        </h2>
        <GoldLine />
      </div>

      {/* Profile card */}
      <div style={{ background:G.bg1, border:`0.5px solid ${G.border}`,
        borderRadius:3, padding:"22px 18px",
        display:"flex", alignItems:"center", gap:16 }}>
        <div style={{ width:50, height:50, borderRadius:2,
          background:`linear-gradient(135deg, ${G.goldDim}, ${G.gold})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          flexShrink:0 }}>
          <span style={{ fontFamily:FONT_DISPLAY, fontSize:20, fontWeight:700,
            color:G.bg }}>
            {manager.charAt(0)}
          </span>
        </div>
        <div>
          <div style={{ fontFamily:FONT_DISPLAY, fontSize:16, fontWeight:700,
            color:G.cream, marginBottom:3 }}>{manager}</div>
          <div style={{ fontSize:11, color:G.creamDim, fontFamily:FONT_BODY }}>
            Manajer Inventaris · {outlet}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1,
        background:G.border, borderRadius:3, overflow:"hidden",
        border:`0.5px solid ${G.border}` }}>
        {[
          { label:"Total SKU", val:itemsCount },
          { label:"Kategori", val:4 },
          { label:"Versi", val:"1.2" },
        ].map(s => (
          <div key={s.label} style={{ background:G.bg1, padding:"16px 12px", textAlign:"center" }}>
            <div style={{ fontFamily:FONT_DISPLAY, fontSize:20, fontWeight:700,
              color:G.gold, lineHeight:1 }}>{s.val}</div>
            <div style={{ fontSize:9, fontFamily:FONT_BODY, fontWeight:600,
              letterSpacing:"0.1em", textTransform:"uppercase",
              color:G.creamDim, marginTop:5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Edit form */}
      <div style={{ background:G.bg1, border:`0.5px solid ${G.border}`, borderRadius:3 }}>
        <div style={{ padding:"14px 16px", display:"flex", alignItems:"center", gap:8,
          borderBottom:`0.5px solid ${G.border}` }}>
          <span style={{ fontSize:9, fontFamily:FONT_BODY, fontWeight:600,
            letterSpacing:"0.15em", textTransform:"uppercase", color:G.creamDim }}>
            Detail Outlet
          </span>
        </div>
        <div style={{ padding:"16px", display:"flex", flexDirection:"column", gap:14 }}>
          {[
            { label:"Nama Outlet", val:outlet, set:setOutlet },
            { label:"Manajer Pengelola", val:manager, set:setManager },
          ].map(f => (
            <div key={f.label}>
              <div style={{ fontSize:9, fontFamily:FONT_BODY, fontWeight:600,
                letterSpacing:"0.14em", textTransform:"uppercase",
                color:G.creamDim, marginBottom:6 }}>{f.label}</div>
              <input value={f.val} onChange={e=>f.set(e.target.value)} style={inputStyle} />
            </div>
          ))}
          <button onClick={save} style={{
            height:42, background: saved ? G.goldDim : G.gold, color:G.bg,
            border:"none", borderRadius:2, fontFamily:FONT_BODY, fontSize:11,
            fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase",
            cursor:"pointer", transition:"background 0.2s",
          }}>
            {saved ? "✓ Tersimpan" : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      {/* Database */}
      <div style={{ background:G.bg1, border:`0.5px solid ${G.border}`, borderRadius:3 }}>
        <div style={{ padding:"14px 16px", borderBottom:`0.5px solid ${G.border}` }}>
          <span style={{ fontSize:9, fontFamily:FONT_BODY, fontWeight:600,
            letterSpacing:"0.15em", textTransform:"uppercase", color:G.creamDim }}>
            Database
          </span>
        </div>
        <div style={{ padding:"16px", display:"flex", flexDirection:"column", gap:10 }}>
          {[
            ["Penyimpanan", "Lokal (localStorage)"],
            ["Versi App", "1.2.0"],
          ].map(([l,v]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between",
              fontSize:12, fontFamily:FONT_BODY }}>
              <span style={{ color:G.creamDim }}>{l}</span>
              <span style={{ color:G.cream, fontFamily:"monospace" }}>{v}</span>
            </div>
          ))}
          <div style={{ height:0.5, background:G.border, margin:"4px 0" }} />
          <button onClick={onReset} style={{
            height:40, background:"transparent", color:G.red,
            border:`0.5px solid ${G.red}35`, borderRadius:2,
            fontFamily:FONT_BODY, fontSize:10, fontWeight:700,
            letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer",
          }}>
            Reset ke Data Bawaan
          </button>
        </div>
      </div>

      <div style={{ textAlign:"center", paddingBottom:8 }}>
        <span style={{ fontSize:10, color:G.creamDim, fontFamily:FONT_BODY,
          letterSpacing:"0.08em" }}>
          PantauStok — Crafted for café hospitality
        </span>
      </div>
    </div>
  );
}

/* ─── Root App ─────────────────────────────── */
export default function App() {
  const [onboarded, setOnboarded] = useLS("ps3_onboarded", false);
  const [items, setItems]         = useLS("ps3_items", SEED_ITEMS);
  const [alerts, setAlerts]       = useLS("ps3_alerts", SEED_ALERTS);
  const [tab, setTab]             = useState("dashboard");

  const reCalc = useCallback(list =>
    list.map(i => ({ ...i, status: calcStatus(i.expiryDate, i.quantity) })), []);

  const handleAdd = ({ name, category, quantity, unit, expiryDate, type }) => {
    const today = new Date().toISOString().split("T")[0];
    const idx = items.findIndex(i => i.name.toLowerCase() === name.toLowerCase());
    if (idx > -1) {
      const updated = [...items];
      const ex = updated[idx];
      const fq = type==="In" ? ex.quantity+quantity : Math.max(0, ex.quantity-quantity);
      updated[idx] = { ...ex, quantity:fq, expiryDate, lastUpdated:today,
        status:calcStatus(expiryDate, fq) };
      setItems(updated);
      if (type==="Out" && fq <= 2) {
        setAlerts(prev => [{ id:String(Date.now()), type:"critical",
          title:`${name} — Stok Hampir Habis`,
          body:`Sisa ${fq} ${unit}. Segera lakukan pemesanan ulang.`, item:name
        }, ...prev]);
      }
    } else {
      setItems(prev => [{ id:String(Date.now()), name, category, quantity, unit, expiryDate,
        status:calcStatus(expiryDate, quantity), lastUpdated:today }, ...prev]);
    }
  };

  const NAV = [
    { id:"dashboard", label:"Beranda", sym:"◇" },
    { id:"catalog",   label:"Katalog", sym:"≡" },
    { id:"add_stock", label:"Tambah",  sym:"+" },
    { id:"alerts",    label:"Notif",   sym:"◉" },
    { id:"profile",   label:"Profil",  sym:"◌" },
  ];

  if (!onboarded) return <WelcomeView onStart={() => setOnboarded(true)} />;

  return (
    <>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{
        minHeight:"100vh", background:G.bg, color:G.cream,
        fontFamily:FONT_BODY, WebkitFontSmoothing:"antialiased",
        display:"flex", flexDirection:"column",
      }}>
        {/* Top bar */}
        <header style={{
          position:"fixed", top:0, left:0, right:0, zIndex:50,
          background:G.bg+"ee", backdropFilter:"blur(20px)",
          borderBottom:`0.5px solid ${G.border}`, height:52,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 20px", maxWidth:480, margin:"0 auto", width:"100%",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:22, height:22, background:G.gold, borderRadius:2,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontFamily:FONT_DISPLAY, fontSize:12, fontWeight:700,
                color:G.bg, lineHeight:1 }}>P</span>
            </div>
            <span style={{ fontFamily:FONT_DISPLAY, fontSize:15, fontWeight:700,
              color:G.cream, letterSpacing:"-0.01em" }}>
              Pantau<span style={{ color:G.gold, fontStyle:"italic" }}>Stok</span>
            </span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {alerts.length > 0 && (
              <div style={{ display:"flex", alignItems:"center", gap:5,
                background:G.redFaint, border:`0.5px solid ${G.red}40`,
                borderRadius:2, padding:"4px 9px" }}>
                <div style={{ width:5, height:5, borderRadius:99, background:G.red }} />
                <span style={{ fontSize:10, color:G.red, fontFamily:FONT_BODY,
                  fontWeight:600, letterSpacing:"0.08em" }}>{alerts.length}</span>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main style={{
          flex:1, paddingTop:68, paddingBottom:80,
          padding:"68px 20px 80px", maxWidth:480,
          margin:"0 auto", width:"100%", boxSizing:"border-box",
        }}>
          {tab==="dashboard" && (
            <DashboardView items={items} alerts={alerts} onNav={setTab}
              onQuickAdd={(id,n) => setItems(reCalc(items.map(i=>i.id===id?{...i,quantity:i.quantity+n}:i)))}
              onReset={() => window.confirm("Reset?") && (setItems(SEED_ITEMS),setAlerts(SEED_ALERTS))} />
          )}
          {tab==="catalog" && (
            <CatalogView items={items}
              onDelete={id => setItems(items.filter(i=>i.id!==id))}
              onUpdateQty={(id,q) => setItems(reCalc(items.map(i=>i.id===id?{...i,quantity:q}:i)))}
              onAdd={() => setTab("add_stock")} />
          )}
          {tab==="add_stock" && <AddStockView onAdd={handleAdd} existingItems={items} />}
          {tab==="alerts" && (
            <AlertsView alerts={alerts}
              onDismiss={id => setAlerts(a=>a.filter(x=>x.id!==id))} onNav={setTab} />
          )}
          {tab==="profile" && (
            <ProfileView onReset={() => window.confirm("Reset?") && (setItems(SEED_ITEMS),setAlerts(SEED_ALERTS))}
              itemsCount={items.length} />
          )}
        </main>

        {/* Bottom nav */}
        <nav style={{
          position:"fixed", bottom:0, left:0, right:0, zIndex:50,
          background:G.bg+"f2", backdropFilter:"blur(20px)",
          borderTop:`0.5px solid ${G.border}`, height:62,
          display:"flex", alignItems:"center",
          maxWidth:480, margin:"0 auto", width:"100%",
        }}>
          {NAV.map(n => {
            const active = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)} style={{
                flex:1, height:"100%", background:"none", border:"none",
                display:"flex", flexDirection:"column", alignItems:"center",
                justifyContent:"center", gap:3, cursor:"pointer",
                color: active ? G.gold : G.creamDim,
                borderTop: active ? `1px solid ${G.gold}` : "1px solid transparent",
                transition:"all 0.15s",
                position:"relative",
              }}>
                <span style={{ fontSize:13, fontFamily:FONT_BODY,
                  fontWeight: active ? 600 : 400, lineHeight:1 }}>
                  {n.sym}
                </span>
                <span style={{ fontSize:9, fontFamily:FONT_BODY, fontWeight:500,
                  letterSpacing:"0.08em", textTransform:"uppercase" }}>
                  {n.label}
                </span>
                {n.id==="alerts" && alerts.length>0 && (
                  <div style={{ position:"absolute", top:10, right:"calc(50% - 14px)",
                    width:5, height:5, borderRadius:99, background:G.red }} />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
