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
6. Sau khi hoàn thành → chạy post-task checklist (xem CHECKLIST-TEMPLATES.md §2.5)
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

## 🗄️ Database Module (`src/modules/prisma/`)

### PrismaModule ✅ Đã tạo

- **Files**: `prisma.module.ts`, `prisma.service.ts`
- **Dùng bởi**: Tất cả modules (Global Module)
- **Ghi chú**: `@Global()` — tự động available không cần import. Extends PrismaClient, auto-connect/disconnect.

---

## 🛡️ Shared Guards & Decorators (`src/shared/`)

### JwtAuthGuard ✅ Đã tạo

- **File**: `src/shared/guards/jwt-auth.guard.ts`
- **Dùng bởi**: Tất cả protected routes
- **Ghi chú**: Extends `@nestjs/passport` AuthGuard('jwt'). Dùng với `@UseGuards(JwtAuthGuard)`.

### RolesGuard ✅ Đã tạo

- **File**: `src/shared/guards/roles.guard.ts`
- **Dùng bởi**: Admin routes, author-only routes
- **Kết hợp**: `@Roles(Role.AUTHOR, Role.ADMIN)` decorator
- **Ghi chú**: Dùng `Reflector` để đọc metadata. Returns `ForbiddenException` khi không đủ quyền.

### @CurrentUser() Decorator ✅ Đã tạo

- **File**: `src/shared/decorators/current-user.decorator.ts`
- **Dùng bởi**: Tất cả controller methods cần user info
- **Returns**: `JwtPayload` object (`sub`, `email`, `role`, `displayName`)
- **Usage**: `@CurrentUser() user: JwtPayload` hoặc `@CurrentUser('sub') userId: string`

### @Roles() Decorator ✅ Đã tạo

- **File**: `src/shared/decorators/roles.decorator.ts`
- **Dùng bởi**: Role-protected endpoints
- **Usage**: `@Roles(Role.ADMIN)` hoặc `@Roles(Role.AUTHOR, Role.ADMIN)`
- **Ghi chú**: Sử dụng Prisma enum `Role` thay vì string.

---

## 🔧 Shared DTOs (`src/shared/dto/`)

### PaginationDto ✅ Đã tạo

- **File**: `src/shared/dto/pagination.dto.ts`
- **Fields**: `page`, `limit`, `sortBy?`, `order?` (ASC/DESC)
- **Computed**: `get skip()` tự tính offset
- **Dùng bởi**: Story listing, và mọi endpoint có pagination
- **Ghi chú**: Có Swagger ApiPropertyOptional và class-validator decorators.

---

## 🛠️ Shared Utils (`src/shared/utils/`)

### Slug Generator ✅ Đã tạo

- **File**: `src/shared/utils/slug.util.ts`
- **Dùng bởi**: Story creation, Genre creation
- **Functions**: `generateSlug(title)`, `generateUniqueSlug(title)`
- **Ghi chú**: Hỗ trợ đầy đủ dấu tiếng Việt (á→a, đ→d, ư→u, v.v.)

### Hash Utils ✅ Đã tạo

- **File**: `src/shared/utils/hash.util.ts`
- **Dùng bởi**: Auth (password hash/verify)
- **Functions**: `hashPassword()`, `comparePassword()`
- **Provider**: bcrypt (salt rounds 12)

---

## 🌐 Shared Interceptors & Filters (`src/shared/`)

### HttpExceptionFilter ✅ Đã tạo

- **File**: `src/shared/filters/http-exception.filter.ts`
- **Dùng bởi**: Global (APP_FILTER)
- **Ghi chú**: Format tất cả errors thành `{ statusCode, message, error, details? }`. Xử lý class-validator errors thành `details` object. Log unexpected errors.

### TransformInterceptor ✅ Đã tạo

- **File**: `src/shared/interceptors/transform.interceptor.ts`
- **Dùng bởi**: Global (APP_INTERCEPTOR)
- **Interface**: `ApiResponse<T>` = `{ statusCode, message, data, meta? }`
- **Ghi chú**: Tự wrap response. Hỗ trợ pagination meta passthrough.

### LoggingInterceptor ✅ Đã tạo

- **File**: `src/shared/interceptors/logging.interceptor.ts`
- **Dùng bởi**: Global (APP_INTERCEPTOR)
- **Output**: `GET /api/stories 200 - 15ms`

---

## 🌍 i18n (`src/i18n/`)

### Đa ngôn ngữ ✅ Đã tạo

- **Files**: `src/i18n/{vi,en}/{common,auth,story}.json`
- **Dùng bởi**: Tất cả services qua `I18nService`
- **Header**: `x-lang: en` hoặc `Accept-Language: en`
- **Mặc định**: `vi` (tiếng Việt)

---

## 📝 Hướng Dẫn Cập Nhật File Này

Khi tạo module/service/util mới dùng chung:

```markdown
### [Tên Module/Service] ✅ Đã tạo / (Chưa tạo)

- **File**: `src/đường/dẫn/file.ts`
- **Dùng bởi**: [Module 1, Module 2, ...]
- **Methods**: [Liệt kê methods chính]
- **Dependencies**: [External deps nếu có]
- **Ghi chú**: [Lưu ý quan trọng]
```

---

> **Tài liệu liên quan**: [ARCHITECTURE.md](../.document/ARCHITECTURE.md) · [FOLDER-STRUCTURE.md](../.document/FOLDER-STRUCTURE.md) · [CODING-STANDARDS.md](../.document/CODING-STANDARDS.md)
