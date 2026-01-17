---
name: auth-ux-spec
overview: Define the auth architecture and UX for the root Next.js app using Supabase Auth, plus route map, wireframes, copy, and file plan. No code changes until approval.
todos:
  - id: design-auth-layout
    content: Finalize auth layout + card spec and copy deck
    status: completed
  - id: auth-routing-guard
    content: Define route map + guard strategy
    status: completed
  - id: file-plan
    content: List files to create/modify for auth implementation
    status: completed
---

# Auth UX Spec (Root Web App)

## Auth Architecture Decision

- **Stack:** Supabase Auth (email/password + email verification) for the root app at repo root (App Router).
- **Session model:** Cookie-based Supabase session for server checks, with client hooks for UI state.
- **Guards:** Middleware protects `/app/*`, plus a server-side check in `app/app/(shell)/layout.tsx` to avoid client flicker. Public auth routes redirect logged-in users away.
- **Data model:** Keep existing LocalStorage-based app data for now; auth only gates access. After signup/login, if no local profile exists, redirect to `/onboarding` to create it.

## Route Map

- `/login` → sign in; if authenticated → redirect `/app`.
- `/signup` → create account; success → `/verify` (or `/onboarding` if email already verified).
- `/forgot-password` → request reset; success → `/verify` with instructions.
- `/verify` → handles email confirmation and password reset confirmation; success → `/login` or `/onboarding`.
- `/logout` → server action or route handler signs out; redirect to `/`.
- Protected: `/app/*` → requires auth; unauthenticated → `/login?redirect=/app/...`.

## UI Wireframes

### AuthLayout (shared)

```
[ Full-page gradient background ]
   [ GiftPal logo + wordmark ]
   [ Auth card (max-w-md) ]
     - Title
     - Subtitle
     - Form fields
     - Primary CTA button
     - Secondary links (login/signup/forgot)
   [ Footer small text ]
```

### /login

```
[AuthCard]
  Title: Welcome back
  Fields: Email, Password
  CTA: Log in
  Links: Forgot password, Create account
  Social: none
```

### /signup

```
[AuthCard]
  Title: Create your account
  Fields: Name, Email, Password, Confirm Password
  CTA: Create account
  Links: Already have an account? Log in
```

### /forgot-password

```
[AuthCard]
  Title: Reset your password
  Fields: Email
  CTA: Send reset link
  Links: Back to login
```

### /verify

```
[AuthCard]
  Title: Check your email
  Body: Instructions + resend link
  CTA: Back to login
```

### /logout

```
[No UI] Route triggers sign-out → redirect to /
```

## Copy Deck

- **Login title:** “Welcome back”
- **Login subtitle:** “Sign in to continue planning gifts.”
- **Signup title:** “Create your account”
- **Signup subtitle:** “Start organizing gifting with GiftPal.”
- **Forgot title:** “Reset your password”
- **Forgot subtitle:** “We’ll email you a secure reset link.”
- **Verify title:** “Check your email”
- **Verify subtitle:** “We sent a confirmation link to finish setup.”
- **CTA labels:** “Log in”, “Create account”, “Send reset link”, “Back to login”
- **Errors:** “Invalid email or password.” “Please confirm your email to continue.” “Something went wrong—try again.”

## Acceptance Criteria (per page)

- **/login:** Validates email/password; shows error on failure; redirects to intended path after login.
- **/signup:** Validates required fields + password match; shows success state and verification instructions.
- **/forgot-password:** Validates email; shows “email sent” state; no user enumeration leaks.
- **/verify:** Handles Supabase verification flows; provides next-step CTA.
- **/logout:** Clears session and redirects to `/`.

## Component Plan

- **Reuse:** `Card`, `Input`, `Button`, `Select` styles, `Modal` if needed, `lucide-react` icons.
- **New:** `AuthLayout`, `AuthCard` (if needed), `FormError`, `FormSuccess` (simple styled blocks using existing Tailwind tokens).

## File Plan (no changes yet)

- Create: `app/(auth)/layout.tsx`
- Create: `app/login/page.tsx`
- Create: `app/signup/page.tsx`
- Create: `app/forgot-password/page.tsx`
- Create: `app/verify/page.tsx`
- Create: `app/logout/page.tsx` (or route handler)
- Create: `lib/supabase/client.ts`, `lib/supabase/server.ts`
- Create: `lib/auth/session.ts` or similar helper
- Modify: `app/app/(shell)/layout.tsx` (server-side guard)
- Modify: `middleware.ts` (protect `/app` + redirect auth pages)
- Modify: `app/page.tsx` (login CTA to `/login` instead of `/app`)
- Modify: `README.md` + `.env.example`

## Visual Consistency Checklist

- **Palette:** Use existing gradient theme from onboarding (blue/purple/pink) and slate text tones.
- **Typography:** `text-slate-900` headings, `text-slate-500/600` body.
- **Spacing:** `p-6`, `space-y-4/6`, `max-w-md` for auth card.
- **Radius:** `rounded-lg` (cards/inputs/buttons).
- **Shadows:** `shadow-sm` and `shadow-xl` consistent with current cards.
- **Focus:** `focus-visible:ring-slate-900` on inputs/buttons.

---

Reply: **Approved — start build** or **Changes: ...**