import React, { useState, useEffect } from "react";

export default function App() {
  // --- STATE ---
  const [step, setStep] = useState(0); // 0: Landing, 1: Style, 2: Goal, 3: Dashboard
  const [userData, setUserData] = useState({
    style: "",
    goal: 15,
    trades: []
  });

  // --- NAVIGATION HELPERS ---
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // --- UI COMPONENTS ---

  // SCREEN 0: LANDING (The "Your Best Trading Day" screen)
  const Landing = () => (
    <div style={containerStyle}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
         <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '16px', letterSpacing: '-1.5px' }}>Your best<br/>trading day.</h1>
         <p style={{ color: '#8E8E93', fontSize: '19px', fontWeight: '500' }}>Prepare. Execute. Reflect.</p>
      </div>
      <button onClick={nextStep} style={primaryButtonStyle}>Get Started →</button>
      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#8E8E93' }}>Already have an account? <span style={{color: '#fff', fontWeight: 'bold'}}>Sign in</span></p>
    </div>
  );

  // SCREEN 1: STYLE SELECTION
  const StyleSelection = () => (
    <div style={containerStyle}>
      <ProgressBar progress={33} onBack={prevStep} />
      <h2 style={titleStyle}>👋 Let's build your trading plan</h2>
      <p style={subTitleStyle}>First, how do you trade?</p>
      
      {['Day Trading', 'Swing Trading', 'Position Trading', 'Scalping'].map((opt) => (
        <div key={opt} onClick={() => setUserData({...userData, style: opt})} style={userData.style === opt ? activeCardStyle : cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{opt}</div>
              <div style={{ fontSize: '12px', color: '#8E8E93', marginTop: '4px' }}>
                {opt === 'Day Trading' ? 'Buy and sell within the same day' : 'Hold positions for days or weeks'}
              </div>
            </div>
            {userData.style === opt && <div style={{ color: '#00ff9c', fontSize: '20px' }}>●</div>}
          </div>
        </div>
      ))}

      <button onClick={nextStep} disabled={!userData.style} style={{ ...primaryButtonStyle, opacity: userData.style ? 1 : 0.5, marginTop: 'auto' }}>Continue →</button>
    </div>
  );

  // SCREEN 2: GOAL SETTING
  const GoalSetting = () => (
    <div style={containerStyle}>
      <ProgressBar progress={66} onBack={prevStep} />
      <h2 style={titleStyle}>What is your weekly profit target?</h2>
      <p style={subTitleStyle}>A realistic target keeps you grounded.</p>
      
      <div style={{ textAlign: 'center', margin: '60px 0' }}>
        <h1 style={{ fontSize: '72px', fontWeight: '800', margin: 0 }}>{userData.goal}%</h1>
        <p style={{ color: '#8E8E93', fontSize: '14px' }}>Tap to type any amount</p>
      </div>

      <input 
        type="range" min="1" max="50" value={userData.goal} 
        onChange={(e) => setUserData({...userData, goal: e.target.value})}
        style={sliderStyle}
      />
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
        {['USD', 'EUR', 'GBP', '%'].map(u => (
          <div key={u} style={{ padding: '8px 16px', background: u === '%' ? '#fff' : '#1C1C1E', color: u === '%' ? '#000' : '#fff', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>{u}</div>
        ))}
      </div>

      <button onClick={nextStep} style={{ ...primaryButtonStyle, marginTop: 'auto' }}>Continue →</button>
    </div>
  );

  // SCREEN 3: DASHBOARD REVEAL
  const Dashboard = () => (
    <div style={{ ...containerStyle, padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '900' }}>Pro<span style={{color: '#00ff9c'}}>Journal</span></h1>
        <div style={{ display: 'flex', gap: '15px', fontSize: '20px' }}>👁️ 📋 ⚙️</div>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <p style={{ margin: 0, color: '#8E8E93', fontSize: '12px', fontWeight: 'bold' }}>TOTAL NET P/L</p>
           <p style={{ margin: 0, color: '#8E8E93', fontSize: '12px' }}>All time ▾</p>
        </div>
        <h2 style={{ fontSize: '36px', margin: '10px 0', color: '#00ff9c', fontWeight: '800' }}>$26,918.66</h2>
      </div>

      <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1C1C1E' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#2C2C2E', padding: '10px', borderRadius: '12px' }}>📓</div>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Morning check-in</p>
        </div>
        <span style={{ color: '#8E8E93' }}>→</span>
      </div>

      <button onClick={() => setStep(0)} style={{ ...cardStyle, width: '100%', background: 'transparent', border: '1px dashed #444', color: '#8E8E93' }}>
        Restart Onboarding (Debug)
      </button>
    </div>
  );

  // ROUTER
  if (step === 0) return <Landing />;
  if (step === 1) return <StyleSelection />;
  if (step === 2) return <GoalSetting />;
  return <Dashboard />;
}

// --- STYLES ---
const containerStyle = {
  background: '#000',
  color: '#fff',
  minHeight: '100vh',
  padding: '40px 25px',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
  boxSizing: 'border-box'
};

const titleStyle = { fontSize: '28px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' };
const subTitleStyle = { color: '#8E8E93', fontSize: '16px', marginBottom: '32px', lineHeight: '1.4' };

const cardStyle = {
  background: '#1C1C1E',
  padding: '20px',
  borderRadius: '20px',
  border: '1px solid #2C2C2E',
  marginBottom: '12px',
  cursor: 'pointer'
};

const activeCardStyle = {
  ...cardStyle,
  border: '1px solid #00ff9c',
  background: 'rgba(0, 255, 156, 0.05)'
};

const primaryButtonStyle = {
  background: '#fff',
  color: '#000',
  border: 'none',
  padding: '18px',
  borderRadius: '18px',
  fontSize: '17px',
  fontWeight: 'bold',
  width: '100%',
  cursor: 'pointer'
};

const sliderStyle = {
  width: '100%',
  height: '6px',
  borderRadius: '5px',
  background: '#2C2C2E',
  outline: 'none',
  WebkitAppearance: 'none',
  accentColor: '#00ff9c'
};

const ProgressBar = ({ progress, onBack }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
    <button onClick={onBack} style={{ background: '#1C1C1E', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '10px' }}>‹</button>
    <div style={{ background: '#1C1C1E', height: '6px', flex: 1, borderRadius: '10px' }}>
      <div style={{ background: '#00ff9c', height: '100%', width: `${progress}%`, borderRadius: '10px', transition: '0.4s ease' }} />
    </div>
  </div>
);
