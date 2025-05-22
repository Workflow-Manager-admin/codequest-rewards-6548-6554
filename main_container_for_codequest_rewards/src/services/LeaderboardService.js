import { leaderboardApi } from '../api';

/**
 * PUBLIC_INTERFACE
 * Service for handling leaderboard-related functionality
 * Acts as a bridge between the UI components and the API layer
 */
class LeaderboardService {
  /**
   * Get top reviewers for the leaderboard
   * @param {Object} options - Optional parameters (limit, timeframe, etc.)
   * @returns {Promise} Promise resolving to top reviewers data
   */
  static async getTopReviewers(options = {}) {
    try {
      // Simulate API call but use mock data
      await leaderboardApi.getTopReviewers(options);
      
      // Mock top reviewers data - in a real app, this would come from the API
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
      
      // Apply limit if specified
      if (options.limit && options.limit > 0) {
        return topReviewers.slice(0, options.limit);
      }
      
      return topReviewers;
    } catch (error) {
      console.error('Failed to get top reviewers:', error);
      throw error;
    }
  }
  
  /**
   * Get top earners for the leaderboard
   * @param {Object} options - Optional parameters (limit, timeframe, etc.)
   * @returns {Promise} Promise resolving to top earners data
   */
  static async getTopEarners(options = {}) {
    try {
      // Simulate API call but use mock data
      await leaderboardApi.getTopEarners(options);
      
      // Mock top earners data - in a real app, this would come from the API
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
      
      // Apply limit if specified
      if (options.limit && options.limit > 0) {
        return topEarners.slice(0, options.limit);
      }
      
      return topEarners;
    } catch (error) {
      console.error('Failed to get top earners:', error);
      throw error;
    }
  }
  
  /**
   * Get current leaderboard season information
   * @returns {Promise} Promise resolving to current season data
   */
  static async getCurrentSeason() {
    try {
      // Simulate API call but use mock data
      const response = await leaderboardApi.getCurrentSeason();
      
      // The mock implementation already returns season data
      return response.data;
    } catch (error) {
      console.error('Failed to get current season:', error);
      throw error;
    }
  }
  
  /**
   * Get user ranking information
   * @param {string} userId - Optional user ID (defaults to current user)
   * @returns {Promise} Promise resolving to user ranking data
   */
  static async getUserRanking(userId = 'current') {
    try {
      // Simulate API call but use mock data
      await leaderboardApi.getUserRanking(userId);
      
      // Mock user ranking data - in a real app, this would come from the API
      return {
        rank: 5,
        percentile: 97,
        position: 5,
        total: 150
      };
    } catch (error) {
      console.error(`Failed to get ranking for user ${userId}:`, error);
      throw error;
    }
  }
}

export default LeaderboardService;
