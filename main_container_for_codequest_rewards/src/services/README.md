# CodeQuest Rewards - Backend Architecture

This document outlines the design and implementation of the backend stubs and service layer for the CodeQuest Rewards application.

## Architecture Overview

The application follows a layered architecture with clear separation of concerns:

```
UI Components
      ↓
   Services
      ↓
   API Layer
      ↓
  (Future) Backend
```

### Layer Responsibilities:

1. **UI Components**: Responsible for rendering the interface and handling user interactions
2. **Services**: Implement business logic and state management, acting as a bridge between UI and API
3. **API Layer**: Handles communication with the backend (currently mocked but designed to be easily replaced)

## Service Layer

The service layer abstracts away API calls and provides a consistent interface for UI components. This allows for:

- Simplified component implementation
- Centralized error handling
- Easy transition from mock data to real API endpoints
- Consistent data transformation logic

### Available Services:

- **RewardsService**: Handling reward listings, filtering, and redemption
- **MergeRequestService**: Managing code review and bug claiming functionality
- **UserService**: Handling user profile data, achievements, and activity history
- **LeaderboardService**: Providing leaderboard data for different categories and time periods

## API Layer

The API layer is designed to mimic real API calls using promises, even though it currently returns mock data. Each API module includes:

- Endpoint-specific methods matching future backend functionality
- Proper separation by domain (rewards, merge requests, users, leaderboard)
- Simulated API call pattern with promise-based returns
- Logging for debugging and monitoring

### API Client

The API client (`apiClient.js`) is configured to support:

- Authentication token management
- Request interceptors for adding auth headers
- Response interceptors for handling token refreshing
- Error handling and retries

## Mock Implementation Notes

The current implementation:

1. Uses mock data from `src/data/mockData.js`
2. Simulates API calls with delayed responses
3. Performs filtering, sorting, and data transformation in the service layer
4. Logs API calls for debugging and monitoring

## Transitioning to a Real Backend

When transitioning to a real backend:

1. Keep the service layer implementations unchanged
2. Update API layer implementation to make real HTTP requests instead of returning mock data
3. Update error handling in the API layer to handle network errors
4. Add authentication logic to the API client

## Example Data Flow

A typical data flow (e.g., for loading the rewards page):

1. RewardsRedemption component mounts
2. Component calls RewardsService.getRewardCategories() and RewardsService.getAvailableRewards()
3. RewardsService makes API calls via rewardsApi.getRewardCategories() and rewardsApi.getAvailableRewards()
4. API layer simulates network requests (will be replaced with real requests)
5. Service receives and transforms data if needed
6. Component receives and displays data

This approach ensures that UI components remain isolated from API implementation details and allows for easy evolution of the backend over time.
