# Backend

API server and business logic layer.

## Features

- RESTful API endpoints
- WebSocket server for real-time updates
- Database models and migrations
- Authentication and authorization
- Integration with external services (Twilio, Zapier)
- AI agent coordination

## Getting Started

```bash
cd src/backend
npm install
npm run migrate
npm run dev
```

## Structure

- `routes/` - API route definitions
- `controllers/` - Request handlers
- `models/` - Database models
- `services/` - Business logic
- `middleware/` - Express middleware
- `utils/` - Utility functions
- `migrations/` - Database migrations
