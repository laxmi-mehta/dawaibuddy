# Branching Strategy

## Overview

DawaiBuddy uses a **trunk-based** model with **two long-lived integration branches** — one per
domain — that both merge into `main`. This keeps the branch count low while still isolating
frontend and backend work. Every branch holds the full monorepo (`backend/` + `frontend/` + `docs/`).

## Branch Hierarchy

```
main                  ← production-ready, protected
│
├── frontend          ← frontend integration (full monorepo)
│   └── frontend/<feature>
│
└── backend           ← backend integration (full monorepo)
    └── backend/<feature>
```

## Branch Types

| Branch Pattern | Purpose | Base From | Merges Into |
|----------------|---------|-----------|-------------|
| `main` | Production code (protected) | — | — |
| `frontend` | Frontend integration | `main` | `main` (via PR) |
| `backend` | Backend integration | `main` | `main` (via PR) |
| `frontend/<feature>` | Individual frontend feature | `frontend` | `frontend` |
| `backend/<feature>` | Individual backend feature | `backend` | `backend` |
| `hotfix/<name>` | Production fix | `main` | `main` (+ `frontend`/`backend`) |

## Workflow

### Starting a feature

```bash
# Frontend feature
git switch frontend && git pull
git switch -c frontend/medicine-details
# ... work ...
git push -u origin frontend/medicine-details
# Open PR: frontend/medicine-details → frontend
```

```bash
# Backend feature
git switch backend && git pull
git switch -c backend/interactions-api
# ... work ...
git push -u origin backend/interactions-api
# Open PR: backend/interactions-api → backend
```

### Promoting to main

```bash
# After PR approval on the integration branch
git switch main && git merge --no-ff frontend   # or: backend
git push origin main
# Keep the other integration branch in sync periodically:
git switch backend && git merge main && git push
```

### Hotfix

```bash
git switch main && git switch -c hotfix/critical-bug
# ... fix ...
git switch main && git merge --no-ff hotfix/critical-bug && git push origin main
git switch frontend && git merge main && git push
git switch backend && git merge main && git push
git branch -d hotfix/critical-bug
```

## Protection rules (configure on GitHub)

- `main`: require PR, ≥1 reviewer, passing CI, no direct push.
- `frontend`, `backend`: require PR, passing CI.

## Commit convention

Format: `type(scope): message`

| Type | When |
|------|------|
| `feat` | New feature |
| `fix` | Bug fix |
| `setup` | Project setup / scaffolding |
| `docs` | Documentation |
| `refactor` | Code refactor |
| `test` | Tests |
| `chore` | Maintenance |
| `ci` | CI/CD changes |

Examples:
```
feat(frontend): DawaiBuddy design system + landing page
feat(accounts): add email verification flow
fix(prescriptions): resolve pagination offset bug
docs: backend architecture
```
