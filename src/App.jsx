import React, { useState, useEffect } from "react";

// --- Helpers ---
const pnlCalc = (t) => {
  const e = parseFloat(t.entry), x = parseFloat(t.exit), q = parseFloat(t.quantity);
  if (isNaN(e) || isNaN(x) || isNaN(q)) return 0;
  return t.side === "buy" ? (x - e) * q : (e - x) * q;
};

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [trades, setTrades] = useState(() => {
    const saved = localStorage.getItem("pro_journal_trades");
    return saved ? JSON.parse(saved) : [];
  });
  const [formData, setFormData] = useState({ symbol: "", entry: "", exit: "", quantity: "", side: "buy" });

  useEffect(() => {
    localStorage.setItem("pro_journal_trades", JSON.stringify(trades));
  }, [trades]);

  const totalPnL = trades.reduce((sum, t) => sum + pnlCalc(t), 0);
  const winRate = trades.length > 0 ? (trades.filter(t => pnlCalc(t) > 0).length / trades.length * 100).toFixed(0) : 0;

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", paddingBottom: "100px" }}>
      
      {/* Header with Neon Logo */}
      <div style={{ padding: "40px 25px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "800", letterSpacing: "-1px" }}>PRO<span style={{ color: "#00ff9c", textShadow: "0 0 15px rgba(0,255,156,0.3)" }}>JOURNAL</span></h1>
          <p style={{ margin: 0, fontSize: "10px", opacity: 0.4, fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>Institutional Grade</p>
        </div>
        <button onClick={() => setShowModal(true)} style={glowBtn}>+ NEW TRADE</button>
      </div>

      <div style={{ padding: "0 20px" }}>
        {activeTab === "dashboard" && (
          <div>
            {/* Main PnL Card */}
            <div style={glassCard}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <span style={labelStyle}>NET PROFIT</span>
                <span style={{ color: "#00ff9c", fontSize: "10px", fontWeight: "bold" }}>● LIVE</span>
              </div>
              <h2 style={{ fontSize: "52px", margin: "0 0 15px 0", fontWeight: "900", color: totalPnL >= 0 ? "#00ff9c" : "#ff4444", letterSpacing: "-2px" }}>
                ${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
              <div style={{ display: "flex", gap: "30px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "15px" }}>
                <div><p style={labelStyle}>WIN RATE</p><p style={valStyle}>{winRate}%</p></div>
                <div><p style={labelStyle}>TOTAL TRADES</p><p style={valStyle}>{trades.length}</p></div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div style={smallCard}><p style={labelStyle}>AVG WIN</p><p style={{...valStyle, color: "#00ff9c"}}>$--</p></div>
              <div style={smallCard}><p style={labelStyle}>MAX DRAWDOWN</p><p style={{...valStyle, color: "#ff4444"}}>$--</p></div>
            </div>
          </div>
        )}

        {activeTab === "trades" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "20px", opacity: 0.8 }}>History</h3>
            {trades.length === 0 ? <div style={glassCard}><p style={{opacity: 0.3, textAlign: 'center'}}>No data points yet.</p></div> : 
              trades.map((t, i) => (
                <div key={i} style={tradeRow}>
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold", fontSize: "16px" }}>{t.symbol.toUpperCase()}</p>
                    <p style={{ margin: 0, fontSize: "11px", opacity: 0.4 }}>{t.side.toUpperCase()} • QTY {t.quantity}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontWeight: "900", color: pnlCalc(t) >= 0 ? "#00ff9c" : "#ff4444" }}>
                      {pnlCalc(t) >= 0 ? "+" : ""}${pnlCalc(t).toFixed(2)}
                    </p>
                    <p style={{ margin: 0, fontSize: "10px", opacity: 0.4 }}>{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {/* Modal / Form */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
             <h2 style={{ marginTop: 0, fontSize: "20px" }}>Log Execution</h2>
             <input placeholder="Asset (BTC, EURUSD...)" style={inputStyle} onChange={e => setFormData({...formData, symbol: e.target.value})} />
             <div style={{ display: "flex", gap: "10px" }}>
               <input placeholder="Entry" type="number" style={inputStyle} onChange={e => setFormData({...formData, entry: e.target.value})} />
               <input placeholder="Exit" type="number" style={inputStyle} onChange={e => setFormData({...formData, exit: e.target.value})} />
             </div>
             <input placeholder="Quantity" type="number" style={inputStyle} onChange={e => setFormData({...formData, quantity: e.target.value})} />
             <select style={inputStyle} onChange={e => setFormData({...formData, side: e.target.value})}>
               <option value="buy">LONG / BUY</option>
               <option value="sell">SHORT / SELL</option>
             </select>
             <button onClick={() => {
                if(!formData.symbol || !formData.entry) return;
                setTrades([formData, ...trades]);
                setShowModal(false);
             }} style={saveBtn}>CONFIRM TRADE</button>
             <button onClick={() => setShowModal(false)} style={{ width: "100%", background: "none", border: "none", color: "#666", marginTop: "15px", fontSize: "12px" }}>Dismiss</button>
          </div>
        </div>
      )}

      {/* Nav Bar */}
      <nav style={navStyle}>
        <div onClick={() => setActiveTab("dashboard")} style={{ opacity: activeTab === "dashboard" ? 1 : 0.3, cursor: "pointer" }}>
          <div style={{ fontSize: "20px", marginBottom: "4px" }}>📊</div>
          <span style={{ fontSize: "9px", fontWeight: "bold", letterSpacing: "1px" }}>DASHBOARD</span>
        </div>
        <div onClick={() => setActiveTab("trades")} style={{ opacity: activeTab === "trades" ? 1 : 0.3, cursor: "pointer" }}>
          <div style={{ fontSize: "20px", marginBottom: "4px" }}>🧾</div>
          <span style={{ fontSize: "9px", fontWeight: "bold", letterSpacing: "1px" }}>HISTORY</span>
        </div>
      </nav>
    </div>
  );
}

// --- Styles ---
const glassCard = { background: "rgba(255,255,255,0.03)", borderRadius: "24px", padding: "25px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "15px", backdropFilter: "blur(10px)" };
const smallCard = { background: "rgba(255,255,255,0.03)", borderRadius: "20px", padding: "20px", border: "1px solid rgba(255,255,255,0.05)" };
const labelStyle = { margin: 0, fontSize: "9px", fontWeight: "900", opacity: 0.4, letterSpacing: "1px" };
const valStyle = { margin: "5px 0 0 0", fontSize: "18px", fontWeight: "bold" };
const glowBtn = { background: "#00ff9c", color: "#000", border: "none", padding: "10px 18px", borderRadius: "12px", fontWeight: "900", fontSize: "11px", boxShadow: "0 0 20px rgba(0,255,156,0.3)" };
const navStyle = { position: "fixed", bottom: 0, width: "100%", height: "90px", background: "rgba(5,5,5,0.8)", backdropFilter: "blur(20px)", display: "flex", justifyContent: "space-around", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingBottom: "20px" };
const tradeRow = { display: "flex", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalContent = { background: "#0a0a0a", width: "85%", padding: "30px", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" };
const inputStyle = { width: "100%", background: "#111", border: "1px solid #222", color: "#fff", padding: "15px", borderRadius: "15px", marginBottom: "12px", boxSizing: "border-box", fontSize: "14px" };
const saveBtn = { width: "100%", background: "#00ff9c", color: "#000", border: "none", padding: "16px", borderRadius: "15px", fontWeight: "bold", fontSize: "14px", marginTop: "10px" };
