import React, { useState, useEffect } from "react";

// --- Helpers ---
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

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [trades, setTrades] = useState(() => {
    const saved = localStorage.getItem("pro_journal_trades");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("pro_journal_trades", JSON.stringify(trades));
  }, [trades]);

  const totalPnL = trades.reduce((sum, t) => sum + pnlCalc(t), 0);
  const winRate = trades.length > 0 
    ? (trades.filter(t => pnlCalc(t) > 0).length / trades.length * 100).toFixed(1) 
    : 0;

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: "100px" }}>
      {/* Header */}
      <div style={{ padding: "30px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "900" }}>PRO<span style={{ color: "#00ff9c" }}>JOURNAL</span></h1>
        <div style={{ background: "#111", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", color: "#00ff9c", border: "1px solid #00ff9c" }}>LIVE MARKET</div>
      </div>

      <div style={{ padding: "0 20px" }}>
        {activeTab === "dashboard" && (
          <div>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "30px", padding: "30px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "20px" }}>
              <p style={{ margin: 0, opacity: 0.5, fontSize: "12px", fontWeight: "bold" }}>TOTAL PROFIT</p>
              <h2 style={{ fontSize: "48px", margin: "10px 0", color: totalPnL >= 0 ? "#00ff9c" : "#ff4444" }}>
                ${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
              <div style={{ display: "flex", gap: "20px" }}>
                <div><p style={{ margin: 0, opacity: 0.5, fontSize: "10px" }}>WIN RATE</p><p style={{ margin: 0, fontWeight: "bold" }}>{winRate}%</p></div>
                <div><p style={{ margin: 0, opacity: 0.5, fontSize: "10px" }}>TRADES</p><p style={{ margin: 0, fontWeight: "bold" }}>{trades.length}</p></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "trades" && (
          <div>
             <h3 style={{ marginBottom: "20px" }}>Recent History</h3>
             {trades.length === 0 ? <p style={{ opacity: 0.5 }}>No trades logged yet.</p> : 
               trades.map((t, i) => (
                 <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: "1px solid #222" }}>
                   <div>
                     <p style={{ margin: 0, fontWeight: "bold" }}>{t.symbol}</p>
                     <p style={{ margin: 0, fontSize: "12px", opacity: 0.5 }}>{t.side.toUpperCase()} @ {t.entry}</p>
                   </div>
                   <p style={{ fontWeight: "bold", color: pnlCalc(t) >= 0 ? "#00ff9c" : "#ff4444" }}>
                     {pnlCalc(t) >= 0 ? "+" : ""}${pnlCalc(t).toFixed(2)}
                   </p>
                 </div>
               ))
             }
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ position: "fixed", bottom: 0, width: "100%", height: "80px", background: "rgba(10,10,10,0.8)", backdropFilter: "blur(10px)", display: "flex", justifyContent: "space-around", alignItems: "center", borderTop: "1px solid #222" }}>
        <div onClick={() => setActiveTab("dashboard")} style={{ opacity: activeTab === "dashboard" ? 1 : 0.4, cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "20px" }}>📊</div>
          <span style={{ fontSize: "10px", fontWeight: "bold" }}>DASHBOARD</span>
        </div>
        <div onClick={() => setActiveTab("trades")} style={{ opacity: activeTab === "trades" ? 1 : 0.4, cursor: "pointer", textAlign: "center" }}>
          <div style={{ fontSize: "20px" }}>🧾</div>
          <span style={{ fontSize: "10px", fontWeight: "bold" }}>TRADES</span>
        </div>
      </nav>
    </div>
  );
}
