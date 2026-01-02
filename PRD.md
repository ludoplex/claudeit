# Product Requirements Document (PRD)

## OpusAudit - Claude API Billing Monitor & Evidence Collector

**Version:** 1.0.0  
**Date:** January 2, 2026  
**Status:** Active Development  
**Owner:** Product Team

---

## Executive Summary

OpusAudit is a web-based application designed to monitor Claude API usage, track billing discrepancies, and automatically generate evidence packages for refund requests. Built on Puter.js for seamless cloud integration, it provides real-time monitoring, automated analysis, and comprehensive documentation for API billing disputes.

---

## Problem Statement

### Current Challenges

1. **Lack of Visibility**: Users have limited visibility into Claude API call details, making it difficult to verify billing accuracy
2. **Manual Evidence Collection**: Collecting evidence for billing disputes is time-consuming and error-prone
3. **Missing Failure Detection**: 5xx errors and incomplete streams may go unnoticed, resulting in unwarranted charges
4. **Inefficient Dispute Process**: No standardized way to document and submit refund requests to Anthropic support

### Target Users

- **Primary**: Individual developers and small teams using Claude API
- **Secondary**: Enterprise developers managing large-scale API usage
- **Tertiary**: API cost auditors and finance teams

---

## Solution Overview

OpusAudit provides a comprehensive monitoring and evidence collection system that:

1. **Monitors** all Claude API calls in real-time
2. **Detects** refundable events (5xx errors, incomplete streams, zero-output deliveries)
3. **Calculates** accurate cost estimates based on token usage
4. **Generates** professional support packets with cover letters and detailed logs
5. **Stores** data securely in Puter cloud storage

---

## Core Features

### 1. Authentication & User Management

#### 1.1 Puter.js Authentication
- **Priority**: P0 (Critical)
- **Description**: Secure user authentication via Puter.js
- **User Story**: As a user, I want to sign in securely so that my API logs are private and persistent

**Acceptance Criteria:**
- User can sign in with Puter.js authentication
- Session persists across page reloads
- User can sign out and clear local session
- Display user email/username in header

#### 1.2 Session Management
- **Priority**: P0 (Critical)
- **Description**: Maintain user session state
- **User Story**: As a user, I want my session to persist so I don't have to sign in repeatedly

**Acceptance Criteria:**
- Check authentication status on page load
- Auto-authenticate if valid session exists
- Clear session data on sign out

---

### 2. API Monitoring & Logging

#### 2.1 Real-time Request Logging
- **Priority**: P0 (Critical)
- **Description**: Log all Claude API requests with comprehensive metadata
- **User Story**: As a user, I want all my API calls logged so I can review them later

**Acceptance Criteria:**
- Capture request ID, timestamp, model, tokens, status, latency
- Store logs in chronological order
- Display most recent 50 logs in UI
- Auto-save logs to Puter KV storage

**Technical Details:**
```javascript
RequestLog {
    id: string,           // Unique request identifier
    timestamp: string,    // ISO 8601 timestamp
    model: string,        // Claude model used
    inputTokens: number,  // Estimated input tokens
    outputTokens: number, // Estimated output tokens
    status: number,       // HTTP status code
    stopReason: string,   // Completion reason (end_turn, etc.)
    latencyMs: number,    // Request latency in milliseconds
    cost: number,         // Calculated cost in USD
    isRefundable: boolean,// Whether event qualifies for refund
    refundReason: string, // Reason for refund eligibility
    error: string         // Error message if failed
}
```

#### 2.2 Token Estimation
- **Priority**: P1 (High)
- **Description**: Estimate token usage for cost calculation
- **User Story**: As a user, I want to see estimated costs so I can track spending

**Acceptance Criteria:**
- Estimate input tokens from user message
- Estimate output tokens from API response
- Use ~4 characters per token heuristic
- Display token counts in request logs

#### 2.3 Cost Calculation
- **Priority**: P0 (Critical)
- **Description**: Calculate accurate cost per request based on model pricing
- **User Story**: As a user, I want accurate cost estimates so I can verify my billing

**Acceptance Criteria:**
- Use official Claude pricing tiers
- Calculate: (inputTokens/1000 * inputPrice) + (outputTokens/1000 * outputPrice)
- Support multiple models with different pricing
- Display costs with 4 decimal precision

**Pricing Table:**
| Model | Input (per 1K tokens) | Output (per 1K tokens) |
|-------|----------------------|------------------------|
| Claude Sonnet 4 | $0.003 | $0.015 |
| Claude 3.5 Haiku | $0.0008 | $0.004 |
| Claude 3.7 Sonnet | $0.003 | $0.015 |

---

### 3. Chat Interface

#### 3.1 Message Input/Output
- **Priority**: P0 (Critical)
- **Description**: Interactive chat interface for Claude API
- **User Story**: As a user, I want to chat with Claude while monitoring all requests

**Acceptance Criteria:**
- Text area for message input
- Model selector dropdown
- Send button (disabled during request)
- Display chat history with user/assistant messages
- Show streaming responses in real-time
- Enter key sends message (Shift+Enter for new line)

#### 3.2 Streaming Support
- **Priority**: P1 (High)
- **Description**: Display streaming responses as they arrive
- **User Story**: As a user, I want to see responses as they stream for better UX

**Acceptance Criteria:**
- Handle async iterator responses from Puter.js
- Update UI incrementally as chunks arrive
- Show typing indicator during streaming
- Gracefully handle stream interruptions

---

### 4. Refund Analysis Engine

#### 4.1 Automated Eligibility Detection
- **Priority**: P0 (Critical)
- **Description**: Automatically detect refundable events
- **User Story**: As a user, I want automatic detection of billing issues so I don't miss refund opportunities

**Acceptance Criteria:**
- Detect 5xx server errors
- Detect incomplete streams (missing stop_reason)
- Detect zero-output deliveries with charges
- Mark events as refundable with reason
- Update refundable count in real-time

**Refundability Rules:**

1. **Service Availability (5xx Error)**
   - Condition: HTTP status >= 500
   - Policy: Commercial Terms - Service Availability / SLA
   - Evidence: HTTP status code and timestamp

2. **Incomplete Delivery**
   - Condition: status=200, outputTokens>0, stopReason=null
   - Policy: Billing applies to successful completion
   - Evidence: Missing completion signal

3. **Zero Output Delivery**
   - Condition: status=200, outputTokens=0, cost>0
   - Policy: Charges should reflect actual usage
   - Evidence: No output delivered despite charges

#### 4.2 Evidence Package Generation
- **Priority**: P0 (Critical)
- **Description**: Generate professional support packets
- **User Story**: As a user, I want automated evidence packages so I can easily submit refund requests

**Acceptance Criteria:**
- Generate cover letter with summary statistics
- Generate CSV with refundable request IDs
- Include incident types and date ranges
- Cite relevant policy sections
- Professional formatting

#### 4.3 Dispute Threshold Warning
- **Priority**: P2 (Medium)
- **Description**: Warn users when disputed amount is below threshold
- **User Story**: As a user, I want guidance on when to submit disputes

**Acceptance Criteria:**
- Show warning if disputed value < $5.00
- Recommend waiting for more failures
- Avoid spamming support with small claims

---

### 5. Data Management

#### 5.1 Cloud Storage
- **Priority**: P0 (Critical)
- **Description**: Persist data to Puter cloud storage
- **User Story**: As a user, I want my logs saved so I don't lose data

**Acceptance Criteria:**
- Save logs to Puter KV storage
- Load logs on authentication
- Auto-save every 30 seconds
- Handle storage errors gracefully

#### 5.2 Export Functionality
- **Priority**: P1 (High)
- **Description**: Export logs and support packets
- **User Story**: As a user, I want to export data for external analysis

**Acceptance Criteria:**
- Export all logs as CSV
- Export refundable events as CSV
- Export cover letter as TXT
- Download to local device
- Save to Puter cloud storage

---

### 6. Dashboard & Statistics

#### 6.1 Real-time Stats
- **Priority**: P0 (Critical)
- **Description**: Display key metrics in dashboard
- **User Story**: As a user, I want to see my API usage at a glance

**Acceptance Criteria:**
- Total requests count
- Refundable events count
- Total spent (USD)
- Disputed value (USD)
- Update in real-time after each request

#### 6.2 Request Logs View
- **Priority**: P1 (High)
- **Description**: Scrollable list of recent requests
- **User Story**: As a user, I want to review individual requests

**Acceptance Criteria:**
- Show most recent 50 requests
- Display: ID, timestamp, model, status, cost
- Color-coded status indicators (green=success, red=error)
- Click to view detailed information
- Highlight refundable events

#### 6.3 Refundable Events Panel
- **Priority**: P0 (Critical)
- **Description**: Dedicated panel for refundable events
- **User Story**: As a user, I want to focus on events that qualify for refunds

**Acceptance Criteria:**
- Table view with all refundable events
- Show: request ID, timestamp, model, status, reason, cost
- Generate Support Packet button
- Badge showing event count
- Empty state when no refundable events

---

## User Experience (UX)

### Design Principles

1. **Clarity**: Clear information hierarchy, easy to understand metrics
2. **Efficiency**: Quick access to critical information
3. **Trust**: Professional design that inspires confidence
4. **Responsiveness**: Works seamlessly on desktop and mobile

### Visual Design

- **Color Scheme**: Dark theme (slate/blue gradients)
- **Typography**: System fonts for readability
- **Icons**: Heroicons for consistency
- **Layout**: Responsive grid with Tailwind CSS

### Key Screens

#### 1. Authentication Screen
- Centered card with Puter.js sign-in button
- App logo and description
- Security messaging

#### 2. Main Dashboard
- Header with user info and sign-out
- 4 stat cards (requests, refundable, spent, disputed)
- Split view: Chat (2/3) + Request Logs (1/3)
- Refundable Events panel below
- Threshold warning banner (conditional)

#### 3. Support Packet Modal
- Cover letter preview
- Download and cloud save buttons
- Professional formatting

---

## Technical Architecture

### Tech Stack

- **Frontend**: HTML5, CSS (Tailwind), JavaScript (ES6+)
- **Backend**: Puter.js (cloud services)
- **Authentication**: Puter.js Auth
- **Storage**: Puter KV (key-value store)
- **AI**: Puter.js AI Chat API
- **Deployment**: GitHub Pages (static hosting)

### Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    Browser (UI)                     │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │   Auth     │  │    Chat     │  │   Dashboard  │ │
│  │  Screen    │  │  Interface  │  │    Stats     │ │
│  └────────────┘  └─────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                   puter.js (Core)                   │
│  ┌───────────────────────────────────────────────┐  │
│  │  AppState │ Utils │ Storage │ Auth │ API     │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                Puter.js Services                    │
│  ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │
│  │   Auth   │  │    KV    │  │    AI Chat      │  │
│  │ Service  │  │  Storage │  │  (Claude API)   │  │
│  └──────────┘  └──────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Module Structure

```
/
├── index.html          # Main application UI
├── puter.js            # Core application logic
├── tests.html          # Comprehensive test suite
├── PRD.md              # This document
├── README.md           # Project documentation
└── LICENSE             # License file
```

---

## Testing Strategy

### Unit Tests
- AppState management
- Utils functions (token estimation, cost calculation)
- Storage operations (save/load)
- Authentication flow
- Refund analysis logic

### Integration Tests
- End-to-end user workflow
- API call and logging
- Data persistence
- Export functionality

### Manual Testing
- UI/UX validation
- Cross-browser compatibility
- Mobile responsiveness
- Error handling

### Test Coverage Goal
- **Target**: 80%+ code coverage
- **Critical paths**: 100% coverage

---

## Performance Requirements

### Response Times
- Page load: < 2 seconds
- Authentication: < 1 second
- API call initiation: < 100ms
- Log rendering: < 500ms for 50 items

### Scalability
- Support up to 10,000 logged requests per user
- Graceful degradation with large datasets
- Efficient pagination for UI rendering

### Reliability
- 99.9% uptime (dependent on Puter.js and GitHub Pages)
- Graceful error handling for all API failures
- Auto-save to prevent data loss

---

## Security & Privacy

### Data Protection
- All data stored in user's private Puter cloud space
- No server-side storage or logging
- Client-side encryption for sensitive data

### Authentication
- Secure OAuth via Puter.js
- No password storage
- Session timeout after inactivity

### Compliance
- GDPR compliant (user owns their data)
- No tracking or analytics
- No third-party data sharing

---

## Deployment & Operations

### Deployment Process
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to `main` branch, root directory
4. Access via `https://[username].github.io/[repo]`

### Monitoring
- Browser console logging for debugging
- Error tracking via Puter.js logs
- User-reported issues via GitHub Issues

### Maintenance
- Regular Puter.js SDK updates
- Pricing table updates as needed
- Security patches as required

---

## Roadmap

### Phase 1: MVP (Current)
- ✅ Core monitoring functionality
- ✅ Refund analysis engine
- ✅ Support packet generation
- ✅ Puter.js integration

### Phase 2: Enhanced Features (Q1 2026)
- [ ] Advanced filtering and search
- [ ] Custom refund rules
- [ ] Multi-user collaboration
- [ ] Dashboard customization

### Phase 3: Analytics (Q2 2026)
- [ ] Usage trends and patterns
- [ ] Cost forecasting
- [ ] Model performance comparison
- [ ] Anomaly detection

### Phase 4: Enterprise (Q3 2026)
- [ ] Team management
- [ ] Budget alerts
- [ ] API key management
- [ ] Audit reports

---

## Success Metrics

### Key Performance Indicators (KPIs)

1. **User Adoption**
   - Target: 1,000 active users in first 3 months
   - Metric: Unique authenticated users per month

2. **Engagement**
   - Target: 70% weekly active users (WAU/MAU ratio)
   - Metric: Users returning within 7 days

3. **Value Delivery**
   - Target: $50,000 in disputed value identified
   - Metric: Sum of all disputed amounts across users

4. **Dispute Success Rate**
   - Target: 60% of disputes result in refunds
   - Metric: User-reported successful refunds

5. **Data Quality**
   - Target: < 5% false positive rate for refundable events
   - Metric: User feedback on incorrect flagging

---

## Risks & Mitigations

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Puter.js API changes | High | Medium | Version pinning, regular updates |
| Claude pricing changes | Medium | High | Configurable pricing table |
| Token estimation accuracy | Medium | Medium | Improve algorithm, user calibration |
| Browser compatibility | Low | Low | Polyfills, progressive enhancement |

### Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low user adoption | High | Medium | Marketing, community engagement |
| Anthropic policy changes | High | Low | Monitor TOS, adapt quickly |
| Competition | Medium | Medium | Focus on unique features, UX |

---

## Glossary

- **5xx Error**: Server-side HTTP error (500-599)
- **Ghost Stream**: Incomplete API response without proper termination
- **Refundable Event**: API call that qualifies for billing dispute
- **Stop Reason**: Signal indicating why API response ended
- **Token**: Unit of text processing (roughly 4 characters)
- **Puter.js**: Cloud platform SDK for web applications
- **KV Storage**: Key-value storage service

---

## Appendix

### A. API Documentation
See Puter.js documentation: https://docs.puter.com

### B. Support Contact
- GitHub Issues: https://github.com/[username]/opusaudit/issues
- Email: support@opusaudit.com (placeholder)

### C. License
MIT License - See LICENSE file

---

**Document Revision History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-02 | Product Team | Initial PRD |

---

**Approvals**

- [ ] Product Manager
- [ ] Engineering Lead  
- [ ] Design Lead
- [ ] QA Lead

