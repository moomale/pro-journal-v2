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

  // Form State
  const [formData, setFormData] = useState({ symbol: "", entry: "", exit: "", quantity: "", side: "buy" });

  useEffect(() => {
    localStorage.setItem("pro_journal_trades", JSON.stringify(trades));
  }, [trades]);

  const addTrade = () => {
    if (!formData.symbol || !formData.entry || !formData.exit) return alert("Please fill in all fields");
    setTrades([formData, ...trades]);
    setFormData({ symbol: "", entry: "", exit: "", quantity: "", side: "buy" });
    setShowModal(false);
  };

  const totalPnL = trades.reduce((sum, t) => sum + pnlCalc(t), 0);
  const winRate = trades.length > 0 
    ? (trades.filter(t => pnlCalc(t) > 0).length / trades.length * 100).toFixed(1) 
    : 0;

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", fontFamily: "sans-serif", paddingBottom: "100px" }}>
      {/* Header */}
      <div style={{ padding: "30px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "900" }}>PRO<span style={{ color: "#00ff9c" }}>JOURNAL</span></h1>
        <button onClick={() => setShowModal(true)} style={{ background: "#00ff9c", color: "#000", border: "none", padding: "10px 20px", borderRadius: "12px", fontWeight: "bold" }}>+ LOG TRADE</button>
      </div>

      <div style={{ padding: "0 20px" }}>
        {activeTab === "dashboard" && (
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "30px", padding: "30px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ margin: 0, opacity: 0.5, fontSize: "12px", fontWeight: "bold" }}>TOTAL PROFIT</p>
            <h2 style={{ fontSize: "48px", margin: "10px 0", color: totalPnL >= 0 ? "#00ff9c" : "#ff4444" }}>
              ${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
            <div style={{ display: "flex", gap: "20px" }}>
              <div><p style={{ margin: 0, opacity: 0.5, fontSize: "10px" }}>WIN RATE</p><p style={{ margin: 0, fontWeight: "bold" }}>{winRate}%</p></div>
              <div><p style={{ margin: 0, opacity: 0.5, fontSize: "10px" }}>TRADES</p><p style={{ margin: 0, fontWeight: "bold" }}>{trades.length}</p></div>
            </div>
          </div>
        )}

        {activeTab === "trades" && (
          <div>
            <h3 style={{ marginBottom: "20px" }}>Trade History</h3>
            {trades.map((t, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: "1px solid #222" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>{t.symbol.toUpperCase()}</p>
                  <p style={{ margin: 0, fontSize: "12px", opacity: 0.5 }}>{t.side.toUpperCase()} @ {t.entry}</p>
                </div>
                <p style={{ fontWeight: "bold", color: pnlCalc(t) >= 0 ? "#00ff9c" : "#ff4444" }}>
                  {pnlCalc(t) >= 0 ? "+" : ""}${pnlCalc(t).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#111", width: "90%", padding: "30px", borderRadius: "24px", border: "1px solid #222" }}>
            <h2 style={{ marginTop: 0 }}>Log New Trade</h2>
            <input placeholder="Symbol (e.g. BTCUSDT)" style={inputStyle} onChange={e => setFormData({...formData, symbol: e.target.value})} />
            <div style={{ display: "flex", gap: "10px" }}>
              <input placeholder="Entry Price" type="number" style={inputStyle} onChange={e => setFormData({...formData, entry: e.target.value})} />
              <input placeholder="Exit Price" type="number" style={inputStyle} onChange={e => setFormData({...formData, exit: e.target.value})} />
            </div>
            <input placeholder="Quantity" type="number" style={inputStyle} onChange={e => setFormData({...formData, quantity: e.target.value})} />
            <select style={inputStyle} onChange={e => setFormData({...formData, side: e.target.value})}>
              <option value="buy">BUY / LONG</option>
              <option value="sell">SELL / SHORT</option>
            </select>
            <button onClick={addTrade} style={{ width: "100%", background: "#00ff9c", color: "#000", border: "none", padding: "15px", borderRadius: "12px", fontWeight: "bold", marginTop: "10px" }}>SAVE TRADE</button>
            <button onClick={() => setShowModal(false)} style={{ width: "100%", background: "transparent", color: "#fff", border: "none", marginTop: "15px", opacity: 0.5 }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ position: "fixed", bottom: 0, width: "100%", height: "80px", background: "rgba(10,10,10,0.8)", backdropFilter: "blur(10px)", display: "flex", justifyContent: "space-around", alignItems: "center", borderTop: "1px solid #222" }}>
        <div onClick={() => setActiveTab("dashboard")} style={{ opacity: activeTab === "dashboard" ? 1 : 0.4, cursor: "pointer", textAlign: "center" }}>📊<br/><span style={{fontSize:'10px'}}>DASHBOARD</span></div>
        <div onClick={() => setActiveTab("trades")} style={{ opacity: activeTab === "trades" ? 1 : 0.4, cursor: "pointer", textAlign: "center" }}>🧾<br/><span style={{fontSize:'10px'}}>TRADES</span></div>
      </nav>
    </div>
  );
}

const inputStyle = { width: "100%", background: "#050505", border: "1px solid #222", color: "#fff", padding: "12px", borderRadius: "10px", marginBottom: "10px", boxSizing: "border-box" };
