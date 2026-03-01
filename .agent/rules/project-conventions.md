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
