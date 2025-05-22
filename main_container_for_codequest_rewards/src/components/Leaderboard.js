import React, { useState } from 'react';
import FireEffects from './FireEffects';

/**
 * Leaderboard component displays top reviewers and earners with gaming-style visuals
 * 
 * @returns {JSX.Element} The Leaderboard component
 */
const Leaderboard = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('reviewers');
  
  // Mock data for top reviewers
  const topReviewers = [
    { id: 1, name: 'DragonSlayer', points: 856, quests: 38, avatar: '🔮' },
    { id: 2, name: 'CodeNinja', points: 712, quests: 29, avatar: '⚔️' },
    { id: 3, name: 'PixelWizard', points: 645, quests: 25, avatar: '🧙' },
    { id: 4, name: 'ByteHunter', points: 581, quests: 22, avatar: '🏹' },
    { id: 5, name: 'SyntaxSamurai', points: 520, quests: 19, avatar: '🥷' },
    { id: 6, name: 'CipherMaster', points: 478, quests: 17, avatar: '🔒' },
    { id: 7, name: 'DevTitan', points: 456, quests: 15, avatar: '🛡️' },
    { id: 8, name: 'BugSlayer', points: 421, quests: 14, avatar: '🐞' },
    { id: 9, name: 'AlgoAlchemist', points: 387, quests: 12, avatar: '⚗️' },
    { id: 10, name: 'LogicLegend', points: 356, quests: 10, avatar: '💎' },
  ];
  
  // Mock data for top earners
  const topEarners = [
    { id: 1, name: 'CodeNinja', rewards: 12500, achievements: 15, avatar: '⚔️' },
    { id: 2, name: 'DragonSlayer', rewards: 11200, achievements: 14, avatar: '🔮' },
    { id: 3, name: 'AlgoAlchemist', rewards: 9700, achievements: 11, avatar: '⚗️' },
    { id: 4, name: 'SyntaxSamurai', rewards: 8900, achievements: 10, avatar: '🥷' },
    { id: 5, name: 'BugSlayer', rewards: 7600, achievements: 9, avatar: '🐞' },
    { id: 6, name: 'ByteHunter', rewards: 6800, achievements: 8, avatar: '🏹' },
    { id: 7, name: 'PixelWizard', rewards: 6200, achievements: 7, avatar: '🧙' },
    { id: 8, name: 'LogicLegend', rewards: 5500, achievements: 6, avatar: '💎' },
    { id: 9, name: 'CipherMaster', rewards: 4900, achievements: 5, avatar: '🔒' },
    { id: 10, name: 'DevTitan', rewards: 4200, achievements: 4, avatar: '🛡️' },
  ];
  
  // Function to render the leaderboard table based on active tab
  const renderLeaderboard = () => {
    const data = activeTab === 'reviewers' ? topReviewers : topEarners;
    
    return (
      <div className="leaderboard-table">
        {data.map((entry, index) => (
          <div key={entry.id} className="leaderboard-row">
            <div className="leaderboard-rank">
              {index === 0 && <span className="crown">👑</span>}
              <span className={`rank-number ${index < 3 ? 'top-rank' : ''}`}>{index + 1}</span>
            </div>
            <div className="leaderboard-avatar">{entry.avatar}</div>
            <div className="leaderboard-name">{entry.name}</div>
            {activeTab === 'reviewers' ? (
              <>
                <div className="leaderboard-points">
                  <span className="value">{entry.points}</span>
                  <span className="label">PTS</span>
                </div>
                <div className="leaderboard-quests">
                  <span className="value">{entry.quests}</span>
                  <span className="label">QUESTS</span>
                </div>
              </>
            ) : (
              <>
                <div className="leaderboard-rewards">
                  <span className="value">{entry.rewards}</span>
                  <span className="label">REWARDS</span>
                </div>
                <div className="leaderboard-achievements">
                  <span className="value">{entry.achievements}</span>
                  <span className="label">ACHV</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <main>
      <div className="container">
        <div className="leaderboard-container">
          <h1 className="title">Leaderboard</h1>
          <div className="subtitle">🔥 The Finest Code Warriors 🔥</div>

          {/* Tab switching */}
          <div className="leaderboard-tabs">
            <button
              className={`tab-btn ${activeTab === 'reviewers' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviewers')}
            >
              Top Reviewers
            </button>
            <button
              className={`tab-btn ${activeTab === 'earners' ? 'active' : ''}`}
              onClick={() => setActiveTab('earners')}
            >
              Top Earners
            </button>
          </div>
          
          {/* Season info */}
          <div className="season-info">
            <span className="season-badge">SEASON 2</span>
            <span className="season-dates">APR 2023 - JUN 2023</span>
          </div>
          
          {/* Leaderboard content */}
          {renderLeaderboard()}
          
          {/* Legend */}
          <div className="leaderboard-legend">
            {activeTab === 'reviewers' ? (
              <div>PTS = Points earned from reviews | QUESTS = Completed review quests</div>
            ) : (
              <div>REWARDS = Total reward points | ACHV = Achievements unlocked</div>
            )}
          </div>

          {/* Fire effects for background */}
          <FireEffects />
        </div>
      </div>
    </main>
  );
};

export default Leaderboard;
