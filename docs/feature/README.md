# Feature Tracking

Lightweight feature tracker. Each feature gets a folder under `docs/feature/`.

## Structure

```
docs/feature/
  [feature-name]/
    readme.md      # What and why — scope, goals, constraints
    decisions.md   # Design decisions with rationale
    tasks.md       # Implementation checklist
```

## Creating a New Feature

1. Copy `_template/` to a new folder named after the feature
2. Fill in `readme.md` with scope and goals
3. Add design decisions to `decisions.md` as they arise
4. Break work into tasks in `tasks.md`

## Conventions

- Folder names: lowercase with hyphens (`dark-mode-v2`, `rss-feed`)
- Keep docs short and actionable
- Update `tasks.md` as work progresses
- Decisions are append-only — don't delete, mark as superseded if changed
