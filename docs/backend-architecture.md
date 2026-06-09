# Backend Architecture

## Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| Python | 3.12 | Runtime |
| Django | 5.1 | Web framework |
| Django REST Framework | 3.15 | REST API layer |
| djangorestframework-simplejwt | 5.3 | JWT auth |
| Celery | 5.4 | Async task queue |
| django-celery-beat | 2.7 | Periodic tasks |
| PostgreSQL | 16 | Primary database |
| Redis | 7 | Broker + cache + results |
| drf-spectacular | 0.27 | OpenAPI 3.0 docs |
| Gunicorn | 23 | Production WSGI server |

## Directory Layout

```
backend/
├── apps/                    # Django applications
│   ├── common/              # Shared base models, pagination, exceptions
│   ├── accounts/            # Custom User model + JWT auth endpoints
│   ├── prescriptions/       # Prescription CRUD
│   ├── medicines/           # Medicine catalog
│   ├── interactions/        # Drug interaction data
│   ├── reminders/           # Medication reminder scheduling
│   └── ai_assistant/        # AI conversation sessions
│
├── config/                  # Project-level configuration
│   ├── settings/
│   │   ├── base.py          # Shared settings (all envs)
│   │   ├── local.py         # Dev overrides (debug toolbar, etc.)
│   │   └── production.py    # Prod hardening (HSTS, Sentry, etc.)
│   ├── urls.py              # Root URL router
│   ├── celery.py            # Celery app init
│   ├── wsgi.py              # WSGI entrypoint
│   └── asgi.py              # ASGI entrypoint
│
├── requirements/
│   ├── base.txt             # Core deps
│   ├── dev.txt              # Dev + test deps
│   └── prod.txt             # Prod server deps
│
├── manage.py
├── Dockerfile               # Multi-stage (dev + prod)
└── pyproject.toml           # Ruff + Black + isort + MyPy + pytest config
```

## App Structure Convention

Each app follows this layout:

```
apps/<app>/
├── __init__.py
├── apps.py          # AppConfig
├── models.py        # Django models (extend BaseModel)
├── serializers.py   # DRF serializers
├── views.py         # DRF views / viewsets
├── urls.py          # URL patterns
├── tasks.py         # Celery tasks (when needed)
├── admin.py         # Django admin registration
├── filters.py       # django-filter FilterSet classes
├── permissions.py   # Custom DRF permissions
└── tests/
    ├── __init__.py
    ├── test_models.py
    ├── test_views.py
    └── test_serializers.py
```

## Base Models

All models inherit from `apps.common.models.BaseModel`:

```python
class BaseModel(UUIDModel, TimeStampedModel):
    # id: UUID (auto-generated, PK)
    # created_at: DateTimeField (auto_now_add)
    # updated_at: DateTimeField (auto_now)
```

## API Design Principles

- **Versioning:** URL prefix `/api/v1/`
- **Authentication:** JWT Bearer token required on all endpoints except `auth/token/`
- **Pagination:** Default 20 items/page, configurable via `?page_size=`
- **Filtering:** django-filter + DRF SearchFilter + OrderingFilter
- **Error format:**
  ```json
  { "error": { "status_code": 400, "detail": { ... } } }
  ```
- **Schema:** Auto-generated at `/api/docs/` (Swagger UI) and `/api/redoc/`

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/token/` | Obtain JWT pair |
| POST | `/api/v1/auth/token/refresh/` | Refresh access token |
| POST | `/api/v1/auth/token/verify/` | Verify token validity |
| POST | `/api/v1/auth/token/blacklist/` | Logout (blacklist token) |
| GET | `/api/v1/users/` | List users (admin) |
| GET/PUT/PATCH | `/api/v1/users/me/` | Current user profile |
| GET/POST | `/api/v1/prescriptions/` | List / create prescriptions |
| GET/PUT/PATCH/DELETE | `/api/v1/prescriptions/<id>/` | Prescription detail |
| GET | `/api/v1/medicines/` | List medicines |
| GET | `/api/v1/medicines/<id>/` | Medicine detail |
| GET | `/api/v1/interactions/` | List drug interactions |
| GET | `/api/v1/interactions/<id>/` | Interaction detail |
| GET/POST | `/api/v1/reminders/` | List / create reminders |
| GET/PUT/PATCH/DELETE | `/api/v1/reminders/<id>/` | Reminder detail |
| GET/POST | `/api/v1/assistant/conversations/` | List / start conversations |
| GET/DELETE | `/api/v1/assistant/conversations/<id>/` | Conversation detail |

## Settings Management

- Uses `django-environ` for `.env` file loading
- `DJANGO_SETTINGS_MODULE` selects the environment:
  - `config.settings.local` — development
  - `config.settings.production` — staging/production
- Never commit `.env` — only `.env.example`

## Celery Architecture

```
Django App → redis://redis:6379/0  (broker)
                     ↓
Celery Worker → executes tasks
Celery Beat  → triggers scheduled tasks
                     ↓
             redis://redis:6379/1  (result backend)
```

Periodic task schedules are stored in PostgreSQL via `django-celery-beat` and managed through Django Admin.

## Code Quality

| Tool | Config Location | Purpose |
|------|----------------|---------|
| Ruff | `pyproject.toml` | Linting + fast isort |
| Black | `pyproject.toml` | Code formatting |
| isort | `pyproject.toml` | Import ordering |
| MyPy | `pyproject.toml` | Static type checking |
| pre-commit | `.pre-commit-config.yaml` | Git hook enforcement |
| pytest | `pyproject.toml` | Test runner |

## Docker

The backend `Dockerfile` is multi-stage:

1. **base** — slim Python 3.12, system deps
2. **development** — installs `requirements/dev.txt`, mounts source volume
3. **production** — installs `requirements/prod.txt`, collectstatic, non-root user, Gunicorn

`docker-compose.yml` at repo root orchestrates:
- `django` (development target)
- `celery_worker`
- `celery_beat`
- `postgres:16-alpine`
- `redis:7-alpine`
