import React, { useState } from 'react';
import FireEffects from './FireEffects';

/**
 * UserProfile component displays the user's profile information, stats, badges, and progress
 * with gaming-themed UI elements matching the fire/gaming aesthetic of CodeQuest Rewards
 * 
 * @returns {JSX.Element} The UserProfile component
 */
const UserProfile = () => {
  // State for tab switching between different sections
  const [activeTab, setActiveTab] = useState('achievements');
  
  // Mock user data
  const userData = {
    id: 1,
    name: 'DragonSlayer',
    avatar: '🔮',
    level: 5,
    xp: 456,
    xpToNextLevel: 600,
    title: 'Code Warrior',
    joinDate: 'March 2023',
    stats: {
      points: 856,
      quests: 38,
      reviews: 142,
      badges: 12,
    },
  };
  
  // Mock badges data
  const badges = [
    { id: 1, name: 'Bug Hunter', icon: '🐞', description: 'Found 10 critical bugs', unlocked: true },
    { id: 2, name: 'First Blood', icon: '🩸', description: 'First to review a new project', unlocked: true },
    { id: 3, name: 'Streak Master', icon: '🔥', description: 'Reviewed code 7 days in a row', unlocked: true },
    { id: 4, name: 'Eagle Eye', icon: '👁️', description: 'Spotted a security vulnerability', unlocked: true },
    { id: 5, name: 'Mentor', icon: '🧙‍♂️', description: 'Helped 5 team members improve their code', unlocked: true },
    { id: 6, name: 'Perfectionist', icon: '✨', description: 'Submitted a flawless review', unlocked: true },
    { id: 7, name: 'Night Owl', icon: '🦉', description: 'Completed reviews after hours', unlocked: true },
    { id: 8, name: 'Code Oracle', icon: '🔮', description: 'Predicted and prevented 5 production issues', unlocked: true },
    { id: 9, name: 'Lightning Fast', icon: '⚡', description: 'Completed 10 reviews in record time', unlocked: true },
    { id: 10, name: 'Team Player', icon: '🤝', description: 'Collaborated on 20 code reviews', unlocked: false },
    { id: 11, name: 'Architect', icon: '🏛️', description: 'Suggested major architectural improvements', unlocked: false },
    { id: 12, name: 'Legend', icon: '👑', description: 'Reached level 10', unlocked: false },
  ];
  
  // Mock activity data
  const activityHistory = [
    { id: 1, type: 'review', description: 'Reviewed PR #342 - Auth API Update', points: 25, date: '2 days ago', icon: '📝' },
    { id: 2, type: 'badge', description: 'Earned "Bug Hunter" badge', date: '3 days ago', icon: '🏆' },
    { id: 3, type: 'level', description: 'Reached Level 5', date: '1 week ago', icon: '🎮' },
    { id: 4, type: 'review', description: 'Reviewed PR #337 - Payment Gateway', points: 30, date: '1 week ago', icon: '📝' },
    { id: 5, type: 'quest', description: 'Completed "Security Guardian" quest', points: 150, date: '2 weeks ago', icon: '🎯' },
  ];
  
  // Calculate XP progress percentage
  const xpProgressPercentage = Math.round((userData.xp / userData.xpToNextLevel) * 100);
  
  // Function to render the appropriate tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'achievements':
        return (
          <div className="profile-achievements">
            <h3 className="section-title">Achievement Badges</h3>
            <div className="badges-grid">
              {badges.map((badge) => (
                <div 
                  key={badge.id} 
                  className={`badge-item ${badge.unlocked ? 'unlocked' : 'locked'}`}
                  title={badge.description}
                >
                  <div className="badge-icon">{badge.icon}</div>
                  <div className="badge-name">{badge.name}</div>
                  <div className="badge-status">
                    {badge.unlocked ? 'Unlocked' : 'Locked'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'activity':
        return (
          <div className="profile-activity">
            <h3 className="section-title">Recent Activity</h3>
            <div className="activity-timeline">
              {activityHistory.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-content">
                    <div className="activity-description">{activity.description}</div>
                    <div className="activity-meta">
                      {activity.points && <span className="activity-points">+{activity.points} pts</span>}
                      <span className="activity-date">{activity.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'stats':
        return (
          <div className="profile-detailed-stats">
            <h3 className="section-title">Performance Stats</h3>
            
            <div className="stats-card">
              <h4>Review Efficiency</h4>
              <div className="stat-bars">
                <div className="stat-bar-item">
                  <div className="stat-bar-label">Speed</div>
                  <div className="stat-bar-track">
                    <div className="stat-bar-fill" style={{width: '78%'}}></div>
                  </div>
                  <div className="stat-bar-value">78%</div>
                </div>
                <div className="stat-bar-item">
                  <div className="stat-bar-label">Accuracy</div>
                  <div className="stat-bar-track">
                    <div className="stat-bar-fill" style={{width: '92%'}}></div>
                  </div>
                  <div className="stat-bar-value">92%</div>
                </div>
                <div className="stat-bar-item">
                  <div className="stat-bar-label">Thoroughness</div>
                  <div className="stat-bar-track">
                    <div className="stat-bar-fill" style={{width: '85%'}}></div>
                  </div>
                  <div className="stat-bar-value">85%</div>
                </div>
              </div>
            </div>
            
            <div className="stats-card">
              <h4>Review Types</h4>
              <div className="stat-distribution">
                <div className="stat-dist-item">
                  <div className="stat-dist-value">65%</div>
                  <div className="stat-dist-bar" style={{height: '65%', backgroundColor: 'var(--fire-red)'}}></div>
                  <div className="stat-dist-label">Backend</div>
                </div>
                <div className="stat-dist-item">
                  <div className="stat-dist-value">25%</div>
                  <div className="stat-dist-bar" style={{height: '25%', backgroundColor: 'var(--fire-orange)'}}></div>
                  <div className="stat-dist-label">Frontend</div>
                </div>
                <div className="stat-dist-item">
                  <div className="stat-dist-value">10%</div>
                  <div className="stat-dist-bar" style={{height: '10%', backgroundColor: 'var(--fire-yellow)'}}></div>
                  <div className="stat-dist-label">DevOps</div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <main>
      <div className="container">
        <div className="profile-container">
          {/* User profile header with avatar and main info */}
          <div className="profile-header">
            <div className="profile-avatar-container">
              <div className="profile-avatar">{userData.avatar}</div>
              <div className="profile-level-badge">{userData.level}</div>
            </div>
            
            <div className="profile-info">
              <h1 className="profile-name">{userData.name}</h1>
              <div className="profile-title">{userData.title}</div>
              <div className="profile-join-date">Member since {userData.joinDate}</div>
            </div>
          </div>
          
          {/* XP Progress bar */}
          <div className="xp-progress-container">
            <div className="xp-label">
              <span>XP: {userData.xp}/{userData.xpToNextLevel}</span>
              <span>Level {userData.level}</span>
            </div>
            <div className="xp-progress-track">
              <div 
                className="xp-progress-fill"
                style={{width: `${xpProgressPercentage}%`}}
              ></div>
              <div className="xp-progress-glow"></div>
            </div>
            <div className="xp-progress-percent">{xpProgressPercentage}%</div>
          </div>
          
          {/* User stats */}
          <div className="game-stats profile-stats">
            <div className="stat-item">
              <div className="stat-value">{userData.stats.points}</div>
              <div className="stat-label">Points</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userData.stats.quests}</div>
              <div className="stat-label">Quests</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userData.stats.reviews}</div>
              <div className="stat-label">Reviews</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userData.stats.badges}</div>
              <div className="stat-label">Badges</div>
            </div>
          </div>
          
          {/* Tab navigation for profile sections */}
          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </button>
            <button
              className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
            <button
              className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              Stats
            </button>
          </div>
          
          {/* Content area for the selected tab */}
          <div className="profile-content">
            {renderTabContent()}
          </div>
          
          {/* Fire effects at the bottom */}
          <FireEffects />
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
