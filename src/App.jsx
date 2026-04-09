import React from "react";

function App() {
  return (
    <div style={{ 
      background: '#050505', 
      color: '#00ff9c', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem' }}>🟢 SYSTEM ONLINE</h1>
      <p>If you can see this, the connection is FIXED.</p>
    </div>
  );
}

export default App;
