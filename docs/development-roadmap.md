# Development Roadmap

## Phase 1 — Foundation (Complete)

### Backend Foundation ✅
- Django 5 + DRF project structure
- Custom User model (email as USERNAME_FIELD)
- JWT authentication routes
- Placeholder CRUD apps: prescriptions, medicines, interactions, reminders, ai_assistant
- PostgreSQL + Redis + Celery configuration
- Docker Compose setup
- Backend tooling: Ruff, Black, isort, MyPy, pre-commit

### Frontend Foundation ✅
- Vite + React 19 + TypeScript
- Tailwind CSS v4 + ShadCN UI primitives
- React Router 7 with protected/guest route guards
- Zustand auth store with token persistence
- Axios client with JWT interceptor + auto-refresh
- Placeholder pages for all 8 routes
- ESLint + Prettier + Husky configured

### DevOps ✅
- GitHub Actions: backend-ci, frontend-ci, lint (all)
- Simplified branching: `feature/*` → `main`

---

## Phase 2 — Auth & User Management

**Branch:** `feature/backend-auth`, `feature/frontend-auth`

- [ ] Backend: Registration endpoint with email verification
- [ ] Backend: Password reset flow
- [ ] Frontend: Login form with validation (React Hook Form + Zod)
- [ ] Frontend: Register form
- [ ] Frontend: Redirect after login, persist session

---

## Phase 3 — Prescription Management

**Branch:** `feature/backend-prescriptions`, `feature/frontend-prescriptions`

- [ ] Backend: Full Prescription model with fields (doctor, date, diagnosis)
- [ ] Backend: Prescription → PrescriptionItem line items
- [ ] Backend: File upload support (prescription images)
- [ ] Frontend: Prescription list with pagination
- [ ] Frontend: Create / edit prescription form
- [ ] Frontend: Prescription detail view

---

## Phase 4 — Medicine Catalog

**Branch:** `feature/backend-medicines`, `feature/frontend-medicines`

- [ ] Backend: Seed medicine catalog (OpenFDA or manual)
- [ ] Backend: Medicine search endpoint
- [ ] Frontend: Searchable medicine list
- [ ] Frontend: Medicine detail page with dosage info

---

## Phase 5 — Drug Interactions

**Branch:** `feature/backend-interactions`, `feature/frontend-interactions`

- [ ] Backend: Interaction data seeding
- [ ] Backend: Check-interaction endpoint (list of medicine IDs → interactions)
- [ ] Frontend: Interaction checker UI
- [ ] Frontend: Severity colour coding (low / moderate / high)

---

## Phase 6 — Reminders

**Branch:** `feature/backend-reminders`, `feature/frontend-reminders`

- [ ] Backend: Celery Beat task for sending reminders
- [ ] Backend: Push notification / email delivery
- [ ] Frontend: Reminder creation form with date-time picker
- [ ] Frontend: Reminder list with status indicators

---

## Phase 7 — AI Assistant

**Branch:** `feature/backend-ai`, `feature/frontend-ai`

- [ ] Backend: Claude API integration (Anthropic SDK)
- [ ] Backend: Context injection (user's prescriptions + medicines)
- [ ] Backend: Streaming response support
- [ ] Frontend: Chat interface with message bubbles
- [ ] Frontend: Streaming token display

---

## Phase 8 — Polish & Production Readiness

**Branch:** `feature/devops-production`

- [ ] Nginx reverse proxy configuration
- [ ] Docker multi-stage production build
- [ ] CI: deploy to staging on merge to main
- [ ] Sentry error tracking (frontend + backend)
- [ ] Rate limiting (Django + API gateway)
- [ ] HTTPS, HSTS, CSP headers
- [ ] Load testing baseline

---

## Milestone Summary

| Milestone | Target | Status |
|-----------|--------|--------|
| Foundation | Phase 1 | ✅ Done |
| User auth | Phase 2 | Pending |
| Core features | Phases 3–6 | Pending |
| AI integration | Phase 7 | Pending |
| Production | Phase 8 | Pending |
