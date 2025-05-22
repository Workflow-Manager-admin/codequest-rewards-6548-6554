import { mergeRequests, bugRewards } from '../data/mockData';
import { mergeRequestApi } from '../api';

/**
 * PUBLIC_INTERFACE
 * Service for handling merge request review functionality
 * Acts as a bridge between the UI components and the API layer
 */
class MergeRequestService {
  /**
   * Get all available merge requests
   * @param {Object} filters - Optional filters (status, search query, etc.)
   * @returns {Promise} Promise resolving to filtered merge requests
   */
  static async getMergeRequests(filters = {}) {
    try {
      // Simulate API call but use mock data
      await mergeRequestApi.getMergeRequests(filters);
      
      let filteredMRs = [...mergeRequests];
      
      // Apply status filter
      if (filters.status) {
        filteredMRs = filteredMRs.filter(mr => mr.status === filters.status);
      }
      
      // Apply project filter
      if (filters.project) {
        filteredMRs = filteredMRs.filter(mr => mr.projectName === filters.project);
      }
      
      // Apply search query
      if (filters.search) {
        const query = filters.search.toLowerCase();
        filteredMRs = filteredMRs.filter(
          mr => mr.title.toLowerCase().includes(query) || 
                mr.id.toLowerCase().includes(query)
        );
      }
      
      return {
        data: filteredMRs,
        total: filteredMRs.length
      };
    } catch (error) {
      console.error('Failed to get merge requests:', error);
      throw error;
    }
  }
  
  /**
   * Get merge request by ID
   * @param {string} id - The merge request ID
   * @returns {Promise} Promise resolving to merge request details
   */
  static async getMergeRequestById(id) {
    try {
      // Simulate API call but use mock data
      await mergeRequestApi.getMergeRequestById(id);
      
      const mergeRequest = mergeRequests.find(mr => mr.id === id);
      
      if (!mergeRequest) {
        throw new Error('Merge request not found');
      }
      
      return mergeRequest;
    } catch (error) {
      console.error(`Failed to get merge request with ID ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Claim a bug in a merge request
   * @param {string} mergeRequestId - The merge request ID
   * @param {string} bugId - The bug ID
   * @returns {Promise} Promise resolving to claim result with reward details
   */
  static async claimBug(mergeRequestId, bugId) {
    try {
      // Find the merge request and bug
      const mergeRequest = await this.getMergeRequestById(mergeRequestId);
      
      let foundBug = null;
      let bugFile = null;
      
      // Search through code changes to find the bug
      for (const file of mergeRequest.codeChanges) {
        const bug = file.bugs.find(b => b.id === bugId);
        if (bug) {
          foundBug = bug;
          bugFile = file;
          break;
        }
      }
      
      if (!foundBug) {
        throw new Error('Bug not found in the specified merge request');
      }
      
      if (foundBug.claimed) {
        throw new Error('Bug already claimed');
      }
      
      // Simulate API call
      const apiResult = await mergeRequestApi.claimBug(mergeRequestId, bugId);
      
      // Get reward details based on bug severity
      const reward = bugRewards[foundBug.severity];
      
      // Mark bug as claimed (in a real app, the API would handle this)
      foundBug.claimed = true;
      
      // Create result with reward details
      const result = {
        success: true,
        bugId: foundBug.id,
        description: foundBug.description,
        points: foundBug.points,
        xp: reward.xp,
        severity: foundBug.severity
      };
      
      return result;
    } catch (error) {
      console.error(`Failed to claim bug ${bugId} in merge request ${mergeRequestId}:`, error);
      throw error;
    }
  }
  
  /**
   * Submit a review for a merge request
   * @param {string} mergeRequestId - The merge request ID
   * @param {Object} reviewData - The review data
   * @returns {Promise} Promise resolving to review submission result
   */
  static async submitReview(mergeRequestId, reviewData) {
    try {
      // Find the merge request
      const mergeRequest = await this.getMergeRequestById(mergeRequestId);
      
      // Simulate API call
      const apiResult = await mergeRequestApi.submitReview(mergeRequestId, reviewData);
      
      // In a real app, the API would update the merge request status
      // For now, we'll just update the local data to simulate completion
      mergeRequest.reviewsCompleted = true;
      
      return {
        success: true,
        reviewId: apiResult.data.reviewId,
        message: 'Review submitted successfully'
      };
    } catch (error) {
      console.error(`Failed to submit review for merge request ${mergeRequestId}:`, error);
      throw error;
    }
  }
  
  /**
   * Add a comment to a merge request
   * @param {string} mergeRequestId - The merge request ID
   * @param {Object} commentData - The comment data
   * @returns {Promise} Promise resolving to comment submission result
   */
  static async addComment(mergeRequestId, commentData) {
    try {
      // Find the merge request
      const mergeRequest = await this.getMergeRequestById(mergeRequestId);
      
      // Simulate API call
      const apiResult = await mergeRequestApi.addComment(mergeRequestId, commentData);
      
      // Create a new comment (in a real app, the API would return the created comment)
      const newComment = {
        id: apiResult.data.commentId,
        author: 'DragonSlayer', // Hard-coded for mock implementation
        authorAvatar: '🔮',     // Hard-coded for mock implementation
        content: commentData.content,
        createdAt: new Date().toISOString(),
        fileId: commentData.fileId,
        lineNumber: commentData.lineNumber
      };
      
      // Add comment to merge request (in a real app, this would be handled by the API)
      mergeRequest.comments.push(newComment);
      
      return {
        success: true,
        comment: newComment
      };
    } catch (error) {
      console.error(`Failed to add comment to merge request ${mergeRequestId}:`, error);
      throw error;
    }
  }
}

export default MergeRequestService;
