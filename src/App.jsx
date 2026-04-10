import React, { useState } from "react";

export default function App() {
  const [step, setStep] = useState(0); 
  const [userData, setUserData] = useState({ style: "", goal: 10 });

  // --- UNIQUE DESIGN COMPONENTS ---

  const OnboardingWrapper = ({ children, title, subtitle }) => (
    <div style={layoutStyle}>
      <div style={headerStyle}>
        <div style={brandStyle}>PRO<span style={{color: '#B87333'}}>JOURNAL</span></div>
        <div style={stepIndicator}>{step}/4</div>
      </div>
      <div style={contentStyle}>
        <h1 style={mainTitle}>{title}</h1>
        <p style={descriptionStyle}>{subtitle}</p>
        {children}
      </div>
      <div style={footerStyle}>
        <button onClick={() => setStep(step + 1)} style={nextButtonStyle}>Next Phase —></button>
      </div>
    </div>
  );

  // --- SCREENS ---

  if (step === 0) return (
    <div style={landingStyle}>
      <div style={heroCircle} />
      <h1 style={{fontSize: '56px', letterSpacing: '-3px', lineHeight: '0.9', margin: '0 0 20px 0'}}>MASTER<br/>THE<br/>BIAS.</h1>
      <p style={{color: '#666', marginBottom: '40px'}}>Precision journaling for the 1%.</p>
      <button onClick={() => setStep(1)} style={startButtonStyle}>Initialize System</button>
    </div>
  );

  if (step === 1) return (
    <OnboardingWrapper title="Define your edge." subtitle="Choose your primary execution methodology.">
      <div style={gridStyle}>
        {['Institutional', 'Retail Flow', 'Algo-Driven', 'Arbitrage'].map(opt => (
          <div key={opt} onClick={() => setUserData({...userData, style: opt})} 
               style={userData.style === opt ? activeBoxStyle : boxStyle}>
            {opt}
          </div>
        ))}
      </div>
    </OnboardingWrapper>
  );

  if (step === 2) return (
    <OnboardingWrapper title="The Goal." subtitle="What is your projected weekly growth?">
       <div style={{marginTop: '40px'}}>
          <input type="range" min="1" max="50" style={sliderStyle} onChange={(e) => setUserData({...userData, goal: e.target.value})} />
          <div style={{fontSize: '80px', fontWeight: '200', color: '#B87333'}}>{userData.goal}%</div>
       </div>
    </OnboardingWrapper>
  );

  if (step === 3) return (
    <div style={layoutStyle}>
       <h1 style={mainTitle}>Why you can't "Sign Up" yet...</h1>
       <p style={descriptionStyle}>To activate "Live Sign-up," we need to connect a <b>Database</b>.</p>
       <div style={infoCard}>
          <h3>Developer Note:</h3>
          <p>You need an <b>API Key</b> from a service like <b>Clerk.com</b> or <b>Firebase</b>. These are the "keys" that let people actually create accounts.</p>
          <p>For now, I have created this <b>Simulated Account</b> for you.</p>
       </div>
       <button onClick={() => alert("Ready to connect Database?")} style={nextButtonStyle}>Learn to connect Database</button>
    </div>
  );
}

// --- DISTINCTIVE STYLES ---

const layoutStyle = {
  background: '#0a0a0a', color: '#fff', minHeight: '100vh',
  padding: '40px', display: 'flex', flexDirection: 'column',
  fontFamily: '"Helvetica Neue", sans-serif'
};

const landingStyle = {
  ...layoutStyle, justifyContent: 'center', alignItems: 'flex-start',
  overflow: 'hidden', position: 'relative'
};

const heroCircle = {
  position: 'absolute', top: '-10%', right: '-20%',
  width: '400px', height: '400px', borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(184,115,51,0.2) 0%, rgba(0,0,0,0) 70%)'
};

const brandStyle = { fontWeight: '900', fontSize: '18px', letterSpacing: '2px' };

const mainTitle = { fontSize: '36px', fontWeight: '800', marginBottom: '10px' };
const descriptionStyle = { color: '#666', fontSize: '14px', marginBottom: '40px' };

const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' };

const boxStyle = {
  border: '1px solid #222', padding: '30px 15px', borderRadius: '4px',
  textAlign: 'center', fontSize: '12px', textTransform: 'uppercase',
  letterSpacing: '1px', transition: '0.3s'
};

const activeBoxStyle = { ...boxStyle, background: '#fff', color: '#000', borderColor: '#fff' };

const nextButtonStyle = {
  background: 'none', color: '#B87333', border: '1px solid #B87333',
  padding: '15px 30px', borderRadius: '40px', fontWeight: 'bold', cursor: 'pointer'
};

const startButtonStyle = {
  background: '#fff', color: '#000', border: 'none', padding: '20px 40px',
  borderRadius: '4px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px'
};

const infoCard = {
  background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222',
  marginTop: '20px', lineHeight: '1.6', fontSize: '14px', color: '#ccc'
};

const sliderStyle = { width: '100%', accentColor: '#B87333' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '60px' };
const stepIndicator = { color: '#444', fontWeight: 'bold' };
