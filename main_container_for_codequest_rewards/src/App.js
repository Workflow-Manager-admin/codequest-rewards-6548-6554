import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';
import UserProfile from './components/UserProfile';
import MergeRequestReview from './components/MergeRequestReview';
import RewardsRedemption from './components/RewardsRedemption';

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
              <Link to="/profile" className="nav-link">
                <button className="btn btn-secondary">Profile</button>
              </Link>
              <Link to="/leaderboard" className="nav-link">
                <button className="btn btn-secondary">Leaderboard</button>
              </Link>
              <Link to="/merge-requests" className="nav-link">
                <button className="btn btn-secondary">Code Review</button>
              </Link>
              <Link to="/rewards" className="nav-link">
                <button className="btn btn-secondary">Rewards</button>
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
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/merge-requests" element={<MergeRequestReview />} />
        <Route path="/rewards" element={<RewardsRedemption />} />
      </Routes>
    </div>
  );
}

export default App;
