import React from 'react';
import './App.css';
import FireEffects from './components/FireEffects';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">🔥</span> CodeQuest Rewards
            </div>
            <button className="btn">Dashboard</button>
          </div>
        </div>
      </nav>

      <main>
        <div className="container">
          <div className="hero">
            <div className="subtitle">Level Up Your Code</div>
            
            <h1 className="title">CodeQuest Rewards</h1>
            
            <div className="description">
              A gamified internal application designed to incentivize and improve code quality by rewarding reviewers who identify and validate bugs or discrepancies in Merge Requests across organizational projects.
            </div>
            
            <button className="btn btn-large">Start Quest</button>
            
            {/* Fire effects rendered behind the content */}
            <FireEffects />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
