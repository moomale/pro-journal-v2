import React, { useState } from "react";

export default function App() {
  // --- STATE ---
  // 0: Auth, 1: Landing, 2: Style, 3: Goal, 4: Dashboard
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ style: "", goal: 15 });

  // --- NAVIGATION ---
  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  // --- UI SCREENS ---

  // SCREEN 0: THE AUTH / WELCOME SCREEN
  const AuthScreen = () => (
    <div style={containerStyle}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ background: '#1C1C1E', padding: '20px', borderRadius: '24px', marginBottom: '30px', border: '1px solid #2C2C2E' }}>
          <h1 style={{ fontSize: '32px', margin: 0 }}>📊</h1>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '10px', letterSpacing: '-1px' }}>ProJournal</h1>
        <p style={{ color: '#8E8E93', fontSize: '16px', marginBottom: '40px' }}>Your edge, sharpened by data.</p>
        
        <div style={{ display: 'flex', gap: '5px', marginBottom: '40px' }}>
          {['★','★','★','★','★'].map((s, i) => <span key={i} style={{color: '#fff'}}> {s} </span>)}
          <span style={{ color: '#8E8E93', fontSize: '13px', marginLeft: '5px' }}>4.8 from 20,846 traders</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button onClick={next} style={appleButtonStyle}> Sign in with Apple</button>
        <button onClick={next} style={googleButtonStyle}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" style={{width: '18px', marginRight: '10px'}} alt=""/>
          Sign in with Google
        </button>
        <button onClick={next} style={fbButtonStyle}>Sign in with Facebook</button>
      </div>

      <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '12px', color: '#444', lineHeight: '1.5' }}>
        By continuing, you agree to our <span style={{textDecoration:'underline'}}>Terms of Service</span> and <span style={{textDecoration:'underline'}}>Privacy Policy</span>.
      </p>
    </div>
  );

  // SCREEN 1: LANDING
  const Landing = () => (
    <div style={containerStyle}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
         <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '16px', letterSpacing: '-1.5px' }}>Your best<br/>trading day.</h1>
         <p style={{ color: '#8E8E93', fontSize: '19px' }}>Prepare. Execute. Reflect.</p>
      </div>
      <button onClick={next} style={primaryButtonStyle}>Get Started →</button>
    </div>
  );

  // ROUTER LOGIC
  if (step === 0) return <AuthScreen />;
  if (step === 1) return <Landing />;
  // (Remaining steps for Style, Goal, and Dashboard would follow...)
  return <div style={containerStyle}><h1 onClick={() => setStep(0)}>Dashboard Under Construction (Tap to Restart)</h1></div>;
}

// --- STYLES ---
const containerStyle = {
  background: '#000',
  color: '#fff',
  minHeight: '100vh',
  padding: '40px 25px',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
  boxSizing: 'border-box'
};

const primaryButtonStyle = {
  background: '#fff',
  color: '#000',
  border: 'none',
  padding: '18px',
  borderRadius: '16px',
  fontSize: '17px',
  fontWeight: 'bold',
  width: '100%',
  cursor: 'pointer'
};

const appleButtonStyle = {
  ...primaryButtonStyle,
  background: '#fff',
};

const googleButtonStyle = {
  ...primaryButtonStyle,
  background: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const fbButtonStyle = {
  ...primaryButtonStyle,
  background: '#1877F2',
  color: '#fff'
};
