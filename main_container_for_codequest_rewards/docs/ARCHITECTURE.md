# CodeQuest Rewards - System Architecture

## Overview

CodeQuest Rewards is a gamified application designed to incentivize and improve code quality by rewarding reviewers who identify and validate bugs or discrepancies in Merge Requests (MRs) across organizational projects. The system uses game mechanics like points, levels, achievements, and leaderboards to motivate developers to participate in code reviews and identify potential issues.

## Core Components

### 1. Admin Portal
- **Functionality**: Onboarding new teams/projects, configuring point values, managing users, viewing analytics
- **Integration Points**: User management system, Git providers, analytical dashboards
- **Key Services**: AdminService, ProjectService

### 2. Git Integration Layer
- **Functionality**: Connects to Git providers (GitHub, GitLab, etc.), monitors repositories, detects new PRs/MRs
- **Integration Points**: Git provider APIs, webhooks
- **Key Services**: GitIntegrationService, WebhookService

### 3. Merge Request Processing
- **Functionality**: Routes MRs to appropriate reviewers, tracks review status, manages code diff display
- **Integration Points**: Git providers, notification system
- **Key Services**: MergeRequestService, ReviewRoutingService

### 4. Bug Validation System
- **Functionality**: Allows claiming bugs, validates bug reports, calculates point values
- **Integration Points**: MergeRequestService, RewardsService
- **Key Services**: ValidationService

### 5. Rewards & Gamification
- **Functionality**: Manages points, achievements, levels, leaderboards, and redemption of rewards
- **Integration Points**: User profiles, notification system
- **Key Services**: RewardsService, LeaderboardService, UserService

### 6. User Interface
- **Functionality**: Interactive dashboard, leaderboards, MR review interfaces, profile pages
- **Integration Points**: All services via React components
- **Key Components**: Home, Leaderboard, MergeRequestReview, UserProfile, RewardsRedemption

## High-Level Data Flow

```
1. Admin Onboarding & Setup
   ┌─────────────┐      ┌────────────────┐      ┌───────────────┐
   │ Admin Portal│──────▶ Project Config │──────▶ Team/Reviewer │
   └─────────────┘      └────────────────┘      │ Assignment    │
                                                └───────────────┘
                                                        │
                                                        ▼
2. Git Integration & PR Detection
   ┌─────────────┐      ┌────────────────┐      ┌───────────────┐
   │ Git Provider│──────▶ Webhooks/API   │──────▶ MR Detection  │
   │ (GitHub/    │      │ Integration    │      │ & Processing  │
   │  GitLab)    │      └────────────────┘      └───────────────┘
   └─────────────┘                                      │
                                                        ▼
3. Review Process
   ┌─────────────┐      ┌────────────────┐      ┌───────────────┐
   │ Reviewer    │──────▶ Bug Detection  │──────▶ Bug Validation│
   │ Assignment  │      │ & Claiming     │      │               │
   └─────────────┘      └────────────────┘      └───────────────┘
                                                        │
                                                        ▼
4. Rewards & Gamification
   ┌─────────────┐      ┌────────────────┐      ┌───────────────┐
   │ Points      │──────▶ Achievements   │──────▶ Leaderboards  │
   │ Allocation  │      │ & Leveling     │      │               │
   └─────────────┘      └────────────────┘      └───────────────┘
                                                        │
                                                        ▼
5. Reward Redemption
   ┌─────────────┐      ┌────────────────┐      ┌───────────────┐
   │ Reward      │──────▶ Redemption     │──────▶ Reward        │
   │ Selection   │      │ Process        │      │ Fulfillment   │
   └─────────────┘      └────────────────┘      └───────────────┘
```

## Key Data Models

### 1. User
- Profile information, authentication details
- Game stats: level, XP, points, badges
- Review history and activity log

### 2. Project
- Repository information, Git provider details
- Team assignments and reviewer roles
- Configuration settings for MR routing

### 3. Merge Request
- PR/MR metadata from Git provider
- Code diffs and change information
- Status tracking and review assignments
- Bug reports and validations

### 4. Bug
- Description, severity, line numbers
- Status (claimed, validated, rejected)
- Points value and validation history

### 5. Reward
- Types, point costs, availability
- Redemption history and status
- Categories and featured status

### 6. Achievement/Badge
- Requirements for earning
- Display information and rarity
- Associated bonuses or perks

## Authentication & Authorization

The system relies on standard authentication mechanisms with role-based access control:
- **Admin**: Full system configuration access
- **Team Lead**: Project-specific administration
- **Reviewer**: Can review MRs and claim bugs
- **Developer**: Limited access to view status and leaderboards

## External Integration Points

1. **Git Providers**: 
   - API integration for repository monitoring
   - Webhook endpoints for PR/MR event notifications
   - OAuth-based authentication

2. **User Directory**:
   - Integration with company directory/SSO
   - Role and permission management

3. **Reward Fulfillment**:
   - Optional integration with procurement systems
   - Notification systems for physical rewards

## Service Layer Architecture

The application follows a clean architecture with clear separation of concerns:

1. **UI Components Layer**: React components for user interaction
2. **Service Layer**: Business logic and state management
3. **API Layer**: Communication with backend services
4. **External Systems**: Git providers and other integrated services

Communication between layers follows a standardized pattern to maintain scalability and testability.

## Future Extensibility

The architecture supports several extension points:
- Additional Git provider integrations
- Custom reward types and validation logic
- Enhanced analytics and reporting
- Team-based competitions and group achievements

## Development Philosophy

The system embraces:
- Clean, maintainable code with thorough documentation
- Service-oriented architecture with clear boundaries
- Responsive UI with gaming-inspired elements
- Security and performance as core principles
