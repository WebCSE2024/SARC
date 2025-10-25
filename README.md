# 🌐 SARC – Student Alumni Relations Cell | CSE Department, IIT (ISM) Dhanbad

> A full‑stack web platform connecting students, alumni, and faculty of the CSE Department, IIT (ISM) Dhanbad. It powers alumni referrals, publications, seminars, and SIG‑based discovery with a modern React frontend and Node/Express backend.

Live: https://sarc.iitism.ac.in

---

## Overview

SARC (Student Alumni Relations Cell) is the official portal for the CSE community at IIT (ISM) Dhanbad. It enables:

- Alumni to post internship/placement/research referrals
- Faculty to publish and showcase research publications
- Members to discover seminars, achievements, and departmental updates
- Browsing by Special Interest Groups (SIGs): AI/ML, Information Security, Computing Systems, Theoretical CS

The system integrates Cloudinary for media, Redis for caching, and optional RabbitMQ for news/event ingestion. The backend can serve the production frontend build directly.

---

## Tech Stack

- Frontend: React, Vite, React Router, SCSS, Three.js
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Caching: Redis (ioredis)
- Media: Cloudinary
- Messaging (optional): RabbitMQ
- Dev tooling: ESLint, Nodemon, Docker

---

## Repository Structure

```
SARC/
├── client/                  # React frontend (Vite)
│   ├── src/
│   └── package.json
├── server/                  # Node + Express backend
│   ├── src/
│   └── package.json
├── docker-compose.yml       # Local infra: MongoDB + Redis
└── README.md
```

Important: This codebase expects a sibling folder named `shared/` at the repository root that provides common types, middlewares, and axios instances (imports like `shared/axios/axiosInstance`). Ensure the `shared` workspace is present and properly configured for local development.

---

## Features

- Unified Login (CSE Society credentials and LinkedIn OAuth via external Auth service)
- Alumni Referrals (create, list, manage; admin status toggle)
- Publications (PDF upload via Cloudinary; page extraction handled on the client)
- Seminars and Achievements (browse and details)
- Comments and Likes on posts
- SIG‑based browsing and discovery
- Optimized media delivery (Cloudinary) and caching (Redis)

---

## Local Development

Prerequisites:

- Node.js 18+ and npm
- Docker (optional but recommended for MongoDB/Redis)

### 1) Start infrastructure (MongoDB + Redis)

Use the provided compose file:

- MongoDB exposed on 27017
- Redis exposed on 6379

Run: docker compose up -d from the repo root.

### 2) Configure the backend

Create `server/.env` from `server/.env.example` and set values:

- MONGODB_URL: Example (local docker) mongodb://localhost:27017/sarc
- NODE_ENV: development
- PORT: 8004 (recommended to avoid port clash with Redis UI on 8001)
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_CLOUD_API_KEY, CLOUDINARY_API_SECRET: required for uploads
- RABBITMQ_URL: optional, required only if using the news/event ingestion service

Notes:

- Redis is expected at 127.0.0.1:6379 (as configured in `server/src/connections/redisConnection.js`).
- If you also run a Redis UI on port 8001, do not set the server PORT to 8001.
- The backend mounts API routes under the base path `/sarc/v0`.

Install and start the server:

- cd server
- npm install
- npm start

The server listens on the configured PORT (defaults to 8001 if not set, but 8004 is recommended in dev).

### 3) Configure the frontend

The client runs with Vite on port 3005 by default (see `client/vite.config.js`).

Install and start:

- cd client
- npm install
- npm start

Then open http://localhost:3005.

Axios base URLs and authentication configuration are provided by the shared package (e.g., `shared/axios/axiosInstance`). Ensure those point to your running services, for example:

- SARC API: http://localhost:8004/sarc/v0
- Auth System: depends on your auth microservice URL

### 4) Production build and serving

- Build frontend: cd client && npm run build (outputs `client/dist`)
- When `NODE_ENV=production`, the backend serves static files from `../client/dist` and proxies all non‑API routes to `index.html`.

---

## API Overview

All endpoints are prefixed with `/sarc/v0`.

- Referrals: `/sarc/v0/referral/*`
- Publications: `/sarc/v0/publication/*`
- Seminars: `/sarc/v0/seminar/*`
- Achievements: `/sarc/v0/achievement/*`
- Comments: `/sarc/v0/comments/*`
- Likes: `/sarc/v0/likes/*`

Detailed endpoints, request/response examples, and auth requirements are documented in `docs/API.md`.

---

## Environment Variables (server)

- MONGODB_URL: MongoDB connection string
- NODE_ENV: development | production
- PORT: HTTP port for the server (use 8004 in dev to avoid conflicts)
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_CLOUD_API_KEY, CLOUDINARY_API_SECRET: Cloudinary credentials
- RABBITMQ_URL: Optional; required for the news service

Cloudinary is required for media/PDF uploads. If not set, related features will fail.

---

## Docker

- Infrastructure only: `docker-compose.yml` spins up MongoDB and Redis for development.
- App containers:
  - Client: `client/Dockerfile` builds and runs the Vite dev server
  - Server: `server/Dockerfile` runs the Node server (expects a valid `.env`)

Notes for containerized server:

- The current Redis client in code defaults to 127.0.0.1:6379; when running the server inside Docker, point Redis to the `redis-stack` service or use host networking as appropriate. Similarly, update `MONGODB_URL` to use `mongodb://mongo:27017/...` when resolving via Docker network.

---

## Scripts

Frontend (client):

- npm start: run Vite dev server (port 3005)
- npm run build: production build
- npm run preview: preview the production build
- npm run lint: lint the codebase

Backend (server):

- npm start: start server with nodemon

---

## Contributing

Internal development is managed by the WebCSE team. Please open an issue or contact the maintainers for access to the `shared` workspace and any private dependencies (e.g., Auth service).

---

## License

This project is maintained by the Computer Science Society, IIT (ISM) Dhanbad. All rights reserved. Unauthorized distribution or public hosting is not permitted.





