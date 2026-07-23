# Kanban Task Board

A React + TypeScript kanban board built with Supabase anonymous auth and task persistence.

## Features

- Guest accounts with Supabase anonymous auth
- Four default columns: To Do, In Progress, In Review, Done
- Drag-and-drop task status updates
- Optional task description, priority, and due date
- Responsive board layout with polished UI

## Local setup

### Frontend
1. `cd frontend`
2. Copy `.env.example` to `.env`
3. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_API_URL`
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start frontend:
   ```bash
   npm run dev
   ```

### Backend
1. `cd backend`
2. Copy `.env.example` to `.env`
3. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start backend in development:
   ```bash
   npm run dev
   ```
6. Build and run production locally:
   ```bash
   npm run build
   npm start
   ```

## Deployment
### Backend (recommended: Render)
- Use `render.yaml` in the repo root to deploy the backend service.
- In Render, set the service root to `backend`.
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Add environment variables:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `FRONTEND_URL` (optional, for CORS)

### Frontend (recommended: Vercel)
- Deploy the `frontend` folder as a static site.
- Build command: `npm install && npm run build`
- Output directory: `dist`
- Add environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_API_URL` (set to your deployed backend URL)

### Alternative hosts
- Frontend: Netlify, Vercel, or any static host serving `frontend/dist`
- Backend: Render, Railway, Fly, or any Node host running `backend/dist/server.js`

## Project structure

- `frontend/` — React app source and Vite config
- `frontend/src/` — React components and styles
- `backend/` — Express API server
- `backend/server.ts` — backend routes and Supabase integration
- `.env.example` — environment variable templates
