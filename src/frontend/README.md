# Thrive Fertilizing - Dashboard Frontend

A semi-production ready AI-powered business dashboard built with Next.js, TypeScript, Tailwind CSS, and Shadcn/UI.

## 🚀 Quick Start

```bash
# Navigate to the frontend directory
cd src/frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You'll be automatically redirected to the dashboard.

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Icons**: Lucide React
- **State Management**: React Hooks (local state with mock data)

## 📁 Project Structure

```
src/frontend/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   │   ├── page.tsx       # Main dashboard overview
│   │   ├── inbox/         # Unified inbox
│   │   ├── pipeline/      # Lead pipeline (Kanban)
│   │   ├── customers/     # Customer CRM
│   │   ├── tasks/         # Task management
│   │   ├── estimates/     # Estimates center
│   │   └── layout.tsx     # Dashboard layout wrapper
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Redirects to dashboard
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── layout/           # Layout components (Sidebar, Header)
│   └── ui/               # Shadcn UI components
├── lib/                  # Utilities and helpers
│   ├── mock-data/       # Mock data generators
│   └── utils.ts         # Utility functions
├── types/               # TypeScript type definitions
│   ├── customer.ts
│   ├── message.ts
│   ├── lead.ts
│   ├── estimate.ts
│   ├── task.ts
│   ├── activity.ts
│   ├── notification.ts
│   └── index.ts
└── package.json
```

## 📊 Dashboard Features

### 1. **Main Dashboard** (`/dashboard`)
- Overview statistics (leads, revenue, messages, tasks)
- Recent activity feed
- Key performance metrics

### 2. **Unified Inbox** (`/dashboard/inbox`)
- All customer conversations in one place
- Message threads with customer/AI/team messages
- Search and filter conversations
- AI automation controls (pause/resume)
- Real-time message status

### 3. **Lead Pipeline** (`/dashboard/pipeline`)
- Kanban-style board with 8 stages:
  - New Leads
  - Qualification
  - Estimate Needed
  - Estimate Sent
  - Awaiting Response
  - Scheduled
  - In Progress
  - Completed
- Drag-and-drop capability (UI ready, logic pending)
- Priority indicators
- Value tracking per stage

### 4. **Customers** (`/dashboard/customers`)
- Complete customer database
- Contact information
- Service history
- Revenue tracking
- Search and filter
- Tags and status

### 5. **Tasks** (`/dashboard/tasks`)
- Task management interface
- Filter by status (pending, in progress, completed)
- Priority levels
- Due dates and overdue tracking
- Assignment tracking
- AI vs. human created tasks

### 6. **Estimates** (`/dashboard/estimates`)
- All estimates in one table
- Filter by status (draft, pending, sent, accepted, etc.)
- AI-generated vs. manual estimates
- Approval workflow
- Pricing breakdown
- Valid until dates

## 🎨 UI Components (Shadcn/UI)

The following components are installed and ready to use:

- Button
- Card
- Input
- Label
- Badge
- Avatar
- Dropdown Menu
- Separator
- Table
- Select
- Dialog
- Scroll Area

To add more components:

```bash
npx shadcn@latest add <component-name>
```

## 🗂️ Mock Data

All pages use realistic mock data generated from `lib/mock-data/`:

- **Customers**: 50 sample customers
- **Conversations**: 25 message threads
- **Leads**: 35 leads across all pipeline stages
- **Estimates**: 20 estimates with various statuses
- **Tasks**: 30 tasks with different priorities
- **Activities**: 100 recent activities
- **Notifications**: 15 sample notifications

The mock data includes:
- Realistic names, addresses, phone numbers
- Service types specific to fertilizing business
- Financial data (revenue, estimate values)
- Timestamps and dates
- Status transitions
- AI-generated flags

## 🎯 Key Features Implemented

✅ Fully responsive design
✅ Dark mode ready (CSS variables configured)
✅ Type-safe with TypeScript
✅ Component-based architecture
✅ Mock data for realistic testing
✅ Navigation with active states
✅ Search and filter functionality
✅ Badge and status indicators
✅ Clean, modern UI

## 🔄 Next Steps (For Backend Integration)

When you're ready to integrate with a real backend:

1. **Replace Mock Data**: Swap mock data generators with API calls
2. **Add State Management**: Consider Zustand or Redux for global state
3. **WebSocket Integration**: For real-time updates
4. **Form Validation**: Add Zod or React Hook Form
5. **API Layer**: Create `/lib/api/` for backend communication
6. **Authentication**: Add auth provider and protected routes
7. **Error Handling**: Implement error boundaries and toast notifications

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Add new Shadcn component
npx shadcn@latest add <component>
```

## 📝 TypeScript Types

All TypeScript types are defined in the `/types` directory:

- `Customer`: Customer data and profiles
- `Message`: Conversations and messages
- `Lead`: Lead tracking and pipeline stages
- `Estimate`: Estimate creation and approval
- `Task`: Task management and workflow
- `Activity`: Activity logging
- `Notification`: System notifications
- `DashboardStats`: Dashboard metrics

These types are exported from `/types/index.ts` for easy importing:

```typescript
import { Customer, Lead, Estimate } from "@/types";
```

## 🎨 Color Scheme

The dashboard uses a green primary color (fitting for a fertilizing business):

- Primary: Green (#22c55e / HSL 142 76% 36%)
- Success states: Green shades
- Warning states: Yellow/Orange
- Error states: Red
- Neutral: Slate gray

Colors are defined as CSS variables in `globals.css` for easy customization.

## 📱 Responsive Design

The dashboard is fully responsive:

- **Desktop**: Full sidebar + main content
- **Tablet**: Collapsible sidebar
- **Mobile**: Hidden sidebar with hamburger menu (to be implemented)

## 🔍 Search Functionality

Search is implemented on:

- Inbox (by customer name)
- Customers (by name, email, phone)
- Estimates (by customer name, service type)

## 🚧 Placeholder Pages

The following pages have navigation links but are not yet implemented:

- Schedule (`/dashboard/schedule`)
- Activity Log (`/dashboard/activity`) - partially implemented
- Settings (`/dashboard/settings`)

## 💡 Tips

1. **Adding New Pages**: Create a new folder under `/app/dashboard/[page-name]` with a `page.tsx` file
2. **Mock Data**: Modify generators in `/lib/mock-data/` to adjust sample data
3. **Styling**: Use Tailwind utility classes; custom CSS in `globals.css` if needed
4. **Types**: Add new types to `/types/` and export from `index.ts`

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ using Next.js, TypeScript, and Shadcn/UI**
