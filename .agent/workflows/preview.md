---
description: Preview server start, stop, and status check. Local development server management.
---

# /preview - Preview Management (BE)

$ARGUMENTS

---

## Task

Manage NestJS dev server: start, stop, status check.

### Commands

```
/preview           - Show current status
/preview start     - Start server
/preview stop      - Stop server
/preview restart   - Restart
/preview check     - Health check
```

---

## Usage Examples

### Start Server
```
/preview start

Response:
🚀 Starting NestJS server...
   Port: 3001
   Type: NestJS

✅ Server ready!
   API: http://localhost:3001
   Swagger: http://localhost:3001/api/docs
```

### Status Check
```
/preview

Response:
=== Server Status ===

🌐 API: http://localhost:3001
📁 Project: be-reader
🏷️ Type: NestJS
💚 Health: OK
🗄️ Database: Connected
```

---

## Technical

```bash
pnpm run start:dev      # Start dev server
pnpm run db:studio      # Prisma Studio (port 5555)
```
