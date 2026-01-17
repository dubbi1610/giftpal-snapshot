# GiftPal - Personal Gift Planning Assistant

A fully functioning web application for managing contacts, events, gift plans, wishlists, and gift history.

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- A Supabase project (for authentication)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Create a `.env.local` file in the root directory (copy from `.env.example` if it exists)
   - Fill in your Supabase credentials:
     - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
     - `NEXT_PUBLIC_SITE_URL` - Your site URL (defaults to `http://localhost:3000` for development)

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to find your project URL and anonymous key
3. Enable Email Auth in Authentication > Providers
   - Go to Authentication > Providers
   - Enable "Email" provider
   - Configure email settings as needed

4. Configure Redirect URLs (Authentication > URL Configuration):
   - Add `http://localhost:3000/verify*` for development
   - Add `https://yourdomain.com/verify*` for production
   - Add `https://*.vercel.app/verify*` for Vercel preview deployments (optional)

5. Configure Email Templates (Authentication > Email Templates):
   - **Confirm signup**: Use `{{ .ConfirmationURL }}` in the template
   - **Reset password**: Use `{{ .ConfirmationURL }}` in the template

6. Enable Email Verification:
   - Go to Authentication > Settings
   - Ensure "Confirm email" is enabled (required for email verification flow)

7. (Optional) Configure SMTP:
   - Go to Authentication > Settings > SMTP Settings
   - Configure custom SMTP server or use Supabase default email service

## Routes List

### Auth Routes
- `/login` - Sign in page
- `/signup` - Create account page
- `/forgot-password` - Password reset request page
- `/verify` - Email verification and password reset confirmation (handles tokens from email links)
- `/reset-password` - Set new password after password reset (requires valid reset token)
- `/logout` - Sign out handler (redirects to home)

### Main Routes
- `/` - Landing page

### App Routes (requires authentication)
- `/app` - Dashboard with personalized suggestions
- `/app/contacts` - Contacts list
- `/app/contacts/new` - Create new contact
- `/app/contacts/[id]` - Contact detail page
- `/app/events` - Events list
- `/app/events/new` - Create new event
- `/app/events/[id]` - Event detail page
- `/app/planner` - Gift plans list
- `/app/planner/new` - Create new gift plan
- `/app/planner/[id]` - Gift plan detail (with CRUD for ideas)
- `/app/wishlists` - Wishlists list
- `/app/wishlists/new` - Create new wishlist
- `/app/wishlists/[id]` - Wishlist detail (with CRUD for items)
- `/app/history` - Gift history list
- `/app/settings` - Settings and data management

### Share Routes (public, read-only)
- `/share/wishlist/[token]` - Shared wishlist view (read-only)

## Where to Edit Mock Data

Mock data is located in: **`lib/mockData.ts`**

The `createSeedData()` function generates seed data including:
- 1 user profile
- 10 contacts
- 15 events
- 8 gift plans
- 3 wishlists with 20 items
- 25 gift history entries

To modify the seed data, edit the `createSeedData()` function in `lib/mockData.ts`.

## Where Personalization Logic Lives

Personalization engine is located in: **`lib/personalization.ts`**

The `generateSuggestions()` function creates personalized suggestions based on:
- User profile preferences
- Contact relationships and interests
- Event dates and plans
- Gift history patterns

It generates 4 types of suggestions:
1. **Upcoming with no plan** - Events within 30 days without a gift plan
2. **Budget guidance** - Recommended budget ranges based on history
3. **Gift ideas** - Rule-based suggestions using interests + relationship
4. **Planning backlog** - Contacts missing common event types (e.g., birthdays)

The dashboard displays the top 6 prioritized suggestions.

## How to Reset Demo Data

1. Navigate to **Settings** (`/app/settings`)
2. Scroll to the "Data Management" section
3. Click the **"Reset Demo Data"** button
4. Confirm the reset action

This will:
- Clear all existing data from LocalStorage
- Load fresh seed data from `lib/mockData.ts`
- Redirect you back to the dashboard

Alternatively, you can reset data programmatically:
```typescript
import { resetStorage } from '@/lib/storage/storage';
import { createSeedData } from '@/lib/mockData';
// ... import repos

resetStorage();
const seedData = createSeedData();
// ... populate repos with seedData
```

## Project Structure

```
src/
  app/
    page.tsx                      # Entry point with redirect logic
    app/(shell)/                  # Protected app routes
      layout.tsx                  # App shell with sidebar/topbar
      page.tsx                    # Dashboard
      contacts/                   # Contacts pages
      events/                     # Events pages
      planner/                    # Gift planner pages
      wishlists/                  # Wishlists pages
      history/                    # Gift history page
      settings/                   # Settings page
    share/wishlist/[token]/      # Public wishlist share route
  components/
    ui/                           # Design system components
    layout/                       # Layout components (sidebar, topbar)
  lib/
    types.ts                      # TypeScript type definitions
    mockData.ts                   # Seed data generator
    personalization.ts            # Suggestion engine
    api/
      interface.ts                # API interface
      localApi.ts                 # LocalStorage implementation
    hooks/                        # TanStack Query hooks
    storage/
      storage.ts                  # Storage utilities
      init.ts                     # Initialization logic
      repositories/               # Data repositories
    utils/                        # Utility functions
```

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **TanStack Query** (data fetching/state)
- **Zod** (validation)
- **lucide-react** (SVG icons)
- **date-fns** (date utilities)
- **Supabase Auth** (authentication)
- **@supabase/ssr** (server-side auth)
- **LocalStorage** (persistence for app data)

## Features

- ✅ User profile with seed data initialization
- ✅ Contact management with relationships and interests
- ✅ Event tracking (birthdays, anniversaries, holidays, custom)
- ✅ Gift plan creation with budget tracking and ideas
- ✅ Wishlist management with sharing via tokens
- ✅ Gift history tracking (given/received)
- ✅ Personalized dashboard with suggestions
- ✅ Export data as JSON
- ✅ Reset demo data functionality

## Authentication Flow

### Signup Flow
1. User creates account at `/signup`
2. Supabase sends email verification link
3. User clicks link, redirected to `/verify`
4. Email is verified, user redirected to `/onboarding` (or `/app` if profile exists)

### Login Flow
1. User signs in at `/login`
2. If email not verified, error message displayed
3. On success, user redirected to `/app` (or `redirect` parameter if provided)

### Password Reset Flow
1. User requests reset at `/forgot-password`
2. Supabase sends password reset email with link
3. User clicks link, redirected to `/verify?type=recovery`
4. Token verified, user redirected to `/reset-password?token=...`
5. User sets new password, redirected to `/login`

### Email Verification
- Email verification tokens are handled automatically via Supabase email links
- Tokens are processed at `/verify` page
- On success, user is redirected to appropriate page (onboarding or app)

## Notes

- Authentication is handled via Supabase Auth (email/password with email verification)
- App data (contacts, events, plans, etc.) is stored in LocalStorage (client-side only)
- After signup/login, if no local profile exists, users are redirected to `/onboarding` to create one
- Password reset and email verification require `NEXT_PUBLIC_SITE_URL` environment variable for proper redirect URLs
- Responsive design optimized for 390px+ width
- No emojis used - SVG icons only (lucide-react)
