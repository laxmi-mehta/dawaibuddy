# Frontend Architecture

## Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI library |
| TypeScript | 5.7 | Type safety |
| Vite | 6 | Build tool + dev server |
| Tailwind CSS | 4 | Utility-first styling |
| ShadCN UI | manual | Accessible component primitives |
| React Router | 7 | Client-side routing |
| Axios | 1.7 | HTTP client |
| Zustand | 5 | Global state management |

## Directory Layout

```
frontend/
├── public/                  # Static assets served as-is
└── src/
    ├── assets/              # Images, SVGs, fonts imported by components
    ├── components/
    │   ├── ui/              # ShadCN primitives (Button, Input, Card, …)
    │   ├── common/          # Shared app-level components (PageHeader, Spinner, …)
    │   └── layout/          # Chrome components (Sidebar, Header)
    ├── hooks/               # Custom React hooks (useAuth, useLocalStorage, …)
    ├── layouts/             # Route layouts (AppLayout, AuthLayout)
    ├── lib/
    │   ├── axios.ts         # Axios instance with JWT interceptors
    │   └── utils.ts         # cn() helper (clsx + tailwind-merge)
    ├── pages/               # Page-level components (one per route)
    ├── routes/              # Route definitions (ProtectedRoute, GuestRoute)
    ├── services/            # API service modules (one per domain)
    ├── store/               # Zustand stores (auth.store.ts, …)
    ├── types/               # Shared TypeScript types
    ├── utils/               # Pure utility functions (format, validate, …)
    ├── App.tsx              # Root component — mounts BrowserRouter + AppRoutes
    └── main.tsx             # React DOM entry point
```

## Routing

```
/                  → redirect to /dashboard
/login             → LoginPage         (GuestRoute → AuthLayout)
/register          → RegisterPage      (GuestRoute → AuthLayout)
/dashboard         → DashboardPage     (ProtectedRoute → AppLayout)
/prescriptions     → PrescriptionsPage (ProtectedRoute → AppLayout)
/medicines         → MedicinesPage     (ProtectedRoute → AppLayout)
/interactions      → InteractionsPage  (ProtectedRoute → AppLayout)
/reminders         → RemindersPage     (ProtectedRoute → AppLayout)
/assistant         → AssistantPage     (ProtectedRoute → AppLayout)
```

## Authentication Flow

1. User submits login form → `authService.login()` → JWT pair returned
2. Tokens stored in Zustand (`useAuthStore`) and persisted via `localStorage`
3. Every Axios request gets `Authorization: Bearer <access>` injected by interceptor
4. On 401 → interceptor calls `/auth/token/refresh/` → retries original request once
5. On second 401 → clears tokens, redirects to `/login`

## State Management

Zustand stores live in `src/store/`. One store per domain:

| Store | Purpose |
|-------|---------|
| `auth.store.ts` | user, tokens, isAuthenticated — persisted to localStorage |

Add new stores as domains are implemented. Keep stores slim — derive UI state in components, not stores.

## API Layer

All API calls go through `src/lib/axios.ts` (singleton Axios instance).

Service modules in `src/services/` are plain objects of arrow functions — no class syntax, no state.

```ts
// Pattern
export const fooService = {
  list: (): Promise<PaginatedResponse<Foo>> =>
    apiClient.get("/foo/").then((r) => r.data),
};
```

## Component Conventions

- **Pages** — no reusable logic, just compose components and call services
- **UI primitives** — follow ShadCN patterns; styled with `cn()`, forward refs, no business logic
- **Common components** — shared across pages, accept typed props
- **Hooks** — wrap store access or side-effectful logic, return typed values

## Styling

Tailwind CSS v4 via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed). CSS variables for design tokens are defined in `src/index.css` under `@layer base`.

Path alias `@/` → `src/` configured in both `vite.config.ts` and `tsconfig.app.json`.

## Build & Dev

```bash
# Dev server on :3000 (proxies /api → :8000)
npm run dev

# Production build
npm run build

# Type check only
npm run type-check

# Lint
npm run lint

# Format
npm run format
```

## Code Quality

| Tool | Config | Purpose |
|------|--------|---------|
| ESLint | `eslint.config.js` | Linting (TS + React hooks rules) |
| Prettier | `.prettierrc` | Code formatting |
| TypeScript | `tsconfig.app.json` | Strict type checking |
| Husky | `.husky/pre-commit` | Run lint-staged on commit |
| lint-staged | `package.json` | Lint + format only staged files |
