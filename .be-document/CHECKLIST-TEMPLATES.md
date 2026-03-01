# ✅ Checklist Templates — Backend (be-reader)

> **Mục đích**: Checklist bắt buộc cho backend tasks. Bổ sung cho `.document/CHECKLIST-TEMPLATES.md`.

> **Cập nhật lần cuối**: 2026-03-01

---

## 1. ⚠️ Post-Task Verification (BẮT BUỘC)

> **Mọi task PHẢI pass checklist này trước khi giao lại cho user.**

```markdown
## ✅ Task Completion: [Tên Task]

### Lint & Format (KHÔNG BỎ QUA)

- [ ] `pnpm exec eslint src/` → **0 errors, 0 warnings**
- [ ] `pnpm exec prettier --check 'src/**/*.ts'` → **All formatted**
- [ ] `pnpm exec tsc --noEmit` → **0 errors**
- [ ] `pnpm run build` → **Exit code 0**

### Documentation Sync

- [ ] Module dùng chung mới? → Cập nhật `.be-document/REUSABLE-MODULES.md`
- [ ] Conflict với coding standards? → Update `.be-document/CODING-STANDARDS.md`
- [ ] Thay đổi chung (API format, tech stack)? → Update `.document/` (shared)

### Quality Gate

- [ ] Không có `any` trong code
- [ ] Không có `eslint-disable` vô lý (nếu có phải ghi rõ lý do)
- [ ] Đã chạy `pnpm exec prettier --write 'src/**/*.ts'`
```

---

## 2. Pre-Coding Checklist (BE)

```markdown
## Pre-Coding: [Tên Task]

- [ ] Đã đọc `.be-document/REUSABLE-MODULES.md` — đánh giá tái sử dụng
- [ ] Đã đọc `.be-document/CODING-STANDARDS.md` — nắm quy tắc BE
- [ ] Đã xác định modules/DTOs/guards cần tạo/reuse
- [ ] Đã xác định schema changes (nếu có)
- [ ] Đã liệt kê API endpoints liên quan
```

---

## 3. Database Changes Checklist

```markdown
## Database: [Tên Migration]

- [ ] Schema đã thiết kế trong `prisma/schema.prisma`
- [ ] `pnpm exec prisma generate` thành công
- [ ] `pnpm exec prisma migrate dev --name X` pass
- [ ] Seed data cập nhật (nếu cần) → `prisma/seed.ts`
- [ ] Indexes đã cân nhắc cho truy vấn phổ biến
```

---

## 4. New Module Checklist

```markdown
## New Module: [Tên Module]

### Files tạo mới

- [ ] `module.ts`, `controller.ts`, `service.ts`
- [ ] DTOs: `create-*.dto.ts`, `update-*.dto.ts`
- [ ] Import vào `app.module.ts`

### Standards

- [ ] Sử dụng `I18nService` cho messages
- [ ] Sử dụng `PaginationDto` cho listing
- [ ] Guards: `JwtAuthGuard`, `RolesGuard` (nếu cần)
- [ ] Swagger decorators trên controller

### Documentation

- [ ] Cập nhật `.be-document/REUSABLE-MODULES.md` (nếu module dùng chung)
```

---

> **Tài liệu liên quan**: [REUSABLE-MODULES.md](./REUSABLE-MODULES.md) · [CODING-STANDARDS.md](./CODING-STANDARDS.md) · [Shared CHECKLIST-TEMPLATES](../.document/CHECKLIST-TEMPLATES.md)
