# ThriveFertilizing

AI-powered business command center for fertilizing and landscaping operations.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

## Documentation

See [CLAUDE.md](./CLAUDE.md) for complete project documentation, architecture, and development guidelines.

## Project Structure

- `src/frontend/` - Dashboard user interface
- `src/backend/` - API server and business logic
- `src/ai-agent/` - AI agent core engine
- `src/shared/` - Shared utilities and types
- `config/` - Configuration files
- `tests/` - Test suites
- `docs/` - Additional documentation

## Tech Stack

- **Frontend:** React/Next.js, WebSockets
- **Backend:** Node.js/Express, PostgreSQL, Redis
- **AI:** Claude API, NLP processing
- **Integrations:** Twilio (SMS), Yardbook (Zapier)

## Core Features

1. Unified inbox for customer communication
2. Lead and job pipeline management
3. AI-powered task automation
4. Estimate generation and approval
5. Scheduling and availability management
6. Customer CRM and profiles
7. Activity logging and monitoring
8. Smart notifications and alerts

## License

Proprietary - All rights reserved
