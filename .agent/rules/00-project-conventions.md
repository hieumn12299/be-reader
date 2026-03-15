# Project Conventions — Quy tắc bắt buộc cho mọi task

## 1. Luôn đọc `.document/` trước mỗi task

**BẮT BUỘC**: Trước khi bắt đầu BẤT KỲ task nào (code, debug, review, plan...), agent PHẢI đọc các file sau theo thứ tự:

```
1. .document/ARCHITECTURE.md          — Hiểu tech stack, quyết định kiến trúc
2. .document/CODING-STANDARDS.md      — Tuân thủ quy tắc code
3. .document/FOLDER-STRUCTURE.md      — Biết đặt file ở đâu
4. .document/REUSABLE-COMPONENTS.md   — Đánh giá tái sử dụng (FE)
5. .document/WORKFLOW-GUIDE.md        — Quy trình thực hiện task
6. .document/CHECKLIST-TEMPLATES.md   — Checklist phù hợp cho task
7. .document/TESTING-GUIDE.md         — Test strategy
```

Nếu project có `.fe-document/` (FE-specific) hoặc `.be-document/` (BE-specific), đọc thêm:

```
8. .fe-document/REUSABLE-COMPONENTS.md   — Components dùng chung FE
9. .be-document/REUSABLE-MODULES.md      — Modules dùng chung BE
```

**Quy trình**:

- Đọc lướt nhanh (outline) tất cả files
- Đọc chi tiết file liên quan đến task hiện tại
- Áp dụng quy tắc trong suốt task

## 2. Multi-Machine — Hỏi OS khi terminal fail

User sử dụng 2 môi trường:

- **WSL Ubuntu** (trên Windows)
- **macOS**

**Quy tắc**:

- Khi chạy terminal command bị FAIL → KHÔNG thử đoán → HỎI user:
  > "Bạn đang sử dụng WSL Ubuntu hay macOS? Để tôi chạy command phù hợp."
- Khi đã biết OS → ghi nhớ trong suốt conversation
- Package manager: `pnpm` (cả 2 môi trường)

## 3. Cập nhật tài liệu liên quan

Khi tạo/update code → LUÔN kiểm tra và cập nhật:

| Hành động                | Files cần update                                              |
| ------------------------ | ------------------------------------------------------------- |
| Tạo component dùng chung | `REUSABLE-COMPONENTS.md` (FE) hoặc `REUSABLE-MODULES.md` (BE) |
| Thêm file/folder mới     | `FOLDER-STRUCTURE.md` (nếu khác pattern hiện tại)             |
| Thêm dependency          | `ARCHITECTURE.md` (Tech Stack section)                        |
| Thay đổi API             | Type files + Service files + docs                             |
| Hoàn thành task          | Cập nhật checklist trong report                               |

## 4. Shared Documents

Project có cấu trúc shared docs:

```
reader/
├── fe-reader/
│   ├── .document/           ← Shared docs (git submodule: reader-docs)
│   ├── .fe-document/        ← FE-specific docs
│   └── src/
└── be-reader/
    ├── .document/           ← Shared docs (git submodule: reader-docs)
    ├── .be-document/        ← BE-specific docs
    └── src/
```

- **Shared docs** (`.document/`): Kiến trúc, coding standards, workflow, checklist, testing, folder structure, roadmap
- **FE docs** (`.fe-document/`): Reusable FE components catalog
- **BE docs** (`.be-document/`): Reusable BE modules catalog

Khi sửa shared docs → nhớ commit cả submodule.

## 5. No `any` Policy

ESLint rule `@typescript-eslint/no-explicit-any` đã set thành `"error"`.
**TUYỆT ĐỐI KHÔNG** viết `any` trong code. Dùng `unknown` + type narrowing nếu cần.

## 6. i18n — KHÔNG hardcode ngôn ngữ

```typescript
// ✅ ĐÚNG — dùng I18nService
throw new ForbiddenException(this.i18n.t('common.error.forbidden'));

// ❌ SAI — hardcode tiếng Việt
throw new ForbiddenException('Bạn không có quyền thực hiện hành động này');
```

- File i18n: `src/i18n/{vi,en}/*.json`
- Mặc định: `vi`, header `x-lang: en` cho tiếng Anh
- Trong service: `this.i18n.t('module.key')`

## 7. Post-Task Checklist (BẮT BUỘC)

Sau khi hoàn thành task, PHẢI chạy và đảm bảo pass:

```bash
pnpm lint          # 0 errors
pnpm typecheck     # 0 errors
pnpm build         # exit code 0
```

**KHÔNG CHẤP NHẬN** bàn giao task khi còn lỗi.

## 8. NestJS Patterns

### Import Type cho Decorated Signatures

```typescript
// ✅ ĐÚNG — tách import type
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import type { JwtPayload } from '../../shared/decorators/current-user.decorator';

// ❌ SAI — combined import gây TS1272
import { CurrentUser, JwtPayload } from '../../shared/decorators/current-user.decorator';
```

### Typed Express Objects

```typescript
// ✅ ĐÚNG
const request = context.switchToHttp().getRequest<Request>();

// ❌ SAI — trả về any
const request = context.switchToHttp().getRequest();
```

## 9. Prisma Conventions

- Schema: `prisma/schema.prisma`, Config: `prisma.config.ts`
- Sau khi thay đổi schema → PHẢI chạy `pnpm exec prisma generate` + `pnpm run build`

## 10. Walkthrough sau mỗi task

- Sau khi hoàn thành task, tạo walkthrough hiển thị **tất cả code changes** (dùng `render_diffs`)
- Walkthrough phải bao gồm: files đã thay đổi, lý do, và kết quả kiểm tra

## 11. Lên kế hoạch BẮT BUỘC trước mọi task

- **MỌI task** (feature, fix, chore) đều PHẢI có `implementation_plan.md` trước khi code
- Plan phải gửi user review và được approve trước khi implement
- Dùng workflow tương ứng: `/feature`, `/fix`, `/chore`
- Xem chi tiết: `.agent/workflows/feature.md`, `fix.md`, `chore.md`
