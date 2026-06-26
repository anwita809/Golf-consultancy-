# GreenFairway Consulting — Full Stack App

Next.js 16 frontend + Django 6 backend + PostgreSQL.

## Structure

```
greenfairway/
├── frontend/   # Next.js app (unchanged UI)
├── backend/    # Django REST API
└── README.md
```

## Quick Start

### 1. PostgreSQL

Create the database:
```sql
CREATE DATABASE greenfairway;
```

### 2. Backend

```bash
cd backend
cp .env.example .env        # edit DB credentials
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API runs at http://localhost:8000

### 3. Frontend

```bash
cd frontend
cp .env.local.example .env.local
pnpm install
pnpm dev
```

App runs at http://localhost:3000

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register/ | No | Create account |
| POST | /api/auth/login/ | No | Get token |
| POST | /api/auth/logout/ | Yes | Revoke token |
| GET | /api/auth/me/ | Yes | Current user |
| GET/POST | /api/courses/ | Yes | Courses list/create |
| GET/PATCH | /api/assessments/{id}/ | Yes | Assessment detail/update |
| POST | /api/assessments/ | Yes | Create & score assessment |
| POST | /api/assessments/{id}/photos/ | Yes | Upload photo |
| GET | /api/sample-report/ | No | Sample report data |

## How It Works

1. User registers/signs in via the header modal
2. Fills out the 5-tab assessment form
3. On submit, the backend:
   - Creates or reuses the user's course
   - Saves all survey answers
   - Runs the scoring engine (`api/scoring.py`)
   - Generates personalised recommendations
4. The result card shows score, water savings, and cost saving
5. Admin panel at /admin/ for full data management

## Scoring Engine

`backend/api/scoring.py` — pure Python, no ML dependencies.
Factors: sprinkler duration, water source, irrigation schedule, sensor coverage, chemical frequency, pest control method, biodiversity count, mowing frequency, energy source.

Score range: 0–100. Recommendations are generated based on which factors scored poorly.
