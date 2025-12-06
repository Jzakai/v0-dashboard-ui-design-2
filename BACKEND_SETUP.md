# Backend Setup Instructions

## Problem
The "Generate Scenario" feature was failing because the Next.js frontend couldn't communicate with the FastAPI backend.

## Solution
Created Next.js API routes that proxy requests to the FastAPI backend.

## Setup Steps

### 1. Start the FastAPI Backend
\`\`\`bash
cd backend
pip install -r ../requirements.txt
uvicorn main:app --reload --port 8000
\`\`\`

The backend should start on `http://localhost:8000`

### 2. Configure the Backend URL
Update `.env.local` with your backend URL (default is `http://localhost:8000`)

### 3. Start the Next.js Frontend
\`\`\`bash
pnpm install
pnpm dev
\`\`\`

The frontend should start on `http://localhost:3000`

## How It Works

1. Frontend calls `/api/scenario/generate_scenario`
2. Next.js API route proxies the request to FastAPI at `http://localhost:8000/scenario/generate_scenario`
3. FastAPI processes the request using the RAG agent
4. Response is returned to the frontend

## API Routes Created

- `/api/scenario/generate_scenario` - Generate AI scenarios
- `/api/scenario/save_scenario` - Save scenarios to database
- `/api/assignment/assign_course` - Assign courses to trainees

## Environment Variables

- `NEXT_PUBLIC_BACKEND_URL` - URL of your FastAPI backend (default: http://localhost:8000)

## Troubleshooting

If you still get errors:

1. Verify the backend is running: `curl http://localhost:8000/docs`
2. Check the backend logs for errors
3. Verify environment variables are set correctly
4. Check the browser console and Next.js terminal for error messages
