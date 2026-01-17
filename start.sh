#!/bin/bash

# GiftPal Local Startup Script
echo "🚀 Starting GiftPal locally..."

# Navigate to project directory
cd "$(dirname "$0")"

# Check for local Node.js installation first
if [ -d "nodejs-local/bin" ]; then
    export PATH="$(pwd)/nodejs-local/bin:$PATH"
    echo "✅ Using local Node.js installation"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    echo ""
    echo "Please install Node.js:"
    echo "  - Visit https://nodejs.org/ and download the LTS version"
    echo "  - Or use Homebrew: brew install node"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed or not in PATH"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🎉 Starting development server..."
echo "📍 The app will be available at http://localhost:3000"
echo ""
npm run dev
