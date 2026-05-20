# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack + TypeScript.

## Tech Stack

**Frontend:** React 18, TypeScript, TailwindCSS, Zustand, React Router v6, Axios  
**Backend:** Node.js, Express, TypeScript, MongoDB + Mongoose, JWT, bcryptjs  
**DevOps:** Docker, Docker Compose, Nginx

## Features

- ✅ JWT Authentication (Register / Login / Protected Routes)
- ✅ Role-Based Access Control (Admin / Sales)
- ✅ Full Leads CRUD
- ✅ Advanced Filtering: Status, Source, Search (debounced), Sort
- ✅ Backend Pagination (skip/limit, metadata)
- ✅ CSV Export
- ✅ Dark Mode
- ✅ Responsive Design
- ✅ Loading / Empty / Error States
- ✅ Form Validation (frontend + backend)
- ✅ TypeScript throughout (no `any`)

---

## Getting Started (Local — No Docker)

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) or a MongoDB Atlas URI

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
npm install
npm run dev
```

Backend runs on **http://localhost:5000**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## Getting Started (Docker)

```bash
# From project root
docker-compose up --build
```

- Frontend: http://localhost:5173  
- Backend API: http://localhost:5000  
- MongoDB: localhost:27017

---

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Get current user (🔒) |

**Register / Login body:**
```json
{ "name": "John", "email": "john@example.com", "password": "secret123", "role": "sales" }
```

### Leads (all require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leads` | List leads (with filters + pagination) |
| POST | `/leads` | Create lead |
| GET | `/leads/:id` | Get single lead |
| PUT | `/leads/:id` | Update lead |
| DELETE | `/leads/:id` | Delete lead |
| GET | `/leads/export` | Export leads as CSV |
| GET | `/leads/stats` | Get dashboard stats |

**GET /leads query params:**
- `status` — New | Contacted | Qualified | Lost
- `source` — Website | Instagram | Referral
- `search` — search by name or email
- `sort` — latest | oldest
- `page` — page number (default: 1)
- `limit` — per page (default: 10, max: 50)

**Create / Update lead body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "status": "New",
  "source": "Website",
  "notes": "Interested in enterprise plan"
}
```

### Response Format
```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [...],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## RBAC

| Action | Admin | Sales |
|--------|-------|-------|
| View all leads | ✅ | ❌ (own only) |
| Create lead | ✅ | ✅ |
| Edit any lead | ✅ | Own only |
| Delete any lead | ✅ | Own only |
| Export CSV | ✅ | ✅ (own leads) |

---

## Project Structure

```
smart-leads/
├── backend/
│   ├── src/
│   │   ├── config/         # DB connection, env config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routers
│   │   ├── types/          # TypeScript interfaces
│   │   ├── utils/          # JWT, response helpers
│   │   └── index.ts        # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # UI, leads, auth, layout
│   │   ├── hooks/          # useLeads, useDebounce
│   │   ├── pages/          # Login, Register, Dashboard
│   │   ├── services/       # API calls
│   │   ├── store/          # Zustand stores
│   │   ├── types/          # TypeScript types
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```
