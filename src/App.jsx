import { useState, useEffect, useRef } from "react";

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

// Popular symbols for the search feature
const SYMBOL_DATABASE = [
  "BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT",
  "EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "GOLD",
  "AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "GOOGL", "META"
];

// ---------- App ----------
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [range, setRange] = useState("max");
  const [searchQuery, setSearchQuery] = useState("");
  const [trades, setTrades] = useState(() => {
    try { return JSON.parse(localStorage.getItem("trades")) || []; } catch { return []; }
  });

  const [form, setForm] = useState({ entry: "", exit: "", quantity: "", side: "buy", mood: "neutral" });
  const containerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("trades", JSON.stringify(trades));
  }, [trades]);

  const totalPnL = trades.reduce((a, t) => a + t.pnl, 0);
  const filteredSymbols = SYMBOL_DATABASE.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

  // ---------- Chart Logic ----------
  useEffect(() => {
    if (tab !== "chart") return;
    const scriptId = "tradingview-widget-script";
    let script = document.getElementById(scriptId);

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
        });
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = initWidget;
      document.body.appendChild(script);
    } else { initWidget(); }
  }, [symbol, tab]);

  const addTrade = (selectedSymbol) => {
    const pnl = pnlCalc(form);
    setTrades([{ ...form, symbol: selectedSymbol || symbol, pnl, id: Date.now() }, ...trades]);
    setForm({ entry: "", exit: "", quantity: "", side: "buy", mood: "neutral" });
    setSearchQuery("");
  };

  return (
    <div style={styles.appWrapper}>
      <div style={styles.mobileContainer}>
        
        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={styles.logo}>Pro<span style={styles.logoAccent}>Journal</span></h2>
          <div style={styles.themeBadge}>v2.5 LIVE</div>
        </div>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div style={styles.content}>
            <Card>
              <div style={styles.cardLabel}>TOTAL NET PROFIT</div>
              <h1 style={{ 
                ...styles.pnlBig, 
                color: totalPnL >= 0 ? "#00ff9c" : "#ff4d4f",
                textShadow: totalPnL >= 0 ? "0 0 20px rgba(0,255,156,0.4)" : "0 0 20px rgba(255,77,79,0.4)"
              }}>
                ${totalPnL.toFixed(2)}
              </h1>
            </Card>

            <Card>
              <div style={styles.chartHeader}>
                <span style={styles.cardLabel}>PERFORMANCE</span>
                <div style={styles.rangeRow}>
                    {['D', 'W', 'M', 'MAX'].map(r => <span key={r} style={{...styles.rangeBtn, color: r === 'MAX' ? '#00ff9c' : '#666'}}>{r}</span>)}
                </div>
              </div>
              <div style={styles.pseudoChart}>
                  {/* Equity Line Visualization */}
                  <svg width="100%" height="60" style={{marginTop: 10}}>
                    <path d="M0 40 Q 50 10, 100 35 T 200 15 T 300 45 T 400 5" fill="none" stroke="#00ff9c" strokeWidth="3" style={{filter: 'drop-shadow(0 0 5px #00ff9c)'}} />
                  </svg>
              </div>
              <div style={styles.statRow}>
                <div><div style={styles.cardLabel}>WIN RATE</div><div style={styles.statVal}>64%</div></div>
                <div><div style={styles.cardLabel}>TRADES</div><div style={styles.statVal}>{trades.length}</div></div>
              </div>
            </Card>
          </div>
        )}

        {/* CHART */}
        {tab === "chart" && (
          <div style={styles.content}>
            <div style={styles.searchWrapper}>
                <input 
                    style={styles.input} 
                    placeholder="Search Symbol..." 
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
            <div ref={containerRef} style={styles.tvContainer}></div>
          </div>
        )}

        {/* TRADES */}
        {tab === "trades" && (
          <div style={styles.content}>
            <Card>
              <h3 style={{marginTop: 0, fontSize: 18}}>Log Entry</h3>
              
              <div style={styles.searchWrapper}>
                <input 
                    style={styles.input} 
                    placeholder="Search Asset (eg. Apple, BTC)" 
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

              <div style={styles.symbolBadge}>{symbol}</div>

              <div style={styles.sideToggle}>
                <button onClick={() => setForm({...form, side: 'buy'})} style={{...styles.sideBtn, background: form.side === 'buy' ? '#00ff9c' : '#1a1a1a', color: form.side === 'buy' ? '#000' : '#fff'}}>BUY</button>
                <button onClick={() => setForm({...form, side: 'sell'})} style={{...styles.sideBtn, background: form.side === 'sell' ? '#ff4d4f' : '#1a1a1a', color: '#fff'}}>SELL</button>
              </div>

              <div style={styles.grid}>
                <input style={styles.input} placeholder="Entry" value={form.entry} onChange={e => setForm({...form, entry: e.target.value})} />
                <input style={styles.input} placeholder="Exit" value={form.exit} onChange={e => setForm({...form, exit: e.target.value})} />
                <input style={styles.input} placeholder="Qty" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
              </div>

              <button onClick={() => addTrade()} style={styles.mainBtn}>Add to Journal</button>
            </Card>

            <div style={{marginTop: 10}}>
                {trades.map(t => (
                    <div key={t.id} style={styles.tradeRow}>
                        <div>
                            <div style={{fontWeight: 'bold'}}>{t.symbol} <span style={{color: t.side === 'buy' ? '#00ff9c' : '#ff4d4f', fontSize: 10}}>{t.side.toUpperCase()}</span></div>
                            <div style={{fontSize: 12, opacity: 0.5}}>{t.entry} → {t.exit}</div>
                        </div>
                        <div style={{color: t.pnl >= 0 ? '#00ff9c' : '#ff4d4f', fontWeight: 'bold', textShadow: t.pnl >= 0 ? '0 0 10px rgba(0,255,156,0.3)' : 'none'}}>
                            {t.pnl >= 0 ? '+' : ''}{t.pnl.toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* AI COACH */}
        {tab === "ai" && (
            <div style={styles.content}>
                <Card style={{borderColor: '#00ff9c'}}>
                    <h3 style={{color: '#00ff9c', marginTop: 0}}>🧠 AI Behavioral Coach</h3>
                    <p style={{lineHeight: 1.6, opacity: 0.8}}>
                        {trades.length < 3 ? "Keep trading! I need more data to analyze your psychology." : 
                        "You tend to perform better on Tuesday mornings. However, your 'FOMO' trades are currently responsible for 40% of your losses. Tighten your discipline."}
                    </p>
                </Card>
            </div>
        )}

        {/* NAVIGATION */}
        <div style={styles.nav}>
          <Nav icon="📊" label="dashboard" active={tab} setTab={setTab} />
          <Nav icon="📈" label="chart" active={tab} setTab={setTab} />
          <Nav icon="📋" label="trades" active={tab} setTab={setTab} />
          <Nav icon="🧠" label="ai" active={tab} setTab={setTab} />
        </div>

      </div>
    </div>
  );
}

function Nav({ icon, label, active, setTab }) {
  const isActive = active === label;
  return (
    <div onClick={() => setTab(label)} style={{...styles.navItem, color: isActive ? "#00ff9c" : "#555"}}>
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 'bold' }}>{label}</div>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ ...styles.card, ...style }}>{children}</div>
  );
}

const styles = {
  appWrapper: {
    background: "#000",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center", // ALIGN MIDDLE HORIZONTALLY
    alignItems: "center",     // ALIGN MIDDLE VERTICALLY
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
  },
  mobileContainer: {
    width: "100%",
    maxWidth: "450px", // Fixed width for PC to look like mobile
    height: "90vh",
    background: "#050505",
    borderRadius: "40px",
    border: "8px solid #1a1a1a",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
  },
  header: { padding: "30px 25px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { fontSize: 24, margin: 0, fontWeight: 900, letterSpacing: -1 },
  logoAccent: { color: "#00ff9c" },
  themeBadge: { background: "#111", padding: "4px 10px", borderRadius: 20, fontSize: 10, color: "#00ff9c", border: "1px solid #00ff9c" },
  content: { flex: 1, padding: "10px 20px", overflowY: "auto" },
  card: { background: "rgba(255,255,255,0.03)", borderRadius: 30, padding: 25, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 15 },
  cardLabel: { fontSize: 10, fontWeight: 800, opacity: 0.4, letterSpacing: 1 },
  pnlBig: { fontSize: 42, margin: "10px 0", fontWeight: 900 },
  chartHeader: { display: "flex", justifyContent: "space-between", marginBottom: 10 },
  rangeRow: { display: "flex", gap: 10, fontSize: 10, fontWeight: "bold" },
  statRow: { display: "flex", justifyContent: "space-between", marginTop: 20 },
  statVal: { fontSize: 20, fontWeight: "bold" },
  tvContainer: { height: "400px", borderRadius: 20, overflow: "hidden", border: "1px solid #111" },
  searchWrapper: { position: "relative", marginBottom: 10 },
  input: { width: "100%", padding: "15px", borderRadius: "15px", background: "#111", border: "1px solid #222", color: "#fff", boxSizing: "border-box", outline: "none" },
  searchDropdown: { position: "absolute", top: "100%", width: "100%", background: "#111", borderRadius: "10px", zIndex: 10, border: "1px solid #333", overflow: "hidden" },
  searchItem: { padding: "12px", borderBottom: "1px solid #222", cursor: "pointer", fontSize: 13 },
  symbolBadge: { background: "rgba(0,255,156,0.1)", color: "#00ff9c", display: "inline-block", padding: "5px 15px", borderRadius: 10, fontSize: 12, fontWeight: "bold", marginBottom: 15 },
  sideToggle: { display: "flex", gap: 10, marginBottom: 15 },
  sideBtn: { flex: 1, padding: 12, borderRadius: 12, border: "none", fontWeight: "bold", cursor: "pointer" },
  grid: { display: "flex", gap: 8 },
  mainBtn: { width: "100%", padding: "16px", borderRadius: "15px", border: "none", background: "#00ff9c", color: "#000", fontWeight: "bold", marginTop: 15, cursor: "pointer", boxShadow: "0 10px 20px rgba(0,255,156,0.2)" },
  tradeRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 0", borderBottom: "1px solid #111" },
  nav: { height: "80px", background: "rgba(5,5,5,0.8)", backdropFilter: "blur(10px)", display: "flex", justifyContent: "space-around", alignItems: "center", borderTop: "1px solid #111" },
  navItem: { display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", transition: "0.2s" }
};