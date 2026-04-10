import React, { useState } from "react";

// --- THEME CONSTANTS ---
const COLORS = {
  bg: '#050505',
  card: '#121214',
  border: '#1C1C1E',
  accent: '#2E5BFF', // Electric Cobalt
  textMain: '#FFFFFF',
  textMuted: '#8E8E93',
  danger: '#FF3B30'
};

export default function App() {
  const [step, setStep] = useState(0); 
  const [dna, setDna] = useState({ style: "", risk: 50, edge: "" });

  // --- NAVIGATION ---
  const next = () => setStep(step + 1);
  const restart = () => setStep(0);

  // --- UI COMPONENTS ---

  // 1. TRADER DNA ONBOARDING
  const OnboardingDNA = () => (
    <div style={containerStyle}>
      <div style={progressWrapper}>
        <div style={{ ...progressFill, width: `${(step / 3) * 100}%` }} />
      </div>

      {step === 0 && (
        <div style={fadeCenter}>
          <div style={logoIcon}>⚡️</div>
          <h1 style={titleStyle}>Initialize your<br/>Trader DNA</h1>
          <p style={subTitleStyle}>We don't just track trades. We map your discipline.</p>
          <button onClick={next} style={primaryButton}>Begin Sequence →</button>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 style={titleStyle}>Choose your weapon</h2>
          <p style={subTitleStyle}>What is your primary market focus?</p>
          {['Options', 'Crypto', 'Forex', 'Futures'].map(opt => (
            <div key={opt} onClick={() => {setDna({...dna, style: opt}); next();}} style={dna.style === opt ? activeCard : cardStyle}>
              <b style={{fontSize: '18px'}}>{opt}</b>
            </div>
          ))}
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 style={titleStyle}>Risk Appetite</h2>
          <p style={subTitleStyle}>How aggressive is your sizing model?</p>
          <div style={{textAlign: 'center', margin: '40px 0'}}>
            <h1 style={{color: COLORS.accent, fontSize: '64px'}}>{dna.risk}%</h1>
            <p style={{color: COLORS.textMuted}}>Conservative vs Aggressive</p>
          </div>
          <input type="range" style={sliderStyle} value={dna.risk} onChange={e => setDna({...dna, risk: e.target.value})} />
          <button onClick={next} style={primaryButton}>Lock Risk Profile</button>
        </div>
      )}

      {step === 3 && <Dashboard dna={dna} onRestart={restart} />}
    </div>
  );

  return <OnboardingDNA />;
}

// 2. THE COBALT DASHBOARD
const Dashboard = ({ dna, onRestart }) => (
  <div style={{paddingTop: '20px'}}>
    <div style={headerStyle}>
      <h1 style={{fontSize: '22px', fontWeight: '900'}}>PRO<span style={{color: COLORS.accent}}>JOURNAL</span></h1>
      <div style={dnaBadge}>{dna.style} • {dna.risk}% Risk</div>
    </div>

    {/* Consistency Score - UNIQUE ELEMENT */}
    <div style={cardStyle}>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <p style={labelStyle}>CONSISTENCY SCORE</p>
          <h2 style={{fontSize: '32px', margin: '5px 0'}}>84<span style={{fontSize: '14px', color: COLORS.textMuted}}>/100</span></h2>
          <p style={{fontSize: '12px', color: COLORS.accent}}>+4% from last week</p>
        </div>
        <div style={scoreRing}>
          <div style={scoreInner}>84%</div>
        </div>
      </div>
    </div>

    {/* The Pulse (Equity Curve) */}
    <div style={{...cardStyle, height: '150px', position: 'relative', overflow: 'hidden'}}>
      <p style={labelStyle}>THE PULSE</p>
      <svg viewBox="0 0 300 100" style={svgStyle}>
        <path d="M0,80 Q75,20 150,50 T300,10" fill="none" stroke={COLORS.accent} strokeWidth="4" strokeLinecap="round" />
        <path d="M0,80 Q75,20 150,50 T300,10 V100 H0 Z" fill="url(#grad)" opacity="0.2" />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.accent} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    {/* Quick Strike Button */}
    <div style={fabStyle}>+</div>

    <button onClick={onRestart} style={{background: 'transparent', color: '#333', border: 'none', width: '100%', marginTop: '20px'}}>Reset DNA</button>
  </div>
);

// --- STYLES ---
const containerStyle = {
  background: COLORS.bg,
  color: COLORS.textMain,
  minHeight: '100vh',
  padding: '30px 25px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Geist", sans-serif',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box'
};

const progressWrapper = { background: COLORS.border, height: '4px', borderRadius: '10px', marginBottom: '50px' };
const progressFill = { background: COLORS.accent, height: '100%', borderRadius: '10px', transition: '0.5s ease' };

const logoIcon = { fontSize: '50px', marginBottom: '20px' };
const titleStyle = { fontSize: '32px', fontWeight: '800', marginBottom: '10px', letterSpacing: '-1px' };
const subTitleStyle = { color: COLORS.textMuted, fontSize: '17px', lineHeight: '1.5', marginBottom: '40px' };
const labelStyle = { color: COLORS.textMuted, fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' };

const cardStyle = {
  background: COLORS.card,
  padding: '24px',
  borderRadius: '24px',
  border: `1px solid ${COLORS.border}`,
  marginBottom: '16px',
  transition: '0.2s'
};

const activeCard = { ...cardStyle, borderColor: COLORS.accent, boxShadow: `0 0 20px rgba(46, 91, 255, 0.2)` };

const primaryButton = {
  background: COLORS.accent,
  color: '#fff',
  border: 'none',
  padding: '20px',
  borderRadius: '20px',
  fontSize: '17px',
  fontWeight: 'bold',
  width: '100%',
  marginTop: 'auto',
  boxShadow: `0 10px 30px rgba(46, 91, 255, 0.3)`
};

const sliderStyle = { width: '100%', accentColor: COLORS.accent, height: '8px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const dnaBadge = { background: COLORS.border, padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', color: COLORS.textMuted };

const scoreRing = { width: '70px', height: '70px', borderRadius: '50%', border: `4px solid ${COLORS.border}`, borderTopColor: COLORS.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const scoreInner = { fontSize: '14px', fontWeight: 'bold' };
const svgStyle = { width: '100%', height: '100px', marginTop: '10px' };
const fabStyle = { position: 'fixed', bottom: '30px', right: '30px', background: COLORS.accent, width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' };
const fadeCenter = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' };
