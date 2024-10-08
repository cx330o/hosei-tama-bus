# FastSend

FastSend is a lightweight, self-hosted web clipboard built with React, Node.js, and SQLite. It lets you quickly share text, images, audio, video, and files across devices — no login required.

## Motivation

Transferring a snippet of text or a file between devices shouldn't require installing an app or signing into an account. FastSend solves this with a simple web interface you can access from any browser.

## Features

- Docker deployment with Caddy reverse proxy (auto HTTPS)
- Access code authentication with persistent sessions
- Paste text or images directly from clipboard
- Upload and preview images, audio, and video inline
- One-click copy and download for files
- Real-time updates via WebSocket with connection status indicator
- Automatic message expiration and cleanup
- Cursor-based pagination with skeleton loading
- Dark / Light theme toggle
- **AI-powered features:**
  - Message summarization (Groq LLM)
  - Text translation to any language
  - Image description with vision model
  - Results cached in database to avoid duplicate API calls

## Screenshot

![Screenshot](assets/screenshot.webp)

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, PrimeReact, Quill, Zustand, React Router
- Backend: Express, better-sqlite3, WebSocket, Groq SDK
- Deployment: Docker, Docker Compose, Caddy
- Testing: Jest + Supertest (backend), Vitest + Testing Library (frontend)
- CI: GitHub Actions

## Getting Started

### Prerequisites
- Node.js 20+
- Docker (for deployment)
- Groq API key (for AI features, get one at https://console.groq.com)

### Local Development

1. Clone and install dependencies
    ```shell
    git clone https://github.com/insv23/FastSend.git
    cd FastSend
    cd backend && npm install
    cd ../frontend && npm install
    ```

2. Initialize the dev database
    ```shell
    cd ../backend
    npm run db:dev
    ```

3. Configure environment
    ```shell
    # Backend - edit .env and set your GROQ_API_KEY
    cd backend
    # Frontend
    cd ../frontend
    cp .env.development.example .env.development
    ```

4. Start both servers
    ```shell
    # Terminal 1 - Backend (port 9003)
    cd backend && npm run dev

    # Terminal 2 - Frontend (port 5173)
    cd frontend && npm run dev
    ```

5. Open http://localhost:5173

### Running Tests

```shell
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Docker Deployment

1. Configure frontend production env
    ```shell
    cp frontend/.env.production.example frontend/.env.production
    # Edit with your domain or server IP
    ```

2. Create data directory
    ```shell
    mkdir ./data_bak && chmod o+w ./data_bak
    ```

3. Build and start
    ```shell
    docker compose up -d --build
    ```

## License

ISC
