# API Versioning

## Strategy

DawaiBuddy uses **URL-path versioning** — the version prefix is part of every route.

```
/api/v1/<resource>/
/api/v2/<resource>/   ← future
```

## Current Version: v1

All v1 routes are namespaced in `config/urls.py`:

```python
path("api/v1/", include((api_v1_patterns, "v1"), namespace="v1"))
```

## Route Reference

| Prefix | App | Description |
|--------|-----|-------------|
| `/api/v1/auth/` | accounts | JWT token obtain, refresh, verify, blacklist |
| `/api/v1/users/` | accounts | User list (admin), current user profile |
| `/api/v1/prescriptions/` | prescriptions | CRUD |
| `/api/v1/medicines/` | medicines | Read-only catalog |
| `/api/v1/interactions/` | interactions | Read-only interaction data |
| `/api/v1/reminders/` | reminders | CRUD |
| `/api/v1/assistant/` | ai_assistant | Conversation CRUD |

## Deprecation Policy

1. A new version (`/api/v2/`) is introduced only for **breaking changes**
2. The previous version is maintained for **at least 6 months** after the new version ships
3. Deprecation is announced via `Deprecation` response header:
   ```
   Deprecation: true
   Sunset: Sat, 01 Jan 2026 00:00:00 GMT
   Link: </api/v2/prescriptions/>; rel="successor-version"
   ```

## Adding a New Endpoint (v1)

1. Add view + serializer + URL in the relevant app
2. Register the URL in `api_v1_patterns` in `config/urls.py`
3. drf-spectacular auto-generates the OpenAPI schema — no manual doc updates needed
4. Schema available at `/api/docs/` (Swagger UI) and `/api/redoc/`

## Introducing v2 (future)

```python
# config/urls.py
api_v2_patterns = [
    path("prescriptions/", include("apps.prescriptions.urls_v2")),
    # keep v1 routes unchanged
]

urlpatterns += [
    path("api/v2/", include((api_v2_patterns, "v2"), namespace="v2")),
]
```

## Frontend API Client

The Axios base URL is `/api/v1` (set in `src/lib/axios.ts`).

When v2 ships, update per-service where needed:
```ts
// services/prescriptions.service.ts
const BASE = "/api/v2/prescriptions";
```

All other services remain on v1 until their endpoints change.
