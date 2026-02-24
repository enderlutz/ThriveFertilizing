# ThriveFertilizing - AI Business Command Center

## Project Overview

This is an AI-powered business dashboard that serves as the central operating system for a fertilizing/landscaping business. The system acts as the homebase and control center for all customer communication, AI automation, scheduling, estimates, and internal workflows.

### Core Vision

The dashboard functions as an AI-powered operating system where:
- The **dashboard** is the primary interface for the business owner and team
- The **SMS number** is the primary interface for customers
- The **AI agent** lives inside the system, continuously processing customer data, automating communication, and organizing work

### Key Principles

1. **Centralized Control** - All communication and workflows in one place
2. **Real-Time Visibility** - Complete oversight of business operations
3. **Human + AI Collaboration** - Automated task execution with human oversight
4. **Scalable Architecture** - Built for future automation and reporting

## System Architecture

### Technology Stack

**Frontend:**
- React/Next.js for the dashboard interface
- Real-time updates with WebSockets
- Responsive design for mobile and desktop

**Backend:**
- Node.js/Express or Python/FastAPI
- PostgreSQL for data persistence
- Redis for caching and real-time features

**AI Agent:**
- LLM integration (Claude API)
- Natural language processing
- Task automation engine
- Context management system

**Integrations:**
- Twilio for SMS communication
- Yardbook via Zapier for scheduling
- Email notifications
- Calendar integrations

### Customer Channel

Customers communicate primarily via SMS. All interactions automatically sync with the dashboard in real-time.

## Core Modules

### 1. Unified Inbox

Central messaging interface for all customer communication.

**Features:**
- Conversation threads per customer
- Real-time syncing with SMS
- AI + customer + human messages in one view
- Internal notes (not visible to customers)
- Media support (photos, attachments)
- Search and filters

**Controls:**
- Take over conversation
- Pause AI automation
- Resume AI
- Approve AI-generated messages
- Edit AI responses before sending

**Outcomes:**
- No missed conversations
- Faster response time
- Full visibility and control

### 2. Lead and Job Pipeline

Visual workflow for tracking customers from first contact to completed job.

**Stages:**
1. New lead
2. Qualification
3. Estimate needed
4. Estimate sent
5. Waiting on customer
6. Scheduled
7. In progress
8. Completed
9. Follow-up

**Features:**
- Drag-and-drop movement
- Auto-updated based on AI actions
- Priority and urgency indicators
- Tags for service types

**Outcomes:**
- Clear view of business activity
- Reduced bottlenecks
- Increased conversion rates

### 3. Task and Workflow Management

Automatic task creation and management system.

**Task Examples:**
- Approve estimate
- Confirm availability
- Request missing information
- Follow-up reminders
- Customer reactivation

**Features:**
- AI-generated tasks
- Priority ranking
- Owner and team assignment
- Deadline tracking
- Notifications

**Outcomes:**
- Reduced manual coordination
- Improved accountability

### 4. AI Agent Interface

Direct chat interface between the owner and the AI agent.

**Use Cases:**
- Request summaries
- Generate responses
- Ask for recommendations
- Review performance
- Create new workflows

**Example Commands:**
- "Summarize today's leads"
- "What needs my attention?"
- "Draft a response to this customer"
- "Which customers should we follow up with?"

**Outcomes:**
- Faster decision-making
- Reduced cognitive load
- Improved oversight

### 5. Estimate and Approval Center

Structured workflow for managing estimates.

**Features:**
- AI-generated estimate drafts
- Team review and approval
- Pricing rule system
- Editable templates
- Version tracking

**Outcomes:**
- Faster turnaround
- Reduced errors
- Consistent pricing

### 6. Scheduling and Availability

Integration with Yardbook via Zapier to manage job availability.

**Features:**
- Real-time availability view
- Suggested time slots
- AI-driven scheduling
- Conflict detection
- Appointment reminders

**Outcomes:**
- Reduced scheduling friction
- Higher booking rates

### 7. Activity and Automation Log

Transparent record of all actions taken by the AI and team.

**Logged Actions:**
- Messages sent
- Estimates generated
- Appointments scheduled
- Tasks completed

**Outcomes:**
- Trust in automation
- Auditability
- Performance tracking

### 8. Customer Profiles and CRM

Centralized record of each customer.

**Features:**
- Contact information
- Service history
- Communication history
- Preferences
- Tags and segmentation
- Notes and insights

**Outcomes:**
- Better relationships
- Repeat business
- Upsell opportunities

### 9. Notifications and Alerts

Smart notifications to keep the team focused.

**Examples:**
- High-value lead detected
- No response from customer
- Approval needed
- Scheduling conflicts

**Outcomes:**
- Faster action
- Reduced missed opportunities

## AI Agent Responsibilities

The AI agent will:

✓ Respond to customer inquiries
✓ Qualify leads
✓ Gather job details
✓ Draft estimates
✓ Suggest schedules
✓ Create tasks
✓ Send reminders
✓ Monitor conversations
✓ Recommend next steps

The agent will **escalate complex or uncertain cases to humans**.

## Security and Control

- Role-based permissions
- Approval workflows
- Data privacy safeguards
- Logging and monitoring
- Secure API keys and credentials

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow consistent naming conventions
- Write clear, documented code
- Implement error handling at all levels
- Use environment variables for configuration

### Testing

- Unit tests for core business logic
- Integration tests for API endpoints
- End-to-end tests for critical workflows
- Test AI agent responses and decision-making

### Deployment

- Staging environment for testing
- Production environment with monitoring
- Automated backups
- Error tracking and logging

## Future Expansion

This dashboard will serve as the foundation for:

- Advanced analytics and reporting
- Revenue forecasting
- Customer lifetime value tracking
- Predictive scheduling
- Marketing automation
- Multi-location businesses
- Additional communication channels (voice, WhatsApp, email)

## Expected Outcomes

- **Increased revenue** through faster response and better conversion
- **Reduced operational friction** with automated workflows
- **Faster customer response** with AI-powered communication
- **Improved team efficiency** with centralized tools
- **Stronger customer experience** with consistent service
- **Scalable growth** with automated processes

## Getting Started

### Prerequisites

- Node.js 18+ or Python 3.10+
- PostgreSQL 14+
- Redis 7+
- Twilio account for SMS
- Claude API key
- Zapier account for integrations

### Development Setup

1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Set up database
5. Run migrations
6. Start development server

See `/docs` directory for detailed setup instructions.

## Project Structure

```
ThriveFertilizing/
├── src/
│   ├── frontend/          # Dashboard UI (React/Next.js)
│   ├── backend/           # API server and business logic
│   ├── ai-agent/          # AI agent core engine
│   └── shared/            # Shared types and utilities
├── config/                # Configuration files
├── tests/                 # Test suites
├── docs/                  # Documentation
├── CLAUDE.md              # This file
└── README.md              # Project README
```

## Support and Contact

For questions or issues, contact the development team.
