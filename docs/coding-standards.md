# Coding Standards

## General

- All code must pass CI before merging to `main`
- No `any` types in TypeScript (ESLint warns; fix or use a narrow type cast with a comment)
- Commits must follow Conventional Commits format: `type(scope): message`
- No commented-out code committed to main

---

## Backend (Python / Django)

### Style
- Line length: 100 characters (Black + Ruff)
- Use `double quotes` for strings (Black default)
- Imports ordered: stdlib → Django → third-party → local (isort sections)

### Models
- Inherit from `apps.common.models.BaseModel` (UUID PK + timestamps)
- Always define `class Meta` with `ordering` and `verbose_name`
- Use `__str__` on every model

### Views
- Prefer `generics.*` (ListCreateAPIView, RetrieveUpdateDestroyAPIView)
- Override `get_queryset()` to scope by `request.user` on user-owned resources
- Use `perform_create()` to inject `user=request.user`

### Serializers
- Always list `read_only_fields` explicitly
- Validate in `validate_<field>()` methods, not in views

### URLs
- Use `path()`, not `re_path()` unless required
- UUID PKs in patterns: `<uuid:pk>/`
- Every URL must have a `name=`

### Tests
- Test files in `apps/<app>/tests/`
- Use `pytest-django`, `factory-boy` for fixtures
- No mocking the database

---

## Frontend (TypeScript / React)

### Style
- Prettier with `.prettierrc` — 100 chars, double quotes, ES5 trailing commas
- Named exports for components (`export default` only in pages and layouts)
- Props interfaces above the component definition

### Components
- One component per file
- File name = component name (PascalCase)
- No inline styles — Tailwind utility classes only
- Use `cn()` from `@/lib/utils` for conditional classes

### Hooks
- Prefix with `use`
- Return typed values — never `any`

### State
- Local UI state: `useState`
- Shared app state: Zustand store
- No prop drilling beyond 2 levels — lift to store

### Services
- All API calls through `src/services/`
- Never call `apiClient` directly from components or hooks
- Services return typed data — match `src/types/index.ts`

### TypeScript
- Strict mode on
- No non-null assertions (`!`) without a comment explaining why it's safe
- Prefer `type` over `interface` for unions/mapped types; `interface` for object shapes

---

## Git

### Commit Messages

```
feat(accounts): add email verification
fix(prescriptions): resolve off-by-one in pagination
setup: vite frontend scaffold
docs: add api-versioning guide
ci(frontend): add prettier check step
```

### Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Backend feature | `feature/backend-<name>` | `feature/backend-auth` |
| Frontend feature | `feature/frontend-<name>` | `feature/frontend-login` |
| DevOps / infra | `feature/devops-<name>` | `feature/devops-ci` |
| Hotfix | `hotfix/<name>` | `hotfix/jwt-expiry` |

### PR Rules
- Target: `main`
- At least 1 approval required
- CI must be green
- Squash merge preferred for feature branches
