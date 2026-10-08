#!/usr/bin/env bash

# ==============================================================================
# E-Commerce DBMS System Linux & macOS Startup Script
# ==============================================================================

echo "🚀 Starting E-Commerce DBMS System on Linux / macOS..."

# Ensure script runs from root directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR" || exit 1

# Kill spawned child processes on exit (Ctrl+C)
trap 'echo -e "\n🛑 Stopping services..."; kill $(jobs -p) 2>/dev/null; exit 0' INT TERM EXIT

# 1. Start Backend Node.js Express Server
echo "📦 [1/2] Installing backend dependencies & starting API Server (Port 5000)..."
cd backend || exit 1
if [ ! -d "node_modules" ]; then
  npm install
fi
npm start &
BACKEND_PID=$!
cd "$SCRIPT_DIR" || exit 1

# Wait for backend initialization
sleep 2

# 2. Start Frontend Vite React Application
echo "💻 [2/2] Installing frontend dependencies & starting React App (Port 5173)..."
cd frontend || exit 1
if [ ! -d "node_modules" ]; then
  npm install
fi
npm run dev &
FRONTEND_PID=$!
cd "$SCRIPT_DIR" || exit 1

echo ""
echo "=============================================================================="
echo "  🎉 E-Commerce DBMS Portal is ONLINE!"
echo "  - Backend REST API: http://localhost:5000"
echo "  - Frontend Web UI:  http://localhost:5173"
echo "=============================================================================="
echo "Press Ctrl+C to terminate both servers."
echo ""

wait $BACKEND_PID $FRONTEND_PID
