import React, { useState, useEffect } from "react";

export default function App() {
  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(0); // 0 = Landing, 1 = Style, 2 = Experience, 3 = Goal, 4 = Dashboard
  const [userData, setUserData] = useState({
    style: "",
    experience: "",
    goal: 15,
  });

  // --- UI COMPONENTS ---

  // 1. LANDING SCREEN
  const Landing = () => (
    <div style={containerStyle}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
         <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '10px' }}>Your best<br/>trading day.</h1>
         <p style={{ color: '#888', fontSize: '18px' }}>Prepare. Execute. Reflect.</p>
      </div>
      <button onClick={() => setStep(1)} style={primaryButtonStyle}>Get Started →</button>
      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#888' }}>Already have an account? <span style={{color: '#fff', fontWeight: 'bold'}}>Sign in</span></p>
    </div>
  );

  // 2. STYLE SELECTION
  const StyleSelection = () => (
    <div style={containerStyle}>
      <ProgressBar progress={25} />
      <h2 style={titleStyle}>👋 Let's build your trading plan</h2>
      <p style={subTitleStyle}>First, how do you trade?</p>
      
      {['Day Trading', 'Swing Trading', 'Position Trading', 'Scalping'].map((option) => (
        <div key={option} onClick={() => setUserData({...userData, style: option})} style={userData.style === option ? activeCardStyle : cardStyle}>
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{option}</div>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{option === 'Day Trading' ? 'Buy and sell within the same day' : 'Hold for days or weeks'}</div>
        </div>
      ))}

      <button onClick={() => setStep(2)} disabled={!userData.style} style={{ ...primaryButtonStyle, opacity: userData.style ? 1 : 0.5 }}>Continue →</button>
    </div>
  );

  // 3. GOAL SETTING
  const GoalSetting = () => (
    <div style={containerStyle}>
      <ProgressBar progress={75} />
      <h2 style={titleStyle}>What is your weekly profit target?</h2>
      <div style={{ textAlign: 'center', margin: '60px 0' }}>
        <h1 style={{ fontSize: '80px', margin: 0 }}>{userData.goal}%</h1>
        <p style={{ color: '#888' }}>Tap to type any amount</p>
      </div>
      <input 
        type="range" min="1" max="100" value={userData.goal} 
        onChange={(e) => setUserData({...userData, goal: e.target.value})}
        style={{ width: '100%', accentColor: '#00ff9c', marginBottom: '40px' }}
      />
      <button onClick={() => setStep(4)} style={primaryButtonStyle}>Continue →</button>
    </div>
  );

  // 4. THE REVEAL (DASHBOARD PREVIEW)
  const DashboardPreview = () => (
    <div style={{ ...containerStyle, justifyContent: 'center', textAlign: 'center' }}>
      <h2 style={titleStyle}>Profile Ready! 🚀</h2>
      <div style={cardStyle}>
        <p style={{ color: '#888', marginBottom: '10px' }}>YOUR TARGETS</p>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div><p style={{fontSize: '12px', color: '#888'}}>Style</p><b>{userData.style}</b></div>
          <div><p style={{fontSize: '12px', color: '#888'}}>Goal</p><b>{userData.goal}% / week</b></div>
        </div>
      </div>
      <button onClick={() => alert("Transitioning to Dashboard...")} style={primaryButtonStyle}>Enter Dashboard</button>
    </div>
  );

  // --- ROUTER LOGIC ---
  if (step === 0) return <Landing />;
  if (step === 1) return <StyleSelection />;
  if (step === 3 || step === 2) return <GoalSetting />; // Skipping exp for now
  if (step === 4) return <DashboardPreview />;
}

// --- STYLES (Apple Aesthetic) ---
const containerStyle = {
  background: '#000',
  color: '#fff',
  minHeight: '100vh',
  padding: '40px 25px',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
};

const ProgressBar = ({ progress }) => (
  <div style={{ background: '#222', height: '4px', width: '100%', borderRadius: '10px', marginBottom: '40px' }}>
    <div style={{ background: '#00ff9c', height: '100%', width: `${progress}%`, borderRadius: '10px', transition: '0.3s' }} />
  </div>
);

const titleStyle = { fontSize: '28px', fontWeight: 'bold', marginBottom: '12px', lineHeight: '1.2' };
const subTitleStyle = { color: '#888', fontSize: '16px', marginBottom: '30px' };

const cardStyle = {
  background: '#1C1C1E',
  padding: '20px',
  borderRadius: '16px',
  border: '1px solid #2C2C2E',
  marginBottom: '15px',
  cursor: 'pointer'
};

const activeCardStyle = {
  ...cardStyle,
  border: '2px solid #00ff9c',
  background: 'rgba(0, 255, 156, 0.05)'
};

const primaryButtonStyle = {
  background: '#fff',
  color: '#000',
  border: 'none',
  padding: '20px',
  borderRadius: '16px',
  fontSize: '18px',
  fontWeight: 'bold',
  width: '100%',
  marginTop: 'auto'
};

const inputStyle = { width: "100%", background: "#111", border: "1px solid #222", color: "#fff", padding: "14px", borderRadius: "12px", marginBottom: "12px", boxSizing: "border-box", fontSize: "16px" };
