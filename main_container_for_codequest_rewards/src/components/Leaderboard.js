import React, { useState, useEffect } from 'react';
import FireEffects from './FireEffects';
import { LeaderboardService } from '../services';

/**
 * Leaderboard component displays top reviewers and earners with gaming-style visuals
 * 
 * @returns {JSX.Element} The Leaderboard component
 */
const Leaderboard = () => {
  // State for active tab and data
  const [activeTab, setActiveTab] = useState('reviewers');
  const [topReviewers, setTopReviewers] = useState([]);
  const [topEarners, setTopEarners] = useState([]);
  const [seasonInfo, setSeasonInfo] = useState({ name: 'SEASON 2', startDate: 'APR 2023', endDate: 'JUN 2023' });
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch leaderboard data on component mount and when tab changes
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      
      try {
        // Get current season info
        const season = await LeaderboardService.getCurrentSeason();
        if (season) {
          const startDate = new Date(season.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          const endDate = new Date(season.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          setSeasonInfo({
            name: season.name,
            startDate,
            endDate
          });
        }
        
        // Get leaderboard data based on active tab
        if (activeTab === 'reviewers') {
          const reviewers = await LeaderboardService.getTopReviewers();
          setTopReviewers(reviewers);
        } else {
          const earners = await LeaderboardService.getTopEarners();
          setTopEarners(earners);
        }
      } catch (error) {
        console.error(`Failed to fetch ${activeTab} data:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboardData();
  }, [activeTab]);
  
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
            <span className="season-badge">{seasonInfo.name}</span>
            <span className="season-dates">{seasonInfo.startDate} - {seasonInfo.endDate}</span>
          </div>
          
          {/* Leaderboard content */}
          {isLoading ? (
            <div style={{
              padding: '40px 0',
              textAlign: 'center',
              color: 'var(--text-secondary)',
              fontSize: '1.2rem'
            }}>
              Loading leaderboard data...
            </div>
          ) : (
            renderLeaderboard()
          )}
          
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
