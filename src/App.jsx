import React, { useState, useEffect } from "react";

const COLORS = {
  bg: '#000000',
  card: '#121214',
  border: '#1C1C1E',
  accent: '#2E5BFF', 
  textMain: '#FFFFFF',
  textMuted: '#8E8E93',
  buy: '#00FF9C',
  sell: '#FF3B30'
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLog, setShowLog] = useState(false);
  const [logStep, setLogStep] = useState(1);
  const [trade, setTrade] = useState({ symbol: '', side: 'buy', entry: '', exit: '', mood: '🧘' });

  // --- NEW: BUILD ON TOP - DATA PERSISTENCE ---
  const [trades, setTrades] = useState(() => {
    const saved = localStorage.getItem("pro_journal_trades");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("pro_journal_trades", JSON.stringify(trades));
  }, [trades]);

  const handleConfirmLog = () => {
    // Calculate P/L based on side
    const entryNum = parseFloat(trade.entry) || 0;
    const exitNum = parseFloat(trade.exit) || 0;
    const pnl = trade.side === 'buy' ? (exitNum - entryNum) : (entryNum - exitNum);

    const newEntry = {
      ...trade,
      id: Date.now(),
      pnl: pnl,
      date: new Date().toLocaleDateString()
    };

    setTrades([newEntry, ...trades]);
    setShowLog(false);
    setLogStep(1);
    setActiveTab('trades'); // Auto-switch to history to see the result
  };

  // --- UI COMPONENTS ---

  const TradeLogModal = () => (
    <div style={modalOverlay}>
      <div style={logSheet}>
        <div style={logHeader}>
          <button onClick={() => {setShowLog(false); setLogStep(1)}} style={closeBtn}>Cancel</button>
          <div style={stepDots}>
            <div style={{...dot, background: logStep >= 1 ? COLORS.accent : '#333'}} />
            <div style={{...dot, background: logStep >= 2 ? COLORS.accent : '#333'}} />
            <div style={{...dot, background: logStep >= 3 ? COLORS.accent : '#333'}} />
          </div>
          <div style={{width: '60px'}} /> 
        </div>

        {logStep === 1 && (
          <div style={fadeSlide}>
            <h2 style={logTitle}>What are we<br/>trading?</h2>
            <input 
              autoFocus
              placeholder="BTC, NAS100, AAPL..." 
              style={hugeInput} 
              onChange={(e) => setTrade({...trade, symbol: e.target.value})}
            />
            <div style={sideSwitch}>
              <div onClick={() => setTrade({...trade, side: 'buy'})} style={{...sideBtn, background: trade.side === 'buy' ? COLORS.buy : 'transparent', color: trade.side === 'buy' ? '#000' : '#fff'}}>BUY</div>
              <div onClick={() => setTrade({...trade, side: 'sell'})} style={{...sideBtn, background: trade.side === 'sell' ? COLORS.sell : 'transparent', color: trade.side === 'sell' ? '#000' : '#fff'}}>SELL</div>
            </div>
          </div>
        )}

        {logStep === 2 && (
          <div style={fadeSlide}>
            <h2 style={logTitle}>The Numbers</h2>
            <div style={inputGroup}>
              <label style={miniLabel}>ENTRY PRICE</label>
              <input type="number" placeholder="0.00" style={mediumInput} onChange={e => setTrade({...trade, entry: e.target.value})} />
            </div>
            <div style={inputGroup}>
              <label style={miniLabel}>EXIT PRICE</label>
              <input type="number" placeholder="0.00" style={mediumInput} onChange={e => setTrade({...trade, exit: e.target.value})} />
            </div>
          </div>
        )}

        {logStep === 3 && (
          <div style={fadeSlide}>
            <h2 style={logTitle}>State of mind</h2>
            <p style={{color: COLORS.textMuted, marginBottom: '30px'}}>Be honest—how did you feel?</p>
            <div style={moodGrid}>
              {['🧘 Zen', '⚡ FOMO', '😰 Anxious', '📉 Tired'].map(m => (
                <div key={m} onClick={() => setTrade({...trade, mood: m})} style={{...moodCard, borderColor: trade.mood === m ? COLORS.accent : COLORS.border}}>
                  {m}
                </div>
              ))}
            </div>
          </div>
        )}

        <button 
          onClick={() => logStep < 3 ? setLogStep(logStep + 1) : handleConfirmLog()} 
          style={primaryAction}
        >
          {logStep === 3 ? "Confirm & Log Trade" : "Next Step"}
        </button>
      </div>
    </div>
  );

  // --- NEW: BUILD ON TOP - HISTORY LIST ITEM ---
  const TradeItem = ({ item }) => (
    <div style={tradeItemStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={moodIconSmall}>{item.mood.split(' ')[0]}</div>
        <div>
          <div style={{ fontWeight: 'bold' }}>{item.symbol.toUpperCase()}</div>
          <div style={{ fontSize: '10px', color: COLORS.textMuted }}>{item.side.toUpperCase()} • {item.date}</div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 'bold', color: item.pnl >= 0 ? COLORS.buy : COLORS.sell }}>
          {item.pnl >= 0 ? '+' : ''}{item.pnl.toFixed(2)}
        </div>
        <div style={{ fontSize: '10px', color: COLORS.textMuted }}>Net P/L</div>
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{fontSize: '24px', fontWeight: '900'}}>PRO<span style={{color: COLORS.accent}}>JOURNAL</span></h1>
        <div style={{fontSize: '20px'}}>⚙️</div>
      </div>

      {activeTab === 'dashboard' ? (
        <div style={fadeSlide}>
          <div style={statsCard}>
            <p style={miniLabel}>TOTAL NET PERFORMANCE</p>
            <h2 style={{ fontSize: '36px', fontWeight: '900', margin: '10px 0' }}>
              ${trades.reduce((sum, t) => sum + t.pnl, 0).toLocaleString()}
            </h2>
            <div style={{ fontSize: '12px', color: COLORS.accent, fontWeight: 'bold' }}>{trades.length} TRADES LOGGED</div>
          </div>
          <p style={{color: COLORS.textMuted}}>Your identity is locked in. Let's trade.</p>
        </div>
      ) : (
        <div style={fadeSlide}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>Trade History</h2>
          {trades.length === 0 ? (
            <p style={{ color: COLORS.textMuted, textAlign: 'center', marginTop: '40px' }}>No trades logged yet.</p>
          ) : (
            trades.map(t => <TradeItem key={t.id} item={t} />)
          )}
        </div>
      )}

      {/* BOTTOM NAVIGATION */}
      <div style={bottomNav}>
        <div onClick={() => setActiveTab('dashboard')} style={{...navIcon, opacity: activeTab === 'dashboard' ? 1 : 0.3}}>📊</div>
        <div onClick={() => setShowLog(true)} style={fabStyle}>+</div>
        <div onClick={() => setActiveTab('trades')} style={{...navIcon, opacity: activeTab === 'trades' ? 1 : 0.3}}>🧾</div>
      </div>
      
      {showLog && <TradeLogModal />}
    </div>
  );
}

// --- STYLES (Retaining your exact styles + adding only what's new) ---
const containerStyle = { background: COLORS.bg, color: COLORS.textMain, minHeight: '100vh', padding: '40px 20px', paddingBottom: '100px', fontFamily: '-apple-system, sans-serif', boxSizing: 'border-box' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', alignItems: 'flex-end' };
const logSheet = { background: '#0A0A0A', width: '100%', height: '90%', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', padding: '30px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' };
const logHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' };
const closeBtn = { background: 'transparent', border: 'none', color: COLORS.textMuted, fontSize: '16px', width: '60px' };
const stepDots = { display: 'flex', gap: '8px' };
const dot = { width: '6px', height: '6px', borderRadius: '50%' };
const logTitle = { fontSize: '36px', fontWeight: '800', marginBottom: '20px', letterSpacing: '-1px', lineHeight: '1.1' };
const hugeInput = { background: 'transparent', border: 'none', color: '#fff', fontSize: '48px', fontWeight: 'bold', width: '100%', outline: 'none', marginBottom: '30px' };
const sideSwitch = { display: 'flex', background: '#1C1C1E', borderRadius: '14px', padding: '4px' };
const sideBtn = { flex: 1, textAlign: 'center', padding: '12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: '0.2s' };
const inputGroup = { marginBottom: '25px' };
const miniLabel = { fontSize: '10px', color: COLORS.textMuted, fontWeight: 'bold', letterSpacing: '1px', display: 'block', marginBottom: '8px' };
const mediumInput = { background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '15px', color: '#fff', fontSize: '20px', width: '100%', boxSizing: 'border-box' };
const moodGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };
const moodCard = { background: '#111', padding: '20px', borderRadius: '20px', border: '1px solid #222', textAlign: 'center', fontWeight: 'bold' };
const primaryAction = { background: COLORS.accent, color: '#fff', border: 'none', padding: '20px', borderRadius: '20px', fontSize: '18px', fontWeight: 'bold', marginTop: 'auto', boxShadow: '0 10px 30px rgba(46,91,255,0.3)' };
const fabStyle = { background: COLORS.accent, width: '64px', height: '64px', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', boxShadow: '0 15px 35px rgba(46, 91, 255, 0.4)', cursor: 'pointer' };
const fadeSlide = { animation: 'fadeIn 0.4s ease-out' };

// --- NEW STYLES FOR HISTORY & NAV ---
const statsCard = { background: COLORS.card, padding: '25px', borderRadius: '24px', border: `1px solid ${COLORS.border}`, marginBottom: '20px' };
const tradeItemStyle = { background: COLORS.card, padding: '18px', borderRadius: '18px', border: `1px solid ${COLORS.border}`, marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const moodIconSmall = { background: '#1C1C1E', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' };
const bottomNav = { position: 'fixed', bottom: 0, left: 0, width: '100%', height: '90px', background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(10px)', borderTop: `1px solid ${COLORS.border}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingBottom: '15px', boxSizing: 'border-box' };
const navIcon = { fontSize: '24px', cursor: 'pointer', transition: '0.3s' };
