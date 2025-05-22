import React, { useState, useEffect } from 'react';
import FireEffects from './FireEffects';
import AdminUserManagement from './AdminUserManagement';
import AdminProjectManagement from './AdminProjectManagement';
import AdminUserProjectAssignment from './AdminUserProjectAssignment';
import { AdminService } from '../services';

/**
 * AdminDashboard component serves as the main admin interface for CodeQuest Rewards
 * It provides navigation tabs for user management, project management, and user-project assignment
 * 
 * @returns {JSX.Element} The AdminDashboard component
 */
const AdminDashboard = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('users');
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch analytics data on component mount
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const data = await AdminService.getAnalytics({ period: 'month' });
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Render the appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <AdminUserManagement />;
      case 'projects':
        return <AdminProjectManagement />;
      case 'assignments':
        return <AdminUserProjectAssignment />;
      default:
        return <AdminUserManagement />;
    }
  };

  return (
    <main>
      <div className="container">
        <div className="profile-container admin-dashboard">
          <h1 className="profile-name">Admin Dashboard</h1>
          
          {isLoading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '50px 0',
              fontSize: '1.2rem',
              color: 'var(--text-secondary)'
            }}>
              Loading analytics data...
            </div>
          ) : analytics ? (
            <div className="admin-analytics">
              <div className="game-stats profile-stats">
                <div className="stat-item">
                  <div className="stat-value">{analytics.userActivity.activeUsers}</div>
                  <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{analytics.projectHealth.totalProjects}</div>
                  <div className="stat-label">Projects</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{analytics.userActivity.reviewsCompleted}</div>
                  <div className="stat-label">Reviews</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{analytics.userActivity.bugsFound}</div>
                  <div className="stat-label">Bugs Found</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '20px 0',
              fontSize: '1.1rem',
              color: 'var(--fire-red)'
            }}>
              Failed to load analytics data
            </div>
          )}

          {/* Tab navigation */}
          <div className="profile-tabs">
            <button
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Projects
            </button>
            <button
              className={`tab-btn ${activeTab === 'assignments' ? 'active' : ''}`}
              onClick={() => setActiveTab('assignments')}
            >
              Assignments
            </button>
          </div>

          {/* Content area for the selected tab */}
          <div className="admin-content">
            {renderContent()}
          </div>

          {/* Fire effects at the bottom */}
          <FireEffects />
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
