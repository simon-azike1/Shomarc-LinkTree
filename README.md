# Link in Bio - Custom Link-in-Bio Web App

A mobile-first "link-in-bio" web application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Public Profile Page** (`/[username]`) - Display your links with avatar, display name, and bio
- **Admin Dashboard** (`/admin`) - Manage your profile and links (no authentication for MVP)
- **Click Tracking** - Track clicks on each link
- **Responsive Design** - Mobile-first UI built with Tailwind CSS

## Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

## Project Structure

```
/client   → React frontend (Vite)
/server   → Express backend
```

## Setup Instructions

### 1. Clone and Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env and set your MONGO_URI
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Edit .env to set your VITE_API_URL (defaults to http://localhost:5000/api)
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# Install and start MongoDB locally, or use Docker:
docker run -d -p 27017:27017 mongo
```

**Option B: MongoDB Atlas**
1. Create a free account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get your connection string
4. Update the MONGO_URI in backend/.env

### 4. Run the Application

**Start Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Start Frontend:**
```bash
cd frontend
npm run dev
# Client runs on http://localhost:5173
```

### 5. Access the App

1. Open http://localhost:5173 in your browser
2. Click "Get Started" to create your profile
3. Enter a username, display name, and bio
4. Add your links
5. Share your public page at `http://localhost:5173/yourusername`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/:username` | Get user profile |
| PUT | `/api/user/:username` | Update user profile |
| POST | `/api/user` | Create new user |
| POST | `/api/links/:username` | Add a new link |
| PUT | `/api/links/:id` | Update a link |
| DELETE | `/api/links/:id` | Delete a link |
| GET | `/api/redirect/:linkId` | Redirect and track click |

## Tech Stack

- **Frontend:** React 19, React Router, Tailwind CSS 4, Vite
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB

## License

MIT