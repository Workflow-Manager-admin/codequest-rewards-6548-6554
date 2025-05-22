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
    const token = localStorage.getItem('auth_token');
    
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
        // const refreshToken = localStorage.getItem('refresh_token');
        // const response = await axios.post('/auth/refresh', { refreshToken });
        // localStorage.setItem('auth_token', response.data.token);
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Handle failed refresh by logging out
        // localStorage.removeItem('auth_token');
        // localStorage.removeItem('refresh_token');
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
