---
description: Add or update features in existing NestJS application. Used for iterative development and refactoring.
---

# /enhance - Update Application (BE)

$ARGUMENTS

---

## Task

This command adds features or makes updates to existing NestJS application.

### Steps:

1. **Understand Current State**
   - Explore project structure with `list_dir` and `view_file`
   - Read `.be-document/REUSABLE-MODULES.md` for existing modules
   - Identify affected files

2. **Plan Changes**
   - Determine what will be added/changed
   - Check for potential conflicts
   - Plan Prisma schema migration if needed

3. **Present Plan to User** (for major changes)

   ```
   "To add rate limiting:
   - I'll create 2 new files
   - Update 3 existing files
   - Add new dependency: @nestjs/throttler

   Should I proceed?"
   ```

4. **Implement**
   - Make changes following NestJS conventions
   - Use i18n for all strings
   - Typed Express objects
   - Run quality checks

5. **Update Documentation**
   - Update REUSABLE-MODULES.md if changes affect shared modules

---

## Usage Examples

```
/enhance add rate limiting
/enhance add pagination to story endpoints
/enhance refactor auth service
/enhance add email verification
/enhance optimize database queries
```
