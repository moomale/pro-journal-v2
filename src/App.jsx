import React, { useState } from "react";

const COLORS = {
  bg: '#000000',
  card: '#121214',
  border: '#1C1C1E',
  accent: '#2E5BFF', 
  textMain: '#FFFFFF',
  textMuted: '#8E8E93'
};

export default function App() {
  const [step, setStep] = useState(3); // Start at 3 to see the new Dashboard
  const [showMenu, setShowMenu] = useState(false);

  // --- UI COMPONENTS ---

  const Ticker = () => (
    <div style={tickerStyle}>
      <div style={tickerItem}>SPY <span style={{color: '#00FF9C'}}>+0.64%</span></div>
      <div style={tickerItem}>QQQ <span style={{color: '#FF3B30'}}>-0.12%</span></div>
      <div style={tickerItem}>BTC <span style={{color: '#00FF9C'}}>+2.41%</span></div>
    </div>
  );

  const Dashboard = () => (
    <div style={containerStyle}>
      <Ticker />
      
      <div style={headerStyle}>
        <div>
          <p style={{color: COLORS.textMuted, fontSize: '12px', margin: 0}}>WELCOME BACK</p>
          <h1 style={{fontSize: '28px', fontWeight: '800', margin: 0}}>Trader</h1>
        </div>
        <div style={iconGroup}>⚙️ 🔔</div>
      </div>

      {/* Main Profit Card */}
      <div style={mainCard}>
        <p style={labelStyle}>NET PERFORMANCE</p>
        <h2 style={{fontSize: '42px', fontWeight: '900', margin: '10px 0'}}>$14,205<span style={{fontSize: '20px', color: COLORS.textMuted}}>.00</span></h2>
        <div style={badgeRow}>
          <div style={miniBadge}>+12.4% This Month</div>
          <div style={miniBadge}>7 Day Streak 🔥</div>
        </div>
      </div>

      {/* Consistency Streak (Different from the inspiration) */}
      <p style={{...labelStyle, marginBottom: '12px'}}>DISCIPLINE STREAK</p>
      <div style={streakRow}>
        {[1,1,1,1,0,0,0].map((win, i) => (
          <div key={i} style={{...streakSquare, background: win ? COLORS.accent : COLORS.border}} />
        ))}
      </div>

      {/* The Pulse Chart */}
      <div style={cardStyle}>
        <p style={labelStyle}>EQUITY PULSE</p>
        <div style={{height: '100px', marginTop: '15px', display: 'flex', alignItems: 'flex-end', gap: '4px'}}>
            {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                <div key={i} style={{flex: 1, background: COLORS.accent, height: `${h}%`, borderRadius: '4px', opacity: i === 6 ? 1 : 0.3}} />
            ))}
        </div>
      </div>

      {/* Quick-Strike FAB */}
      <div onClick={() => setShowMenu(true)} style={fabStyle}>+</div>

      {/* Slide-up Menu (Glassmorphism) */}
      {showMenu && (
        <div style={modalOverlay} onClick={() => setShowMenu(false)}>
          <div style={menuSheet} onClick={e => e.stopPropagation()}>
            <div style={dragHandle} />
            <h2 style={{fontSize: '20px', marginBottom: '25px'}}>New Entry</h2>
            <div style={menuItem}>⚡️ Quick Trade Log</div>
            <div style={menuItem}>🎙️ Voice Journal (AI)</div>
            <div style={menuItem}>✍️ Manual Reflection</div>
            <button onClick={() => setShowMenu(false)} style={closeButton}>Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );

  return <Dashboard />;
}

// --- STYLES ---
const containerStyle = {
  background: COLORS.bg,
  color: COLORS.textMain,
  minHeight: '100vh',
  padding: '10px 20px 100px 20px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
  boxSizing: 'border-box'
};

const tickerStyle = { display: 'flex', gap: '20px', padding: '10px 0', borderBottom: `1px solid ${COLORS.border}`, marginBottom: '20px', overflow: 'hidden', whiteSpace: 'nowrap' };
const tickerItem = { fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px' };

const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const iconGroup = { display: 'flex', gap: '20px', fontSize: '20px' };

const mainCard = { background: `linear-gradient(135deg, ${COLORS.card} 0%, #000 100%)`, padding: '30px', borderRadius: '32px', border: `1px solid ${COLORS.border}`, marginBottom: '25px' };
const labelStyle = { color: COLORS.textMuted, fontSize: '10px', fontWeight: 'bold', letterSpacing: '1.5px' };
const badgeRow = { display: 'flex', gap: '10px', marginTop: '15px' };
const miniBadge = { background: '#1C1C1E', padding: '6px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold' };

const streakRow = { display: 'flex', gap: '8px', marginBottom: '30px' };
const streakSquare = { flex: 1, height: '35px', borderRadius: '8px', transition: '0.3s' };

const cardStyle = { background: COLORS.card, padding: '20px', borderRadius: '24px', border: `1px solid ${COLORS.border}` };

const fabStyle = { position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: COLORS.accent, width: '70px', height: '70px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', boxShadow: '0 15px 35px rgba(46, 91, 255, 0.4)', cursor: 'pointer', zIndex: 10 };

const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'flex-end' };
const menuSheet = { background: '#111', width: '100%', padding: '30px', borderTopLeftRadius: '32px', borderTopRightRadius: '32px', border: `1px solid ${COLORS.border}`, boxSizing: 'border-box' };
const dragHandle = { width: '40px', height: '4px', background: '#333', borderRadius: '10px', margin: '0 auto 20px auto' };
const menuItem = { padding: '20px', background: '#1C1C1E', borderRadius: '16px', marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' };
const closeButton = { width: '100%', background: 'transparent', color: COLORS.textMuted, border: 'none', padding: '15px', marginTop: '10px' };
