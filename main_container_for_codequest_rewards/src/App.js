import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';

/**
 * Main App component for the CodeQuest Rewards application
 * Enhanced with gaming UI elements and realistic fire effects
 */
function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Link to="/" className="logo-link">
              <div className="logo">
                <span className="logo-symbol">🔥</span> CodeQuest Rewards
              </div>
            </Link>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/leaderboard" className="nav-link">
                <button className="btn btn-secondary">Leaderboard</button>
              </Link>
              <Link to="/" className="nav-link">
                <button className="btn">Dashboard</button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </div>
  );
}

export default App;
