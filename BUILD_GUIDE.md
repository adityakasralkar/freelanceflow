# BUILD_GUIDE.md — FreelanceFlow Step-by-Step Build Prompts
# Use this file in Claude Code — copy each prompt in order

---

## HOW TO USE THIS FILE

1. Open Claude Code (Code section in Claude Desktop)
2. Make sure freelanceflow project is open
3. Copy each prompt below one at a time
4. Wait for Claude Code to finish before going to next prompt
5. Check off each step as you complete it

---

## PHASE 1 — PROJECT SETUP

### PROMPT 1.1 — Read Context
```
Read CLAUDE.md to understand the full project context, tech stack, folder structure, branching strategy, and what we are building. Confirm you have read it by summarizing the 3 core features.
```

---

### PROMPT 1.2 — Create Backend Feature Branch
```
We are starting backend setup. Check what branch we are on. Switch to dev branch first. Then create a new branch called feature/backend-setup from dev and switch to it.
```

---

### PROMPT 1.3 — Initialize Backend
```
Go into the server folder. Run npm init -y to initialize package.json. Then install these production dependencies: express pg jsonwebtoken bcryptjs zod cors helmet morgan dotenv. Then install these dev dependencies: nodemon. Then update the scripts section in server/package.json to have: start runs node src/index.js and dev runs nodemon src/index.js.
```

---

### PROMPT 1.4 — Create Environment Files
```
Inside the server folder create a .env.example file with these variables: PORT=5000, NODE_ENV=development, DB_HOST=localhost, DB_PORT=5432, DB_NAME=freelanceflow, DB_USER=ff_user, DB_PASSWORD=your_password_here, JWT_SECRET=your_secret_key_here, JWT_EXPIRES_IN=7d, CLIENT_URL=http://localhost:5173. Then create a .env file with the same variables but set DB_PASSWORD to ff_password123 and JWT_SECRET to freelanceflow_super_secret_jwt_key_2026. Make sure .env is in the server/.gitignore so it never gets committed.
```

---

### PROMPT 1.5 — Create Server gitignore
```
Create a .gitignore file inside the server folder with these entries: node_modules, .env, .env.local, dist, *.log. Also update the root .gitignore to include node_modules, .env, .env.local, dist, *.log, .DS_Store, CLAUDE.md, BUILD_GUIDE.md.
```

---

### PROMPT 1.6 — Create Express Server Entry Point
```
Create the main Express server file at server/src/index.js. It should: import express, cors, helmet, morgan, dotenv. Load environment variables with dotenv. Create an express app. Apply these middleware in order: helmet(), cors with origin set to CLIENT_URL from env, morgan in dev format, express.json(). Add a health check GET route at /api/health that returns json with success true, message "FreelanceFlow API is running", and timestamp. Add a catch-all 404 handler for unknown routes. Start the server on PORT from env. Export the app. Use clean readable code with comments explaining each section.
```

---

### PROMPT 1.7 — Create Database Connection
```
Create server/src/config/db.js. It should create a PostgreSQL connection pool using the pg library. Read all connection config from environment variables: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD. Export a pool object and also export a query helper function that accepts sql and params and runs pool.query. Add a testConnection function that runs SELECT NOW() to verify connection works. Call testConnection when the file loads and log success or error to console. Handle connection errors gracefully.
```

---

### PROMPT 1.8 — Create Global Error Handler
```
Create server/src/middleware/errorHandler.js. It should export a global error handler middleware that takes err, req, res, next. It should log the error stack to console. Return a JSON response with success false, error message, and status code. Handle these specific cases: if err.status exists use it, if err.code is 23505 (PostgreSQL unique violation) return 409 with message "Resource already exists", if err.code is 23503 (foreign key violation) return 400 with message "Referenced resource not found". Default to 500 if no specific case matches. Also create server/src/middleware/validate.js that exports a validate middleware factory. It takes a Zod schema, validates req.body against it, calls next() if valid, returns 400 with validation errors if invalid.
```

---

### PROMPT 1.9 — Update Server to Use DB and Error Handler
```
Update server/src/index.js to import the db config and call the database connection test on startup. Import and add the errorHandler middleware as the last middleware after all routes. Add a comment showing where routes will be imported later.
```

---

### PROMPT 1.10 — Commit Backend Setup
```
Check git status. Stage all new files. Create a commit with message "chore: initialize express server with middleware and db connection". Then push the feature/backend-setup branch to origin.
```

---

## PHASE 2 — DATABASE SCHEMA

### PROMPT 2.1 — Create New Branch
```
Create a new branch called feature/database-schema from feature/backend-setup and switch to it.
```

---

### PROMPT 2.2 — Create Schema SQL File
```
Create a file at docs/schema.sql with the complete PostgreSQL database schema for FreelanceFlow. Include these tables with all columns exactly as specified:

users: id (uuid primary key default gen_random_uuid()), email (varchar 255 unique not null), password_hash (varchar 255 not null), role (varchar 20 not null check role in freelancer client), name (varchar 255 not null), created_at (timestamptz default now())

clients: id (uuid primary key), freelancer_id (uuid references users), name (varchar 255 not null), company (varchar 255), email (varchar 255), phone (varchar 50), location (varchar 255), created_at (timestamptz default now())

proposals: id (uuid primary key), freelancer_id (uuid references users), client_id (uuid references clients), title (varchar 500 not null), description (text), amount (numeric 12,2 not null), status (varchar 20 default draft check in draft sent accepted declined), valid_until (date), payment_terms (varchar 100), deliverables (jsonb default empty array), created_at (timestamptz default now())

projects: id (uuid primary key), proposal_id (uuid references proposals), freelancer_id (uuid references users), client_id (uuid references clients), title (varchar 500 not null), description (text), start_date (date), end_date (date), total_amount (numeric 12,2), status (varchar 20 default active check in active on_hold completed archived), created_at (timestamptz default now())

milestones: id (uuid primary key), project_id (uuid references projects), title (varchar 500 not null), description (text), due_date (date), amount (numeric 12,2 not null), status (varchar 20 default upcoming check in upcoming in_progress completed), completed_at (timestamptz), created_at (timestamptz default now())

invoices: id (uuid primary key), project_id (uuid references projects), milestone_id (uuid references milestones), freelancer_id (uuid references users), client_id (uuid references clients), invoice_number (varchar 50 unique not null), issue_date (date not null), due_date (date not null), subtotal (numeric 12,2 not null), gst_amount (numeric 12,2 default 0), total_amount (numeric 12,2 not null), status (varchar 20 default draft check in draft sent paid overdue), notes (text), created_at (timestamptz default now())

invoice_items: id (uuid primary key), invoice_id (uuid references invoices on delete cascade), description (text not null), quantity (numeric 8,2 default 1), rate (numeric 12,2 not null), amount (numeric 12,2 not null)

Add CREATE INDEX statements for all foreign key columns and status columns. Add a comment header at the top of the file.
```

---

### PROMPT 2.3 — Create Database Setup Script
```
Create a file at server/src/config/setupDb.js. It should read the schema.sql file and execute it against the database to create all tables. Import the db query helper. Read the SQL file using fs.readFileSync. Execute it. Log success or error. This script is run once to initialize the database. Add a note that it is safe to run multiple times because all CREATE TABLE statements should use CREATE TABLE IF NOT EXISTS.

Update the schema.sql file to use CREATE TABLE IF NOT EXISTS for all tables.

Add a script in server/package.json called db:setup that runs node src/config/setupDb.js.
```

---

### PROMPT 2.4 — Run Database Setup
```
Run the database setup script by running npm run db:setup inside the server folder. Show me the output. If there are errors fix them. If successful confirm all tables were created.
```

---

### PROMPT 2.5 — Commit Schema
```
Stage all files. Commit with message "feat: add PostgreSQL schema with all tables and indexes". Push to origin feature/database-schema.
```

---

## PHASE 3 — AUTH API

### PROMPT 3.1 — Create New Branch
```
Create branch feature/auth-api from feature/database-schema and switch to it.
```

---

### PROMPT 3.2 — Create Auth Middleware
```
Create server/src/middleware/auth.middleware.js. It should export a verifyToken middleware function. It reads the Authorization header, extracts the Bearer token, verifies it using jsonwebtoken and JWT_SECRET from env. If valid, attaches the decoded user payload to req.user and calls next(). If missing or invalid returns 401 with appropriate error message. Also export a requireRole middleware factory that takes a role string and returns middleware that checks req.user.role matches. Returns 403 if role does not match.
```

---

### PROMPT 3.3 — Create User Model
```
Create server/src/models/user.model.js. Export these functions using the db query helper:

findByEmail(email) — SELECT user by email
findById(id) — SELECT user by id, exclude password_hash from result
createUser(name, email, passwordHash, role) — INSERT new user, return created user without password_hash
updateUser(id, fields) — UPDATE user by id with provided fields

All functions should return the result rows. Use parameterized queries only, never string interpolation.
```

---

### PROMPT 3.4 — Create Auth Controller
```
Create server/src/controllers/auth.controller.js. Import bcryptjs, jsonwebtoken, user model, and zod.

Create these Zod schemas:
- registerSchema: name string min 2, email valid email, password string min 6, role enum freelancer or client
- loginSchema: email valid email, password string min 1

Export register function:
- Validate body with registerSchema
- Check if email already exists using findByEmail, return 409 if exists
- Hash password with bcrypt saltRounds 10
- Create user with createUser
- Generate JWT token with user id, email, role, expires in JWT_EXPIRES_IN
- Return 201 with success true, token, and user object (no password)

Export login function:
- Validate body with loginSchema
- Find user by email, return 401 if not found
- Compare password with bcrypt, return 401 if wrong
- Generate JWT token same as register
- Return 200 with success true, token, and user object

Export getMe function (protected route):
- Get user by req.user.id from findById
- Return 200 with user data
```

---

### PROMPT 3.5 — Create Auth Routes
```
Create server/src/routes/auth.routes.js. Import express Router, auth controller, and auth middleware.

Define these routes:
POST /register → register controller
POST /login → login controller
GET /me → verifyToken middleware then getMe controller

Export the router.
```

---

### PROMPT 3.6 — Register Auth Routes in Server
```
Update server/src/index.js to import auth routes and mount them at /api/auth. Make sure it is imported before the error handler middleware.
```

---

### PROMPT 3.7 — Test Auth API
```
Start the server by running npm run dev inside the server folder. Test the health check endpoint, then test register and login using curl or by showing me what the test commands would look like. Fix any errors that come up.
```

---

### PROMPT 3.8 — Commit Auth API
```
Stop the server. Stage all files. Commit with message "feat: add auth API with register, login, and JWT middleware". Push to origin feature/auth-api.
```

---

## PHASE 4 — CLIENTS API

### PROMPT 4.1 — Create New Branch
```
Create branch feature/clients-api from feature/auth-api and switch to it.
```

---

### PROMPT 4.2 — Create Clients Model and Controller
```
Create server/src/models/client.model.js with these functions:
- getAllClients(freelancerId) — get all clients belonging to a freelancer
- getClientById(id, freelancerId) — get single client, verify it belongs to freelancer
- createClient(freelancerId, data) — insert new client
- updateClient(id, freelancerId, data) — update client fields
- deleteClient(id, freelancerId) — delete client

Then create server/src/controllers/clients.controller.js with Zod schema for creating/updating a client (name required, company optional, email optional, phone optional, location optional). Export functions: getAll, getOne, create, update, remove. All functions verify the client belongs to the logged-in freelancer using req.user.id. Return proper success/error responses following the standard format from CLAUDE.md.

Then create server/src/routes/clients.routes.js with all CRUD routes protected by verifyToken middleware.

Mount the clients routes in server/src/index.js at /api/clients.
```

---

### PROMPT 4.3 — Commit Clients API
```
Stage all files. Commit with message "feat: add clients CRUD API". Push to origin feature/clients-api.
```

---

## PHASE 5 — PROPOSALS API

### PROMPT 5.1 — Create New Branch
```
Create branch feature/proposals-api from feature/clients-api and switch to it.
```

---

### PROMPT 5.2 — Create Proposals Model
```
Create server/src/models/proposal.model.js with these functions:
- getAllProposals(freelancerId, filters) — get all proposals for a freelancer, support optional status filter
- getProposalById(id, freelancerId) — get single proposal with client details joined
- createProposal(freelancerId, data) — insert new proposal
- updateProposal(id, freelancerId, data) — update proposal fields
- updateProposalStatus(id, freelancerId, status) — update only the status field
- deleteProposal(id, freelancerId) — delete proposal only if status is draft

Use JOIN to include client name and email in query results.
```

---

### PROMPT 5.3 — Create Proposals Service
```
Create server/src/services/proposal.service.js. This handles business logic.

Export a function validateStatusTransition(currentStatus, newStatus) that enforces the state machine rules:
- draft can go to sent
- sent can go to accepted or declined
- accepted and declined cannot change
- throw an error with clear message if transition is invalid

Export a function convertToProject(proposalId, freelancerId, projectData) that:
- Gets the proposal and verifies it is accepted status
- Creates a new project record using the proposal data
- Updates the proposal to link to the project
- Returns the created project
```

---

### PROMPT 5.4 — Create Proposals Controller and Routes
```
Create server/src/controllers/proposals.controller.js with Zod schema for proposals (title required, description optional, client_id required uuid, amount required positive number, valid_until optional date, payment_terms optional string, deliverables optional array of strings).

Export these functions:
getAll — get all proposals, support ?status= query param filter
getOne — get single proposal by id
create — validate and create proposal with status defaulting to draft
update — validate and update proposal fields
updateStatus — validate new status using proposal service state machine, update
convertToProject — call proposal service convertToProject, return new project
remove — delete only if draft status

Create server/src/routes/proposals.routes.js:
GET / → getAll
POST / → create
GET /:id → getOne
PATCH /:id → update
DELETE /:id → remove
PATCH /:id/status → updateStatus
POST /:id/convert → convertToProject

All routes protected by verifyToken. Mount at /api/proposals in index.js.
```

---

### PROMPT 5.5 — Commit Proposals API
```
Stage all files. Commit with message "feat: add proposals API with state machine". Push to origin feature/proposals-api.
```

---

## PHASE 6 — PROJECTS AND MILESTONES API

### PROMPT 6.1 — Create New Branch
```
Create branch feature/projects-api from feature/proposals-api and switch to it.
```

---

### PROMPT 6.2 — Create Projects Model and Controller
```
Create server/src/models/project.model.js with functions:
- getAllProjects(freelancerId, filters) — get all projects with client name joined, support status filter
- getProjectById(id, freelancerId) — get single project with client details and proposal details joined
- createProject(data) — insert project
- updateProject(id, freelancerId, data) — update project fields

Create server/src/controllers/projects.controller.js with Zod schema and functions: getAll, getOne, update. The create function is handled by proposal service convertToProject.

Create server/src/routes/projects.routes.js with:
GET / → getAll
GET /:id → getOne
PATCH /:id → update

All protected by verifyToken. Mount at /api/projects in index.js.
```

---

### PROMPT 6.3 — Create Milestones Model and Controller
```
Create server/src/models/milestone.model.js with functions:
- getMilestonesByProject(projectId) — get all milestones for a project ordered by due_date
- getMilestoneById(id) — get single milestone
- createMilestone(projectId, data) — insert milestone
- updateMilestone(id, data) — update milestone fields
- completeMilestone(id) — set status to completed and completed_at to now

Create server/src/controllers/milestones.controller.js with Zod schema (title required, description optional, due_date required date, amount required positive number). Export: getByProject, create, update, complete.

The complete function should: update milestone status to completed, then check if an invoice already exists for this milestone, return the milestone and a flag indicating whether an invoice can be generated.

Create server/src/routes/milestones.routes.js:
GET /projects/:projectId/milestones → getByProject
POST /projects/:projectId/milestones → create
PATCH /milestones/:id → update
PATCH /milestones/:id/complete → complete

Mount milestone routes in index.js.
```

---

### PROMPT 6.4 — Commit Projects and Milestones API
```
Stage all files. Commit with message "feat: add projects and milestones API". Push to origin feature/projects-api.
```

---

## PHASE 7 — INVOICES API

### PROMPT 7.1 — Create New Branch
```
Create branch feature/invoices-api from feature/projects-api and switch to it.
```

---

### PROMPT 7.2 — Create Invoice Number Generator
```
Create server/src/utils/generateInvoiceNumber.js. It should query the invoices table to find the latest invoice number, extract the numeric part, increment by 1, and return a new invoice number in format INV-001, INV-002 etc padded to 3 digits. Handle the case where no invoices exist yet by starting from INV-001.
```

---

### PROMPT 7.3 — Create Invoice Service
```
Create server/src/services/invoice.service.js. Export a function generateFromMilestone(milestoneId, freelancerId, extraData) that:
- Gets the milestone and its project
- Verifies milestone status is completed
- Checks no invoice already exists for this milestone
- Generates invoice number using the utility
- Calculates GST as 18 percent of subtotal
- Calculates total as subtotal plus gst_amount
- Creates the invoice record
- Creates invoice_items from the milestone (one line item with milestone title and amount)
- Returns the created invoice with items

Export a function updateInvoiceStatus(id, freelancerId, newStatus) that validates status transitions: draft to sent, sent to paid or overdue. Throw error for invalid transitions.
```

---

### PROMPT 7.4 — Create Invoices Model Controller and Routes
```
Create server/src/models/invoice.model.js with functions:
- getAllInvoices(freelancerId, filters) — get all invoices with client and project names joined, support status filter
- getInvoiceById(id, freelancerId) — get invoice with all invoice_items, client details, project details
- createInvoice(data) — insert invoice
- createInvoiceItem(invoiceId, item) — insert invoice item
- updateInvoiceStatus(id, status) — update status field

Create server/src/controllers/invoices.controller.js with:
getAll — get all invoices with optional ?status= filter
getOne — get single invoice with items
generateFromMilestone — call invoice service
updateStatus — call invoice service status validation then update

Create server/src/routes/invoices.routes.js:
GET / → getAll
GET /:id → getOne
POST /generate/:milestoneId → generateFromMilestone
PATCH /:id/status → updateStatus

Mount at /api/invoices in index.js. All protected by verifyToken.
```

---

### PROMPT 7.5 — Commit Invoices API
```
Stage all files. Commit with message "feat: add invoices API with auto-generation from milestones". Push to origin feature/invoices-api.
```

---

## PHASE 8 — CLIENT PORTAL API

### PROMPT 8.1 — Create New Branch
```
Create branch feature/client-portal-api from feature/invoices-api and switch to it.
```

---

### PROMPT 8.2 — Create Client Portal Routes
```
Create server/src/routes/clientPortal.routes.js. These routes are for the CLIENT role only. Use verifyToken then requireRole('client') middleware on all routes.

Add these routes:
GET /my-projects — get all projects where client_id matches req.user.id, join with freelancer name
GET /my-projects/:id — get single project details with milestones
GET /my-invoices — get all invoices where client_id matches req.user.id
GET /my-invoices/:id — get single invoice with items
PATCH /my-invoices/:id/acknowledge — client marks invoice as paid, only allowed if status is sent

Create the controller functions for each route. Add new model functions as needed.

Mount at /api/client-portal in index.js.
```

---

### PROMPT 8.3 — Commit Client Portal API
```
Stage all files. Commit with message "feat: add client portal API with role-based access". Push to origin feature/client-portal-api.
```

---

## PHASE 9 — MERGE BACKEND TO DEV

### PROMPT 9.1 — Merge All Backend Work
```
Switch to dev branch. Merge feature/client-portal-api into dev. Push dev to origin. Start the server and verify the health check works. List all registered routes so we can confirm everything is mounted correctly.
```

---

## PHASE 10 — FRONTEND SETUP

### PROMPT 10.1 — Create New Branch
```
Switch to dev branch. Create branch feature/frontend-setup from dev and switch to it.
```

---

### PROMPT 10.2 — Initialize React App
```
Go into the client folder. Run npm create vite@latest . -- --template react to initialize a React app in the current directory. Confirm overwrite if asked. After initialization run npm install. Then install these dependencies: @tanstack/react-router @tanstack/react-query zustand react-hook-form zod @hookform/resolvers lucide-react recharts. Then install dev dependencies: tailwindcss @tailwindcss/vite. Show me the final package.json.
```

---

### PROMPT 10.3 — Configure Tailwind
```
Configure Tailwind CSS for the Vite React project. Update vite.config.js to use the Tailwind Vite plugin. Replace the contents of src/index.css with only the Tailwind import. Remove App.css. Clean up App.jsx to just return a simple div with text "FreelanceFlow" to verify setup works.
```

---

### PROMPT 10.4 — Set Up Folder Structure
```
Create the full folder structure inside client/src as defined in CLAUDE.md:
- components/ui/
- components/layout/
- components/shared/
- pages/auth/
- pages/dashboard/
- pages/proposals/
- pages/projects/
- pages/invoices/
- pages/clients/
- pages/settings/
- pages/client-portal/
- store/
- hooks/
- lib/
- utils/

Create a .gitkeep file in each empty folder so git tracks them.
```

---

### PROMPT 10.5 — Set Up Utilities and Fetch Helper
```
Create client/src/utils/index.js with these utility functions:
- formatCurrency(amount) — formats number as Indian Rupee eg ₹1,24,500
- formatDate(dateString) — formats date as "Jan 15, 2026"
- formatDateShort(dateString) — formats as "Jan 15"
- cn(...classes) — merges class names, filters falsy values (simple version without clsx)
- getInitials(name) — returns first 2 letters uppercase from name

Create client/src/lib/api.js — a fetch wrapper that:
- Has a base URL constant pointing to http://localhost:5000/api
- Exports an api object with get, post, patch, delete methods
- Each method automatically adds Authorization Bearer token from localStorage
- Each method returns parsed JSON
- Throws an error with the server error message if response is not ok
- Has a setToken(token) and removeToken() helper
```

---

### PROMPT 10.6 — Set Up Zustand Auth Store
```
Create client/src/store/authStore.js using Zustand. The store should have:
State: user (null or user object), token (null or string), isAuthenticated (boolean)

Actions:
- login(userData, token) — sets user, token, isAuthenticated true, saves token to localStorage
- logout() — clears user, token, isAuthenticated false, removes token from localStorage
- initialize() — reads token from localStorage on app start, if exists sets token in state

Use Zustand create function. Export the store hook as useAuthStore.
```

---

### PROMPT 10.7 — Set Up TanStack Query
```
Create client/src/lib/queryClient.js that creates and exports a TanStack Query QueryClient with default options: staleTime 1 minute, retry 1 time on failure.

Update client/src/main.jsx to wrap the app with QueryClientProvider using the queryClient. Also call authStore initialize() on app start to restore session from localStorage.
```

---

### PROMPT 10.8 — Set Up TanStack Router
```
Create client/src/router.jsx with TanStack Router setup. Define these routes:

Public routes (no auth required):
/ → redirect to /login
/login → FreelancerLoginPage
/client/login → ClientLoginPage

Freelancer routes (protected, require role=freelancer):
/dashboard → DashboardPage
/dashboard/cashflow → CashFlowPage
/proposals → ProposalsPage
/projects → ProjectsPage
/projects/$projectId → ProjectDetailPage
/invoices → InvoicesPage
/invoices/$invoiceId → InvoiceDetailPage
/clients → ClientsPage
/clients/$clientId → ClientProfilePage
/settings → SettingsPage

Client portal routes (protected, require role=client):
/client/dashboard → ClientDashboardPage
/client/projects → ClientProjectsPage
/client/projects/$projectId → ClientProjectDetailPage
/client/invoices → ClientInvoicesPage
/client/invoices/$invoiceId → ClientInvoiceDetailPage

Create a ProtectedRoute component that checks useAuthStore isAuthenticated and role, redirects to login if not authenticated.

Create placeholder page components for each route that just return a div with the page name. We will fill them in later.

Update main.jsx to use RouterProvider with the router.
```

---

### PROMPT 10.9 — Commit Frontend Setup
```
Stage all files. Commit with message "chore: initialize React frontend with Vite, TanStack Router, Query, Zustand, and Tailwind". Push to origin feature/frontend-setup.
```

---

## PHASE 11 — UI COMPONENTS

### PROMPT 11.1 — Create New Branch
```
Create branch feature/ui-components from feature/frontend-setup and switch to it.
```

---

### PROMPT 11.2 — Create Base UI Components
```
Create these base components in client/src/components/ui/ following the design spec:

Design tokens to use throughout:
- Primary accent: #0F9F72
- Page background: #F6F7F9
- Card background: #FFFFFF
- Border: #E5E9F0
- Text primary: #111827
- Text secondary: #667085
- Font: Inter (add Google Fonts import to index.html)

Button.jsx — variants: primary (bg #0F9F72 text white), secondary (bg white border), danger (bg #DC2626), ghost (transparent). Sizes: sm, md, lg. Shows loading spinner when isLoading prop is true. Accepts onClick, disabled, className, children, type props.

Input.jsx — accepts label, error, helperText, placeholder, type props. Shows red border and error text on error. Focus ring in mint green. Full width by default.

Badge.jsx — status badge component. Accepts status prop with values: draft, sent, accepted, declined, active, on_hold, completed, archived, upcoming, in_progress, invoiced, paid, overdue. Each status has its own background and text color from the design spec. Shows a colored dot before text.

Card.jsx — simple wrapper with white background, border, border-radius 12px, shadow-sm. Accepts className and children.

Modal.jsx — overlay modal with close button. Accepts isOpen, onClose, title, subtitle, children, footer props. Clicking overlay closes modal. Escape key closes modal.
```

---

### PROMPT 11.3 — Create Layout Components
```
Create client/src/components/layout/Sidebar.jsx:
- Width 224px, white background, right border
- Logo at top: green square icon + FreelanceFlow text with mint "Flow"
- Nav items with icons from lucide-react: Dashboard (home), Proposals (file-text), Projects (folder), Invoices (receipt), Clients (users)
- Active item: mint text, mint background tint, left accent border
- Bottom: user avatar with initials, user name, role, logout button
- Uses useAuthStore for user data and logout action
- Uses TanStack Router for navigation and active state detection

Create client/src/components/layout/TopBar.jsx:
- Height 52px, white, bottom border
- Left: page title and optional subtitle props
- Right: bell icon button and user avatar
- Accepts title and subtitle props

Create client/src/components/layout/PageLayout.jsx:
- Wraps page content with Sidebar + TopBar + main content area
- Background #F6F7F9
- Content area has padding 24px
- Accepts title, subtitle, actions (right side buttons), children props

Create client/src/components/layout/ClientSidebar.jsx:
- Simpler version for client portal
- Nav items: My Projects, My Invoices, My Profile
- Shows "Client Portal" label below logo
```

---

### PROMPT 11.4 — Create Shared Components
```
Create these shared components in client/src/components/shared/:

Avatar.jsx — circle avatar with colored background and initials. Accepts name and size (sm=24px, md=32px, lg=40px, xl=48px) props. Cycles through 5 color combinations based on first letter of name.

EmptyState.jsx — centered empty state. Accepts icon (lucide component), heading, subtext, actionLabel, onAction props.

StatusBadge.jsx — re-export of Badge.jsx for convenience.

StatCard.jsx — stat card with icon, value, label, delta props. Icon has mint-soft background. Value is large and bold. Delta shows up/down arrow with color.

ConfirmDialog.jsx — small confirmation modal. Accepts isOpen, onClose, onConfirm, title, message, confirmLabel, isDanger props. Shows cancel and confirm buttons.

Drawer.jsx — right side panel that slides in. Accepts isOpen, onClose, title, children, footer props. Width 440px. Overlay dims background.

PageHeader.jsx — page title, subtitle, and right-side actions row. Accepts title, subtitle, actions props.
```

---

### PROMPT 11.5 — Commit UI Components
```
Stage all files. Commit with message "feat: add base UI components and layout system". Push to origin feature/ui-components.
```

---

## PHASE 12 — AUTH PAGES

### PROMPT 12.1 — Create New Branch
```
Create branch feature/auth-pages from feature/ui-components and switch to it.
```

---

### PROMPT 12.2 — Create Freelancer Login Page
```
Create client/src/pages/auth/FreelancerLoginPage.jsx.

Layout: two column full height. Left panel 52% with #F8FAFC background showing app branding, headline "Your freelance business, organized.", feature list with 3 items using check icons. Right panel 48% white with login form centered.

Form using React Hook Form + Zod:
Schema: email required valid email, password required min 1

On submit:
- POST to /api/auth/login using the api helper from lib/api.js
- If success: call authStore login with user and token, navigate to /dashboard
- If role is client: navigate to /client/dashboard instead
- If error: show error message below form

Show loading state on submit button while request is in flight.

Include "Are you a client? Client login →" link at bottom that navigates to /client/login.

Use the Input, Button components created earlier.
```

---

### PROMPT 12.3 — Create Client Login Page
```
Create client/src/pages/auth/ClientLoginPage.jsx.

Same structure as freelancer login but:
- Left panel heading: "View your projects and invoices."
- Feature list about client portal features
- Form title: "Client access"
- On success: navigate to /client/dashboard
- If role is freelancer: show error "This is the client portal. Use freelancer login."
- Bottom link: "Are you a freelancer? Freelancer login →"
```

---

### PROMPT 12.4 — Test Auth Flow
```
Start the frontend dev server with npm run dev inside the client folder. Open the browser. Verify the login page loads. Check that navigation to /client/login works. Check that the form shows validation errors for empty fields. Report any errors found and fix them.
```

---

### PROMPT 12.5 — Commit Auth Pages
```
Stage all files. Commit with message "feat: add freelancer and client login pages". Push to origin feature/auth-pages.
```

---

## PHASE 13 — DASHBOARD PAGES

### PROMPT 13.1 — Create New Branch
```
Create branch feature/dashboard from feature/auth-pages and switch to it.
```

---

### PROMPT 13.2 — Create Dashboard Hooks
```
Create client/src/hooks/useDashboard.js using TanStack Query.

Export these hooks:
- useDashboardStats() — fetches GET /api/invoices and GET /api/projects, computes: totalEarned (sum of paid invoice totals), pendingAmount (sum of sent invoice totals), overdueCount and overdueAmount (invoices with overdue status), activeProjectsCount. Returns all stats.
- useRecentActivity() — fetches recent proposals, milestones, and invoices, merges and sorts by created_at descending, returns top 5 items with type label and timestamp.
- usePipelineSnapshot() — fetches proposals grouped by status counts and projects counts.
```

---

### PROMPT 13.3 — Create Freelancer Dashboard Page
```
Create client/src/pages/dashboard/DashboardPage.jsx.

Use PageLayout with title "Dashboard" and a "+ New Proposal" primary button in actions.

Row 1: 4 StatCards in a grid using useDashboardStats data:
- Total Earned (trending-up icon, mint)
- Pending Payments (clock icon, amber)
- Active Projects (folder icon, blue)
- Overdue Invoices (alert-triangle icon, red)

Row 2: Two columns
- Left 60%: Recent Activity card — list of activity items with colored dots and timestamps. Use useRecentActivity hook.
- Right 40%: Pipeline Snapshot card — horizontal bars for Proposals, Active, Invoiced, Paid counts.

Row 3: Two columns
- Left 65%: Upcoming Milestones card — table showing project, milestone name, due date, amount, status. Fetch from /api/projects with milestones.
- Right 35%: Quick Actions card — 4 full-width secondary buttons: New Proposal, Add Client, View Invoices, Cash Flow.

Show skeleton loading state while data is fetching. Show empty state if no data.
```

---

### PROMPT 13.4 — Create Cash Flow Page
```
Create client/src/pages/dashboard/CashFlowPage.jsx and client/src/hooks/useCashFlow.js.

The hook fetches all invoices and computes:
- Total earned, pending, overdue, projected (sent invoices due in next 30 days)
- Monthly breakdown for last 6 months: earned vs pending vs overdue per month
- Income by client: group paid invoices by client, compute percentage each
- Invoice aging: group pending/overdue invoices by days outstanding (0-15, 16-30, 31-60, 60+)

The page uses PageLayout with title "Cash Flow" and date range selector.

Row 1: 4 StatCards

Row 2: Monthly Revenue bar chart using Recharts BarChart. Grouped bars per month, mint for earned, amber for pending, red for overdue.

Row 3: Two columns
- Left: Income by Client using Recharts PieChart donut style
- Right: Invoice Aging as horizontal bars (divs with widths proportional to amounts)
```

---

### PROMPT 13.5 — Commit Dashboard
```
Stage all files. Commit with message "feat: add freelancer dashboard and cash flow pages". Push to origin feature/dashboard.
```

---

## PHASE 14 — PROPOSALS PAGES

### PROMPT 14.1 — Create New Branch
```
Create branch feature/proposals-ui from feature/dashboard and switch to it.
```

---

### PROMPT 14.2 — Create Proposals Hooks
```
Create client/src/hooks/useProposals.js with these TanStack Query hooks:
- useProposals(statusFilter) — GET /api/proposals with optional status filter param
- useProposal(id) — GET /api/proposals/:id
- useCreateProposal() — mutation for POST /api/proposals
- useUpdateProposal() — mutation for PATCH /api/proposals/:id
- useUpdateProposalStatus() — mutation for PATCH /api/proposals/:id/status
- useDeleteProposal() — mutation for DELETE /api/proposals/:id
- useConvertToProject() — mutation for POST /api/proposals/:id/convert

All mutations should invalidate the proposals query on success.
```

---

### PROMPT 14.3 — Create Proposals Page
```
Create client/src/pages/proposals/ProposalsPage.jsx.

Use PageLayout with title "Proposals" and subtitle showing total count.

Filter tabs: All, Draft, Sent, Accepted, Declined — use useState for active filter, pass to useProposals hook.

Search input on the right side of toolbar using useState to filter client-side.

Proposal list: each row shows avatar, client name, project title, amount, valid until, status badge, chevron on hover. Click row opens ProposalDrawer.

Include ProposalDrawer and CreateProposalModal in this file or import them.
```

---

### PROMPT 14.4 — Create Proposal Drawer
```
Create client/src/pages/proposals/ProposalDrawer.jsx.

Uses the Drawer component. Receives proposalId and onClose props. Fetches proposal using useProposal(proposalId).

Shows all proposal details: client avatar and name, status badge, amount (large mint), valid until, payment terms, description, deliverables list.

Footer changes based on status:
- draft: Cancel ghost + Send to Client primary button
- sent: Mark Declined danger ghost + Mark Accepted primary
- accepted: info box in mint soft + Convert to Project full-width primary
- declined: info box in red soft + Duplicate Proposal secondary

Each action calls the appropriate mutation hook. Show loading state. Show success toast after action.

Include edit and delete icon buttons in drawer header.
```

---

### PROMPT 14.5 — Create Proposal Modal
```
Create client/src/pages/proposals/CreateProposalModal.jsx.

Uses Modal component. React Hook Form + Zod validation.

Fields: Client select (from useClients hook), Project Title input, Amount input with rupee prefix, Valid Until date input, Payment Terms select, Description textarea, Deliverables tag input (press Enter to add, click x to remove).

Footer: Cancel ghost, Save as Draft secondary, Send to Client primary.

On submit with Save Draft: create with status draft.
On submit with Send: create with status sent.

Call useCreateProposal mutation. Close modal and show toast on success.
```

---

### PROMPT 14.6 — Commit Proposals UI
```
Stage all files. Commit with message "feat: add proposals list, drawer, and create modal". Push to origin feature/proposals-ui.
```

---

## PHASE 15 — PROJECTS PAGES

### PROMPT 15.1 — Create New Branch
```
Create branch feature/projects-ui from feature/proposals-ui and switch to it.
```

---

### PROMPT 15.2 — Create Projects Hooks
```
Create client/src/hooks/useProjects.js with:
- useProjects(statusFilter) — GET /api/projects
- useProject(id) — GET /api/projects/:id
- useUpdateProject() — mutation for PATCH /api/projects/:id
- useMilestones(projectId) — GET /api/projects/:id/milestones
- useCreateMilestone(projectId) — mutation
- useUpdateMilestone() — mutation
- useCompleteMilestone() — mutation for PATCH /api/milestones/:id/complete
```

---

### PROMPT 15.3 — Create Projects List Page
```
Create client/src/pages/projects/ProjectsPage.jsx.

Grid of 2 columns with project cards. Each card: client avatar and name top row with status badge, project title, progress bar with milestone count and percentage, amount and due date bottom row, Open button on hover.

Filter tabs: All, In Progress, On Hold, Completed.

Empty state when no projects.

Click card navigates to /projects/$projectId.
```

---

### PROMPT 15.4 — Create Project Detail Page
```
Create client/src/pages/projects/ProjectDetailPage.jsx.

Reads projectId from TanStack Router params. Fetches with useProject.

Header: breadcrumb, project title, status badge, client name.

Tabs: Overview, Milestones, Invoices. Use useState for active tab.

Overview tab: two columns. Left has description and deliverables checklist and payment structure. Right has stats card and client card.

Milestones tab: imports MilestonesTab component.

Invoices tab: table of invoices for this project.
```

---

### PROMPT 15.5 — Create Milestones Tab
```
Create client/src/pages/projects/MilestonesTab.jsx. Receives projectId prop.

Uses useMilestones hook.

Shows vertical timeline. Each milestone: circle indicator (filled check for completed, dash for in progress, empty for upcoming), milestone card with title, status badge, due date, amount.

Completed with no invoice: show Generate Invoice secondary small button.
Completed with invoice: show invoice number as mint link.
In progress: show Mark Complete button that opens ConfirmDialog.

After marking complete: show toast "Milestone complete! Generate an invoice?" with action button.

Add Milestone button opens AddMilestoneModal.

Create AddMilestoneModal.jsx: fields for title, description, due date, amount. Uses useCreateMilestone mutation.
```

---

### PROMPT 15.6 — Commit Projects UI
```
Stage all files. Commit with message "feat: add projects list, detail, and milestones tab". Push to origin feature/projects-ui.
```

---

## PHASE 16 — INVOICES PAGES

### PROMPT 16.1 — Create New Branch
```
Create branch feature/invoices-ui from feature/projects-ui and switch to it.
```

---

### PROMPT 16.2 — Create Invoices Hooks
```
Create client/src/hooks/useInvoices.js with:
- useInvoices(statusFilter) — GET /api/invoices
- useInvoice(id) — GET /api/invoices/:id
- useGenerateInvoice(milestoneId) — mutation POST /api/invoices/generate/:milestoneId
- useUpdateInvoiceStatus() — mutation PATCH /api/invoices/:id/status
```

---

### PROMPT 16.3 — Create Invoices List Page
```
Create client/src/pages/invoices/InvoicesPage.jsx.

Summary strip showing total, paid, pending, overdue amounts.

Filter tabs: All, Draft, Sent, Paid, Overdue.

Table with columns: Invoice Number, Client, Project, Issue Date, Due Date, Amount, Status, Actions.

Invoice number in mono font as mint colored link. Overdue due dates shown in red.

Actions (visible on row hover): View, Mark Paid (if sent), Send Reminder (if overdue).

Mark Paid opens ConfirmDialog. Send Reminder opens a modal showing reminder email preview.
```

---

### PROMPT 16.4 — Create Invoice Detail Page
```
Create client/src/pages/invoices/InvoiceDetailPage.jsx.

Full invoice layout styled like a real invoice document:
- Logo and INVOICE label top row
- Invoice number (large, mono, mint) and status badge
- Issue date and due date right side
- FROM and TO sections with party details
- Line items table with description, qty, rate, amount columns
- Totals section: subtotal, GST, total (larger)
- Notes and bank details at bottom

Action buttons below invoice: Back, Download PDF (shows browser print dialog), Send to Client (if draft), Mark as Paid (if sent).

Also create GenerateInvoiceModal.jsx that opens from milestone complete flow. Pre-fills invoice number, dates, line items from milestone. User can adjust. Submit calls useGenerateInvoice.
```

---

### PROMPT 16.5 — Commit Invoices UI
```
Stage all files. Commit with message "feat: add invoices list, detail, and generate invoice flow". Push to origin feature/invoices-ui.
```

---

## PHASE 17 — CLIENTS PAGES

### PROMPT 17.1 — Create New Branch
```
Create branch feature/clients-ui from feature/invoices-ui and switch to it.
```

---

### PROMPT 17.2 — Create Clients Hooks and Pages
```
Create client/src/hooks/useClients.js with:
- useClients() — GET /api/clients
- useClient(id) — GET /api/clients/:id
- useCreateClient() — mutation
- useUpdateClient() — mutation

Create client/src/pages/clients/ClientsPage.jsx:
Grid of 3 columns with client cards. Each card: avatar, name, company, active projects count, total billed, outstanding amount, View Profile button. Add Client button opens AddClientModal.

Create AddClientModal.jsx: fields for name, company, email, phone, location.

Create client/src/pages/clients/ClientProfilePage.jsx:
Profile header with large avatar, name, company, location. Action buttons: New Proposal, Edit Client. Tabs: Overview, Projects, Invoices, Proposals. Each tab shows filtered data for this client.
```

---

### PROMPT 17.3 — Commit Clients UI
```
Stage all files. Commit with message "feat: add clients list and profile pages". Push to origin feature/clients-ui.
```

---

## PHASE 18 — CLIENT PORTAL PAGES

### PROMPT 18.1 — Create New Branch
```
Create branch feature/client-portal from feature/clients-ui and switch to it.
```

---

### PROMPT 18.2 — Create Client Portal Pages
```
Create all client portal pages using ClientSidebar layout component:

client/src/pages/client-portal/ClientDashboardPage.jsx:
- Welcome message with client name
- 3 stat cards: Active Projects, Pending Invoices, Completed Projects
- My Projects table: project name, status, progress bar, next milestone, due date
- Recent Invoices table: invoice number, project, amount, status

client/src/pages/client-portal/ClientProjectDetailPage.jsx:
- Same header as freelancer project detail but read-only
- Tabs: Overview and Milestones only
- Overview: project description, deliverables (read only), payment breakdown
- Milestones: same timeline but no action buttons, read-only note at top

client/src/pages/client-portal/ClientInvoicesPage.jsx:
- Summary strip with total, paid, pending
- Table with invoice number, project, date, amount, status
- Actions: Download (always), Acknowledge Payment (if status is sent)
- Acknowledge opens ConfirmDialog

client/src/pages/client-portal/ClientInvoiceDetailPage.jsx:
- Same invoice layout as freelancer invoice detail
- Actions: Download PDF, Acknowledge Payment (if sent)
- No Send to Client or Mark as Paid from freelancer perspective

Create client/src/hooks/useClientPortal.js with hooks for all client portal API calls hitting /api/client-portal endpoints.
```

---

### PROMPT 18.3 — Commit Client Portal
```
Stage all files. Commit with message "feat: add client portal pages with read-only project and invoice views". Push to origin feature/client-portal.
```

---

## PHASE 19 — SETTINGS PAGE

### PROMPT 19.1 — Create Settings Page
```
Create client/src/pages/settings/SettingsPage.jsx.

Left settings nav with 3 items: Profile, Business Details, Payment Details. Use useState for active tab.

Profile tab: avatar upload area (circle with camera overlay), first name, last name, email (disabled), phone, location. Save Changes button calls PATCH /api/auth/profile.

Business Details tab: business name, GST number with toggle, address, invoice prefix input with helper text, default payment terms select, default due days number. Save calls PATCH /api/auth/business.

Payment Details tab: UPI ID, bank name, account number, IFSC code, account holder name. Save calls PATCH /api/auth/payment.

Add these update endpoints to the backend auth routes and controller if not already there.

Commit with message feat: add settings page with profile business and payment tabs.
```

---

## PHASE 20 — FINAL MERGE AND CLEANUP

### PROMPT 20.1 — Merge Everything to Dev
```
Switch to dev branch. Merge feature/client-portal into dev. Merge feature/settings (if separate) into dev. Push dev to origin. Start both frontend and backend servers. Test the complete flow: register a freelancer, create a client, create a proposal, accept it, convert to project, add milestones, complete a milestone, generate invoice, then log in as client and view the invoice. Report any errors.
```

---

### PROMPT 20.2 — Fix Any Integration Issues
```
Review all API calls in the frontend and verify they match the backend routes exactly. Check that the Authorization header is being sent on all protected routes. Fix any 401, 403, or 404 errors. Fix any CORS issues.
```

---

### PROMPT 20.3 — Update Build Status in CLAUDE.md
```
Open CLAUDE.md and update the Current Build Status checklist to check off all completed items.
```

---

### PROMPT 20.4 — Final Merge to Main
```
Switch to dev. Make sure all feature branches are merged into dev. Run both servers and do a final smoke test. Then merge dev into main with message "feat: complete FreelanceFlow MVP with all 3 core features". Push main to origin.
```

---

### PROMPT 20.5 — Update README
```
Update README.md with:
- Project description
- Tech stack list
- How to run locally (backend and frontend steps)
- Features list
- Screenshots placeholder section
- Assignment info

Commit with message "docs: update README with setup instructions and features". Push to origin.
```

---

## YOU ARE DONE

All 3 features are complete:
- Feature 1: Proposal to Invoice Pipeline
- Feature 2: Dual Role Portal
- Feature 3: Cash Flow Dashboard

Next steps after this:
1. Record the demo video
2. Write the AI usage reflection report
3. Document the API in docs/api.md
4. Submit GitHub repo link