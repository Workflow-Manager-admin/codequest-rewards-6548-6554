/**
 * API configuration settings
 * This file centralizes API configuration settings to make them easily changeable
 */

const apiConfig = {
  /**
   * Base URL for all API requests
   * In production, this would point to your actual API server
   */
  baseURL: process.env.REACT_APP_API_URL || '/api',
  
  /**
   * Default request timeout in milliseconds
   */
  timeout: 10000,
  
  /**
   * Default headers sent with every request
   */
  headers: {
    'Content-Type': 'application/json',
  },
  
  /**
   * Authentication settings
   */
  auth: {
    /**
     * Local storage keys for tokens
     */
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    
    /**
     * Authentication endpoints
     */
    loginEndpoint: '/auth/login',
    refreshEndpoint: '/auth/refresh',
    
    /**
     * Token expiration handling
     */
    refreshBeforeExpiration: true, // Try to refresh token before it expires
    refreshThreshold: 5 * 60, // Refresh token if it expires within 5 minutes (in seconds)
  },
  
  /**
   * Retry settings for failed requests
   */
  retry: {
    enabled: true,
    maxRetries: 3,
    retryDelay: 1000,
    statusCodesToRetry: [408, 429, 500, 502, 503, 504], // Retry these status codes
  },
};

export default apiConfig;
