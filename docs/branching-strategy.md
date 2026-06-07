# Branching Strategy

## Overview

DawaiBuddy uses a **trunk-based development** model with long-lived integration branches per domain.

## Branch Hierarchy

```
main                    ← production-ready, protected
│
└── develop             ← integration branch (all domains merge here)
    │
    ├── backend/develop ← backend feature integration
    │   └── feature/backend/xxx
    │
    └── frontend/develop ← frontend feature integration
        └── feature/frontend/xxx
```

## Branch Types

| Branch Pattern | Purpose | Base From | Merges Into |
|----------------|---------|-----------|-------------|
| `main` | Production code | — | — |
| `develop` | Integration | `main` | `main` (via PR) |
| `backend/develop` | Backend integration | `develop` | `develop` |
| `frontend/develop` | Frontend integration | `develop` | `develop` |
| `feature/backend/*` | Backend features | `backend/develop` | `backend/develop` |
| `feature/frontend/*` | Frontend features | `frontend/develop` | `frontend/develop` |
| `hotfix/*` | Production fixes | `main` | `main` + `develop` |
| `release/*` | Release preparation | `develop` | `main` + `develop` |

## Workflow

### Starting a Backend Feature

```bash
git checkout backend/develop
git pull origin backend/develop
git checkout -b feature/backend/my-feature
# ... work ...
git push -u origin feature/backend/my-feature
# Open PR: feature/backend/my-feature → backend/develop
```

### Merging to Develop

```bash
# After PR approval on backend/develop
git checkout develop
git merge --no-ff backend/develop
git push origin develop
```

### Hotfix Process

```bash
git checkout main
git checkout -b hotfix/critical-bug-fix
# ... fix ...
git checkout main && git merge --no-ff hotfix/critical-bug-fix
git checkout develop && git merge --no-ff hotfix/critical-bug-fix
git branch -d hotfix/critical-bug-fix
```

## Protection Rules (configure on GitHub)

- `main`: require PR, 2 reviewers, passing CI, no direct push
- `develop`: require PR, 1 reviewer, passing CI
- `backend/develop`: require PR, 1 reviewer, passing CI
- `frontend/develop`: require PR, 1 reviewer, passing CI

## Commit Convention

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
feat(accounts): add email verification flow
fix(prescriptions): resolve pagination offset bug
setup: django backend foundation
docs: backend architecture
```
