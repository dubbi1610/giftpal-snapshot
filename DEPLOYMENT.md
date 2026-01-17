# Deployment Guide for GiftPal

## ✅ Git Push Complete

The code has been successfully pushed to: **https://github.com/rohan2207/GIFTPAL**

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import the repository: `rohan2207/GIFTPAL`
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"
7. Your app will be live at: `https://giftpal.vercel.app` (or a custom domain)

> **Important:** After deployment, configure environment variables (see "Environment Variables" section below)

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select `rohan2207/GIFTPAL`
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy site"

### Option 3: Self-Hosted

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

The app will run on `http://localhost:3000`

### Option 4: Docker (for containerized deployment)

Create a `Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

Then deploy to any container hosting (Railway, Render, Fly.io, etc.)

## Environment Variables

GiftPal requires Supabase environment variables for authentication. Configure these in Vercel Dashboard:

### Configuration Steps

1. **Access Environment Variables:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your GiftPal project
   - Navigate to **Settings** → **Environment Variables**

2. **Add Variables for Each Environment:**
   You need to add each variable separately for **Production**, **Preview**, and **Development** environments.

   **Required Variables:**
   
   **`NEXT_PUBLIC_SUPABASE_URL`** (required)
   - **Description:** Your Supabase project URL
   - **How to find:** 
     - Go to [Supabase Dashboard](https://app.supabase.com)
     - Select your project
     - Navigate to **Settings** → **API**
     - Copy the **Project URL**
   - **Example:** `https://xxxxxxxxxxxxx.supabase.co`
   - **Environments:** Add to Production, Preview, and Development
   
   **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** (required)
   - **Description:** Your Supabase anonymous/public API key
   - **How to find:**
     - In Supabase Dashboard → **Settings** → **API**
     - Under **Project API keys**, find the `anon` `public` key
     - Click the copy icon to copy the key
   - **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Environments:** Add to Production, Preview, and Development
   
   **`NEXT_PUBLIC_SITE_URL`** (optional)
   - **Description:** Your deployed site URL, used for password recovery email redirects
   - **Value:** Your production URL (e.g., `https://giftpal.vercel.app` or your custom domain)
   - **Default:** If not set, defaults to `http://localhost:3000`
   - **Environments:** 
     - **Production:** Set to your production URL
     - **Preview:** Set to your preview URL (or use production URL)
     - **Development:** Can be omitted (will use localhost default)

3. **Adding Each Variable:**
   - Click the **"Add New"** button
   - Enter the **Key** (variable name)
   - Enter the **Value**
   - Select the target environments using the checkboxes:
     - ☑ Production
     - ☑ Preview  
     - ☑ Development
   - Click **"Save"**
   - Repeat steps above for each variable

4. **Redeploy After Configuration:**
   Environment variable changes **require a redeployment** to take effect:
   
   **Option A: Redeploy from Dashboard**
   - Go to **Deployments** tab
   - Click the **"⋯"** (three dots menu) on your latest deployment
   - Select **"Redeploy"**
   - Confirm the redeployment
   
   **Option B: Trigger via Git Push**
   - Make any change to your repository (even a small commit)
   - Push to your connected branch
   - Vercel will automatically redeploy with new environment variables

5. **Verify Configuration:**
   - After redeployment, check the deployment logs to ensure build succeeded
   - Test authentication features (signup, login, password reset) to confirm Supabase is connected

> **Finding Supabase Credentials:** See the "Supabase Setup" section in [README.md](README.md) for detailed instructions on creating a Supabase project and locating your credentials.

## Post-Deployment

1. Visit your deployed URL
2. Complete the onboarding flow
3. Demo data will be automatically seeded on first run
4. All data persists in browser LocalStorage

## Notes

- The app is fully client-side - no backend required
- Each user's data is stored in their browser's LocalStorage
- To reset data: Settings → Reset Demo Data
- To export data: Settings → Export Data (downloads JSON)
