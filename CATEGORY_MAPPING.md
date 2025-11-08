# Category API Mapping - Tài liệu

## 📋 Tổng quan

Tài liệu này mô tả việc mapping API cho Categories (Danh mục) từ Backend (NestJS) sang Frontend (React) với hỗ trợ phân cấp **Cấp 1** (Root) và **Cấp 2** (Subcategories).

**Ngày cập nhật:** 06/11/2024  
**Trạng thái:** ✅ Hoàn thành

---

## 🔄 Thay đổi chính

### 1. Cập nhật Category Type

**File:** `WebSieuThiClient/src/types/category.type.ts`

#### Trước (Old Schema):
```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  level: number;
  order?: number;
  isActive: boolean;
  subcategories?: Category[];
}
```

#### Sau (New Schema - Khớp BE):
```typescript
interface Category {
  _id?: string; // MongoDB ObjectId
  id?: string; // Alias
  parent_id?: string | null; // Parent category ID (null = cấp 1)
  name: string;
  slug: string;
  image?: string;
  description?: string;
  is_active: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Virtual fields
  children?: Category[]; // Subcategories (cấp 2)
  level?: number; // Cấp độ: 1, 2, 3...
}
```

#### 🔑 Thay đổi quan trọng:
| Field cũ | Field mới | Giải thích |
|----------|-----------|------------|
| `parentId` | `parent_id` | Khớp BE naming |
| `subcategories` | `children` | Đổi tên field con |
| `isActive` | `is_active` | Snake_case BE convention |
| N/A | `is_deleted` | Soft delete support |

---

### 2. Helper Functions

**File:** `WebSieuThiClient/src/lib/constants.ts`

#### Placeholder Image
```typescript
export const CATEGORY_PLACEHOLDER_IMAGE =
  "https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=";
```

#### Helper Functions
```typescript
// Lấy ảnh category với fallback
getCategoryImage(category): string

// Lấy ID category (hỗ trợ _id và id)
getCategoryId(category): string

// Chuyển đổi sang CategoryNav format
toCategoryNav(category): CategoryNav

// Kiểm tra category gốc (cấp 1)
isRootCategory(category): boolean

// Build category tree từ flat list
buildCategoryTree(categories): CategoryTree[]
```

#### buildCategoryTree Function
Chuyển đổi flat list sang tree structure:

**Input (Flat List):**
```typescript
[
  { id: "1", name: "Thịt", parent_id: null },
  { id: "2", name: "Thịt heo", parent_id: "1" },
  { id: "3", name: "Thịt bò", parent_id: "1" },
  { id: "4", name: "Rau", parent_id: null }
]
```

**Output (Tree):**
```typescript
[
  {
    id: "1",
    name: "Thịt",
    children: [
      { id: "2", name: "Thịt heo", children: [] },
      { id: "3", name: "Thịt bò", children: [] }
    ]
  },
  {
    id: "4",
    name: "Rau",
    children: []
  }
]
```

---

### 3. CategoryNav Component (Horizontal Navigation)

**File:** `WebSieuThiClient/src/components/category/CategoryNav.tsx`

#### Trước (Dữ liệu mẫu):
```typescript
const defaultCategories = [
  { id: "giat-xa", name: "Giặt xả", image: "..." }
];

<CategoryNav categories={defaultCategories} />
```

#### Sau (Fetch từ API):
```typescript
useEffect(() => {
  const fetchCategories = async () => {
    // Lấy root categories (cấp 1) từ BE
    const data = await categoryService.getRootCategories();
    
    // Convert sang CategoryNav format
    const navCategories = data.map(toCategoryNav);
    setCategories(navCategories);
  };
  fetchCategories();
}, []);
```

#### Features:
- ✅ Fetch categories **cấp 1** từ API
- ✅ Loading skeleton
- ✅ Fallback sang dữ liệu mặc định nếu API failed
- ✅ Dùng `slug` thay vì `id` cho SEO
- ✅ Placeholder image cho categories chưa có ảnh

---

### 4. CategorySideBar Component (Sidebar với Subcategories)

**File:** `WebSieuThiClient/src/components/category/CategorySideBar.tsx`

#### Trước (Dữ liệu mẫu):
```typescript
const categories = [
  {
    name: "THỊT, CÁ, TRỨNG",
    href: "/thit-ca-trung",
    subCategories: [
      { name: "Thịt heo", href: "thit-heo" }
    ]
  }
];
```

#### Sau (Fetch từ API):
```typescript
useEffect(() => {
  const fetchCategories = async () => {
    // Lấy TẤT CẢ categories từ BE
    const allCategories = await categoryService.getAllCategories();
    
    // Build tree structure (cấp 1 + cấp 2)
    const tree = buildCategoryTree(allCategories);
    setCategories(tree);
  };
  fetchCategories();
}, []);
```

#### Thay đổi:
```typescript
// Trước:
category.subCategories
subCategory.href

// Sau:
category.children  // Categories cấp 2
subCategory.slug   // Dùng slug cho SEO
```

#### Features:
- ✅ Fetch **TẤT CẢ** categories từ API
- ✅ Build hierarchy tree (cấp 1 → cấp 2)
- ✅ Hiển thị categories cấp 1 với expandable subcategories
- ✅ Loading skeleton
- ✅ Dùng `slug` thay vì `href`
- ✅ Mobile và Desktop layouts

---

## 🎯 API Endpoints Sử dụng

| API | Method | Mô tả |
|-----|--------|-------|
| `GET /api/categories` | GET | Lấy **TẤT CẢ** categories (cấp 1 + cấp 2) |
| `GET /api/categories/root` | GET | Lấy chỉ categories **cấp 1** (root) |
| `GET /api/categories/:id/children` | GET | Lấy children của 1 category |
| `GET /api/categories/slug/:slug` | GET | Lấy category theo slug |

---

## 🏗️ Cấu trúc phân cấp

### Backend MongoDB Schema
```typescript
{
  _id: ObjectId,
  parent_id: ObjectId | null,  // null = cấp 1 (root)
  name: string,
  slug: string,
  image?: string
}
```

### Phân cấp:
- **Cấp 1 (Root):** `parent_id = null`
- **Cấp 2 (Subcategory):** `parent_id = <id_of_parent>`
- **Cấp 3+:** Tương tự (nếu cần mở rộng)

### Ví dụ dữ liệu:
```
THỊT, CÁ, TRỨNG, HẢI SẢN (cấp 1)
├── Thịt heo (cấp 2)
├── Thịt bò (cấp 2)
├── Thịt gà, vịt (cấp 2)
└── Cá tươi (cấp 2)

RAU, CỦ, NẤM, TRÁI CÂY (cấp 1)
├── Rau lá (cấp 2)
├── Củ, quả (cấp 2)
└── Trái cây tươi (cấp 2)
```

---

## 🖼️ Xử lý hình ảnh

### Ưu tiên hiển thị ảnh:
1. **`category.image`** - Ảnh từ database
2. **`CATEGORY_PLACEHOLDER_IMAGE`** - Placeholder (fallback)

### Placeholder Image:
```
https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg
```

**Hiển thị:** Sử dụng cho tất cả categories chưa có ảnh trong database.

---

## 📊 Component Mapping

### CategoryNav (Horizontal Bar)
| Feature | Implementation |
|---------|----------------|
| Data Source | `categoryService.getRootCategories()` |
| Categories | **Chỉ cấp 1** (Root) |
| Format | Horizontal scroll |
| Loading | Skeleton với 10 items |
| Fallback | Default categories array |

### CategorySideBar (Sidebar)
| Feature | Implementation |
|---------|----------------|
| Data Source | `categoryService.getAllCategories()` |
| Categories | **Cấp 1 + Cấp 2** (expandable) |
| Format | Vertical list với expand/collapse |
| Loading | Skeleton với 8 items |
| Tree Building | `buildCategoryTree()` |

---

## ✅ Checklist hoàn thành

- [x] Cập nhật Category type theo BE schema
- [x] Thêm placeholder image constant
- [x] Tạo helper functions (getCategoryImage, getCategoryId, buildCategoryTree, etc.)
- [x] Update CategoryNav (fetch cấp 1)
- [x] Update CategorySideBar (fetch cấp 1 + cấp 2)
- [x] Xử lý loading states
- [x] Xử lý error/fallback
- [x] Sử dụng slug thay vì id/href
- [x] Build category hierarchy tree
- [x] Test và verify (No linter errors)

---

## 🚀 Testing

### 1. Khởi động Backend
```bash
cd web-sieu-thi-server-nestjs
npm run start:dev
```

### 2. Khởi động Frontend
```bash
cd WebSieuThiClient
npm run dev
```

### 3. Kiểm tra

#### CategoryNav (Horizontal):
1. ✅ Load categories cấp 1 từ BE
2. ✅ Hiển thị đúng tên và ảnh
3. ✅ Ảnh placeholder cho categories chưa có ảnh
4. ✅ Click category navigate sang `/products?category={slug}`
5. ✅ Loading skeleton hiển thị khi đang fetch

#### CategorySideBar:
1. ✅ Load tất cả categories từ BE
2. ✅ Hiển thị categories cấp 1
3. ✅ Click expand hiển thị subcategories (cấp 2)
4. ✅ Click subcategory navigate đúng
5. ✅ Loading skeleton hiển thị
6. ✅ Mobile và Desktop layouts hoạt động

---

## 🔗 Related Files

### Frontend
- `WebSieuThiClient/src/types/category.type.ts`
- `WebSieuThiClient/src/lib/constants.ts`
- `WebSieuThiClient/src/components/category/CategoryNav.tsx`
- `WebSieuThiClient/src/components/category/CategorySideBar.tsx`
- `WebSieuThiClient/src/api/services/catalogService.ts`

### Backend
- `web-sieu-thi-server-nestjs/src/modules/catalog/schema/category.schema.ts`
- `web-sieu-thi-server-nestjs/src/modules/catalog/controller/category.controller.ts`
- `web-sieu-thi-server-nestjs/src/modules/catalog/service/category.service.ts`

---

## 📝 Notes

1. **Database chưa có ảnh:** Tất cả categories sẽ hiển thị placeholder image.

2. **MongoDB ObjectId:** BE trả về `_id`, FE convert sang string.

3. **Backward Compatibility:** Code hỗ trợ cả `id` và `_id`.

4. **Hierarchy Levels:** 
   - Hiện tại: Cấp 1 + Cấp 2
   - Có thể mở rộng: Cấp 3, 4, ... (recursive)

5. **SEO Friendly:** Dùng `slug` thay vì `id` trong URLs.

6. **buildCategoryTree():** 
   - Generic function, hỗ trợ unlimited levels
   - Tự động nest children theo parent_id

---

## 🐛 Known Issues

Không có lỗi linter.

---

## 📈 Performance

- **CategoryNav:** Chỉ load categories cấp 1 → Nhẹ
- **CategorySideBar:** Load tất cả categories 1 lần → Cache được
- **Tree Building:** O(n) complexity, nhanh với < 1000 categories

---

## 🎨 UI/UX Features

### Loading States
- Skeleton screens với animation
- Placeholder 10 items cho CategoryNav
- Placeholder 8 items cho CategorySideBar

### Error Handling
- Fallback sang default categories
- Console.error để debug
- Không crash app

### Mobile Support
- CategorySideBar có 2 layouts: Mobile & Desktop
- Mobile: Full-screen overlay
- Desktop: Fixed sidebar

---

**Author:** AI Assistant  
**Date:** 06/11/2024  
**Version:** 1.0.0

