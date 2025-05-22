# Bug Validation & Points System

## Overview

The bug validation and points system is the core game mechanic of CodeQuest Rewards. This document outlines how bugs are claimed, validated, and how points are allocated to reviewers. It also describes the various reward tiers and point multipliers that create the gamified experience.

## Bug Lifecycle

```
              ┌───────────────┐
              │ PR/MR Created │
              └───────┬───────┘
                      │
                      ▼
┌──────────────┐    ┌───────────────┐
│ Automatically│    │ Code Review   │
│ Detected     ├───▶│ by Reviewer   │
│ Issues       │    │               │
└──────────────┘    └───────┬───────┘
                            │
                            ▼
┌──────────────┐    ┌───────────────┐
│ Bug          │    │ Bug Claiming  │
│ Detection    ├───▶│ Process       │
│              │    │               │
└──────────────┘    └───────┬───────┘
                            │
                            ▼
┌──────────────┐    ┌───────────────┐
│ Secondary    │    │ Bug Validation│
│ Review       ├───▶│ Process       │
│              │    │               │
└──────────────┘    └───────┬───────┘
                            │
                            ▼
┌──────────────┐    ┌───────────────┐
│ Points       │    │ Rewards &     │
│ Calculation  ├───▶│ Achievements  │
│              │    │               │
└──────────────┘    └───────────────┘
```

## Bug Detection Process

Bugs can be discovered through two primary mechanisms:

### 1. Manual Detection During Review

Reviewers carefully examine code in merge requests to identify:
- Logical errors
- Security vulnerabilities
- Performance issues
- Design flaws
- Documentation discrepancies
- Non-compliance with best practices

The reviewer creates a comment on the specific line(s) of code and flags it as a potential bug.

### 2. Automated Detection

The system can integrate with static analysis tools to pre-identify potential issues:
- Code quality tools (ESLint, SonarQube, etc.)
- Security scanners (Snyk, OWASP tools)
- Performance analyzers
- Accessibility checkers

These automated findings are presented to reviewers for validation.

## Bug Claiming Process

Once a potential bug is identified:

1. **Bug Flagging**: Reviewer adds a comment with the `@bug` tag, describing the issue:
   ```
   @bug [severity:medium] This authentication logic doesn't handle token expiration correctly
   ```

2. **Bug Registration**: The system registers the bug with metadata:
   - Location (file, line numbers)
   - Description
   - Severity (as specified by reviewer)
   - Reporter (reviewer user ID)
   - Timestamp

3. **Duplicate Check**: System checks if the same bug has been previously reported

4. **Initial Points Allocation**: Provisional points are calculated based on severity

## Bug Validation Process

Claimed bugs undergo validation to confirm their legitimacy:

### Primary Validation Methods

1. **Author Acknowledgment**:
   - PR/MR author confirms the issue
   - Fastest validation path

2. **Secondary Review**:
   - Another team member reviews the bug claim
   - Provides second opinion on validity and severity
   - Required for high-value/critical bugs

3. **Team Lead Validation**:
   - For disputed bugs or high-impact issues
   - Final authority on validation

### Validation Outcomes

Bug claims can have the following outcomes:

| Outcome | Description | Points Impact |
|---------|-------------|--------------|
| Validated | Bug confirmed as legitimate | Full points awarded |
| Severity Adjusted | Bug confirmed but with different severity | Points adjusted based on new severity |
| Duplicate | Bug already reported by another reviewer | Partial points or no points |
| Rejected | Not a valid bug | No points awarded |
| Enhanced | Bug scope expanded based on validation | Additional points possible |

## Points Calculation

### Base Points by Severity

| Severity | Base Points | XP | Description |
|----------|-------------|------|-------------|
| Low | 10 | 5 | Minor issues, simple fixes |
| Medium | 20 | 15 | Moderate issues, potential edge cases |
| High | 30 | 25 | Critical issues, security vulnerabilities |
| Critical | 50 | 40 | High-impact bugs, severe security issues |

### Multiplier Factors

Points can be modified by various multipliers:

1. **First Discovery Bonus**: +50% for being the first to discover a bug type in a project

2. **Streak Multiplier**: Based on consecutive successful validations
   - 3 streak: x1.1
   - 5 streak: x1.2
   - 10 streak: x1.5

3. **Complexity Modifier**: Based on code complexity metrics
   - Simple code: x0.8
   - Average complexity: x1.0
   - High complexity: x1.2

4. **Impact Modifier**: Based on potential impact if bug reached production
   - Low impact: x0.9
   - Medium impact: x1.0
   - High impact: x1.2
   - Critical impact: x1.5

### Example Calculation

```javascript
function calculatePoints(bug, reviewer) {
  const baseSeverityPoints = {
    low: 10,
    medium: 20,
    high: 30,
    critical: 50
  };
  
  // Get base points from severity
  let points = baseSeverityPoints[bug.severity];
  
  // Apply first discovery bonus
  if (isFirstDiscovery(bug, reviewer)) {
    points *= 1.5;
  }
  
  // Apply streak multiplier
  const streak = getReviewerStreak(reviewer.id);
  if (streak >= 10) points *= 1.5;
  else if (streak >= 5) points *= 1.2;
  else if (streak >= 3) points *= 1.1;
  
  // Apply complexity modifier
  const complexity = calculateCodeComplexity(bug.file, bug.lineNumbers);
  if (complexity === 'high') points *= 1.2;
  else if (complexity === 'simple') points *= 0.8;
  
  // Apply impact modifier
  const impact = assessPotentialImpact(bug);
  if (impact === 'critical') points *= 1.5;
  else if (impact === 'high') points *= 1.2;
  else if (impact === 'low') points *= 0.9;
  
  return Math.round(points);
}
```

## XP and Leveling System

In addition to points (which can be spent on rewards), reviewers earn XP that contributes to their level:

### XP Allocation

- XP is awarded alongside points for bug detection
- Base XP values are typically 50-80% of point values
- XP is also earned for completing reviews, even without finding bugs
- Bonus XP for maintaining review streaks
- Special events can offer XP multipliers

### Level Progression

The level system follows a standard RPG-style exponential curve:

```
Level 1: 0 XP
Level 2: 100 XP
Level 3: 300 XP
Level 4: 600 XP
Level 5: 1,000 XP
Level 6: 1,500 XP
Level 7: 2,100 XP
Level 8: 2,800 XP
Level 9: 3,600 XP
Level 10: 4,500 XP
...and so on
```

### Level Benefits

Higher levels unlock benefits:
- Access to exclusive rewards
- Higher daily point caps
- Special badges and titles
- Priority assignment for high-value reviews
- Higher point multipliers

## Validation Service Design

The validation service implements these key functions:

### 1. Bug Registration

```pseudocode
function registerBug(mrId, reporterId, bugData) {
  validateBugData(bugData);
  checkForDuplicates(mrId, bugData);
  
  const bugId = generateUniqueBugId();
  const timestamp = getCurrentTimestamp();
  
  const bug = {
    id: bugId,
    mrId: mrId,
    reporterId: reporterId,
    description: bugData.description,
    severity: bugData.severity,
    lineNumbers: bugData.lineNumbers,
    fileId: bugData.fileId,
    reportedAt: timestamp,
    status: 'claimed',
    validationStatus: 'pending'
  };
  
  storeBug(bug);
  notifyAuthorAndTeamLead(bug);
  
  return {
    bugId: bugId,
    provisionalPoints: calculateProvisionalPoints(bug)
  };
}
```

### 2. Bug Validation

```pseudocode
function validateBug(bugId, validatorId, validationData) {
  const bug = getBug(bugId);
  
  // Ensure validator is authorized
  if (!isAuthorizedValidator(validatorId, bug)) {
    throw new Error('Unauthorized validation attempt');
  }
  
  // Update validation status
  bug.validationStatus = validationData.status;
  bug.validatedAt = getCurrentTimestamp();
  bug.validatorId = validatorId;
  
  // Handle severity adjustments
  if (validationData.adjustedSeverity) {
    bug.originalSeverity = bug.severity;
    bug.severity = validationData.adjustedSeverity;
  }
  
  // Add validation notes
  bug.validationNotes = validationData.notes;
  
  updateBug(bug);
  
  // Calculate final points if validated
  if (isValidated(bug)) {
    const points = calculateFinalPoints(bug);
    awardPointsToReporter(bug.reporterId, points);
    return { success: true, pointsAwarded: points };
  }
  
  return { success: true, pointsAwarded: 0 };
}
```

### 3. Points Calculation

```pseudocode
function calculateFinalPoints(bug) {
  // Get base points from severity
  let points = getSeverityBasePoints(bug.severity);
  
  // Apply multipliers
  const reviewer = getReviewer(bug.reporterId);
  
  // First discovery bonus
  if (isFirstDiscoveryInProject(bug)) {
    points *= 1.5;
  }
  
  // Streak bonus
  const streak = reviewer.currentValidationStreak;
  points *= calculateStreakMultiplier(streak);
  
  // Code complexity
  const complexity = assessCodeComplexity(bug.fileId, bug.lineNumbers);
  points *= getComplexityMultiplier(complexity);
  
  // Impact assessment
  const impact = assessBugImpact(bug);
  points *= getImpactMultiplier(impact);
  
  return Math.round(points);
}
```

## Fraud Prevention and Gaming Resistance

To maintain system integrity, several measures are implemented:

1. **Duplicate Detection**: Sophisticated algorithms detect similar bug reports

2. **Collusion Detection**: Monitoring patterns of validation between users to detect unusual patterns

3. **Review Volume Limits**: Daily and weekly caps on reviews/validations to prevent gaming

4. **Rotation Policies**: Ensure reviewers don't consistently review the same team's code

5. **Validation Assignment**: Critical bugs are assigned to validators from different teams

6. **Quality Audits**: Random audits of bug reports and validations by senior reviewers
