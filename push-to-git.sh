#!/bin/bash

# Script to push changes to GitHub repository
# Run this after Xcode command line tools are installed

cd "$(dirname "$0")"

echo "🚀 Setting up Git repository and pushing to GitHub..."

# Initialize git repository if not already initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Add remote if it doesn't exist
if ! git remote | grep -q origin; then
    echo "🔗 Adding remote repository..."
    git remote add origin https://github.com/rohan2207/GIFTPAL.git
else
    echo "✅ Remote already exists, updating URL..."
    git remote set-url origin https://github.com/rohan2207/GIFTPAL.git
fi

# Configure git user if not already set (uncomment and set if needed)
# git config user.name "Your Name"
# git config user.email "your.email@example.com"

# Stage all changes
echo "📝 Staging changes..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Remove onboarding page, update Gift Radar to Personalized Gift Idea"

# Check if main or master branch exists
if git show-ref --verify --quiet refs/heads/main; then
    BRANCH="main"
elif git show-ref --verify --quiet refs/heads/master; then
    BRANCH="master"
else
    BRANCH="main"
    echo "🌿 Creating main branch..."
    git branch -M main
fi

# Push to remote
echo "⬆️  Pushing to GitHub..."
git push -u origin $BRANCH

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to https://github.com/rohan2207/GIFTPAL"
else
    echo "❌ Push failed. You may need to:"
    echo "   1. Set up authentication (SSH key or GitHub token)"
    echo "   2. Pull first if remote has changes: git pull origin $BRANCH --rebase"
    echo "   3. Force push if needed (use with caution): git push -u origin $BRANCH --force"
fi
