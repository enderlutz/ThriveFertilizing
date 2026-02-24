# Backend & AI Agent Implementation Guide

## Overview

This document outlines the complete implementation plan for integrating Twilio SMS and AI Agent capabilities into the ThriveFertilizing dashboard. The frontend dashboard is already complete - this guide covers the backend infrastructure needed to power the full system.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Backend Setup](#backend-setup)
3. [Database Schema](#database-schema)
4. [Twilio SMS Integration](#twilio-sms-integration)
5. [AI Agent Implementation](#ai-agent-implementation)
6. [Schedule Integration](#schedule-integration)
7. [Real-Time Updates](#real-time-updates)
8. [Environment Configuration](#environment-configuration)
9. [Deployment](#deployment)
10. [Timeline & Costs](#timeline--costs)

---

## Architecture Overview

### System Components

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Customer  │◄────►│   Twilio    │◄────►│   Backend   │
│    (SMS)    │      │     SMS     │      │     API     │
└─────────────┘      └─────────────┘      └──────┬──────┘
                                                  │
                                                  │
┌─────────────┐      ┌─────────────┐      ┌──────▼──────┐
│  Dashboard  │◄────►│  WebSocket  │◄────►│  AI Agent   │
│  (Frontend) │      │   Server    │      │   (Claude)  │
└─────────────┘      └─────────────┘      └──────┬──────┘
                                                  │
┌─────────────┐                            ┌──────▼──────┐
│  Yardbook   │◄───────────────────────────│  Database   │
│  (Zapier)   │                            │ (PostgreSQL)│
└─────────────┘                            └─────────────┘
```

### Technology Stack

**Backend:**
- Node.js + TypeScript
- Express.js or Fastify
- Prisma ORM
- WebSocket (ws library)

**Database:**
- PostgreSQL 14+
- Redis (optional, for caching)

**Integrations:**
- Twilio SDK for SMS
- Anthropic SDK for Claude API
- Zapier webhooks for Yardbook

---

## Backend Setup

### 1. Project Structure

Create the backend directory structure:

```
src/backend/
├── server.ts              # Main server entry point
├── routes/
│   ├── customers.ts       # Customer CRUD operations
│   ├── messages.ts        # Message handling
│   ├── leads.ts           # Lead management
│   ├── estimates.ts       # Estimate operations
│   ├── tasks.ts           # Task management
│   ├── conversations.ts   # Conversation threads
│   └── webhooks.ts        # Twilio & Zapier webhooks
├── services/
│   ├── twilioService.ts   # SMS sending/receiving logic
│   ├── aiAgent.ts         # AI automation engine
│   ├── scheduleService.ts # Yardbook integration
│   ├── estimateService.ts # Estimate generation
│   └── notificationService.ts  # Notifications
├── database/
│   ├── schema.prisma      # Prisma schema
│   ├── seed.ts            # Database seeding
│   └── migrations/        # Migration files
├── middleware/
│   ├── auth.ts            # Authentication middleware
│   ├── validation.ts      # Request validation
│   └── errorHandler.ts    # Error handling
├── utils/
│   ├── logger.ts          # Logging utility
│   ├── config.ts          # Configuration
│   └── websocket.ts       # WebSocket utilities
└── types/
    └── index.ts           # TypeScript types
```

### 2. Package Dependencies

Create `src/backend/package.json`:

```json
{
  "name": "thrive-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "tsx src/database/seed.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "@prisma/client": "^5.9.0",
    "twilio": "^4.20.0",
    "@anthropic-ai/sdk": "^0.20.0",
    "ws": "^8.16.0",
    "dotenv": "^16.4.0",
    "zod": "^3.22.4",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "axios": "^1.6.5"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/express": "^4.17.21",
    "@types/ws": "^8.5.10",
    "@types/cors": "^2.8.17",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "prisma": "^5.9.0"
  }
}
```

### 3. TypeScript Configuration

Create `src/backend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Main Server File

Create `src/backend/server.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

// Routes
import webhooksRouter from './routes/webhooks.js';
import customersRouter from './routes/customers.js';
import messagesRouter from './routes/messages.js';
import leadsRouter from './routes/leads.js';
import estimatesRouter from './routes/estimates.js';
import tasksRouter from './routes/tasks.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';
import { setupWebSocket } from './utils/websocket.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/webhooks', webhooksRouter);
app.use('/api/customers', customersRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/estimates', estimatesRouter);
app.use('/api/tasks', tasksRouter);

// Error handling
app.use(errorHandler);

// Create HTTP server
const server = createServer(app);

// Setup WebSocket
const wss = setupWebSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
```

---

## Database Schema

### Prisma Schema

Create `src/backend/database/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Customer {
  id                    String   @id @default(uuid())
  name                  String
  phone                 String   @unique
  email                 String?
  address               Json?
  propertySize          Float?
  tags                  String[]
  status                String   @default("lead")
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  lastContactedAt       DateTime?
  totalJobsCompleted    Int      @default(0)
  totalRevenue          Decimal  @default(0)
  notes                 String?
  preferredContactMethod String?

  conversations Conversation[]
  leads         Lead[]
  estimates     Estimate[]
  tasks         Task[]
  activities    Activity[]

  @@index([phone])
  @@index([status])
  @@index([lastContactedAt])
}

model Conversation {
  id              String   @id @default(uuid())
  customerId      String
  aiEnabled       Boolean  @default(true)
  lastMessageAt   DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  customer Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)
  messages Message[]
  notes    InternalNote[]

  @@index([customerId])
  @@index([lastMessageAt])
}

model Message {
  id              String   @id @default(uuid())
  conversationId  String
  senderType      String   // 'customer', 'ai', 'team'
  senderName      String?
  content         Text
  twilioSid       String?  @unique
  status          String   @default("sent")
  sentAt          DateTime @default(now())
  deliveredAt     DateTime?
  readAt          DateTime?
  metadata        Json?

  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  @@index([conversationId])
  @@index([twilioSid])
  @@index([sentAt])
}

model InternalNote {
  id              String   @id @default(uuid())
  conversationId  String
  authorId        String
  content         Text
  createdAt       DateTime @default(now())

  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  @@index([conversationId])
}

model Lead {
  id              String   @id @default(uuid())
  customerId      String
  stage           String
  estimatedValue  Decimal?
  serviceType     String?
  propertySize    Float?
  urgency         String   @default("medium")
  source          String?
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  customer   Customer       @relation(fields: [customerId], references: [id], onDelete: Cascade)
  activities LeadActivity[]

  @@index([customerId])
  @@index([stage])
  @@index([createdAt])
}

model LeadActivity {
  id          String   @id @default(uuid())
  leadId      String
  type        String
  description String
  performedBy String?
  createdAt   DateTime @default(now())

  lead Lead @relation(fields: [leadId], references: [id], onDelete: Cascade)

  @@index([leadId])
}

model Estimate {
  id              String   @id @default(uuid())
  customerId      String
  serviceType     String
  propertySize    Float?
  totalAmount     Decimal
  lineItems       Json
  status          String   @default("draft")
  generatedBy     String   // 'ai' or user ID
  approvedBy      String?
  approvedAt      DateTime?
  sentAt          DateTime?
  expiresAt       DateTime?
  acceptedAt      DateTime?
  rejectedAt      DateTime?
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  customer Customer @relation(fields: [customerId], references: [id], onDelete: Cascade)

  @@index([customerId])
  @@index([status])
  @@index([createdAt])
}

model Task {
  id                  String   @id @default(uuid())
  type                String
  title               String
  description         String?
  priority            String   @default("medium")
  status              String   @default("pending")
  assignedTo          String?
  relatedCustomerId   String?
  relatedEstimateId   String?
  dueDate             DateTime?
  completedAt         DateTime?
  metadata            Json?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  customer Customer? @relation(fields: [relatedCustomerId], references: [id], onDelete: SetNull)

  @@index([status])
  @@index([priority])
  @@index([assignedTo])
  @@index([dueDate])
}

model Activity {
  id          String   @id @default(uuid())
  type        String
  customerId  String?
  userId      String?
  description String
  metadata    Json?
  createdAt   DateTime @default(now())

  customer Customer? @relation(fields: [customerId], references: [id], onDelete: SetNull)

  @@index([type])
  @@index([customerId])
  @@index([createdAt])
}

model AIAction {
  id          String   @id @default(uuid())
  actionType  String
  customerId  String?
  messageId   String?
  parameters  Json
  approved    Boolean  @default(false)
  approvedBy  String?
  approvedAt  DateTime?
  executedAt  DateTime?
  result      Json?
  createdAt   DateTime @default(now())

  @@index([actionType])
  @@index([approved])
  @@index([createdAt])
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  password  String
  role      String   @default("team_member")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}
```

### Database Setup Commands

```bash
# Install Prisma
cd src/backend
npm install

# Initialize Prisma (if not already done)
npx prisma init

# Create migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# (Optional) Seed database with test data
npm run db:seed
```

---

## Twilio SMS Integration

### 1. Twilio Setup

**Get Twilio Credentials:**
1. Sign up at https://www.twilio.com
2. Get a phone number (~$1-15/month)
3. Copy Account SID and Auth Token from console
4. Add to `.env` file

### 2. Twilio Service

Create `src/backend/services/twilioService.ts`:

```typescript
import twilio from 'twilio';
import { prisma } from '../database/client.js';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

export const twilioService = {
  /**
   * Send SMS to a customer
   */
  async sendSMS(to: string, message: string, conversationId?: string) {
    try {
      const response = await client.messages.create({
        body: message,
        from: twilioPhone,
        to: to,
      });

      console.log(`✅ SMS sent to ${to}: ${response.sid}`);

      // Save to database if conversationId provided
      if (conversationId) {
        await prisma.message.create({
          data: {
            conversationId,
            senderType: 'ai',
            content: message,
            twilioSid: response.sid,
            status: response.status,
            sentAt: new Date(),
          },
        });
      }

      return response;
    } catch (error) {
      console.error('❌ Twilio send error:', error);
      throw error;
    }
  },

  /**
   * Send bulk SMS messages
   */
  async sendBulkSMS(messages: Array<{ to: string; body: string }>) {
    const results = await Promise.allSettled(
      messages.map(msg => this.sendSMS(msg.to, msg.body))
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`📊 Bulk SMS: ${successful} sent, ${failed} failed`);

    return { successful, failed, results };
  },

  /**
   * Get message status from Twilio
   */
  async getMessageStatus(messageSid: string) {
    try {
      const message = await client.messages(messageSid).fetch();
      return message.status;
    } catch (error) {
      console.error('Error fetching message status:', error);
      return null;
    }
  },
};
```

### 3. Webhook Handler

Create `src/backend/routes/webhooks.ts`:

```typescript
import { Router } from 'express';
import { prisma } from '../database/client.js';
import { twilioService } from '../services/twilioService.js';
import { aiAgent } from '../services/aiAgent.js';
import { broadcast } from '../utils/websocket.js';

const router = Router();

/**
 * Twilio SMS Webhook
 * Receives incoming SMS messages
 */
router.post('/twilio/sms', async (req, res) => {
  const { From, Body, MessageSid } = req.body;

  console.log(`📨 Incoming SMS from ${From}: ${Body}`);

  try {
    // 1. Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { phone: From },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: 'New Lead',
          phone: From,
          status: 'lead',
        },
      });
      console.log(`✨ New customer created: ${customer.id}`);
    }

    // 2. Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: { customerId: customer.id },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          customerId: customer.id,
          aiEnabled: true,
        },
      });
    }

    // 3. Save incoming message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderType: 'customer',
        content: Body,
        twilioSid: MessageSid,
        sentAt: new Date(),
      },
    });

    // 4. Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    // 5. Broadcast to dashboard via WebSocket
    broadcast({
      type: 'new_message',
      data: {
        customerId: customer.id,
        conversationId: conversation.id,
        message,
      },
    });

    // 6. Process with AI if enabled
    if (conversation.aiEnabled) {
      // Run AI processing in background
      setImmediate(async () => {
        try {
          await aiAgent.processIncomingMessage({
            customer,
            conversation,
            message,
          });
        } catch (error) {
          console.error('AI processing error:', error);
        }
      });
    }

    // 7. Respond to Twilio (empty TwiML = no auto-reply)
    res.set('Content-Type', 'text/xml');
    res.send('<Response></Response>');
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).send('<Response></Response>');
  }
});

/**
 * Twilio Status Callback
 * Updates message delivery status
 */
router.post('/twilio/status', async (req, res) => {
  const { MessageSid, MessageStatus } = req.body;

  try {
    await prisma.message.updateMany({
      where: { twilioSid: MessageSid },
      data: {
        status: MessageStatus,
        ...(MessageStatus === 'delivered' && { deliveredAt: new Date() }),
      },
    });

    console.log(`📬 Message ${MessageSid} status: ${MessageStatus}`);
  } catch (error) {
    console.error('Error updating message status:', error);
  }

  res.sendStatus(200);
});

export default router;
```

### 4. Configure Twilio Webhook

In Twilio Console:
1. Go to **Phone Numbers** → **Manage** → **Active Numbers**
2. Click your phone number
3. Scroll to **Messaging Configuration**
4. Set webhook URL to: `https://yourdomain.com/webhooks/twilio/sms`
5. Set HTTP method to: `POST`
6. Save

**For Development (using ngrok):**
```bash
# Install ngrok
npm install -g ngrok

# Start your backend
npm run dev

# In another terminal, start ngrok
ngrok http 3001

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Use it in Twilio: https://abc123.ngrok.io/webhooks/twilio/sms
```

---

## AI Agent Implementation

### 1. AI Agent Service

Create `src/backend/services/aiAgent.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '../database/client.js';
import { twilioService } from './twilioService.js';
import { broadcast } from '../utils/websocket.js';
import type { Customer, Conversation, Message } from '@prisma/client';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface ProcessMessageParams {
  customer: Customer;
  conversation: Conversation;
  message: Message;
}

export const aiAgent = {
  /**
   * Process incoming customer message with AI
   */
  async processIncomingMessage(params: ProcessMessageParams) {
    const { customer, conversation, message } = params;

    console.log(`🤖 AI processing message for ${customer.name}`);

    try {
      // 1. Build context
      const context = await this.buildContext(customer, conversation);

      // 2. Call Claude API
      const response = await this.callClaude(context, message.content);

      // 3. Process response and execute tools
      await this.processResponse(response, customer, conversation);

      console.log(`✅ AI processing complete for ${customer.name}`);
    } catch (error) {
      console.error('AI Agent error:', error);

      // Create task for human review on error
      await prisma.task.create({
        data: {
          type: 'ai_error',
          title: 'AI Agent Error - Human Review Needed',
          description: `Error processing message from ${customer.name}: ${error.message}`,
          priority: 'high',
          status: 'pending',
          relatedCustomerId: customer.id,
        },
      });
    }
  },

  /**
   * Build context for Claude API
   */
  async buildContext(customer: Customer, conversation: Conversation) {
    // Get conversation history
    const messages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { sentAt: 'desc' },
      take: 20,
    });

    // Get customer's lead info
    const lead = await prisma.lead.findFirst({
      where: { customerId: customer.id },
      orderBy: { createdAt: 'desc' },
    });

    // Get service history
    const completedJobs = await prisma.estimate.count({
      where: {
        customerId: customer.id,
        status: 'accepted',
      },
    });

    return {
      conversationHistory: messages.reverse(),
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        propertySize: customer.propertySize,
        totalRevenue: customer.totalRevenue,
        completedJobs,
      },
      lead: lead ? {
        stage: lead.stage,
        estimatedValue: lead.estimatedValue,
        serviceType: lead.serviceType,
      } : null,
    };
  },

  /**
   * Call Claude API with tools
   */
  async callClaude(context: any, userMessage: string) {
    const systemPrompt = `You are an AI assistant for Thrive Fertilizing, a professional lawn care and fertilizing business.

**Your Role:**
- Respond to customer inquiries professionally and warmly
- Qualify leads by gathering: service type, property size, address
- Draft estimates when you have sufficient information
- Create tasks for the human team when needed
- Move leads through the pipeline appropriately

**Current Customer Context:**
Name: ${context.customer.name}
Phone: ${context.customer.phone}
${context.customer.address ? `Address: ${JSON.stringify(context.customer.address)}` : 'Address: Not yet provided'}
${context.customer.propertySize ? `Property Size: ${context.customer.propertySize} sq ft` : 'Property Size: Unknown'}
Completed Jobs: ${context.customer.completedJobs}
Total Revenue: $${context.customer.totalRevenue}
${context.lead ? `Current Lead Stage: ${context.lead.stage}` : 'No active lead'}

**Guidelines:**
1. Be friendly, professional, and helpful
2. Always gather missing information (property size, service type, address)
3. When you have enough details, create an estimate
4. For complex pricing or unusual requests, create a task for human review
5. Use the customer's name when appropriate
6. Keep responses concise (2-3 sentences max)
7. Never promise specific dates without checking availability

**Response Strategy:**
- New inquiry: Greet warmly, ask about service needs
- Qualification: Gather property details
- Estimate ready: Present price and ask to proceed
- Booking: Suggest times, create scheduling task
- Follow-up: Check in on previous estimates/jobs`;

    const conversationMessages = context.conversationHistory.map((msg: any) => ({
      role: msg.senderType === 'customer' ? 'user' : 'assistant',
      content: msg.content,
    }));

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        ...conversationMessages,
        {
          role: 'user',
          content: userMessage,
        },
      ],
      tools: [
        {
          name: 'send_message',
          description: 'Send an SMS message to the customer. Use requiresApproval for pricing discussions or promises.',
          input_schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'The message to send to the customer',
              },
              requiresApproval: {
                type: 'boolean',
                description: 'Whether this message needs human approval before sending',
              },
            },
            required: ['message'],
          },
        },
        {
          name: 'create_estimate',
          description: 'Generate an estimate for the customer',
          input_schema: {
            type: 'object',
            properties: {
              serviceType: { type: 'string' },
              propertySize: { type: 'number' },
              totalAmount: { type: 'number' },
              lineItems: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    description: { type: 'string' },
                    amount: { type: 'number' },
                  },
                },
              },
              notes: { type: 'string' },
            },
            required: ['serviceType', 'totalAmount', 'lineItems'],
          },
        },
        {
          name: 'create_task',
          description: 'Create a task for the human team',
          input_schema: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string' },
              priority: {
                type: 'string',
                enum: ['low', 'medium', 'high', 'urgent'],
              },
            },
            required: ['type', 'title', 'description'],
          },
        },
        {
          name: 'update_lead_stage',
          description: 'Move lead to a different pipeline stage',
          input_schema: {
            type: 'object',
            properties: {
              stage: {
                type: 'string',
                enum: [
                  'new_lead',
                  'qualification',
                  'estimate_needed',
                  'estimate_sent',
                  'waiting_on_customer',
                  'scheduled',
                  'in_progress',
                  'completed',
                  'follow_up',
                ],
              },
              notes: { type: 'string' },
            },
            required: ['stage'],
          },
        },
        {
          name: 'update_customer_info',
          description: 'Update customer profile with gathered information',
          input_schema: {
            type: 'object',
            properties: {
              propertySize: { type: 'number' },
              address: {
                type: 'object',
                properties: {
                  street: { type: 'string' },
                  city: { type: 'string' },
                  state: { type: 'string' },
                  zip: { type: 'string' },
                },
              },
            },
          },
        },
      ],
    });

    return response;
  },

  /**
   * Process Claude response and execute tools
   */
  async processResponse(
    response: Anthropic.Message,
    customer: Customer,
    conversation: Conversation
  ) {
    for (const block of response.content) {
      if (block.type === 'tool_use') {
        await this.executeTool(block, customer, conversation);
      }
    }
  },

  /**
   * Execute tool calls from Claude
   */
  async executeTool(
    toolUse: any,
    customer: Customer,
    conversation: Conversation
  ) {
    const { name, input } = toolUse;

    console.log(`🔧 Executing tool: ${name}`);

    switch (name) {
      case 'send_message':
        await this.handleSendMessage(input, customer, conversation);
        break;

      case 'create_estimate':
        await this.handleCreateEstimate(input, customer);
        break;

      case 'create_task':
        await this.handleCreateTask(input, customer);
        break;

      case 'update_lead_stage':
        await this.handleUpdateLeadStage(input, customer);
        break;

      case 'update_customer_info':
        await this.handleUpdateCustomerInfo(input, customer);
        break;

      default:
        console.warn(`Unknown tool: ${name}`);
    }
  },

  /**
   * Handle send_message tool
   */
  async handleSendMessage(
    input: any,
    customer: Customer,
    conversation: Conversation
  ) {
    if (input.requiresApproval) {
      // Create approval task
      await prisma.task.create({
        data: {
          type: 'approve_ai_message',
          title: `Approve AI Message to ${customer.name}`,
          description: `Message: "${input.message}"`,
          priority: 'high',
          status: 'pending',
          relatedCustomerId: customer.id,
          metadata: {
            message: input.message,
            conversationId: conversation.id,
          },
        },
      });

      // Notify dashboard
      broadcast({
        type: 'approval_needed',
        data: {
          type: 'message',
          customer,
          message: input.message,
        },
      });

      console.log(`⏳ Message requires approval: ${input.message.substring(0, 50)}...`);
    } else {
      // Send immediately
      await twilioService.sendSMS(
        customer.phone,
        input.message,
        conversation.id
      );

      // Broadcast to dashboard
      broadcast({
        type: 'ai_message_sent',
        data: {
          customerId: customer.id,
          message: input.message,
        },
      });
    }
  },

  /**
   * Handle create_estimate tool
   */
  async handleCreateEstimate(input: any, customer: Customer) {
    const estimate = await prisma.estimate.create({
      data: {
        customerId: customer.id,
        serviceType: input.serviceType,
        propertySize: input.propertySize,
        totalAmount: input.totalAmount,
        lineItems: input.lineItems,
        notes: input.notes,
        generatedBy: 'ai',
        status: 'pending_approval',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Create approval task
    await prisma.task.create({
      data: {
        type: 'approve_estimate',
        title: `Approve Estimate for ${customer.name}`,
        description: `AI generated estimate: $${input.totalAmount} for ${input.serviceType}`,
        priority: 'high',
        status: 'pending',
        relatedCustomerId: customer.id,
        relatedEstimateId: estimate.id,
      },
    });

    // Notify dashboard
    broadcast({
      type: 'new_estimate',
      data: { estimate, customer },
    });

    console.log(`📄 Estimate created: $${input.totalAmount}`);
  },

  /**
   * Handle create_task tool
   */
  async handleCreateTask(input: any, customer: Customer) {
    const task = await prisma.task.create({
      data: {
        type: input.type,
        title: input.title,
        description: input.description,
        priority: input.priority || 'medium',
        status: 'pending',
        relatedCustomerId: customer.id,
      },
    });

    broadcast({
      type: 'new_task',
      data: { task, customer },
    });

    console.log(`✅ Task created: ${input.title}`);
  },

  /**
   * Handle update_lead_stage tool
   */
  async handleUpdateLeadStage(input: any, customer: Customer) {
    // Find or create lead
    let lead = await prisma.lead.findFirst({
      where: { customerId: customer.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          customerId: customer.id,
          stage: input.stage,
          notes: input.notes,
        },
      });
    } else {
      lead = await prisma.lead.update({
        where: { id: lead.id },
        data: {
          stage: input.stage,
          notes: input.notes,
        },
      });
    }

    // Log activity
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: 'stage_change',
        description: `Moved to ${input.stage}`,
        performedBy: 'ai',
      },
    });

    broadcast({
      type: 'lead_updated',
      data: { lead, customer },
    });

    console.log(`📊 Lead moved to: ${input.stage}`);
  },

  /**
   * Handle update_customer_info tool
   */
  async handleUpdateCustomerInfo(input: any, customer: Customer) {
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        propertySize: input.propertySize,
        address: input.address,
      },
    });

    console.log(`👤 Customer info updated`);
  },
};
```

---

## Schedule Integration

### Zapier Webhook Integration

Create `src/backend/services/scheduleService.ts`:

```typescript
import axios from 'axios';

const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL!;

export const scheduleService = {
  /**
   * Get available time slots from Yardbook
   */
  async getAvailableSlots(date?: string) {
    try {
      const response = await axios.post(ZAPIER_WEBHOOK_URL, {
        action: 'get_availability',
        date: date || new Date().toISOString().split('T')[0],
      });

      return response.data.availableSlots || [];
    } catch (error) {
      console.error('Error fetching availability:', error);
      return [];
    }
  },

  /**
   * Book appointment in Yardbook
   */
  async bookAppointment(customerId: string, slot: {
    date: string;
    time: string;
    serviceType: string;
  }) {
    try {
      const response = await axios.post(ZAPIER_WEBHOOK_URL, {
        action: 'book_appointment',
        customerId,
        ...slot,
      });

      return response.data;
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  },

  /**
   * Check if specific time slot is available
   */
  async isSlotAvailable(date: string, time: string): Promise<boolean> {
    const slots = await this.getAvailableSlots(date);
    return slots.some((slot: any) => slot.time === time && slot.available);
  },
};
```

---

## Real-Time Updates

### WebSocket Implementation

Create `src/backend/utils/websocket.ts`:

```typescript
import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

const clients = new Map<string, WebSocket>();

export function setupWebSocket(server: Server): WebSocketServer {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket, req) => {
    // In production, authenticate the connection
    const userId = 'user-id'; // Extract from JWT or session

    clients.set(userId, ws);
    console.log(`📡 WebSocket client connected: ${userId}`);

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        handleWebSocketMessage(data, userId);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      clients.delete(userId);
      console.log(`📡 WebSocket client disconnected: ${userId}`);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Send initial connection confirmation
    ws.send(JSON.stringify({
      type: 'connected',
      timestamp: new Date().toISOString(),
    }));
  });

  return wss;
}

/**
 * Broadcast message to all connected clients
 */
export function broadcast(message: any) {
  const payload = JSON.stringify(message);

  clients.forEach((ws, userId) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  });

  console.log(`📡 Broadcast: ${message.type} to ${clients.size} clients`);
}

/**
 * Send message to specific user
 */
export function sendToUser(userId: string, message: any) {
  const ws = clients.get(userId);

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
    console.log(`📡 Sent to ${userId}: ${message.type}`);
  }
}

/**
 * Handle incoming WebSocket messages
 */
function handleWebSocketMessage(data: any, userId: string) {
  console.log(`📨 WebSocket message from ${userId}:`, data.type);

  // Handle different message types
  switch (data.type) {
    case 'ping':
      sendToUser(userId, { type: 'pong' });
      break;

    // Add more handlers as needed
    default:
      console.warn(`Unknown WebSocket message type: ${data.type}`);
  }
}
```

### Frontend WebSocket Client

Update frontend to connect to WebSocket:

```typescript
// src/frontend/hooks/useRealtimeUpdates.ts
'use client';

import { useEffect, useState } from 'react';

export function useRealtimeUpdates() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const websocket = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
    );

    websocket.onopen = () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleRealtimeUpdate(data);
    };

    websocket.onclose = () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  function handleRealtimeUpdate(data: any) {
    switch (data.type) {
      case 'new_message':
        // Update conversations list
        console.log('New message received', data);
        break;

      case 'approval_needed':
        // Show notification
        console.log('Approval needed', data);
        break;

      case 'lead_updated':
        // Update pipeline
        console.log('Lead updated', data);
        break;

      case 'new_task':
        // Add to task list
        console.log('New task', data);
        break;

      default:
        console.log('Unknown update type', data.type);
    }
  }

  return { isConnected };
}
```

---

## Environment Configuration

### Environment Variables

Create `src/backend/.env`:

```bash
# Server
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/thrive_db"

# Twilio
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token_here"
TWILIO_PHONE_NUMBER="+1234567890"

# Anthropic (Claude API)
ANTHROPIC_API_KEY="sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Zapier
ZAPIER_WEBHOOK_URL="https://hooks.zapier.com/hooks/catch/xxxxx/xxxxx/"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Optional: Redis (for caching)
REDIS_URL="redis://localhost:6379"
```

Create `src/frontend/.env.local`:

```bash
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

---

## Deployment

### Production Deployment Options

**Option 1: All-in-One Platform (Recommended for MVP)**

**Railway.app:**
- Deploy backend + database together
- Automatic HTTPS
- Simple environment variable management
- Cost: ~$20-30/month

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd src/backend
railway init
railway up
```

**Option 2: Separate Services**

**Frontend:** Vercel (already ideal for Next.js)
**Backend:** Render.com
**Database:** Neon.tech or Supabase (managed PostgreSQL)

**Option 3: AWS (For scale)**
- Frontend: Amplify or S3 + CloudFront
- Backend: ECS or Lambda
- Database: RDS PostgreSQL

### Pre-Deployment Checklist

- [ ] Set all production environment variables
- [ ] Run database migrations
- [ ] Configure Twilio webhook to production URL
- [ ] Test AI Agent with real customer scenarios
- [ ] Set up error monitoring (Sentry)
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Test WebSocket connections

---

## Timeline & Costs

### Development Timeline

**Phase 1: Backend Foundation (1-2 weeks)**
- Set up Express server
- Configure Prisma + PostgreSQL
- Create API endpoints
- Implement authentication

**Phase 2: Twilio Integration (3-5 days)**
- Set up Twilio webhooks
- Implement SMS sending/receiving
- Test message flow
- Connect to frontend

**Phase 3: AI Agent Core (1-2 weeks)**
- Integrate Claude API
- Implement tool calling
- Build context management
- Test automation logic

**Phase 4: AI Automation Features (1-2 weeks)**
- Auto-response logic
- Estimate generation
- Lead qualification flow
- Approval workflows

**Phase 5: Real-time Features (3-5 days)**
- WebSocket implementation
- Frontend integration
- Live updates testing

**Phase 6: Schedule Integration (3-5 days)**
- Zapier setup
- Yardbook connection
- Availability checking

**Phase 7: Testing & Polish (1 week)**
- End-to-end testing
- Bug fixes
- Performance optimization
- Documentation

**Total: 6-8 weeks**

### Monthly Operating Costs

| Service | Cost |
|---------|------|
| Twilio (phone + SMS) | $50-100 |
| Claude API | $50-200 |
| Database (managed PostgreSQL) | $10-25 |
| Backend hosting | $20-30 |
| **Total** | **$130-355/month** |

**Cost Scaling:**
- 100 SMS/day: ~$24/month
- 1,000 SMS/day: ~$237/month
- Claude API scales with usage (very cheap at low volume)

---

## Next Steps

### Getting Started

1. **Set up backend project:**
   ```bash
   mkdir -p src/backend
   cd src/backend
   npm init -y
   # Copy package.json from this guide
   npm install
   ```

2. **Set up database:**
   ```bash
   # Copy schema.prisma
   npx prisma migrate dev --name init
   ```

3. **Get API credentials:**
   - Sign up for Twilio
   - Get Claude API key from Anthropic
   - Set up environment variables

4. **Start development:**
   ```bash
   npm run dev
   ```

5. **Test Twilio webhook:**
   - Use ngrok for local development
   - Send test SMS to your Twilio number
   - Verify webhook receives message

6. **Implement AI Agent:**
   - Test with simple prompts first
   - Gradually add tool calling
   - Test approval workflows

### Recommended Development Order

1. ✅ **Backend setup** - Get server running
2. ✅ **Database** - Set up Prisma + PostgreSQL
3. ✅ **Twilio receive** - Get incoming SMS working
4. ✅ **Twilio send** - Send SMS from backend
5. ✅ **Basic AI** - Simple Claude integration
6. ✅ **Tool calling** - AI creates tasks/estimates
7. ✅ **WebSocket** - Real-time updates
8. ✅ **Schedule integration** - Zapier connection
9. ✅ **Polish** - Error handling, logging, tests

---

## Support & Resources

**Documentation:**
- [Twilio SMS Docs](https://www.twilio.com/docs/sms)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/)

**Testing Tools:**
- Postman/Insomnia for API testing
- ngrok for webhook testing
- Twilio Console for SMS testing

**Monitoring:**
- Sentry for error tracking
- LogRocket for debugging
- Datadog/New Relic for performance

---

**Ready to build! 🚀**

Start with Phase 1 (Backend Setup) and work through systematically. The frontend is already complete, so you can test each backend feature as you build it!
