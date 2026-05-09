# FreelanceFlow

A full-stack web application designed to help freelancers streamline their workflow. FreelanceFlow combines proposal creation, project tracking, milestone management, and automated invoicing into a single, cohesive platform, enabling freelancers to manage their business efficiently while giving their clients a dedicated portal for updates.

---

## Problem Statement

Freelancers today manage their work across too many disconnected tools — they write proposals in Word, track projects in spreadsheets, send invoices via email, and have no single view of what they've earned or what's overdue. Clients have zero visibility into project progress unless the freelancer manually shares an update.

This creates problems:
- Proposals get lost or forgotten with no follow-up tracking
- There's no clear link between a proposal, the project it became, and the invoice raised
- Freelancers don't know their real cash position at any point in time
- Clients have to keep emailing freelancers just to check on a project status

**FreelanceFlow** solves this with a single platform that covers the full freelancer workflow:

1. A freelancer sends a proposal to a client
2. When accepted, it automatically becomes a project with milestones
3. Each completed milestone can generate an invoice in one click
4. The cash flow dashboard shows earnings, overdue payments, and monthly trends in real time
5. Clients get their own login to view project progress and invoices — no more status-update emails

The platform is built for solo freelancers and independent consultants who need structure and visibility without enterprise-level complexity.

---

## Core Features

**1. Proposal to Invoice Pipeline**

A state machine enforces the full workflow:
`Draft → Sent → Accepted → Active Project → Milestones → Invoice → Paid`

Each status transition is validated on the backend — you can't skip steps or go backwards. An accepted proposal converts to a project in one click, milestones track deliverables, and completed milestones auto-generate invoices with sequential numbering.

**2. Dual Role Portal**

- **Freelancer** — full dashboard, manages everything (clients, proposals, projects, invoices)
- **Client** — separate login, read-only portal scoped only to their own projects and invoices

JWT tokens carry the user role. Every protected route checks the role server-side. The two portals have completely separate navigation and layouts.

**3. Cash Flow Dashboard**

Freelancers see: total earned, pending, overdue, projected income, monthly revenue bar chart (earned vs pending vs overdue), income breakdown by client (donut chart), and invoice aging (how long invoices have been outstanding).

---

## Tech Stack

**Frontend** (`/client`)
- React + Vite
- TanStack Router (file-based routing)
- TanStack Query (server state, caching)
- Zustand (auth state)
- Tailwind CSS
- React Hook Form + Zod (forms and validation)
- Recharts (cash flow charts)
- Lucide React (icons)

**Backend** (`/server`)
- Node.js + Express
- PostgreSQL — raw SQL, no ORM
- `jsonwebtoken` — JWT auth
- `bcryptjs` — password hashing
- `zod` — request body validation
- `express-rate-limit` — rate limiting on auth routes
- `swagger-ui-express` — API documentation

---

## Project Structure

```
freelanceflow/
├── client/                  # React frontend
│   └── src/
│       ├── components/      # UI, layout, shared components
│       ├── pages/           # Route pages (auth, dashboard, proposals, etc.)
│       ├── hooks/           # TanStack Query hooks per feature
│       ├── store/           # Zustand auth store
│       └── lib/             # API fetch wrapper, query client
├── server/                  # Express backend
│   └── src/
│       ├── config/          # DB connection, Swagger spec, migrations
│       ├── controllers/     # Request handlers
│       ├── middleware/       # Auth, validation, error handler
│       ├── models/          # SQL query functions
│       ├── routes/          # Express routers
│       ├── services/        # Business logic (state machines)
│       └── utils/           # Invoice number generator, etc.
└── docs/                    # Schema SQL, API docs, design reference
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Clone the repo

```bash
git clone https://github.com/adityakasralkar/freelanceflow.git
cd freelanceflow
```

### 2. Create the database

```sql
CREATE USER ff_user WITH PASSWORD 'ff_password123';
CREATE DATABASE freelanceflow OWNER ff_user;
```

### 3. Configure environment

```bash
cd server
cp .env.example .env
```

Fill in `.env`:

```
PORT=5001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=freelanceflow
DB_USER=ff_user
DB_PASSWORD=ff_password123
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 4. Run migrations

```bash
npm install
npm run db:setup
npm run db:migrate
```

### 5. Start the backend

```bash
npm run dev
# Runs on http://localhost:5001
```

### 6. Start the frontend

```bash
cd ../client
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## API Documentation

Base URL: `http://localhost:5001/api`

**Swagger UI (interactive):** [`http://localhost:5001/api/docs`](http://localhost:5001/api/docs) — open in browser, no login needed

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/register` | — | Register as freelancer or client |
| POST | `/auth/login` | — | Login, receive JWT |
| GET | `/auth/me` | ✓ | Get current user profile |
| PATCH | `/auth/me` | ✓ | Update profile / settings |
| GET | `/clients` | ✓ | List clients |
| POST | `/clients` | ✓ | Create client |
| GET/PATCH | `/clients/:id` | ✓ | Get or update client |
| GET | `/proposals` | ✓ | List proposals (filter by status) |
| POST | `/proposals` | ✓ | Create proposal |
| PATCH | `/proposals/:id/status` | ✓ | Advance proposal state machine |
| POST | `/proposals/:id/convert` | ✓ | Convert accepted proposal → project |
| GET | `/projects` | ✓ | List projects |
| GET/PATCH | `/projects/:id` | ✓ | Get or update project |
| GET/POST | `/projects/:id/milestones` | ✓ | List or add milestones |
| PATCH | `/milestones/:id/complete` | ✓ | Mark milestone complete |
| GET | `/invoices` | ✓ | List invoices |
| GET | `/invoices/:id` | ✓ | Get invoice with line items |
| POST | `/invoices/generate/:milestoneId` | ✓ | Auto-generate invoice from milestone |
| PATCH | `/invoices/:id/status` | ✓ | Update invoice status |
| GET | `/client-portal/my-projects` | ✓ client | Client: view their projects |
| GET | `/client-portal/my-invoices` | ✓ client | Client: view their invoices |
| PATCH | `/client-portal/my-invoices/:id/acknowledge` | ✓ client | Client: acknowledge invoice |

All responses use a standard format:
```json
{ "success": true, "data": {}, "message": "..." }
```

---

## Database Schema

Tables: `users`, `clients`, `proposals`, `projects`, `milestones`, `invoices`, `invoice_items`

Full schema: [`docs/schema.sql`](docs/schema.sql)

---

## AI Usage

This project was built using **Option A** — built from scratch with AI assistance.

**AI tool used:** Claude Code (Anthropic)

**What AI assisted with:**
- Setting up the initial project boilerplate and configuration files (Express, Vite, Tailwind).
- Generating mock data and SQL table creation scripts based on my schema design.
- Suggesting validation schemas (using Zod) and regex patterns for inputs.
- Providing syntax help and troubleshooting specific TypeScript type errors.

**Example prompts used:**
- *"How can I set up an Express error handling middleware to catch database constraint violations?"*
- *"What's the best way to structure TanStack router for protected role-based routes?"*
- *"Help me debug this CORS issue when calling my backend from Vite."*

**Reflection & Limitations:**
While AI was extremely helpful for documentation and syntax suggestions, it often struggled with the broader context of the application. For instance, AI-generated SQL queries frequently had incorrect table aliases or missed foreign key constraints, requiring manual correction. Additionally, the AI struggled to generate UI components that strictly adhered to the intended design system, meaning the frontend layout and styling had to be heavily customized by hand. Overall, AI served as an excellent pair-programming assistant, accelerating the development process without replacing core problem-solving and architectural design.

---

## Git History

Feature branches: `feature/auth-api`, `feature/proposals-api`, `feature/projects-ui`, etc. All merged into `dev`. See commit history on GitHub for a feature-by-feature breakdown.

---

## Assignment Info

- **Course:** SEZG503 Full Stack Application Development
- **Name:** Aditya Kasralkar
- **BITS-ID:** 2024TM93619
