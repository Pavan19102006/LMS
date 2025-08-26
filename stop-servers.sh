#!/bin/bash
# LMS Server Stop Script

echo "🛑 Stopping LMS servers..."

# Read PIDs and kill processes
if [ -f "pids/backend.pid" ]; then
    BACKEND_PID=$(cat pids/backend.pid)
    kill $BACKEND_PID 2>/dev/null || true
    echo "Backend server stopped (PID: $BACKEND_PID)"
fi

if [ -f "pids/frontend.pid" ]; then
    FRONTEND_PID=$(cat pids/frontend.pid)
    kill $FRONTEND_PID 2>/dev/null || true
    echo "Frontend server stopped (PID: $FRONTEND_PID)"
fi

# Force kill any remaining processes on ports
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

# Clean up PID files
rm -f pids/*.pid

echo "✅ All LMS servers stopped!"
