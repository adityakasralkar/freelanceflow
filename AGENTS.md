# AGENTS.md — FreelanceFlow Project Context

> This file is read automatically by Codex at the start of every session.
> Do not delete or rename this file.

---

## What is FreelanceFlow?

FreelanceFlow is a full-stack Freelance Project & Invoice Management Platform.
Built as part of BITS Pilani FSAD Assignment 2026.

Freelancers manage clients, proposals, projects, milestones, and invoices.
Clients get a separate portal to track project progress and view/acknowledge invoices.

---

## 3 Core Features (Assignment Scope)

### Feature 1 — Proposal to Invoice Pipeline

State machine: Proposal → Accepted → Project → Milestone Complete → Invoice Generated → Paid

This is the main non-trivial business logic of the app.

### Feature 2 — Dual Role Portal

- Freelancer: full dashboard, manages everything
- Client: read-only portal, sees their projects and invoices only
- Separate login screens, separate routes, JWT role-based access

### Feature 3 — Cash Flow Dashboard

Freelancer sees: total earned, pending, overdue, monthly revenue chart,
income by client (donut chart), invoice aging breakdown.

---

## Tech Stack

### Frontend (inside /client)

- React + Vite
- TanStack Router — page routing
- Zustand — global auth state (logged in user + role)
- TanStack Query — all API data fetching + caching
- Native fetch — HTTP calls (no Axios)
- Tailwind CSS — styling
- React Hook Form — all forms
- Zod — validation (shared schema language with backend)
- Lucide React — icons
- Recharts — cash flow charts

### Backend (inside /server)

- Node.js + Express.js
- pg (node-postgres) — raw SQL, no ORM
- jsonwebtoken — JWT auth tokens
- bcryptjs — password hashing
- Zod — request body validation
- cors — allow frontend origin
- helmet — security HTTP headers
- morgan — request logging
- dotenv — environment variables
- nodemon — dev auto-restart

### Database

- PostgreSQL
- Raw SQL queries (no Prisma, no Knex)
- TablePlus for local GUI access

---

## Folder Structure

```
freelanceflow/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── layout/
│   │   │   └── shared/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── proposals/
│   │   │   ├── projects/
│   │   │   ├── invoices/
│   │   │   ├── clients/
│   │   │   ├── settings/
│   │   │   └── client-portal/
│   │   ├── store/
│   │   │   └── authStore.js
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── utils/
│   │   └── router.jsx
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── proposals.controller.js
│   │   │   ├── projects.controller.js
│   │   │   ├── milestones.controller.js
│   │   │   ├── invoices.controller.js
│   │   │   └── clients.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── validate.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── proposal.model.js
│   │   │   ├── project.model.js
│   │   │   ├── milestone.model.js
│   │   │   ├── invoice.model.js
│   │   │   └── client.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── proposals.routes.js
│   │   │   ├── projects.routes.js
│   │   │   ├── milestones.routes.js
│   │   │   ├── invoices.routes.js
│   │   │   └── clients.routes.js
│   │   ├── services/
│   │   │   ├── proposal.service.js
│   │   │   ├── project.service.js
│   │   │   └── invoice.service.js
│   │   ├── utils/
│   │   │   └── generateInvoiceNumber.js
│   │   └── index.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── design-reference.html  ← open in browser to see all screen designs
│   ├── api.md
│   ├── schema.md
│   └── architecture.md
│
├── AGENTS.md
├── .gitignore
└── README.md
```

---

## Branching Strategy

```
main        → production ready only. Never push directly.
dev         → active development. All features merge here first.
feature/xyz → one branch per feature.
```

### Feature Branch Names

```
feature/auth-setup
feature/proposals-api
feature/proposals-ui
feature/projects-api
feature/projects-ui
feature/milestones-api
feature/invoices-api
feature/invoices-ui
feature/client-portal
feature/cashflow-dashboard
```

### Workflow for Every Feature

```bash
git checkout dev
git checkout -b feature/proposals-api
# write code
git add .
git commit -m "feat: add proposals CRUD endpoints"
git push origin feature/proposals-api
# when done, merge back to dev
git checkout dev
git merge feature/proposals-api
git push origin dev
```

---

## Commit Message Convention

```
feat:      new feature
fix:       bug fix
chore:     setup, config, dependencies
docs:      documentation
refactor:  code cleanup, no behavior change
style:     formatting only
```

### Examples

```
feat: add proposal create endpoint
fix: resolve JWT expiry error on client portal login
chore: initialize express server with middleware
docs: add API endpoints to docs/api.md
```

---

## API Design Conventions

Base URL: `http://localhost:5000/api`

### Routes

```
POST   /api/auth/register
POST   /api/auth/login

GET    /api/proposals
POST   /api/proposals
GET    /api/proposals/:id
PATCH  /api/proposals/:id
DELETE /api/proposals/:id
PATCH  /api/proposals/:id/status

GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id

GET    /api/projects/:id/milestones
POST   /api/projects/:id/milestones
PATCH  /api/milestones/:id
PATCH  /api/milestones/:id/complete

GET    /api/invoices
POST   /api/invoices
GET    /api/invoices/:id
PATCH  /api/invoices/:id/status

GET    /api/clients
POST   /api/clients
GET    /api/clients/:id
PATCH  /api/clients/:id
```

### Response Format

Always follow this format for every API response:

```json
{
  "success": true,
  "data": {},
  "message": "Proposal created successfully"
}
```

```json
{
  "success": false,
  "error": "Proposal not found",
  "code": 404
}
```

---

## Database Tables

```
users
  id, email, password_hash, role (freelancer/client),
  name, created_at

clients
  id, freelancer_id, name, company, email,
  phone, location, created_at

proposals
  id, freelancer_id, client_id, title, description,
  amount, status, valid_until, payment_terms,
  deliverables (jsonb), created_at

projects
  id, proposal_id, freelancer_id, client_id, title,
  description, start_date, end_date, total_amount,
  status, created_at

milestones
  id, project_id, title, description, due_date,
  amount, status, completed_at, created_at

invoices
  id, project_id, milestone_id, freelancer_id, client_id,
  invoice_number, issue_date, due_date, subtotal,
  gst_amount, total_amount, status, notes, created_at

invoice_items
  id, invoice_id, description, quantity, rate, amount
```

---

## Pipeline Status Values

```
Proposal   → draft | sent | accepted | declined
Project    → active | on_hold | completed | archived
Milestone  → upcoming | in_progress | completed
Invoice    → draft | sent | paid | overdue
```

---

## Design Reference

The full UI design for every screen is in:

```
docs/design-reference.html
```

This file contains the complete visual design board for FreelanceFlow including:
- Design system (colors, typography, spacing, components)
- Auth screens (freelancer login, client login)
- Freelancer dashboard and cash flow dashboard
- Proposals list, detail drawer, create modal
- Projects list, project detail, milestones timeline
- Invoices list, invoice detail/print view
- Clients list and client profile
- Client portal dashboard, project detail, invoices
- Settings page

### How to use the design reference

Before building any UI component or page, open docs/design-reference.html in a browser to see exactly how it should look. Match the layout, spacing, colors, and component styles shown there as closely as possible.

When building a specific screen, note the section ID in the HTML file:
```
#system         → Design system and components
#login          → Auth screens
#dashboard      → Freelancer dashboard
#cashflow       → Cash flow dashboard
#proposals      → Proposals list and drawer
#projects       → Projects list
#project-detail → Project detail with milestones
#invoices       → Invoices list and detail
#clients        → Clients list and profile
#settings       → Settings page
#client-portal  → Client portal screens
```

### Design Tokens (from the design reference)

```
Theme          Light
Font           Inter (Google Fonts)
Mono font      JetBrains Mono (invoice numbers, amounts, IDs only)

Page bg        #F6F7F9
Card bg        #FFFFFF
Canvas soft    #F8FAFC
Surface 2      #F3F6FA

Border         #E5E9F0
Border strong  #D8DEE8

Text primary   #111827
Text secondary #667085
Text muted     #98A2B3

Accent mint    #0F9F72  (CTAs, active nav, success, links)
Accent dark    #087252  (hover state for mint)
Mint soft      #EAF8F2  (accepted badge bg, success tint)

Blue           #2563EB
Blue soft      #EFF6FF
Amber          #D97706
Amber soft     #FFF7ED
Red            #DC2626
Red soft       #FEF2F2
Purple         #7C3AED
Purple soft    #F5F3FF

Shadow sm      0 1px 3px rgba(15,23,42,0.06)
Shadow         0 4px 14px rgba(15,23,42,0.07)
Shadow md      0 8px 22px rgba(15,23,42,0.09)

Radius sm      8px  (buttons, inputs, icon buttons)
Radius md      12px (cards)
Radius lg      16px (modals, drawers)
Radius full    9999px (badges, pills, avatars)

Icons          Lucide React, stroke 1.5px, 16px default size
```

### Pipeline Status Badge Colors

```
draft      text #667085  bg #F3F6FA   border #E5E9F0
sent       text #2563EB  bg #EFF6FF   border #BFDBFE
accepted   text #0F9F72  bg #EAF8F2   border #6EE7B7
declined   text #DC2626  bg #FEF2F2   border #FECACA
in_progress text #D97706 bg #FFF7ED   border #FDE68A
invoiced   text #7C3AED  bg #F5F3FF   border #DDD6FE
paid       text #065F46  bg #ECFDF5   border #6EE7B7
overdue    text #DC2626  bg #FEF2F2   border #FECACA
upcoming   text #667085  bg #F3F6FA   border #E5E9F0
completed  text #065F46  bg #ECFDF5   border #A7F3D0
```

---

## Environment Variables

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=freelanceflow
DB_USER=ff_user
DB_PASSWORD=your_password_here
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

## Important Rules for Codex

- Always check which branch we are on before writing code
- Create a feature branch before starting any new feature
- Follow the folder structure above exactly — no deviations
- Always use the response format defined above for all APIs
- Validate all request bodies with Zod before hitting the database
- Never store plain text passwords — always bcrypt
- JWT token goes in Authorization header as Bearer token
- Frontend fetch calls always attach token from Zustand auth store
- Commit after every logical chunk of work with proper commit message
- Before building any page or component read docs/design-reference.html for that screen's visual layout and match it exactly

---

## Current Build Status

- [ ] Repo setup and branching
- [ ] Folder structure created
- [ ] PostgreSQL local setup
- [ ] Backend: Express server running
- [ ] Backend: DB connection working
- [ ] Backend: Auth API (register + login)
- [ ] Backend: Proposals API
- [ ] Backend: Projects API
- [ ] Backend: Milestones API
- [ ] Backend: Invoices API
- [ ] Backend: Clients API
- [ ] Frontend: Vite + React setup
- [ ] Frontend: TanStack Router configured
- [ ] Frontend: Zustand auth store
- [ ] Frontend: Auth pages
- [ ] Frontend: Freelancer dashboard
- [ ] Frontend: Proposals pages
- [ ] Frontend: Projects and milestones pages
- [ ] Frontend: Invoices pages
- [ ] Frontend: Clients pages
- [ ] Frontend: Cash flow dashboard
- [ ] Frontend: Client portal pages
- [ ] Frontend: Settings page