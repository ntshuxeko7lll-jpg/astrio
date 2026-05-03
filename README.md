# Astrio - Phase 1

Astrio is a futuristic social media platform combining reels, AI-assisted content creation, chat, and a creator marketplace in a mobile-first experience.

## Phase 1: Task Management MVP

Phase 1 focuses on building the core authentication and content management system.

### Features
- User authentication (signup/login)
- Content/Reel management (CRUD)
- Basic dashboard
- Responsive mobile UI

### Tech Stack
- **Backend**: Node.js + Express + TypeScript + PostgreSQL
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Deployment**: Docker & Docker Compose

### Quick Start

```bash
docker-compose up
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api
- Database: PostgreSQL localhost:5432

### Manual Setup

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

### Project Structure
```
astrio/
├── backend/           # Node.js API
├── frontend/          # React app
├── docker-compose.yml # Docker setup
└── README.md
```
