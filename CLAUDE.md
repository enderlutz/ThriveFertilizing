# ThriveFertilizing — Backend Build Plan

## Status

- **Frontend**: Complete (Next.js dashboard with mock data)
- **Backend**: In progress — Python/FastAPI
- **AI Agent**: Planned for future phase

> Original project vision preserved in `originalclaude.md`

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| API Server | Python 3.11+ / FastAPI |
| ORM | SQLAlchemy 2.0 (async) |
| Database | PostgreSQL 14+ |
| Migrations | Alembic |
| Cache / Pub-Sub | Redis 7+ |
| ASGI Server | Uvicorn |
| SMS | Twilio Python SDK |
| Scheduling | Zapier Webhooks → Yardbook |

---

## Backend Project Structure

```
src/backend/
├── main.py                  # FastAPI app entry point, router registration
├── config.py                # Settings via Pydantic BaseSettings (.env)
├── database.py              # Async SQLAlchemy engine + session factory
├── models/                  # SQLAlchemy ORM models (tables)
│   ├── base.py
│   ├── customer.py
│   ├── conversation.py
│   ├── message.py
│   ├── lead.py
│   ├── estimate.py
│   ├── task.py
│   ├── activity.py
│   └── appointment.py
├── schemas/                 # Pydantic schemas (request/response validation)
│   ├── customer.py
│   ├── conversation.py
│   ├── message.py
│   ├── lead.py
│   ├── estimate.py
│   ├── task.py
│   ├── activity.py
│   └── appointment.py
├── routers/                 # FastAPI route handlers
│   ├── customers.py
│   ├── conversations.py
│   ├── leads.py
│   ├── estimates.py
│   ├── tasks.py
│   ├── activities.py
│   ├── twilio_webhook.py
│   └── schedule.py
├── services/                # Business logic (called by routers)
│   ├── customer_service.py
│   ├── conversation_service.py
│   ├── lead_service.py
│   ├── estimate_service.py
│   ├── task_service.py
│   ├── twilio_service.py
│   └── schedule_service.py
├── migrations/              # Alembic migration scripts
│   └── versions/
├── requirements.txt
└── alembic.ini
```

---

## Database Schema

All models mirror the frontend TypeScript types in `src/frontend/types/`.

### customers
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| name | VARCHAR | |
| email | VARCHAR | nullable |
| phone | VARCHAR | unique, used to match Twilio SMS |
| address_street | VARCHAR | |
| address_city | VARCHAR | |
| address_state | VARCHAR | |
| address_zip | VARCHAR | |
| property_size | INTEGER | sq ft |
| tags | ARRAY(VARCHAR) | VIP, Repeat, etc. |
| status | VARCHAR | active, inactive, prospect |
| preferred_contact_method | VARCHAR | sms, email, phone |
| notes | TEXT | |
| total_jobs_completed | INTEGER | default 0 |
| total_revenue | DECIMAL | default 0.00 |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |
| last_contacted_at | TIMESTAMP | nullable |

### conversations
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| customer_id | UUID FK → customers | |
| status | VARCHAR | active, resolved, archived |
| ai_enabled | BOOLEAN | default true |
| assigned_to | VARCHAR | nullable |
| priority | VARCHAR | low, normal, high, urgent |
| tags | ARRAY(VARCHAR) | |
| unread_count | INTEGER | default 0 |
| last_message_at | TIMESTAMP | |
| created_at | TIMESTAMP | |

### messages
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| conversation_id | UUID FK → conversations | |
| sender | VARCHAR | customer, ai, team, system |
| sender_name | VARCHAR | |
| content | TEXT | |
| read | BOOLEAN | default false |
| ai_generated | BOOLEAN | default false |
| needs_approval | BOOLEAN | default false |
| approved | BOOLEAN | nullable |
| twilio_sid | VARCHAR | nullable, for outbound tracking |
| created_at | TIMESTAMP | |

### leads
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| customer_id | UUID FK → customers | |
| stage | VARCHAR | new_lead, qualification, estimate_needed, estimate_sent, waiting_on_customer, scheduled, in_progress, completed, follow_up |
| service_type | VARCHAR | |
| property_address | VARCHAR | |
| property_size | INTEGER | |
| estimated_value | DECIMAL | |
| actual_value | DECIMAL | nullable |
| priority | VARCHAR | low, medium, high, urgent |
| source | VARCHAR | sms, referral, website, etc. |
| assigned_to | VARCHAR | |
| tags | ARRAY(VARCHAR) | |
| notes | TEXT | |
| estimate_id | UUID FK → estimates | nullable |
| appointment_id | UUID FK → appointments | nullable |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |
| last_activity_at | TIMESTAMP | |

### estimates
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| customer_id | UUID FK → customers | |
| lead_id | UUID FK → leads | nullable |
| status | VARCHAR | draft, pending_approval, approved, sent, accepted, rejected, expired |
| service_type | VARCHAR | |
| property_address | VARCHAR | |
| property_size | INTEGER | |
| subtotal | DECIMAL | |
| tax | DECIMAL | 8.25% Texas rate |
| total | DECIMAL | |
| valid_until | DATE | |
| notes | TEXT | |
| internal_notes | TEXT | |
| created_by | VARCHAR | |
| approved_by | VARCHAR | nullable |
| approved_at | TIMESTAMP | nullable |
| sent_at | TIMESTAMP | nullable |
| responded_at | TIMESTAMP | nullable |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### estimate_line_items
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| estimate_id | UUID FK → estimates | |
| description | VARCHAR | |
| quantity | DECIMAL | |
| unit_price | DECIMAL | |
| total | DECIMAL | computed |
| sort_order | INTEGER | |

### tasks
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| type | VARCHAR | approve_estimate, confirm_availability, request_information, follow_up, customer_reactivation, send_reminder, review_message, other |
| title | VARCHAR | |
| description | TEXT | |
| status | VARCHAR | pending, in_progress, completed, cancelled |
| priority | VARCHAR | low, medium, high, urgent |
| assigned_to | VARCHAR | |
| created_by | VARCHAR | |
| due_date | TIMESTAMP | nullable |
| completed_at | TIMESTAMP | nullable |
| completed_by | VARCHAR | nullable |
| related_customer_id | UUID FK → customers | nullable |
| related_lead_id | UUID FK → leads | nullable |
| related_estimate_id | UUID FK → estimates | nullable |
| related_conversation_id | UUID FK → conversations | nullable |
| created_at | TIMESTAMP | |

### activities
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| type | VARCHAR | message_sent, message_received, estimate_created, estimate_sent, appointment_scheduled, task_created, task_completed, lead_created, lead_stage_changed, system_event |
| title | VARCHAR | |
| description | TEXT | |
| performed_by | VARCHAR | |
| customer_id | UUID FK → customers | nullable |
| lead_id | UUID FK → leads | nullable |
| estimate_id | UUID FK → estimates | nullable |
| task_id | UUID FK → tasks | nullable |
| conversation_id | UUID FK → conversations | nullable |
| impact | VARCHAR | nullable (e.g. "+$1,200 potential") |
| created_at | TIMESTAMP | |

### appointments
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| customer_id | UUID FK → customers | |
| service_type | VARCHAR | |
| scheduled_date | TIMESTAMP | |
| duration | INTEGER | minutes |
| status | VARCHAR | scheduled, confirmed, in_progress, completed, cancelled |
| assigned_to | VARCHAR | |
| notes | TEXT | |
| yardbook_id | VARCHAR | nullable, external reference |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

## API Endpoints

### Customers
```
GET    /api/customers                    List all customers (search, filter)
POST   /api/customers                    Create customer
GET    /api/customers/{id}               Get customer profile
PUT    /api/customers/{id}               Update customer
DELETE /api/customers/{id}               Delete customer
```

### Conversations & Inbox
```
GET    /api/conversations                List conversations (filter by status, assigned)
POST   /api/conversations                Create conversation
GET    /api/conversations/{id}           Get conversation + messages
POST   /api/conversations/{id}/messages  Send outbound message (triggers Twilio)
PUT    /api/conversations/{id}/ai        Toggle AI on/off for conversation
```

### Leads & Pipeline
```
GET    /api/leads                        List leads (filter by stage, assigned)
POST   /api/leads                        Create lead
GET    /api/leads/{id}                   Get lead detail
PUT    /api/leads/{id}                   Update lead
PUT    /api/leads/{id}/stage             Move lead to new stage
```

### Estimates
```
GET    /api/estimates                    List estimates (filter by status)
POST   /api/estimates                    Create estimate
GET    /api/estimates/{id}               Get estimate detail
PUT    /api/estimates/{id}               Update estimate
PUT    /api/estimates/{id}/status        Approve / send / mark accepted
```

### Tasks
```
GET    /api/tasks                        List tasks (filter by status, priority)
POST   /api/tasks                        Create task
PUT    /api/tasks/{id}/status            Update task status
```

### Activities
```
GET    /api/activities                   Activity log (filter by type, customer)
```

### Twilio Webhook
```
POST   /api/webhooks/twilio              Incoming SMS from Twilio
                                          - Validates signature
                                          - Matches phone → customer
                                          - Creates/updates conversation
                                          - Stores message
                                          - Broadcasts via WebSocket
```

### Schedule (Yardbook via Zapier)
```
GET    /api/schedule/availability        Get available time slots
POST   /api/schedule/book                Book appointment (triggers Zapier)
POST   /api/webhooks/zapier              Receive schedule updates from Zapier/Yardbook
```

### Real-Time
```
WS     /ws                              WebSocket — real-time dashboard updates
```

---

## Phase Plan

### Phase 1 — Foundation (Start Here)
1. Set up FastAPI project skeleton (`main.py`, `config.py`, `database.py`)
2. Write all SQLAlchemy models (`src/backend/models/`)
3. Configure Alembic and run initial migration
4. Write Pydantic schemas for all models
5. Implement all CRUD routers + services
6. Verify with FastAPI auto-docs at `http://localhost:4000/docs`
7. Update frontend to call real API instead of mock data (one page at a time)

### Phase 2 — Twilio SMS
1. Add `twilio` to requirements
2. Implement `POST /api/webhooks/twilio` with signature validation
3. Implement outbound SMS send in `conversation_service.py`
4. Test with Twilio test credentials + ngrok

### Phase 3 — Scheduling
1. Implement Zapier inbound webhook for Yardbook schedule data
2. Build `GET /api/schedule/availability` using stored appointments
3. Implement `POST /api/schedule/book` that posts to Zapier outbound webhook

### Phase 4 — WebSocket Real-Time
1. Add `redis` and `websockets` to requirements
2. Set up Redis pub/sub channel
3. Implement `WS /ws` endpoint in FastAPI
4. Add WebSocket broadcasts to: new message, lead stage change, task update
5. Connect frontend WebSocket client in `Header.tsx`

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/thrive_fertilizing

# Redis
REDIS_URL=redis://localhost:6379

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx

# Zapier
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxx/xxxxx

# Security
JWT_SECRET=your_jwt_secret_here

# Server
PORT=4000
ENV=development
```

---

## Frontend Integration

Once Phase 1 is complete, replace mock data page by page:

| Frontend Page | Mock Data File | API Endpoints |
|--------------|----------------|---------------|
| `/dashboard` | `mock-data/index.ts` | `/api/activities`, `/api/leads`, `/api/tasks` |
| `/dashboard/inbox` | `mock-data/messages.ts` | `/api/conversations`, `/api/conversations/{id}/messages` |
| `/dashboard/pipeline` | `mock-data/leads.ts` | `/api/leads` |
| `/dashboard/customers` | `mock-data/customers.ts` | `/api/customers` |
| `/dashboard/tasks` | `mock-data/tasks.ts` | `/api/tasks` |
| `/dashboard/estimates` | `mock-data/estimates.ts` | `/api/estimates` |

Set in `src/frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Running the Backend

```bash
cd src/backend
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload --port 4000
```

API docs available at: `http://localhost:4000/docs`
