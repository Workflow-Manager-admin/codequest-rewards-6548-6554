# Project Management & Team Assignment

## Overview

The project management component of CodeQuest Rewards handles team structures, project assignments, and reviewer roles. This document outlines how projects are configured, teams are structured, and how MR/PR reviews are routed to appropriate reviewers.

## Project Setup Process

```
1. Project Creation
   ┌─────────────┐      ┌────────────────┐      ┌───────────────┐
   │ Create      │──────▶ Configure      │──────▶ Connect Git   │
   │ Project     │      │ Settings       │      │ Repository    │
   └─────────────┘      └────────────────┘      └───────────────┘
                                                        │
                                                        ▼
2. Team Assignment
   ┌─────────────┐      ┌────────────────┐      ┌───────────────┐
   │ Create/     │──────▶ Assign         │──────▶ Configure     │
   │ Select Team │      │ Members        │      │ Reviewer Roles│
   └─────────────┘      └────────────────┘      └───────────────┘
                                                        │
                                                        ▼
3. Review Configuration
   ┌─────────────┐      ┌────────────────┐      ┌───────────────┐
   │ Set Routing │──────▶ Configure      │──────▶ Define SLAs   │
   │ Rules       │      │ Auto-Assignment│      │ and Metrics   │
   └─────────────┘      └────────────────┘      └───────────────┘
```

## Project Model

A project in CodeQuest Rewards typically represents a single repository or a collection of related repositories with these key attributes:

```json
{
  "id": "proj-123",
  "name": "Payment Gateway",
  "description": "Core payment processing system",
  "repositories": [
    {
      "id": "repo-456",
      "name": "payment-gateway",
      "provider": "github",
      "url": "https://github.com/organization/payment-gateway"
    }
  ],
  "teams": ["Backend Team", "Security Team"],
  "primaryLanguages": ["Java", "Python"],
  "primaryReviewers": ["user-789", "user-012"],
  "secondaryReviewers": ["user-345"],
  "createdAt": "2023-03-15T10:30:00Z",
  "metrics": {
    "targetReviewTime": 48,
    "bugDetectionTarget": 0.15
  }
}
```

## Team Structure

Teams provide the organizational structure for users and projects:

```json
{
  "id": "team-456",
  "name": "Backend Team",
  "description": "Server-side architecture and API development",
  "members": [
    {
      "id": "user-789",
      "name": "CodeNinja",
      "role": "team_lead"
    },
    {
      "id": "user-012",
      "name": "DragonSlayer",
      "role": "reviewer"
    },
    {
      "id": "user-345",
      "name": "AlgoAlchemist",
      "role": "reviewer"
    },
    {
      "id": "user-678",
      "name": "DevTitan",
      "role": "developer"
    }
  ],
  "projects": ["proj-123", "proj-456"],
  "createdAt": "2023-02-10T14:20:00Z",
  "metrics": {
    "reviewsCompleted": 87,
    "bugsDetected": 42,
    "averageResponseTime": "1.5 days"
  }
}
```

## User Roles and Permissions

The system supports the following roles with different permission levels:

| Role | Description | Project Permissions | Review Permissions |
|------|-------------|---------------------|-------------------|
| Admin | System administrator | Full access to all projects | Can review any MR |
| Team Lead | Manages a team | Configure team projects | Can review team MRs |
| Reviewer | Dedicated code reviewer | View assigned projects | Can review assigned MRs |
| Developer | Standard developer | View own projects | Limited review capabilities |

## Reviewer Assignment Process

```
┌─────────────────┐    ┌──────────────┐    ┌────────────────┐
│  New MR/PR      │    │ Routing      │    │ Load Balancing │
│  Detected       ├───▶│ Rules        ├───▶│ Algorithm      │
│                 │    │ Evaluation   │    │                │
└─────────────────┘    └──────────────┘    └────────┬───────┘
                                                    │
                                                    ▼
┌─────────────────┐    ┌──────────────┐    ┌────────────────┐
│  Reviewer       │    │ Notification │    │ Reviewer       │
│  Assignment     │◀───┤ System       │◀───┤ Selection      │
│                 │    │              │    │                │
└─────────────────┘    └──────────────┘    └────────────────┘
```

### Assignment Rules

MRs/PRs are assigned to reviewers based on several factors:

1. **Primary Repository Reviewers**:
   - Team members designated as primary reviewers get priority

2. **Expertise Matching**:
   - Reviewer's expertise (languages, domains) matched to MR content
   - Previous reviews in similar code areas increase priority

3. **Workload Balancing**:
   - Current open review assignments
   - Recent review completion rate
   - Time since last assignment

4. **Availability**:
   - Out-of-office status
   - Working hour alignment (for global teams)

### Auto-Assignment Algorithm

```python
def assign_reviewer(merge_request):
    # Get base candidates
    candidates = get_primary_reviewers(merge_request.repository_id)
    
    if not candidates:
        candidates = get_team_reviewers(merge_request.teams)
    
    # Filter by availability
    candidates = filter_by_availability(candidates)
    
    if not candidates:
        return escalate_to_team_lead(merge_request)
    
    # Score candidates
    scored_candidates = []
    for candidate in candidates:
        score = 0
        # Expertise match
        score += calculate_expertise_match(candidate, merge_request)
        # Workload adjustment
        score -= calculate_workload_penalty(candidate)
        # Recent activity bonus
        score += calculate_activity_bonus(candidate)
        
        scored_candidates.append((candidate, score))
    
    # Select best match
    best_candidate = select_highest_score(scored_candidates)
    
    # Assign and notify
    assign(merge_request, best_candidate)
    notify_reviewer(best_candidate, merge_request)
    
    return best_candidate
```

## Review SLAs and Metrics

The system tracks several Service Level Agreement metrics:

1. **First Response Time**:
   - Target: < 4 hours
   - Measured from MR creation to first reviewer interaction

2. **Review Completion Time**:
   - Target: < 48 hours (configurable per project)
   - Measured from assignment to review completion

3. **Bug Detection Rate**:
   - Target: > 15% of MRs have identified issues
   - Encourages thorough code review

4. **Review Quality**:
   - Measured by peer feedback
   - Bug validation success rate

## Team Performance Tracking

Teams are evaluated based on aggregate metrics:

1. **Review Velocity**: Average time to complete reviews
2. **Bug Prevention**: Bugs found during review vs. in production
3. **Knowledge Sharing**: Cross-team reviews and mentoring
4. **Review Participation**: Percentage of team members actively reviewing

## Project Health Indicators

Project health is monitored through several indicators:

1. **Code Quality Metrics**:
   - Review thoroughness scores
   - Bug detection trends
   - Code coverage trends

2. **Team Engagement**:
   - Review participation
   - Average response times
   - Review depth (comments per line)

3. **Process Efficiency**:
   - Time from PR creation to merge
   - Review iteration count
   - Reviewer workload distribution

## Integration with Development Workflow

CodeQuest Rewards is designed to integrate seamlessly with existing development workflows:

1. **CI/CD Integration**:
   - Reviews triggered after CI passes
   - Automatic PR updates on review completion

2. **Process Enforcement**:
   - Required reviews before merge
   - Blocking on critical issues
   - Review templates and checklists

3. **Notification System**:
   - Slack/Teams integrations
   - Email notifications
   - Dashboard alerts

## Example Routing Configuration

```json
{
  "projectId": "proj-123",
  "routingRules": [
    {
      "condition": {
        "pathMatches": "src/payment/*",
        "fileTypes": [".java", ".py"]
      },
      "action": {
        "assignTo": ["user-789", "user-012"],
        "priority": "high"
      }
    },
    {
      "condition": {
        "pathMatches": "src/security/*",
        "containsModification": ["encryption", "authentication"]
      },
      "action": {
        "assignTo": ["user-345"],
        "requireSecondaryReview": true,
        "priority": "critical"
      }
    },
    {
      "condition": {
        "fallback": true
      },
      "action": {
        "assignToTeam": "Backend Team",
        "useLoadBalancing": true
      }
    }
  ]
}
```
