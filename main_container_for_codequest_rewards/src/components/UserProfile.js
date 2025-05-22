import React, { useState, useEffect } from 'react';
import FireEffects from './FireEffects';
import { UserService } from '../services';

/**
 * UserProfile component displays the user's profile information, stats, badges, and progress
 * with gaming-themed UI elements matching the fire/gaming aesthetic of CodeQuest Rewards
 * 
 * @returns {JSX.Element} The UserProfile component
 */
const UserProfile = () => {
  // State for tab switching between different sections
  const [activeTab, setActiveTab] = useState('achievements');
  
  // User data state
  const [userData, setUserData] = useState(null);
  const [badges, setBadges] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);
  const [isLoading, setIsLoading] = useState({
    profile: true,
    badges: true,
    activity: true
  });
  
  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(prev => ({ ...prev, profile: true }));
        const profileData = await UserService.getCurrentUser();
        setUserData(profileData);
      } catch (error) {
        console.error("Failed to load user profile:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, profile: false }));
      }
    };
    
    fetchUserProfile();
  }, []);
  
  // Fetch user achievements on component mount and when tab changes to achievements
  useEffect(() => {
    const fetchUserAchievements = async () => {
      if (activeTab !== 'achievements') return;
      
      try {
        setIsLoading(prev => ({ ...prev, badges: true }));
        const achievementsData = await UserService.getUserAchievements();
        setBadges(achievementsData);
      } catch (error) {
        console.error("Failed to load user achievements:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, badges: false }));
      }
    };
    
    fetchUserAchievements();
  }, [activeTab]);
  
  // Fetch user activity history on component mount and when tab changes to activity
  useEffect(() => {
    const fetchUserActivity = async () => {
      if (activeTab !== 'activity') return;
      
      try {
        setIsLoading(prev => ({ ...prev, activity: true }));
        const activityData = await UserService.getUserActivity();
        setActivityHistory(activityData);
      } catch (error) {
        console.error("Failed to load user activity:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, activity: false }));
      }
    };
    
    fetchUserActivity();
  }, [activeTab]);
  
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
