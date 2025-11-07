# Student Groups App - Quick Start Guide

## Setup

### Environment Variables

1. Create backend `.env` file in `backend/` directory:

   ```env
   CANVAS_API_URL=https://canvas.kth.se/api/v1
   PORT=3001
   ```

2. Add your Canvas API token to the backend `.env`:
   ```env
   CANVAS_ACCESS_TOKEN=your_actual_canvas_token_here
   ```

## Starting the Servers

### Easy Way (Recommended)

```bash
./start-servers.sh
```

This single command:

- Cleans up any existing processes on ports 3001 and 3015
- Starts the backend proxy (port 3001)
- Starts the frontend dev server (port 3015)
- Handles cleanup when you stop (Ctrl+C)

### Manual Way

**Terminal 1 - Backend:**

```bash
cd backend
node server.js
```

**Terminal 2 - Frontend:**

```bash
pnpm dev
```

## Accessing the App

Open your browser to: **http://localhost:3015**

## Troubleshooting

### "Port already in use"

```bash
# Kill processes on ports 3001 and 3015
lsof -ti:3001 | xargs kill -9
lsof -ti:3015 | xargs kill -9
```

### Backend not working

Check if it's running:

```bash
curl http://localhost:3001/health
```

Should respond with:

```json
{ "status": "ok", "canvas_host": "canvas.kth.se" }
```

### Test Canvas API

```bash
curl http://localhost:3001/api/canvas/courses/YOUR_COURSE_ID/groups
```

## Ports

- **Backend**: 3001 (configurable in backend/.env)
- **Frontend**: 3015 (configured in vite.config.js)
