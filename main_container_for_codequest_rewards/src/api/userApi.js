import apiClient from './apiClient';

/**
 * PUBLIC_INTERFACE
 * API module for user-related endpoints
 * Currently mocked to return data without actual API calls
 */
const userApi = {
  /**
   * Get current user profile information
   * @returns {Promise} Promise resolving to user profile data
   */
  getCurrentUser: () => {
    // Simulated API call
    console.log('API call: Get current user profile');
    
    // In real implementation: return apiClient.get('/users/me');
    return Promise.resolve({ 
      data: null // Will be populated from the service layer
    });
  },
  
  /**
   * Get user achievements and badges
   * @returns {Promise} Promise resolving to user achievements
   */
  getUserAchievements: () => {
    // Simulated API call
    console.log('API call: Get user achievements');
    
    // In real implementation: return apiClient.get('/users/me/achievements');
    return Promise.resolve({ 
      data: { 
        badges: [] // Will be populated from the service layer
      } 
    });
  },
  
  /**
   * Get user activity history
   * @param {Object} filters - Filter parameters (timeframe, type, etc.)
   * @returns {Promise} Promise resolving to user activity history
   */
  getUserActivity: (filters = {}) => {
    // Simulated API call
    console.log('API call: Get user activity with filters:', filters);
    
    // In real implementation: return apiClient.get('/users/me/activity', { params: filters });
    return Promise.resolve({ 
      data: { 
        activities: [] // Will be populated from the service layer
      }
    });
  },
  
  /**
   * Get user statistics
   * @returns {Promise} Promise resolving to user stats
   */
  getUserStats: () => {
    // Simulated API call
    console.log('API call: Get user statistics');
    
    // In real implementation: return apiClient.get('/users/me/stats');
    return Promise.resolve({ 
      data: {
        points: 0,
        level: 0,
        xp: 0,
        xpToNextLevel: 0,
        stats: {
          reviews: 0,
          bugsFound: 0,
          quests: 0,
          badges: 0
        }
      } // Will be populated from the service layer
    });
  }
};

export default userApi;
