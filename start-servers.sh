#!/bin/bash
# LMS 24/7 Server Startup Script

echo "🚀 Starting LMS servers for 24/7 operation..."

# Kill any existing processes on ports 3000 and 5001
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5001 | xargs kill -9 2>/dev/null || true

# Start backend server in background
echo "🔧 Starting backend server..."
cd "$(dirname "$0")/server"
nohup npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

# Wait for backend to start
sleep 5

# Start frontend in background
echo "🎨 Starting frontend server..."
cd "../client"
nohup npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

# Create PID file for later management
echo "$BACKEND_PID" > ../pids/backend.pid
echo "$FRONTEND_PID" > ../pids/frontend.pid

echo "✅ LMS servers started successfully!"
echo "📱 Frontend: http://localhost:3000"
echo "⚙️  Backend: http://localhost:5001"
echo "📝 Logs: Check logs/ directory"
echo "🛑 To stop: ./stop-servers.sh"
