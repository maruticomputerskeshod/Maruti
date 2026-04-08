# Maruti Computer Education Academy

Full-stack management and public-facing platform for the Maruti Computer institute.

## 📁 Project Structure

- `/backend`: FastAPI (Python) backend service.
- `/frontend`: Next.js frontend application.
- `/docker-compose.yml`: Multi-container orchestration.

## 🚀 Quick Start

1. **Environment Config**:
   Copy `.env.example` (or create your own) in both `backend` and `frontend`.

2. **Run with Docker**:
   ```bash
   docker-compose up --build
   ```

3. **Initialize Database**:
   ```bash
   docker exec -it maruti-backend-1 python seed.py
   ```

## 📖 Documentation

For a detailed architectural overview, tech stack explanation, and feature list, please see:
👉 **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)**
