# Rooted

A personal task management app with a date-first, hierarchical view system. Tasks are scheduled to specific dates and organized under a tree of **Views** (think labelled folders). The daily task tree, recurring series support, and Google OAuth sign-in are all built in.

---

## Features

- **Daily task tree** — browse tasks by date; tasks are nested under their View hierarchy
- **Views** — recursive parent/child categories; soft-deletable; searchable in a sidebar
- **Recurring series** — tasks generated from iCal `RRULE` strings with a watermark-based generator
- **Task actions** — create, edit, toggle completion, delete; inline forms with validation
- **Calendar navigator** — pick a date from a mini-calendar synced to the URL `?date=` param
- **Google OAuth** — Clerk SSO sign-in with redirect flow
- **Dark / light theme** — toggle persisted via `next-themes`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router), React 19 |
| Language | TypeScript |
| Auth | Clerk (`@clerk/nextjs`) — Google OAuth |
| Database | PostgreSQL via Neon (`@neondatabase/serverless`) |
| ORM | Drizzle ORM + Drizzle Kit |
| Server state | Drizzle repository classes |
| Client state | TanStack React Query v5 |
| Forms & validation | React Hook Form + Zod v4 |
| UI components | shadcn/ui (Radix UI primitives) |
| Styling | Tailwind CSS v4 |
| Toasts | Sonner |
| Date utilities | date-fns, react-day-picker |

---

## Project Structure

```
app/
  layout.tsx              # Root layout — ClerkProvider, QueryProvider, ThemeProvider, Toaster
  page.tsx                # Landing page
  sign-in/                # Google OAuth sign-in + /callback
  (dashboard)/
    layout.tsx            # Sticky navbar, dark-mode toggle, profile
    tasks/page.tsx        # Main tasks page — reads ?date= query param
  api/
    tasks/                # GET list, POST create
      [id]/               # GET, PATCH, DELETE
      tree/               # GET task tree for a given date
    views/                # GET list, POST create
      [id]/               # GET, PATCH, DELETE
        disable/          # POST — soft-delete (is_active = false)
db/
  schemas/                # Drizzle table definitions (tasks, views, series)
  repos/                  # Data access layer (TaskRepo, ViewRepo)
  migrations/             # SQL migration files
features/
  tasks/
    application/          # Pure business logic — buildTaskTree()
    components/           # React UI (TaskTree, TasksView, TaskCalendar, forms, actions)
    contracts/            # Zod schemas for API request/response shapes
    react-query/          # TanStack Query hooks
  views/
    components/           # Sidebar, drawer, combobox, forms
    contracts/            # Zod schemas
    react-query/          # TanStack Query hooks
components/
  ui/                     # shadcn/ui components
  providers/              # QueryProvider, ThemeProvider
```

---

## Database Schema

### `views`
Self-referential tree via `parent_id → views.id`. Soft-deleted with `is_active`.

### `tasks`
Belong to one `view` (nullable) and one `series` (nullable). Keyed by `scheduled_date` (a plain `date` column).

### `series`
Stores an iCal `rrule` string and a `last_generated_date` watermark; linked to a required `view`. Drives recurring task generation.

---

## API Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/tasks` | List tasks with pagination and filters |
| `POST` | `/api/tasks` | Create a task (`X-Timezone` header used for date logic) |
| `GET` | `/api/tasks/[id]` | Fetch a single task |
| `PATCH` | `/api/tasks/[id]` | Partial update |
| `DELETE` | `/api/tasks/[id]` | Delete |
| `GET` | `/api/tasks/tree` | **Main query.** Returns the full view-tree + tasks for a date via recursive CTE |
| `GET` | `/api/views` | List views |
| `POST` | `/api/views` | Create a view |
| `GET` | `/api/views/[id]` | Fetch a single active view |
| `PATCH` | `/api/views/[id]` | Update title / description / parent |
| `DELETE` | `/api/views/[id]` | Delete |
| `POST` | `/api/views/[id]/disable` | Soft-delete |

All routes require authentication via Clerk's `auth()` and return `401` for unauthenticated requests.

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Clerk](https://clerk.com) application with Google OAuth enabled

### Environment variables

Create a `.env.local` file:

```env
DATABASE_URL=your_neon_connection_string

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

### Install and run

```bash
npm install

# Push the schema / run migrations
npx drizzle-kit migrate

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database migrations

Migrations live in `db/migrations/` and are managed with Drizzle Kit.

```bash
# Generate a new migration after schema changes
npx drizzle-kit generate

# Apply pending migrations
npx drizzle-kit migrate
```
