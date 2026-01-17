# Git Push Instructions

## Changes Made

The following changes have been made to the codebase:

1. **Removed Onboarding Page**
   - Deleted `/app/onboarding/page.tsx`
   - Updated routing in `/app/page.tsx` to redirect directly to `/app`
   - Updated `/app/app/(shell)/layout.tsx` to remove onboarding redirect
   - Updated `/app/app/(shell)/settings/page.tsx` to redirect to `/app` instead of `/onboarding`
   - Updated README.md to remove onboarding references

2. **Changed "Gift Radar" to "Personalized Gift Idea"**
   - Updated `/app/app/(shell)/page.tsx` (dashboard page)

3. **Updated .gitignore**
   - Added `nodejs-local/` to exclude local Node.js installation

## Prerequisites

Before pushing to GitHub, you need to:

1. **Install Xcode Command Line Tools** (if not already installed):
   ```bash
   xcode-select --install
   ```
   Follow the prompts to complete installation.

## Push to GitHub

Once Xcode tools are installed, you have two options:

### Option 1: Use the provided script
```bash
cd /Users/ashishbhatia/Downloads/GIFTPAL-main
./push-to-git.sh
```

### Option 2: Manual commands

```bash
cd /Users/ashishbhatia/Downloads/GIFTPAL-main

# Initialize git repository (if not already initialized)
git init

# Add remote repository
git remote add origin https://github.com/rohan2207/GIFTPAL.git
# Or update if it already exists:
# git remote set-url origin https://github.com/rohan2207/GIFTPAL.git

# Configure git user (if not already configured globally)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Stage all changes
git add .

# Commit changes
git commit -m "Remove onboarding page, update Gift Radar to Personalized Gift Idea"

# Set branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Authentication

If you encounter authentication issues:

1. **Using HTTPS**: You'll need a Personal Access Token (PAT)
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate a new token with `repo` permissions
   - Use the token as your password when pushing

2. **Using SSH** (recommended):
   ```bash
   git remote set-url origin git@github.com:rohan2207/GIFTPAL.git
   ```
   Make sure you have SSH keys set up with GitHub.

## Troubleshooting

If the remote repository already has commits:
```bash
git pull origin main --rebase
git push -u origin main
```

If you need to force push (use with caution):
```bash
git push -u origin main --force
```
