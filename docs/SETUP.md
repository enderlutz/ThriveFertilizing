# Setup Guide

Complete setup instructions for ThriveFertilizing project.

## Prerequisites

- Node.js 18+ or Python 3.10+
- PostgreSQL 14+
- Redis 7+
- Twilio account
- Claude API key
- Zapier account

## Step 1: Database Setup

### PostgreSQL

```bash
# Install PostgreSQL (macOS)
brew install postgresql@14

# Start PostgreSQL
brew services start postgresql@14

# Create database
createdb thrive_fertilizing
```

### Redis

```bash
# Install Redis (macOS)
brew install redis

# Start Redis
brew services start redis
```

## Step 2: Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your actual credentials
nano .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `CLAUDE_API_KEY` - Your Claude API key
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number

## Step 3: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd src/frontend && npm install && cd ../..

# Install backend dependencies
cd src/backend && npm install && cd ../..

# Install AI agent dependencies
cd src/ai-agent && npm install && cd ../..
```

## Step 4: Database Migrations

```bash
# Run migrations
npm run migrate

# Seed initial data (optional)
npm run seed
```

## Step 5: Start Development Server

```bash
# Start all services
npm run dev

# Or start individually:
npm run dev:frontend   # Port 3000
npm run dev:backend    # Port 4000
npm run dev:ai-agent   # Background service
```

## Step 6: Verify Installation

1. Open browser to http://localhost:3000
2. Check API health: http://localhost:4000/health
3. Test SMS integration with Twilio
4. Verify AI agent is responding

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check connection string in `.env`
- Ensure database exists: `psql -l`

### Redis Connection Issues

- Verify Redis is running: `redis-cli ping`
- Check Redis URL in `.env`

### API Key Issues

- Verify Claude API key is valid
- Check Twilio credentials
- Test API keys with curl or Postman

## Next Steps

- Review [CLAUDE.md](../CLAUDE.md) for project architecture
- Read module-specific README files
- Set up testing environment
- Configure CI/CD pipeline
