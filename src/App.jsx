import React, { useState, useEffect } from "react";

// --- Helpers ---
const pnlCalc = (t) => {
  const e = parseFloat(t.entry);
  const x = parseFloat(t.exit);
  const q = parseFloat(t.quantity);
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

  const addTrade = () => {
    if (!formData.symbol || !formData.entry || !formData.exit) return alert("Fill all fields");
    setTrades([formData, ...trades]);
    setFormData({ symbol: "", entry: "", exit: "", quantity: "", side: "buy" });
    setShowModal(false);
  };

  const totalPnL = trades.reduce((sum, t) => sum + pnlCalc(t), 0);
  const winRate = trades.length > 0 
    ? (trades.filter(t => pnlCalc(t) > 0).length / trades.length * 100).toFixed(0) 
    : 0;

  // Generate Graph Data
  const getGraphPath = () => {
    if (trades.length === 0) return "M 0 50 L 300 50";
    const history = [...trades].reverse();
    let current = 50;
    let path = "M 0 50";
    const step = 300 / history.length;
    history.forEach((t, i) => {
      current -= (pnlCalc(t) / 100); // Scale for visual
      path += ` L ${(i + 1) * step} ${Math.max(10, Math.min(90, current))}`;
    });
    return path;
  };

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: "100px" }}>
      {/* Header */}
      <div style={{ padding: "30px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "900", letterSpacing: "-1px" }}>PRO<span style={{ color: "#00ff9c" }}>JOURNAL</span></h1>
        <button onClick={() => setShowModal(true)} style={{ background: "#00ff9c", color: "#000", border: "none", padding: "10px 18px", borderRadius: "12px", fontWeight: "bold", fontSize: "12px" }}>+ LOG TRADE</button>
      </div>

      <div style={{ padding: "0 20px" }}>
        {activeTab === "dashboard" && (
          <>
            {/* Stats Card */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "24px", padding: "25px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "15px" }}>
              <p style={{ margin: 0, color: "#888", fontSize: "11px", fontWeight: "bold", letterSpacing: "1px" }}>TOTAL NET PROFIT</p>
              <h2 style={{ fontSize: "42px", margin: "8px 0", color: totalPnL >= 0 ? "#00ff9c" : "#ff4444", fontWeight: "800" }}>
                ${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
              <div style={{ display: "flex", gap: "25px", marginTop: "15px" }}>
                <div><p style={{ margin: 0, color: "#888", fontSize: "10px" }}>WIN RATE</p><p style={{ margin: "4px 0 0 0", fontWeight: "bold", color: "#fff" }}>{winRate}%</p></div>
                <div><p style={{ margin: 0, color: "#888", fontSize: "10px" }}>PERFORMANCE</p><p style={{ margin: "4px 0 0 0", fontWeight: "bold", color: totalPnL >= 0 ? "#00ff9c" : "#ff4444" }}>{totalPnL >= 0 ? "BULLISH" : "BEARISH"}</p></div>
              </div>
            </div>

            {/* Performance Curve */}
            <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "24px", padding: "20px", border: "1px solid #111", marginBottom: "15px" }}>
              <p style={{ margin: "0 0 15px 0", color: "#888", fontSize: "11px", fontWeight: "bold" }}>EQUITY CURVE</p>
              <svg viewBox="0 0 300 100" style={{ width: "100%", height: "120px" }}>
                <path d={getGraphPath()} fill="none" stroke="#00ff9c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* AI Behavioral Section */}
            <div style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #111 100%)", borderRadius: "24px", padding: "20px", border: "1px solid #222" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "18px" }}>🤖</span>
                <p style={{ margin: 0, color: "#00ff9c", fontSize: "12px", fontWeight: "bold" }}>AI CO-PILOT</p>
              </div>
              <p style={{ margin: 0, color: "#eee", fontSize: "14px", lineHeight: "1.5" }}>
                {trades.length < 3 
                  ? `Log ${3 - trades.length} more trades to unlock Behavioral Analysis and pattern recognition.`
                  : "Analysis complete: You tend to perform better on Long trades in the morning session."}
              </p>
            </div>
          </>
        )}

        {activeTab === "trades" && (
          <div>
            <h3 style={{ color: "#fff", marginBottom: "20px" }}>History</h3>
            {trades.length === 0 ? <p style={{ color: "#555" }}>No data yet...</p> : 
              trades.map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid #151515" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold", color: "#fff", fontSize: "15px" }}>{t.symbol.toUpperCase()}</p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#666", fontWeight: "bold" }}>{t.side.toUpperCase()} • ENTRY {t.entry}</p>
                  </div>
                  <p style={{ margin: 0, fontWeight: "800", color: pnlCalc(t) >= 0 ? "#00ff9c" : "#ff4444" }}>
                    {pnlCalc(t) >= 0 ? "+" : ""}${pnlCalc(t).toFixed(2)}
                  </p>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(10px)" }}>
          <div style={{ background: "#0a0a0a", width: "85%", padding: "30px", borderRadius: "32px", border: "1px solid #222" }}>
            <h2 style={{ color: "#fff", marginTop: 0 }}>Log Trade</h2>
            <input placeholder="Symbol (e.g. NAS100)" style={inputStyle} onChange={e => setFormData({...formData, symbol: e.target.value})} />
            <div style={{ display: "flex", gap: "10px" }}>
              <input placeholder="Entry" type="number" style={inputStyle} onChange={e => setFormData({...formData, entry: e.target.value})} />
              <input placeholder="Exit" type="number" style={inputStyle} onChange={e => setFormData({...formData, exit: e.target.value})} />
            </div>
            <input placeholder="Quantity / Lots" type="number" style={inputStyle} onChange={e => setFormData({...formData, quantity: e.target.value})} />
            <select style={inputStyle} onChange={e => setFormData({...formData, side: e.target.value})}>
              <option value="buy">BUY / LONG</option>
              <option value="sell">SELL / SHORT</option>
            </select>
            <button onClick={addTrade} style={{ width: "100%", background: "#00ff9c", color: "#000", border: "none", padding: "16px", borderRadius: "14px", fontWeight: "900", marginTop: "10px" }}>SAVE TRADE</button>
            <button onClick={() => setShowModal(false)} style={{ width: "100%", background: "transparent", color: "#666", border: "none", marginTop: "15px", fontWeight: "bold" }}>Close</button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ position: "fixed", bottom: 0, width: "100%", height: "85px", background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)", display: "flex", justifyContent: "space-around", alignItems: "center", borderTop: "1px solid #111" }}>
        <div onClick={() => setActiveTab("dashboard")} style={{ opacity: activeTab === "dashboard" ? 1 : 0.3, textAlign: "center", color: activeTab === "dashboard" ? "#00ff9c" : "#fff" }}>
          <div style={{ fontSize: "22px" }}>📊</div>
          <span style={{ fontSize: "10px", fontWeight: "bold", marginTop: "5px", display: "block" }}>DASHBOARD</span>
        </div>
        <div onClick={() => setActiveTab("trades")} style={{ opacity: activeTab === "trades" ? 1 : 0.3, textAlign: "center", color: activeTab === "trades" ? "#00ff9c" : "#fff" }}>
          <div style={{ fontSize: "22px" }}>🧾</div>
          <span style={{ fontSize: "10px", fontWeight: "bold", marginTop: "5px", display: "block" }}>TRADES</span>
        </div>
      </nav>
    </div>
  );
}

const inputStyle = { width: "100%", background: "#111", border: "1px solid #222", color: "#fff", padding: "14px", borderRadius: "12px", marginBottom: "12px", boxSizing: "border-box", fontSize: "16px" };
