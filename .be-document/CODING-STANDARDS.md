# 📏 Quy Tắc Viết Code — Backend (be-reader)

> **Mục đích**: Quy ước code riêng cho backend NestJS. Bổ sung cho `.document/CODING-STANDARDS.md`.

> **Cập nhật lần cuối**: 2026-03-01

---

## 1. Package Manager

Dự án sử dụng **pnpm**. KHÔNG dùng `npm` hoặc `yarn`.

```bash
pnpm install          # Cài dependencies
pnpm add <pkg>        # Thêm dependency
pnpm add -D <pkg>     # Thêm devDependency
```

---

## 2. ESLint & Prettier

### Cấu hình

**ESLint** (`eslint.config.mjs`):

- Extends: `@typescript-eslint`, `prettier`
- `@typescript-eslint/no-explicit-any`: `"error"` ← BẮT BUỘC
- `@typescript-eslint/no-unsafe-assignment`: `"error"`
- `@typescript-eslint/no-unused-vars`: `"error"` (bỏ qua `_` prefix)
- `@typescript-eslint/no-floating-promises`: `"warn"`

**Prettier** (`.prettierrc`):

- `singleQuote`: true
- `trailingComma`: "all"

### Lệnh kiểm tra

```bash
pnpm exec eslint src/                      # ESLint → 0 errors
pnpm exec prettier --check 'src/**/*.ts'   # Prettier → All formatted
pnpm exec tsc --noEmit                     # TypeScript → 0 errors
pnpm run build                             # NestJS build → exit 0
```

### Auto-fix

```bash
pnpm exec prettier --write 'src/**/*.ts'   # Format tất cả
pnpm exec eslint src/ --fix                # Fix ESLint auto-fixable
```

---

## 3. NestJS Conventions

### Module Structure

```
src/modules/<feature>/
  ├── <feature>.module.ts
  ├── <feature>.controller.ts
  ├── <feature>.service.ts
  ├── dto/
  │   ├── create-<feature>.dto.ts
  │   └── update-<feature>.dto.ts
  └── strategies/         (nếu có)
```

### Import Type cho Decorated Signatures

Khi dùng type trong decorated method parameter (với `isolatedModules` + `emitDecoratorMetadata`):

```typescript
// ✅ ĐÚNG — tách import type
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import type { JwtPayload } from '../../shared/decorators/current-user.decorator';

// ❌ SAI — combined import gây TS1272
import { CurrentUser, JwtPayload } from '../../shared/decorators/current-user.decorator';
```

### Typed Express Objects

Luôn type `getRequest()` và `getResponse()` để tránh `no-unsafe-assignment`:

```typescript
// ✅ ĐÚNG
const request = context.switchToHttp().getRequest<Request>();
const response = context.switchToHttp().getResponse<Response>();

// ❌ SAI — trả về any
const request = context.switchToHttp().getRequest();
```

### JWT Type Safety

```typescript
// ✅ ĐÚNG — typed verify
const payload = this.jwtService.verify<{ sub: string }>(token, { secret });

// ❌ SAI — returns any
const payload = this.jwtService.verify(token, { secret });
```

---

## 4. Prisma Conventions

### Prisma v7

- Schema: `prisma/schema.prisma`
- Config: `prisma.config.ts` (chứa DATABASE_URL)
- Connection URL KHÔNG đặt trong `datasource` block

### Lệnh Prisma

```bash
pnpm exec prisma generate              # Generate types
pnpm exec prisma migrate dev --name X  # Tạo migration
pnpm exec prisma db seed               # Seed data
pnpm exec prisma studio                # GUI
```

### Sau khi thay đổi schema

```bash
pnpm exec prisma generate   # PHẢI chạy để update types
pnpm run build               # Verify build
```

---

## 5. i18n

- Mặc định: `vi` (tiếng Việt)
- Header: `x-lang: en` cho tiếng Anh
- Files: `src/i18n/{vi,en}/*.json`
- Trong service: `this.i18n.t('module.key')`

---

> **Tài liệu liên quan**: [REUSABLE-MODULES.md](./REUSABLE-MODULES.md) · [CHECKLIST-TEMPLATES.md](./CHECKLIST-TEMPLATES.md) · [Shared CODING-STANDARDS](../.document/CODING-STANDARDS.md)
