# CodeQuest Rewards API Layer

This directory contains the API layer for the CodeQuest Rewards application. The API layer is designed to be a bridge between the service layer and the backend server. 

## Architecture

The API layer follows a modular design with separate files for different domains:

```
api/
├── apiClient.js      # Base API client configuration
├── index.js          # Export all API modules
├── leaderboardApi.js # Leaderboard-related endpoints
├── mergeRequestApi.js # Merge request-related endpoints
├── rewardsApi.js     # Rewards-related endpoints
└── userApi.js        # User-related endpoints
```

## API Client Configuration

The `apiClient.js` file provides a configured Axios instance with:

- Base URL configuration
- Timeout settings
- Request and response interceptors
- Authentication token management
- Error handling

## Mock Implementation

In the current implementation, all API calls are mocked to return pre-defined data without making actual network requests. This allows for development and testing without a backend server.

Each API method includes:
- Documentation explaining its purpose and parameters
- Console logging for tracking calls (useful for debugging)
- A simulated response that mimics what a real API would return

## Transitioning to Real API

When a real backend becomes available, you'll need to:

1. Keep the method signatures the same
2. Replace the mock implementation with actual Axios calls to the backend
3. Configure the base URL in apiClient.js
4. Enable the authentication logic in the interceptors

### Example Transition

Current mock implementation:
```javascript
getAvailableRewards: (filters = {}) => {
  // Simulated API call
  console.log('API call: Get available rewards with filters:', filters);
  
  // For mock implementation, return resolved promise immediately
  return Promise.resolve({ 
    data: { items: [], total: 0 } 
  });
},
```

Future real implementation:
```javascript
getAvailableRewards: (filters = {}) => {
  // Real API call
  return apiClient.get('/rewards', { params: filters });
},
```

## Error Handling

The API layer includes centralized error handling in the apiClient.js file. This includes:

- Token refresh on 401 Unauthorized responses
- Logging of API errors
- Standard error format returned to services

## Authentication

The API client is configured to:

1. Store authentication tokens in localStorage
2. Add tokens to request headers
3. Refresh tokens when they expire
4. Handle authentication failures

When transitioning to a real backend, you'll need to implement the token refresh logic in the response interceptor.

## Request and Response Format

All API methods follow a consistent format:

1. Methods accept parameters in a way that matches the expected backend API
2. All methods return Promises that resolve to objects with a `data` property
3. Error responses are standardized via the interceptors
