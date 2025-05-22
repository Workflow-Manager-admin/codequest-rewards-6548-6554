import { availableRewards, rewardCategories, redemptionHistory } from '../data/mockData';
import { rewardsApi } from '../api';

/**
 * PUBLIC_INTERFACE
 * Service for handling rewards-related functionality
 * Acts as a bridge between the UI components and the API layer
 */
class RewardsService {
  /**
   * Get all available rewards
   * @param {Object} filters - Optional filters (category, search query, etc.)
   * @returns {Promise} Promise resolving to filtered rewards
   */
  static async getAvailableRewards(filters = {}) {
    try {
      // In a real implementation, this would call the API and return actual data
      // For now, we'll simulate the API call but use our mock data
      const response = await rewardsApi.getAvailableRewards(filters);
      
      let filteredRewards = [...availableRewards];
      
      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        filteredRewards = filteredRewards.filter(
          reward => reward.category === filters.category
        );
      }
      
      // Apply search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filteredRewards = filteredRewards.filter(
          reward => reward.name.toLowerCase().includes(query) || 
                   reward.description.toLowerCase().includes(query)
        );
      }
      
      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price-low':
            filteredRewards.sort((a, b) => a.points - b.points);
            break;
          case 'price-high':
            filteredRewards.sort((a, b) => b.points - a.points);
            break;
          case 'popularity':
            filteredRewards.sort((a, b) => {
              const popularityRank = { 'very high': 4, 'high': 3, 'medium': 2, 'low': 1 };
              return popularityRank[b.popularity] - popularityRank[a.popularity];
            });
            break;
          case 'featured':
          default:
            // Featured items first, then sort by points
            filteredRewards.sort((a, b) => {
              if (a.featured && !b.featured) return -1;
              if (!a.featured && b.featured) return 1;
              return b.points - a.points;
            });
        }
      }
      
      return {
        data: filteredRewards,
        total: filteredRewards.length
      };
    } catch (error) {
      console.error('Failed to get available rewards:', error);
      throw error;
    }
  }
  
  /**
   * Get reward categories
   * @returns {Promise} Promise resolving to reward categories
   */
  static async getRewardCategories() {
    try {
      // Simulate API call but use mock data
      await rewardsApi.getRewardCategories();
      return rewardCategories;
    } catch (error) {
      console.error('Failed to get reward categories:', error);
      throw error;
    }
  }
  
  /**
   * Redeem a reward
   * @param {string} rewardId - ID of the reward to redeem
   * @param {Object} userData - User data for redemption (points, etc.)
   * @returns {Promise} Promise resolving to redemption result
   */
  static async redeemReward(rewardId, userData = {}) {
    try {
      // Find the reward in our mock data
      const reward = availableRewards.find(r => r.id === rewardId);
      
      if (!reward) {
        throw new Error('Reward not found');
      }
      
      if (userData.points < reward.points) {
        throw new Error('Insufficient points');
      }
      
      if (reward.stock <= 0) {
        throw new Error('Reward out of stock');
      }
      
      // Simulate API call
      const response = await rewardsApi.redeemReward(rewardId);
      
      // Create a new redemption record (in a real app this would come from the API)
      const newRedemption = {
        id: `rdm-${Date.now()}`,
        rewardId: reward.id,
        rewardName: reward.name,
        pointsCost: reward.points,
        redeemDate: new Date().toISOString(),
        status: 'pending'
      };
      
      // In a real implementation, the API would handle this
      // For now, we'll just simulate success
      return {
        success: true,
        transactionId: response.data.transactionId,
        redemption: newRedemption
      };
    } catch (error) {
      console.error('Failed to redeem reward:', error);
      throw error;
    }
  }
  
  /**
   * Get user's redemption history
   * @returns {Promise} Promise resolving to redemption history
   */
  static async getRedemptionHistory() {
    try {
      // Simulate API call but use mock data
      await rewardsApi.getRedemptionHistory();
      return redemptionHistory;
    } catch (error) {
      console.error('Failed to get redemption history:', error);
      throw error;
    }
  }
}

export default RewardsService;
