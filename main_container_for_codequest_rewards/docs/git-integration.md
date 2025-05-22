# Git Integration & PR Monitoring

## Overview

The Git Integration layer is a critical component of the CodeQuest Rewards system, providing connectivity to Git providers (GitHub, GitLab, etc.), monitoring repositories for new Pull Requests/Merge Requests, and triggering the review workflow. This document explains the integration architecture, webhook handling, and PR monitoring process.

## Architecture

```
┌─────────────────┐                        ┌───────────────────────┐
│  Git Provider   │                        │  CodeQuest Rewards    │
│  (GitHub/GitLab)│                        │                       │
│                 │                        │  ┌───────────────┐    │
│                 │                        │  │               │    │
│  ┌───────────┐  │      Webhooks          │  │ Webhook      │    │
│  │Repositories├─────────────────────────────▶│ Receivers   │    │
│  └───────────┘  │                        │  │               │    │
│                 │                        │  └───────┬───────┘    │
│                 │                        │          │            │
│                 │                        │          ▼            │
│  ┌───────────┐  │                        │  ┌───────────────┐    │
│  │  API      ◀─────────────────────────────▶│ API Client    │    │
│  └───────────┘  │      API Calls         │  └───────┬───────┘    │
│                 │                        │          │            │
└─────────────────┘                        │          ▼            │
                                           │  ┌───────────────┐    │
                                           │  │ MR Processing │    │
                                           │  └───────────────┘    │
                                           │                       │
                                           └───────────────────────┘
```

## Integration Methods

The system uses two complementary methods to ensure reliable PR/MR detection:

### 1. Webhooks (Push Model)

- Git providers send event notifications to predefined endpoints
- Immediate triggers when PR events occur
- Requires public endpoint access for Git provider
- Handles events like: 
  - PR creation
  - PR updates
  - Comments added
  - PR closed/merged

### 2. API Polling (Pull Model)

- Periodic polling of Git provider APIs
- Fallback mechanism for missed webhook events
- Scheduled background process
- Ensures consistency between Git provider and CodeQuest state

## Webhook Implementation

### Registration Process

1. Admin provides Git repository access details
2. System registers webhook endpoints with Git provider:
   - PR/MR creation events
   - PR/MR update events
   - Review/comment events
   - PR/MR closing events
3. System validates webhook registration with test event

### Webhook Endpoint Security

- Webhook endpoints verify signatures/tokens from Git providers
- Rate limiting protects against abuse
- Payload validation ensures data integrity
- IP filtering optional for additional security

### Event Processing

```
┌─────────────────┐    ┌──────────────┐    ┌────────────────┐
│  Webhook        │    │ Validation & │    │ Event Queue    │
│  Receiver       ├───▶│ Signature    ├───▶│                │
│                 │    │ Verification │    │                │
└─────────────────┘    └──────────────┘    └────────┬───────┘
                                                    │
                                                    ▼
┌─────────────────┐    ┌──────────────┐    ┌────────────────┐
│  MR Service     │    │ Event        │    │ Event Processor│
│  Updates        │◀───┤ Handlers     │◀───┤                │
│                 │    │              │    │                │
└─────────────────┘    └──────────────┘    └────────────────┘
```

## API Integration

### Authentication Methods

- OAuth tokens for GitHub/GitLab
- Personal access tokens as fallback
- Service accounts for organizational access
- Scoped permissions following least privilege

### API Operations

The system utilizes various API endpoints:

1. **Repository Management**
   - List repositories
   - Get repository details
   - Configure webhook settings

2. **Pull/Merge Request Operations**
   - List open PRs/MRs
   - Get PR/MR details
   - Get PR/MR diff content
   - Add comments to PRs/MRs

3. **Review Operations**
   - Get review comments
   - Submit review feedback
   - Check review status

### Error Handling & Retries

- Exponential backoff for rate limit handling
- Circuit breakers for API downtime
- Queuing mechanism for failed operations
- Alerting for persistent integration issues

## Merge Request Processing

### Detection Process

1. System receives webhook event or detects via polling
2. PR/MR metadata is extracted and normalized
3. System checks if PR/MR is already tracked
4. For new PRs/MRs, create entry in CodeQuest database
5. Trigger reviewer assignment process

### Data Synchronization

The system maintains synchronized state between Git providers and internal database:

- Regular reconciliation processes
- Handling of out-of-band updates
- Conflict resolution strategies
- Historical PR/MR archiving

### Supported Git Providers

1. **GitHub**
   - Enterprise and public GitHub support
   - Pull Request API integration
   - Review and comment handling

2. **GitLab**
   - Self-hosted and GitLab.com support
   - Merge Request API integration
   - Discussion and note handling

3. **Extension Points**
   - Extensible provider architecture
   - Adapter pattern for new providers
   - Configuration-driven provider selection

## Repository Scanning

### Initial Setup

When a new repository is connected:

1. System performs initial scan of open PRs/MRs
2. Historical data is indexed (configurable depth)
3. Repository structure is analyzed
4. PR patterns are detected for routing configuration

### Ongoing Monitoring

- Webhook events provide real-time updates
- Polling provides backup detection mechanism
- Scheduled rescans ensure consistency
- Detection of force-pushed or amended PRs

## Implementation Considerations

### Scalability

- Webhook handlers scale horizontally
- Event processing via queue system
- Rate limiting respects Git provider constraints
- Efficient caching of repository data

### Security

- Credentials stored securely (not in code)
- Limited access scopes for API tokens
- Webhook payload verification
- Audit logging of all Git provider interactions

### Multi-Provider Support

- Common abstraction layer for Git providers
- Provider-specific adapters
- Configuration-based provider selection
- Consistent event normalization
