# TTSGP Booking System

Internal Discussion & Training Room Booking System built with Next.js 14, Supabase, and Tailwind CSS.

## Tech Stack

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Charts**: Recharts
- **Calendar**: FullCalendar

---

## Setup Guide (GitHub → Vercel → Supabase)

### Step 1 — Supabase

1. Go to [supabase.com](https://supabase.com) → New Project
2. Open **SQL Editor** → **New Query**
3. Paste the full contents of `supabase_schema.sql` → **Run**
4. Go to **Settings → API** and copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep this secret)

### Step 2 — GitHub

1. Create a new repo on GitHub
2. Upload all files from this ZIP maintaining the folder structure
3. Make sure `.env.local` is NOT committed (it's in `.gitignore`)

### Step 3 — Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Under **Environment Variables**, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL       = your project URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY  = your anon key
   SUPABASE_SERVICE_ROLE_KEY      = your service role key
   NEXT_PUBLIC_APP_URL            = https://your-app.vercel.app
   NEXT_PUBLIC_APP_NAME           = TTSGP Booking System
   ```
4. Click **Deploy**

### Step 4 — First Admin User

1. In Supabase → **Authentication → Users** → **Invite user** (or use email signup)
2. After the user signs up, go to **Table Editor → users**
3. Find the user row and set `role` to `super_admin`

---

## Folder Structure

```
src/
  app/
    login/              ← Login page
    home/               ← Employee dashboard
    bookings/           ← Browse & book rooms
    room/[id]/          ← Room detail + booking form
    my-bookings/        ← User's booking history
    notifications/      ← User notifications
    account/            ← Profile management
    admin/
      dashboard/        ← Admin stats & charts
      rooms/            ← Room CRUD
      users/            ← User management + role assignment
      booking-management/ ← Approve/cancel bookings
      reports/          ← Charts + CSV export
      settings/         ← System settings
      audit/            ← Audit log viewer
      announcements/    ← Create/edit announcements
  components/           ← Shared UI components
  services/             ← Supabase data services
  lib/                  ← Supabase client
  types/                ← TypeScript types
  hooks/                ← useAuth, useUser
  utils/                ← helpers (cn, formatDate, etc.)
```

---

## User Roles

| Role        | Access                          |
|-------------|---------------------------------|
| employee    | Home, Bookings, My Bookings, Notifications, Account |
| admin       | All employee pages + all Admin pages |
| super_admin | Full access including role management |

## Booking Status Flow

```
pending → approved → completed
       ↓
    cancelled
```
