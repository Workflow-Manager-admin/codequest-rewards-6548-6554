import apiClient from './apiClient';

/**
 * PUBLIC_INTERFACE
 * API module for leaderboard-related endpoints
 * Currently mocked to return data without actual API calls
 */
const leaderboardApi = {
  /**
   * Get leaderboard data for top reviewers
   * @param {Object} options - Optional parameters (limit, timeframe, etc.)
   * @returns {Promise} Promise resolving to leaderboard data for reviewers
   */
  getTopReviewers: (options = {}) => {
    // Simulated API call
    console.log('API call: Get top reviewers with options:', options);
    
    // In real implementation: return apiClient.get('/leaderboard/reviewers', { params: options });
    return Promise.resolve({ 
      data: { 
        users: [] // Will be populated from the service layer
      }
    });
  },
  
  /**
   * Get leaderboard data for top earners
   * @param {Object} options - Optional parameters (limit, timeframe, etc.)
   * @returns {Promise} Promise resolving to leaderboard data for earners
   */
  getTopEarners: (options = {}) => {
    // Simulated API call
    console.log('API call: Get top earners with options:', options);
    
    // In real implementation: return apiClient.get('/leaderboard/earners', { params: options });
    return Promise.resolve({ 
      data: { 
        users: [] // Will be populated from the service layer
      }
    });
  },
  
  /**
   * Get current leaderboard season information
   * @returns {Promise} Promise resolving to current season data
   */
  getCurrentSeason: () => {
    // Simulated API call
    console.log('API call: Get current leaderboard season');
    
    // In real implementation: return apiClient.get('/leaderboard/current-season');
    return Promise.resolve({ 
      data: {
        id: 'season-2',
        name: 'Season 2',
        startDate: '2023-04-01T00:00:00Z',
        endDate: '2023-06-30T23:59:59Z'
      }
    });
  },
  
  /**
   * Get user ranking information
   * @param {string} userId - Optional user ID (defaults to current user)
   * @returns {Promise} Promise resolving to user ranking data
   */
  getUserRanking: (userId = 'current') => {
    // Simulated API call
    console.log('API call: Get user ranking for user:', userId);
    
    // In real implementation: return apiClient.get(`/leaderboard/ranking/${userId}`);
    return Promise.resolve({ 
      data: {
        rank: 0,
        percentile: 0,
        position: 0,
        total: 0
      } // Will be populated from the service layer
    });
  }
};

export default leaderboardApi;
