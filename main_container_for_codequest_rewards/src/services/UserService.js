import { userApi } from '../api';

/**
 * PUBLIC_INTERFACE
 * Service for handling user-related functionality
 * Acts as a bridge between the UI components and the API layer
 */
class UserService {
  /**
   * Get current user profile data
   * @returns {Promise} Promise resolving to user profile data
   */
  static async getCurrentUser() {
    try {
      // Simulate API call but use mock data
      await userApi.getCurrentUser();
      
      // Mock user data - in a real app, this would come from the API
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
      
      return userData;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  }
  
  /**
   * Get user badges and achievements
   * @returns {Promise} Promise resolving to user achievements
   */
  static async getUserAchievements() {
    try {
      // Simulate API call but use mock data
      await userApi.getUserAchievements();
      
      // Mock badges data - in a real app, this would come from the API
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
      
      return badges;
    } catch (error) {
      console.error('Failed to get user achievements:', error);
      throw error;
    }
  }
  
  /**
   * Get user activity history
   * @param {Object} filters - Optional filters (timeframe, type, etc.)
   * @returns {Promise} Promise resolving to activity history
   */
  static async getUserActivity(filters = {}) {
    try {
      // Simulate API call but use mock data
      await userApi.getUserActivity(filters);
      
      // Mock activity data - in a real app, this would come from the API
      const activityHistory = [
        { id: 1, type: 'review', description: 'Reviewed PR #342 - Auth API Update', points: 25, date: '2 days ago', icon: '📝' },
        { id: 2, type: 'badge', description: 'Earned "Bug Hunter" badge', date: '3 days ago', icon: '🏆' },
        { id: 3, type: 'level', description: 'Reached Level 5', date: '1 week ago', icon: '🎮' },
        { id: 4, type: 'review', description: 'Reviewed PR #337 - Payment Gateway', points: 30, date: '1 week ago', icon: '📝' },
        { id: 5, type: 'quest', description: 'Completed "Security Guardian" quest', points: 150, date: '2 weeks ago', icon: '🎯' },
      ];
      
      // Apply type filter if provided
      if (filters.type) {
        return activityHistory.filter(activity => activity.type === filters.type);
      }
      
      return activityHistory;
    } catch (error) {
      console.error('Failed to get user activity:', error);
      throw error;
    }
  }
  
  /**
   * Get user statistics
   * @returns {Promise} Promise resolving to user stats
   */
  static async getUserStats() {
    try {
      // Simulate API call but use mock data
      await userApi.getUserStats();
      
      // Mock user stats - in a real app, this would come from the API
      // We're using the same structure as in getCurrentUser for consistency
      const userData = {
        id: 1,
        name: 'DragonSlayer',
        level: 5,
        xp: 456,
        xpToNextLevel: 600,
        stats: {
          points: 856,
          quests: 38,
          reviews: 142,
          badges: 12,
          bugsFound: 75,
        },
      };
      
      return userData;
    } catch (error) {
      console.error('Failed to get user stats:', error);
      throw error;
    }
  }
}

export default UserService;
