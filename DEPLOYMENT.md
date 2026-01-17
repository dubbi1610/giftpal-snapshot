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

**No environment variables needed** - app uses LocalStorage (client-side only)

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

**None required!** The app uses LocalStorage for persistence, so it works entirely client-side.

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
