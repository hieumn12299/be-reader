---
description: Create new NestJS module/feature. Starts interactive dialogue for module setup.
---

# /create - Create NestJS Module

$ARGUMENTS

---

## Task

This command starts a new NestJS module/feature creation process.

### Steps:

1. **Request Analysis**
   - Understand what the user wants to build
   - Ask clarifying questions if needed:
     - What type of module? (CRUD, service, guard, etc.)
     - What entities/models are involved?
     - What API endpoints are needed?

2. **Module Planning**
   - Plan NestJS module structure (module → controller → service → dto)
   - Plan Prisma schema changes if needed
   - Create implementation plan
   - Get user approval before proceeding

3. **Module Building**
   - Follow the approved plan
   - Follow NestJS conventions from `00-project-conventions.md`
   - Use i18n for all strings
   - Use Typed Express objects

4. **Verification**
   - Run `pnpm lint && pnpm typecheck && pnpm build`

---

## Usage Examples

```
/create auth module
/create story CRUD endpoints
/create notification service
/create rate-limiting guard
```

---

## Before Starting

If request is unclear, ask these questions:

- What type of module/feature?
- What entities/database tables are involved?
- What API endpoints (GET, POST, PUT, DELETE)?

Use sensible defaults, iterate later.
