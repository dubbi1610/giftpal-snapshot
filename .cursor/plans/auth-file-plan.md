# Auth Implementation File Plan

This document lists all files that need to be created or modified for the auth implementation as specified in the Auth UX Spec.

## Files to Create

### Auth Layout & Components
- ✅ `app/(auth)/layout.tsx` - Shared layout for all auth pages (gradient background, logo)
- ✅ `components/auth/AuthCard.tsx` - Reusable card component for auth forms
- ✅ `components/auth/FormError.tsx` - Error message component
- ✅ `components/auth/FormSuccess.tsx` - Success message component

### Auth Pages
- ⏳ `app/login/page.tsx` - Sign in page
- ⏳ `app/signup/page.tsx` - Create account page
- ⏳ `app/forgot-password/page.tsx` - Password reset request page
- ⏳ `app/verify/page.tsx` - Email verification and password reset confirmation page
- ⏳ `app/logout/page.tsx` (or route handler) - Sign out handler

### Supabase Client/Server Utilities
- ⏳ `lib/supabase/client.ts` - Client-side Supabase client
- ⏳ `lib/supabase/server.ts` - Server-side Supabase client

### Auth Helpers
- ⏳ `lib/auth/session.ts` (or similar) - Session management helpers

## Files to Modify

### Routing & Guards
- ✅ `middleware.ts` - Protect `/app/*` routes and redirect auth pages (created)
- ⏳ `app/app/(shell)/layout.tsx` - Add server-side auth check to avoid client flicker

### Landing Page
- ⏳ `app/page.tsx` - Update login CTA to point to `/login` instead of `/app`

### Documentation & Configuration
- ⏳ `README.md` - Document auth setup and environment variables
- ⏳ `.env.example` - Add Supabase environment variables

## Copy Deck Reference

### Login Page
- Title: "Welcome back"
- Subtitle: "Sign in to continue planning gifts."
- CTA: "Log in"
- Links: "Forgot password", "Create account"

### Signup Page
- Title: "Create your account"
- Subtitle: "Start organizing gifting with GiftPal."
- CTA: "Create account"
- Links: "Already have an account? Log in"

### Forgot Password Page
- Title: "Reset your password"
- Subtitle: "We'll email you a secure reset link."
- CTA: "Send reset link"
- Links: "Back to login"

### Verify Page
- Title: "Check your email"
- Subtitle: "We sent a confirmation link to finish setup."
- CTA: "Back to login"

### Error Messages
- "Invalid email or password."
- "Please confirm your email to continue."
- "Something went wrong—try again."

## Visual Consistency Checklist

All auth components should follow these design tokens:
- **Background:** Gradient `from-blue-50 via-purple-50 to-pink-50`
- **Typography:** `text-slate-900` headings, `text-slate-500/600` body
- **Spacing:** `p-6`, `space-y-4/6`, `max-w-md` for auth card
- **Radius:** `rounded-lg` (cards/inputs/buttons)
- **Shadows:** `shadow-sm` and `shadow-xl` consistent with current cards
- **Focus:** `focus-visible:ring-slate-900` on inputs/buttons
