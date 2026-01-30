# AI-Powered Outfit Recommendation System

An intelligent fashion recommendation engine with a Django REST API and a React (Vite + Tailwind) frontend that generates coordinated outfit suggestions from a single input product. The stack ships with Redis caching, Spectacular/Swagger API docs, and Docker Compose for one-command startup.

## Features
- Product ingestion and enrichment with color, style, season, and occasion tagging
- Recommendation service for complementary outfits
- Redis-backed caching for faster responses
- Auto-generated API docs (Swagger + ReDoc)
- Health and stats endpoints for monitoring
- Sample data seeding from `Sample_Products.xlsx`

## Architecture
- Backend: Django 4.2, Django REST Framework, Spectacular docs
- Data: PostgreSQL (preferred) or SQLite fallback via `DATABASE_URL`, Redis cache
- Frontend: React 18 + Vite + Tailwind (folder: `outfit-frontend`)
- Orchestration: Docker Compose (services: `web`, `frontend`, `redis`)

## Prerequisites
- Docker and Docker Compose (recommended path)
- Or: Python 3.11+ and Node 18+ for manual local development
- Redis (local or remote) if running without Docker
- PostgreSQL if you do not want SQLite fallback

## Environment variables
Create a `.env` in the project root for local runs (and mirror values in Compose if needed):
```dotenv
DEBUG=1
SECRET_KEY=change-me
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
REDIS_URL=redis://localhost:6379/0
CACHE_TTL=300
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```
When using Docker Compose, `docker-compose.yml` already sets sensible defaults (Postgres via `host.docker.internal`, Redis service `redis`).

## Quick start with Docker Compose (recommended)
```bash
# Start all services (API, frontend, Redis)


# Stop
docker-compose down
```
Services:
- API: http://localhost:8000
- Frontend (Vite preview): http://localhost:3000
- Health: http://localhost:8000/api/health/
- Docs: http://localhost:8000/api/docs/ (Swagger) and http://localhost:8000/api/redoc/

## Local development without Docker

### Backend
```bash
python -m venv env
source env/bin/activate
pip install -r requirements.txt

# Configure .env as above

# Run migrations and seed sample data (requires Sample_Products.xlsx in project root)
python manage.py migrate
python manage.py seed_products

# Run server
python manage.py runserver 0.0.0.0:8000
```

### Frontend (outfit-frontend)
```bash
cd outfit-frontend
npm install

# Dev server (binds to host for Docker/VM friendliness)
VITE_API_BASE_URL=http://localhost:8000/api npm run dev -- --host --port 5173

# Production build and preview
VITE_API_BASE_URL=http://localhost:8000/api npm run build
VITE_API_BASE_URL=http://localhost:8000/api npm run preview -- --host --port 4173
```

## Management commands
- `python manage.py seed_products` — imports sample products from `Sample_Products.xlsx` (project root) and rebuilds product, season, and occasion data.

## API routes (high level)
- `GET /api/health/` — readiness
- `GET /api/stats/` — system stats
- `GET /api/products/` — product listing (pagination enabled)
- `GET /api/recommendations/` — recommendations
- Docs: `GET /api/docs/` (Swagger), `GET /api/redoc/`, schema at `GET /api/schema/`

## Testing and quality
```bash
# Run tests
pytest

# Coverage
pytest --cov

# Lint/format
flake8
black .
isort .
```

## Troubleshooting
- **Postgres unreachable**: Update `DATABASE_URL` in `.env` or `docker-compose.yml` to point to your database.
- **Redis not available**: Ensure Redis is running, or set `REDIS_URL` to a reachable instance.
- **CORS errors**: Add your frontend origin to `CORS_ALLOWED_ORIGINS` (comma-separated).
- **Sample data missing**: Place `Sample_Products.xlsx` in the project root before running `seed_products`.