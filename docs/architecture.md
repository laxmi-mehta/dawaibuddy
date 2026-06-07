# System Architecture

## Overview

DawaiBuddy is an AI-powered medication management platform. The system is composed of:

- **Backend API** — Django 5 REST API (this repository, `backend/`)
- **Frontend** — To be added (`frontend/`)
- **Infrastructure** — Docker Compose (dev), cloud-native (prod)

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│              (Web App / Mobile App)                      │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS / REST + JWT
┌────────────────────────▼────────────────────────────────┐
│                    API Gateway / Nginx                    │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                  Django REST API                          │
│                                                          │
│  ┌──────────┐ ┌─────────────┐ ┌───────────┐            │
│  │ accounts │ │prescriptions│ │ medicines │            │
│  └──────────┘ └─────────────┘ └───────────┘            │
│  ┌────────────┐ ┌──────────┐ ┌────────────────┐        │
│  │interactions│ │ reminders│ │ ai_assistant   │        │
│  └────────────┘ └──────────┘ └────────────────┘        │
└──────────┬─────────────┬──────────────┬────────────────┘
           │             │              │
    ┌──────▼───┐  ┌──────▼───┐  ┌──────▼──────┐
    │PostgreSQL│  │  Redis   │  │  Celery     │
    │(primary) │  │(cache/   │  │  Workers    │
    │          │  │ queue)   │  │  (async)    │
    └──────────┘  └──────────┘  └─────────────┘
```

## Service Responsibilities

| Service | Technology | Role |
|---------|-----------|------|
| API | Django 5 + DRF | Business logic, REST endpoints |
| Auth | JWT (simplejwt) | Stateless authentication |
| Database | PostgreSQL 16 | Primary data store |
| Cache | Redis 7 | Session cache, rate limiting |
| Queue | Celery + Redis | Async tasks (reminders, AI calls) |
| Beat | Celery Beat | Scheduled tasks |
| Docs | drf-spectacular | OpenAPI 3.0 auto-generated docs |

## Data Flow: Authentication

```
Client → POST /api/v1/auth/token/ → Django
       ← { access, refresh }

Client → GET /api/v1/users/me/
         Authorization: Bearer <access>
       → JWT validation → User lookup
       ← User data
```

## Data Flow: Async Task (Reminder)

```
Client → POST /api/v1/reminders/
Django → Saves to PostgreSQL
       → Enqueues Celery task via Redis
       ← { id, scheduled_at, ... }

Celery Worker → Picks up task at scheduled_at
              → Sends notification
              → Updates Reminder.is_sent = True
```

## Environment Tiers

| Tier | Stack | Notes |
|------|-------|-------|
| Local | Docker Compose | `config.settings.local` |
| Staging | TBD | `config.settings.production` |
| Production | TBD | `config.settings.production` |
