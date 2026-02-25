# Commands

All commands are run from the **project root** (`ThriveFertilizing/`).

## Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend + backend together |
| `npm run dev:frontend` | Start frontend only (port 3000) |
| `npm run dev:backend` | Start backend only (port 4000) |
| `npm run stop:backend` | Kill the backend process |

## Database

| Command | Description |
|---------|-------------|
| `npm run migrate` | Apply any pending DB migrations |

To create a new migration after changing a model:
```bash
cd src/backend
venv/bin/alembic revision --autogenerate -m "describe your change"
npm run migrate
```

## URLs (when running)

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Dashboard (frontend) |
| http://localhost:4000 | API (backend) |
| http://localhost:4000/docs | Interactive API docs |
| http://localhost:4000/health | Backend health check |

## First-Time Setup

1. Install dependencies:
   ```bash
   npm install
   cd src/frontend && npm install
   cd ../backend && python3 -m venv venv && venv/bin/pip install -r requirements.txt
   ```

2. Make sure Postgres.app is open and running (elephant icon in menu bar)

3. Create the database (first time only):
   ```bash
   /Applications/Postgres.app/Contents/Versions/latest/bin/psql -U $USER -c "CREATE DATABASE thrive_fertilizing;"
   ```

4. Run migrations:
   ```bash
   npm run migrate
   ```

5. Start everything:
   ```bash
   npm run dev
   ```
