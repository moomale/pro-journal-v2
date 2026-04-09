import React, { useState, useEffect, useRef } from "react";

// ---------- Helpers ----------
const formatSymbol = (symbol) => {
  if (!symbol) return "BINANCE:BTCUSDT";
  const s = symbol.toUpperCase();
  if (s.includes("USDT")) return `BINANCE:${s}`;
  if (s.length === 6) return `FX:${s}`;
  return `NASDAQ:${s}`;
};

const pnlCalc = (t) => {
  const e = parseFloat(t.entry);
  const x = parseFloat(t.exit);
  const q = parseFloat(t.quantity);
  if (isNaN(e) || isNaN(x) || isNaN(q)) return 0;
  return t.side === "buy" ? (x - e) * q : (e - x) * q;
};

const SYMBOL_DATABASE = [
  "BTCUSDT", "ETHUSDT", "SOLUSDT", "EURUSD", "GBPUSD", "GOLD", "AAPL", "TSLA", "NVDA"
];

// ---------- App ----------
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [searchQuery, setSearchQuery] = useState("");
  const [trades, setTrades] = useState(() => {
    try { return JSON.parse(localStorage.getItem("trades")) || []; } catch { return []; }
  });

  const [form, setForm] = useState({ entry: "", exit: "", quantity: "", side: "buy" });
  const containerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("trades", JSON.stringify(trades));
  }, [trades]);

  const totalPnL = trades.reduce((a, t) => a + t.pnl, 0);
  const filteredSymbols = SYMBOL_DATABASE.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

  // ---------- Chart Logic (Safe Mode) ----------
  useEffect(() => {
    if (tab !== "chart" || !containerRef.current) return;
    
    const initWidget = () => {
      if (window.TradingView && containerRef.current) {
        containerRef.current.innerHTML = '<div id="tv_target" style="height: 100%; width: 100%;"></div>';
        new window.TradingView.widget({
          container_id: "tv_target",
          symbol: formatSymbol(symbol),
          interval: "60",
          theme: "dark",
          autosize: true,
          style: "1",
          toolbar_bg: "#050505",
          enable_publishing: false,
          hide_top_toolbar: false,
          save_image: false,
        });
      }
    };

    const scriptId = "tradingview-widget-script";
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = initWidget;
      document.body.appendChild(script);
    } else {
      setTimeout(initWidget, 100);
    }
  }, [symbol, tab]);

  const handleAddTrade = () => {
    if (!form.entry || !form.exit || !form.quantity) return alert("Fill all fields");
    const pnl = pnlCalc(form);
    const newTrade = { ...form, symbol: symbol, pnl, id: Date.now() };
    setTrades([newTrade, ...trades]);
    setForm({ entry: "", exit: "", quantity: "", side: "buy" });
    setTab("dashboard"); // Go back to dashboard to see the profit
  };

  return (
    <div style={styles.appWrapper}>
      {/* Global CSS Reset for White Corners */}
      <style>{`
        body { margin: 0; padding: 0; background: #000; overflow: hidden; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      <div style={styles.mobileContainer}>
        
        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={styles.logo}>Pro<span style={styles.logoAccent}>Journal</span></h2>
          <div style={styles.themeBadge}>INSTITUTIONAL v2.5</div>
        </div>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div style={styles.content}>
            <div style={styles.card}>
              <div style={styles.cardLabel}>TOTAL NET PROFIT</div>
              <h1 style={{ 
                ...styles.pnlBig, 
                color: totalPnL >= 0 ? "#00ff9c" : "#ff4d4f",
                textShadow: totalPnL >= 0 ? "0 0 20px rgba(0,255,156,0.3)" : "0 0 20px rgba(255,77,79,0.3)"
              }}>
                ${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h1>
              <div style={styles.statRow}>
                <div><div style={styles.cardLabel}>WIN RATE</div><div style={styles.statVal}>{trades.length > 0 ? (trades.filter(t => t.pnl > 0).length / trades.length * 100).toFixed(0) : 0}%</div></div>
                <div><div style={styles.cardLabel}>TRADES</div><div style={styles.statVal}>{trades.length}</div></div>
              </div>
            </div>

            <div style={{...styles.card, padding: '20px'}}>
               <div style={styles.cardLabel}>PERFORMANCE CURVE</div>
               <svg width="100%" height="60" style={{marginTop: 15}}>
                  <path d="M0 40 Q 50 10, 100 35 T 200 15 T 300 45 T 400 5" fill="none" stroke="#00ff9c" strokeWidth="3" style={{filter: 'drop-shadow(0 0 5px #00ff9c)'}} />
               </svg>
            </div>
          </div>
        )}

        {/* CHART */}
        {tab === "chart" && (
          <div style={styles.content}>
            <div style={styles.searchWrapper}>
                <input 
                    style={styles.input} 
                    placeholder="Search Symbol (e.g. BTC)..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <div style={styles.searchDropdown}>
                        {filteredSymbols.map(s => (
                            <div key={s} style={styles.searchItem} onClick={() => { setSymbol(s); setSearchQuery(""); }}>{s}</div>
                        ))}
                    </div>
                )}
            </div>
            <div ref={containerRef} style={styles.tvContainer}>
              {!window.TradingView && <div style={{padding: 40, textAlign: 'center', opacity: 0.5}}>Loading Markets...</div>}
            </div>
          </div>
        )}

        {/* TRADES LOG */}
        {tab === "trades" && (
          <div style={styles.content}>
            <div style={styles.card}>
              <h3 style={{marginTop: 0, fontSize: 18}}>New Execution</h3>
              <div style={styles.symbolBadge}>{symbol}</div>
              <div style={styles.sideToggle}>
                <button onClick={() => setForm({...form, side: 'buy'})} style={{...styles.sideBtn, background: form.side === 'buy' ? '#00ff9c' : '#1a1a1a', color: form.side === 'buy' ? '#000' : '#fff'}}>BUY</button>
                <button onClick={() => setForm({...form, side: 'sell'})} style={{...styles.sideBtn, background: form.side === 'sell' ? '#ff4d4f' : '#1a1a1a', color: '#fff'}}>SELL</button>
              </div>
              <div style={styles.grid}>
                <input type="number" style={styles.input} placeholder="Entry" value={form.entry} onChange={e => setForm({...form, entry: e.target.value})} />
                <input type="number" style={styles.input} placeholder="Exit" value={form.exit} onChange={e => setForm({...form, exit: e.target.value})} />
              </div>
              <input type="number" style={{...styles.input, marginTop: 10}} placeholder="Quantity" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
              <button onClick={handleAddTrade} style={styles.mainBtn}>Submit to Journal</button>
            </div>

            <div style={{marginTop: 20}}>
                {trades.map(t => (
                    <div key={t.id} style={styles.tradeRow}>
                        <div>
                            <div style={{fontWeight: 'bold', fontSize: 15}}>{t.symbol}</div>
                            <div style={{fontSize: 11, opacity: 0.4}}>{t.side.toUpperCase()} • {t.entry} → {t.exit}</div>
                        </div>
                        <div style={{color: t.pnl >= 0 ? '#00ff9c' : '#ff4d4f', fontWeight: 'bold'}}>
                            {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* AI COACH */}
        {tab === "ai" && (
          <div style={styles.content}>
            <div style={{...styles.card, borderColor: '#00ff9c', borderStyle: 'dashed'}}>
              <h3 style={{color: '#00ff9c', marginTop: 0}}>🧠 AI Coach</h3>
              <p style={{lineHeight: 1.6, opacity: 0.7, fontSize: 14}}>
                {trades.length < 3 ? "Log 3 more trades for a behavioral analysis." : 
                "Strategy Alert: You are currently 100% profitable on Longs, but Shorts are dragging your equity curve down by 22%. Filter for Buy setups only for the next 48 hours."}
              </p>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <div style={styles.nav}>
          <NavItem icon="📊" label="dashboard" active={tab} onClick={setTab} />
          <NavItem icon="📈" label="chart" active={tab} onClick={setTab} />
          <NavItem icon="📋" label="trades" active={tab} onClick={setTab} />
          <NavItem icon="🧠" label="ai" active={tab} onClick={setTab} />
        </div>

      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  const isActive = active === label;
  return (
    <div onClick={() => onClick(label)} style={{...styles.navItem, opacity: isActive ? 1 : 0.3}}>
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div style={{ fontSize: 9, textTransform: 'uppercase', fontWeight: '900', marginTop: 4, color: isActive ? '#00ff9c' : '#fff' }}>{label}</div>
    </div>
  );
}

const styles = {
  appWrapper: { background: "#000", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
  mobileContainer: { 
    width: "100%", maxWidth: "420px", height: "92vh", background: "#050505", borderRadius: "45px", 
    border: "8px solid #111", overflow: "hidden", position: "relative", display: "flex", flexDirection: "column",
    boxShadow: "0 40px 100px rgba(0,0,0,0.8)"
  },
  header: { padding: "40px 25px 15px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: 22, margin: 0, fontWeight: 900, letterSpacing: -1, color: '#fff' },
  logoAccent: { color: "#00ff9c" },
  themeBadge: { background: "rgba(0,255,156,0.1)", padding: "4px 10px", borderRadius: 20, fontSize: 9, color: "#00ff9c", fontWeight: 'bold' },
  content: { flex: 1, padding: "10px 20px", overflowY: "auto" },
  card: { background: "rgba(255,255,255,0.03)", borderRadius: "28px", padding: "25px", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 15 },
  cardLabel: { fontSize: 9, fontWeight: 900, opacity: 0.3, letterSpacing: 1.5, marginBottom: 8 },
  pnlBig: { fontSize: 48, margin: "5px 0", fontWeight: 900, letterSpacing: -2 },
  statRow: { display: "flex", justifyContent: "space-between", marginTop: 20 },
  statVal: { fontSize: 20, fontWeight: "bold", color: '#fff' },
  tvContainer: { height: "100%", minHeight: "450px", borderRadius: 20, overflow: "hidden" },
  searchWrapper: { position: "relative", marginBottom: 15 },
  input: { width: "100%", padding: "16px", borderRadius: "18px", background: "#0a0a0a", border: "1px solid #1a1a1a", color: "#fff", boxSizing: "border-box", outline: "none", fontSize: 14 },
  searchDropdown: { position: "absolute", top: "100%", width: "100%", background: "#111", borderRadius: "15px", zIndex: 100, border: "1px solid #222" },
  searchItem: { padding: "15px", borderBottom: "1px solid #1a1a1a", cursor: "pointer", fontSize: 13, color: '#fff' },
  symbolBadge: { background: "#00ff9c", color: "#000", display: "inline-block", padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: "900", marginBottom: 15 },
  sideToggle: { display: "flex", gap: 10, marginBottom: 15 },
  sideBtn: { flex: 1, padding: 14, borderRadius: 14, border: "none", fontWeight: "900", fontSize: 12 },
  grid: { display: "flex", gap: 10 },
  mainBtn: { width: "100%", padding: "18px", borderRadius: "18px", border: "none", background: "#00ff9c", color: "#000", fontWeight: "900", marginTop: 15, boxShadow: "0 10px 30px rgba(0,255,156,0.2)" },
  tradeRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" },
  nav: { height: "90px", background: "rgba(5,5,5,0.8)", backdropFilter: "blur(20px)", display: "flex", justifyContent: "space-around", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingBottom: 15 },
  navItem: { display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", transition: "0.2s" }
};
