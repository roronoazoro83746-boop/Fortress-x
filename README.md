# Fortress X - AI Fraud Detection Platform

Fortress X is a premium, modern cybersecurity dashboard and AI-powered fraud detection system.

## Project Structure
- `backend/`: FastAPI application handling risk orchestration, ML scoring, and transaction logging.
- `frontend/`: React + Vite + TypeScript dashboard styled with Tailwind CSS and the "Kinetic Shield" design system.

## Setup & Running

### 🐳 Via Docker Compose (Recommended)
```bash
docker-compose up --build
```
Access the Dashboard at: `http://localhost:5173`
Access the API at: `http://localhost:8000`

### 🛠️ Local Manual Start

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Features
- **Dynamic Fraud Scoring**: Real-time evaluation of transactions based on ML, IP risk, and behavioral patterns.
- **Cybersecurity Aesthetic**: Dark-themed UI with glassmorphism, neon accents, and smooth animations.
- **Full-Stack Integration**: Frontend talks to the backend using a secure API key (`fortress-secret`).
- **Sentinel Monitoring**: Live dashboard metrics and risk trend analysis.
