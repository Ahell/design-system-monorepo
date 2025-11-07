#!/bin/bash

# Student Groups App - Server Startup Script
# This script starts both the backend proxy and frontend development server

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}Student Groups App - Starting${NC}"
echo -e "${BLUE}=================================${NC}"

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Cleanup function
cleanup() {
    echo -e "\n${RED}Shutting down servers...${NC}"
    jobs -p | xargs -r kill 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Clean up any existing processes on our ports
echo -e "${GREEN}Cleaning up existing processes...${NC}"
lsof -ti :3001 2>/dev/null | xargs kill -9 2>/dev/null || true
lsof -ti :3015 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

# Start backend
echo -e "${GREEN}Starting backend server (port 3001)...${NC}"
cd backend
node server.js > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 2

# Check if backend is running
if ! curl -s http://localhost:3001/health > /dev/null; then
    echo -e "${RED}Backend failed to start. Check backend.log${NC}"
    cat backend.log
    exit 1
fi

echo -e "${GREEN}Backend started successfully!${NC}"

# Start frontend
echo -e "${GREEN}Starting frontend server (port 3015)...${NC}"
./node_modules/.bin/vite --port 3015 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

echo -e "${BLUE}=================================${NC}"
echo -e "${GREEN}✓ Both servers are running!${NC}"
echo -e "${BLUE}=================================${NC}"
echo -e "Backend:  ${BLUE}http://localhost:3001${NC}"
echo -e "Frontend: ${BLUE}http://localhost:3015${NC}"
echo -e "${BLUE}=================================${NC}"
echo -e "Press ${RED}Ctrl+C${NC} to stop both servers"
echo -e "${BLUE}=================================${NC}"

# Wait for processes
wait
