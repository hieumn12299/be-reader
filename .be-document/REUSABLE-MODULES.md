# 🔄 Catalog Modules & Services Dùng Chung — Backend

> **Mục đích**: Danh mục tất cả NestJS modules, services, và utils dùng chung trong backend. Agent ĐỌC file này trước khi bắt đầu task backend.

> **Cập nhật lần cuối**: 2026-03-01

---

## Quy Trình Đánh Giá Tái Sử Dụng

Khi nhận task backend mới, agent thực hiện:

```
1. Đọc file REUSABLE-MODULES.md
2. Đánh giá module/service nào reuse được
3. Nếu cần update nhỏ → update + update file này
4. Nếu cần update lớn → tạo mới + thêm vào file này
5. Sau khi hoàn thành → cập nhật file này
```

---

## 📦 Shared Services (`src/shared/services/`)

### Email Service (Chưa tạo)

- **File**: `src/shared/services/email.service.ts`
- **Dùng bởi**: Auth (verify email, reset password), Notification
- **Provider**: Resend
- **Methods**: `sendVerificationEmail()`, `sendResetPasswordEmail()`, `sendNotification()`
- **Ghi chú**: Async operation, không block API response

---

### Storage Service (Chưa tạo)

- **File**: `src/shared/services/storage.service.ts`
- **Dùng bởi**: Upload, Story (cover image), Chapter (inline images)
- **Provider**: Cloudinary
- **Methods**: `getPresignedUrl()`, `deleteImage()`, `optimizeUrl()`
- **Ghi chú**: Presigned URL pattern, validate file type/size trước khi upload

---

### Cache Service (Chưa tạo)

- **File**: `src/shared/services/cache.service.ts`
- **Dùng bởi**: Story (hot stories), Search (results cache)
- **Provider**: Upstash Redis (REST API)
- **Methods**: `get<T>()`, `set<T>()`, `del()`, `invalidatePattern()`
- **Ghi chú**: TTL mặc định 5 phút, key pattern: `module:entity:id`

---

## 🛡️ Shared Guards & Decorators (`src/shared/`)

### JwtAuthGuard (Chưa tạo)

- **File**: `src/shared/guards/jwt-auth.guard.ts`
- **Dùng bởi**: Tất cả protected routes
- **Ghi chú**: Extract JWT từ Authorization header, validate, attach user to request

### RolesGuard (Chưa tạo)

- **File**: `src/shared/guards/roles.guard.ts`
- **Dùng bởi**: Admin routes, author-only routes
- **Kết hợp**: `@Roles('AUTHOR', 'ADMIN')` decorator

### @CurrentUser() Decorator (Chưa tạo)

- **File**: `src/shared/decorators/current-user.decorator.ts`
- **Dùng bởi**: Tất cả controller methods cần user info
- **Returns**: `User` object từ request

### @Roles() Decorator (Chưa tạo)

- **File**: `src/shared/decorators/roles.decorator.ts`
- **Dùng bởi**: Role-protected endpoints
- **Usage**: `@Roles('ADMIN')` hoặc `@Roles('AUTHOR', 'ADMIN')`

---

## 🔧 Shared DTOs (`src/shared/dto/`)

### PaginationDto (Chưa tạo)

- **File**: `src/shared/dto/pagination.dto.ts`
- **Fields**: `page: number`, `limit: number`, `sortBy?: string`, `order?: 'ASC' | 'DESC'`
- **Dùng bởi**: Story listing, chapter listing, comment listing

---

## 🛠️ Shared Utils (`src/shared/utils/`)

### Slug Generator (Chưa tạo)

- **File**: `src/shared/utils/slug.util.ts`
- **Dùng bởi**: Story creation, Genre creation
- **Function**: `generateSlug(title: string): string`

### Hash Utils (Chưa tạo)

- **File**: `src/shared/utils/hash.util.ts`
- **Dùng bởi**: Auth (password hash/verify)
- **Functions**: `hashPassword()`, `comparePassword()`
- **Provider**: bcrypt (salt rounds 12)

---

## 📝 Hướng Dẫn Cập Nhật File Này

Khi tạo module/service/util mới dùng chung:

```markdown
### [Tên Module/Service]

- **File**: `src/đường/dẫn/file.ts`
- **Dùng bởi**: [Module 1, Module 2, ...]
- **Methods**: [Liệt kê methods chính]
- **Dependencies**: [External deps nếu có]
- **Ghi chú**: [Lưu ý quan trọng]
```

---

> **Tài liệu liên quan**: [ARCHITECTURE.md](../.document/ARCHITECTURE.md) · [FOLDER-STRUCTURE.md](../.document/FOLDER-STRUCTURE.md) · [CODING-STANDARDS.md](../.document/CODING-STANDARDS.md)
