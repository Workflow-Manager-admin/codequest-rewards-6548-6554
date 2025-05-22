import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FireEffects from './FireEffects';

/**
 * Home component for the CodeQuest Rewards application
 * Contains the main landing page content with gaming UI elements and fire effects
 * 
 * @returns {JSX.Element} The Home component
 */
const Home = () => {
  // State for simple animations and interactions
  const [isHovering, setIsHovering] = useState(false);

  return (
    <main>
      <div className="container">
        <div 
          className="hero"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Gaming UI element - Level indicator */}
          <div className="level-indicator">
            LEVEL <span className="level">5</span>
          </div>
          
          <div className="subtitle">Level Up Your Code</div>
          
          <h1 className="title">CodeQuest Rewards</h1>
          
          {/* Gaming-style stats display */}
          <div className="game-stats">
            <div className="stat-item">
              <div className="stat-value">128</div>
              <div className="stat-label">Points</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">12</div>
              <div className="stat-label">Quests</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">5</div>
              <div className="stat-label">Rank</div>
            </div>
          </div>
          
          <div className="description">
            A gamified internal application designed to incentivize and improve code quality by rewarding reviewers who identify and validate bugs or discrepancies in Merge Requests across organizational projects.
          </div>
          
          {/* Multiple action buttons for better interactivity */}
          <div className="action-buttons">
            <Link to="/merge-requests">
              <button 
                className="btn btn-large"
                style={{
                  transform: isHovering ? 'translateY(-2px) scale(1.03)' : 'none',
                  transition: 'transform 0.3s ease'
                }}
              >
                Start Quest
              </button>
            </Link>
            <Link to="/rewards">
              <button className="btn btn-secondary">View Rewards</button>
            </Link>
          </div>
          
          {/* Enhanced fire effects rendered behind the content */}
          <FireEffects />
        </div>
      </div>
    </main>
  );
};

export default Home;
