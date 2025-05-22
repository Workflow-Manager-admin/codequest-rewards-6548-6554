import axios from 'axios';
import apiConfig from './apiConfig';

/**
 * Configured axios instance for making API requests
 * In a production environment, this would include proper base URL, 
 * authentication headers, interceptors, etc.
 */
const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers
});

/**
 * Request interceptor for adding auth token
 * In a real implementation, this would add the authentication token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or other storage in real implementation
    const token = localStorage.getItem(apiConfig.auth.tokenKey);
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor for handling common error cases and token refresh
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration in a real implementation
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Would refresh token in real implementation
        const refreshToken = localStorage.getItem(apiConfig.auth.refreshTokenKey);
        
        // In a real implementation, we would make a refresh token request:
        // const response = await axios.post(apiConfig.auth.refreshEndpoint, { refreshToken });
        // localStorage.setItem(apiConfig.auth.tokenKey, response.data.token);
        
        // Mock refresh token success (remove this in real implementation)
        console.log('Token refreshed successfully (mock)');
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Handle failed refresh by logging out
        localStorage.removeItem(apiConfig.auth.tokenKey);
        localStorage.removeItem(apiConfig.auth.refreshTokenKey);
        console.error('Failed to refresh token:', refreshError);
        
        // In a real implementation, you might redirect to login page:
        // window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }
    
    // Implement retry logic for certain errors
    if (apiConfig.retry.enabled && 
        apiConfig.retry.statusCodesToRetry.includes(error.response?.status) && 
        (!originalRequest._retryCount || originalRequest._retryCount < apiConfig.retry.maxRetries)) {
      
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      // Exponential backoff delay
      const delay = apiConfig.retry.retryDelay * Math.pow(2, originalRequest._retryCount - 1);
      
      return new Promise(resolve => {
        setTimeout(() => resolve(apiClient(originalRequest)), delay);
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
