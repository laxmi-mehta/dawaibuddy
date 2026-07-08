# Handoff — Wire DawaiBuddy frontend to live backend

## Goal
Whole website renders but is **not clickable / not live** — most pages show static mock data.
Make every screen functional against the Django API: real data in, real actions out
(load, create, update, delete). Fix/add any backend endpoints the screens need.

## Repo facts
- Monorepo: `backend/` (Django 5.1 + DRF, JWT, sqlite dev) + `frontend/` (React 19, Vite, TS, Tailwind v4, zustand, axios).
- Branch model: **main** (prod) + **frontend** + **backend**, each a full monorepo copy. Currently on `frontend` with backend code materialized in the tree.
- Run: backend `cd backend && .venv/bin/python manage.py runserver` (:8000); frontend `cd frontend && npm run dev` (:3000, `/api` proxied to :8000).
- Seed data: `python manage.py seed_demo` → 20 medicines + interactions. Test login: `a@b.com` / `secret12345`.
- API base: `/api/v1/`. Swagger: `/api/docs/`.
- **HARD RULE: never write "Claude" / "Claude Code" / "Co-Authored-By" in commits, PRs, contributors.** Git author = `laxmi <mehtalaxmi075@gmail.com>`.
- i18n (English/Hindi/Marathi) is DEFERRED to the very end — but keep user-facing strings externalizable.

## Current wiring state
Already wired: **Login, Register, Settings, Interactions** (Interactions is the reference pattern — copy its structure).
Static, need wiring:
- **DashboardPage** → `GET /api/v1/users/me/dashboard/`
- **RemindersPage** → `GET /reminders/today/`, `GET /reminders/`, `POST /reminders/`, `POST /reminders/{id}/mark-taken/`
- **MedicineDetailPage** → `GET /medicines/{id}/` (+ list already exists at `/medicines/`)
- **PrescriptionsPage** → `GET/POST /prescriptions/`
- **AssistantPage** → `POST /ai/ask/`, conversations endpoints
- **ProfilePage** → `GET/PATCH /users/me/profile/`, `GET /users/me/`
- **UploadPage / OcrReviewPage** → prescription upload + OCR (endpoint likely MISSING — build it)

## Services present (frontend/src/services)
auth, interactions, medicines, prescriptions, reminders, assistant. Reuse; add methods as needed.
Axios (`src/lib/axios.ts`) already attaches JWT + does 401 refresh-retry.

## Plan (do per-page, verify each in browser before next)
1. **Dashboard** — replace mock cards with dashboard endpoint data (today's meds, adherence, counts).
2. **Reminders** — list today + all, mark-taken toggles live, add-reminder form POSTs.
3. **Medicines list + detail** — list page clickable → detail page loads by id; add search/category filter query params to `GET /medicines/` if missing.
4. **Prescriptions** — list + create; wire Upload → create prescription; build OCR endpoint if absent (accept image, return parsed medicines for OcrReview).
5. **Assistant** — chat sends to `/ai/ask/`, renders response; persist via conversations.
6. **Profile** — load + save profile fields.
7. Loading + error + empty states on every screen (match Interactions page pattern).

## Verify
- Each screen: real data loads, actions persist (refresh page → state stuck), no console errors.
- `npm run lint` + `npm run format` clean before commit (eslint config is strict: no-unused-expressions — use if/else not ternary side-effects).
- Backend: `python manage.py check`; new endpoints appear in `/api/docs/`.

## Commit
- Frontend changes on `frontend` branch: `feat(frontend): wire <screen> to live API`.
- Backend changes on `backend` branch: `feat(backend): <endpoint>`.
- No Claude attribution. Push. Merge to main at milestone.

## Reference files
- Wired example: `frontend/src/pages/InteractionsPage.tsx`, `frontend/src/services/interactions.service.ts`.
- Types: `frontend/src/types/index.ts`. Axios: `frontend/src/lib/axios.ts`. Auth store: `frontend/src/store/auth.store.ts`.
- Backend routes: `backend/config/urls.py` + each `apps/*/urls.py`.
