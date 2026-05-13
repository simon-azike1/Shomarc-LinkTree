# Link in Bio (MERN)

A mobile-first **link-in-bio** web application built with the **MERN stack**:
- **MongoDB** for storage
- **Express/Node.js** for the API
- **React (Vite)** for the frontend

It lets you manage a single profile (MVP-style) with multiple links, track clicks, and redirect visitors to the selected link.

## Features

- Public profile page: `/:username`
- Admin dashboard: `/admin`
- Manage profile details (name, bio, avatar)
- Manage links (title, URL, icon, message, ordering)
- Click tracking via redirect endpoint
- Deployed-friendly routing for Netlify

## Tech Stack

- **Frontend:** React 19, React Router, Vite
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB

## Project Structure

```
frontend/  -> React + Vite
backend/   -> Express + Mongoose API
```

## Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

## Setup (Local Development)

### 1) Install dependencies

**Backend**
```bash
cd backend
npm install
```

**Frontend**
```bash
cd frontend
npm install
```

### 2) Configure environment variables

**Backend** (`backend/server.js` reads these):
- `MONGO_URI` (default: `mongodb://localhost:27017/shomarc`)
- `ADMIN_PASSWORD` (required for `POST /api/admin/login`)
- `PORT` (default: `5000`)

Create a `backend/.env` file with at least:
```env
MONGO_URI=mongodb://localhost:27017/shomarc
ADMIN_PASSWORD=your-password
PORT=5000
```

**Frontend**
- If your frontend uses an API base URL env var (commonly `VITE_API_URL`), set it accordingly.

### 3) Start MongoDB

Local (example using Docker):
```bash
docker run -d -p 27017:27017 mongo
```

### 4) Run the application

**Start backend**
```bash
cd backend
npm run dev
```
Backend listens on: `http://localhost:5000`

**Start frontend**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

## API Endpoints

Base path: `/api`

### Admin

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/login` | Validate admin password (`ADMIN_PASSWORD`) |

### Profile

The backend stores a single `Profile` document and creates it automatically if missing.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/profile` | Get or initialize the profile |
| POST | `/api/profile` | Create profile (or upsert-like behavior) |
| PUT | `/api/profile` | Update profile |

### Links

Links are embedded in the profile document.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/links` | Add a new link (auto-assigns `order`) |
| PUT | `/api/links/:id` | Update a link by id |
| DELETE | `/api/links/:id` | Delete a link by id |
| PUT | `/api/links/reorder` | Reorder links by passing `{ links: [{ _id, order }, ...] }` |

### Redirect + Click Tracking

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/redirect/:id` | Increment click counter and redirect to link URL |

## Deployment (Netlify)

The repo includes `netlify.toml` configured to:
- Build the frontend with `npx vite build`
- Publish `dist`
- Route SPA paths to `index.html`
- Route `/api/*` to Netlify Functions (`/.netlify/functions/api`) with status `200`

## License

MIT

