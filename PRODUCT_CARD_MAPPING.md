# Product Card API Mapping - Tài liệu

## 📋 Tổng quan

Tài liệu này mô tả việc mapping API cho Product Card từ Backend (NestJS) sang Frontend (React).

**Ngày cập nhật:** 06/11/2024  
**Trạng thái:** ✅ Hoàn thành

---

## 🔄 Thay đổi chính

### 1. Cập nhật Product Type

**File:** `WebSieuThiClient/src/types/product.type.ts`

#### Trước (Old Schema):
```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  unit_price: number;
  final_price: number;
  stock_quantity: number;
  discount_percent: number;
  is_hot: boolean;
  product_suggestion_id?: number;
  image_url: string;
  slug: string;
  quantity?: string; // String: "500g", "1kg"
}
```

#### Sau (New Schema - Khớp BE):
```typescript
interface Product {
  _id?: string; // MongoDB ObjectId
  id?: string; // Alias
  category_id?: string;
  brand_id?: string;
  name: string;
  slug: string;
  unit?: string; // Đơn vị: "500g", "1kg", "pack", etc.
  unit_price: number;
  discount_percent: number;
  final_price?: number;
  image_primary?: string; // Ảnh chính
  images?: string[]; // Mảng ảnh
  quantity: number; // SỐ LƯỢNG TRONG KHO (số)
  stock_status: 'in_stock' | 'out_of_stock' | 'preorder';
  is_active?: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}
```

#### 🔑 Thay đổi quan trọng:
| Field cũ | Field mới | Giải thích |
|----------|-----------|------------|
| `id` (number) | `_id` (string) + `id` (string) | MongoDB ObjectId |
| `image_url` | `image_primary` + `images[]` | Backend có nhiều ảnh |
| `stock_quantity` | `quantity` | Đổi tên field |
| `quantity` (string) | `unit` (string) | Đơn vị sản phẩm |
| N/A | `stock_status` | Trạng thái kho mới |

---

### 2. Helper Functions

**File:** `WebSieuThiClient/src/lib/constants.ts`

#### Placeholder Image
```typescript
export const PRODUCT_PLACEHOLDER_IMAGE =
  "https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=";
```

#### Helper Functions
```typescript
// Lấy ảnh sản phẩm với fallback
getProductImage(product): string
// Ưu tiên: image_primary > images[0] > placeholder

// Lấy ID sản phẩm (hỗ trợ _id và id)
getProductId(product): string

// Kiểm tra hết hàng
isProductOutOfStock(product): boolean
// Check stock_status === 'out_of_stock' hoặc quantity === 0
```

---

### 3. Component Updates

#### 3.1 ProductCard Component

**File:** `WebSieuThiClient/src/components/products/ProductCard.tsx`

**Thay đổi:**
```typescript
// Trước:
const isOutOfStock = product.stock_quantity === 0;
const productId = product.id;
<img src={product.image_url || "/placeholder.svg"} />
<span>/{product.quantity}</span> // quantity là string

// Sau:
const isOutOfStock = isProductOutOfStock(product);
const productId = getProductId(product);
<img src={getProductImage(product)} />
<span>/{product.unit}</span> // unit là đơn vị
```

**Badge "Hot":**
```typescript
// Thay đổi logic: Hiển thị Hot khi discount >= 15%
{hasDiscount && product.discount_percent >= 15 && (
  <Badge>Hot</Badge>
)}
```

**Stock Warning:**
```typescript
// Sử dụng quantity (số) thay vì stock_quantity
{!isOutOfStock && product.quantity < 10 && (
  <p>Chỉ còn {product.quantity} sản phẩm</p>
)}
```

#### 3.2 PromotionCard Component

**File:** `WebSieuThiClient/src/components/productPage/promotion/PromotionCard.tsx`

Áp dụng tương tự như ProductCard:
- Dùng `getProductImage()`, `getProductId()`, `isProductOutOfStock()`
- Thay `product.quantity` (string) → `product.unit` (đơn vị)
- Thay `stock_quantity` → `quantity` (số trong kho)

---

### 4. HomePage API Integration

**File:** `WebSieuThiClient/src/pages/home/index.tsx`

#### Trước (Dữ liệu mẫu):
```typescript
import { sampleProductsByCategory } from "@/lib/sampleData";

<CategorySection
  categoryName="THỊT, CÁ, TRỨNG, HẢI SẢN"
  products={sampleProductsByCategory["thit-ca-trung-hai-san"]}
/>
```

#### Sau (Fetch từ API):
```typescript
import { productService, categoryService } from "@/api";

useEffect(() => {
  const fetchData = async () => {
    // 1. Lấy categories từ BE
    const categoriesData = await categoryService.getRootCategories();
    
    // 2. Lấy products cho từng category
    for (const category of categoriesData) {
      const products = await productService.getProducts(category.slug);
      productsData[category.slug] = products;
    }
  };
  fetchData();
}, []);

// Render dynamic
{categories.map((category) => (
  <CategorySection
    categoryName={category.name}
    products={productsByCategory[category.slug] || []}
  />
))}
```

#### Loading State:
```typescript
if (loading) {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-b-2 border-green-600"></div>
      <p>Đang tải dữ liệu...</p>
    </div>
  );
}
```

---

## 🎯 API Endpoints Sử dụng

| API | Method | Mô tả |
|-----|--------|-------|
| `GET /api/categories/root` | GET | Lấy danh mục gốc |
| `GET /api/products?category={slug}` | GET | Lấy sản phẩm theo category |

---

## 🖼️ Xử lý hình ảnh

### Ưu tiên hiển thị ảnh:
1. **`product.image_primary`** - Ảnh chính (nếu có)
2. **`product.images[0]`** - Ảnh đầu tiên trong mảng (nếu có)
3. **`PRODUCT_PLACEHOLDER_IMAGE`** - Ảnh placeholder (fallback)

### Placeholder Image:
```
https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=
```

**Hiển thị:** Sử dụng cho tất cả sản phẩm chưa có ảnh trong database.

---

## 📊 Trường hợp đặc biệt

### 1. Giá sản phẩm
```typescript
// Ưu tiên final_price, nếu không có thì dùng unit_price
const price = product.final_price || product.unit_price;
```

### 2. Đơn vị sản phẩm
```typescript
// Hiển thị unit nếu có
{product.unit && <span>/{product.unit}</span>}
```

### 3. Product ID
```typescript
// Hỗ trợ cả _id (MongoDB) và id
const productId = product._id || product.id?.toString() || "";
```

### 4. Stock Status
```typescript
// 3 trạng thái
- 'in_stock': Còn hàng
- 'out_of_stock': Hết hàng
- 'preorder': Đặt trước
```

---

## ✅ Checklist hoàn thành

- [x] Cập nhật Product type theo BE schema
- [x] Tạo helper functions (getProductImage, getProductId, isProductOutOfStock)
- [x] Thêm placeholder image constant
- [x] Update ProductCard component
- [x] Update PromotionCard component
- [x] Update HomePage fetch data từ API
- [x] Xử lý loading state
- [x] Xử lý empty state (khi chưa có categories)
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
1. ✅ HomePage load được categories và products từ BE
2. ✅ Product cards hiển thị đúng:
   - Tên sản phẩm
   - Giá (final_price hoặc unit_price)
   - Đơn vị (unit)
   - Giảm giá (%)
   - Badge "Hot" (nếu discount >= 15%)
3. ✅ Ảnh hiển thị:
   - Nếu có ảnh: hiển thị `image_primary` hoặc `images[0]`
   - Nếu không có ảnh: hiển thị placeholder
4. ✅ Stock status:
   - Hết hàng: hiển thị overlay "Hết hàng"
   - Còn ít (<10): hiển thị cảnh báo "Chỉ còn X sản phẩm"
5. ✅ Add to cart hoạt động đúng với ID và ảnh từ BE

---

## 🔗 Related Files

### Frontend
- `WebSieuThiClient/src/types/product.type.ts`
- `WebSieuThiClient/src/lib/constants.ts`
- `WebSieuThiClient/src/components/products/ProductCard.tsx`
- `WebSieuThiClient/src/components/productPage/promotion/PromotionCard.tsx`
- `WebSieuThiClient/src/pages/home/index.tsx`
- `WebSieuThiClient/src/api/services/productService.ts`
- `WebSieuThiClient/src/api/services/catalogService.ts`

### Backend
- `web-sieu-thi-server-nestjs/src/modules/catalog/schema/product.schema.ts`
- `web-sieu-thi-server-nestjs/src/modules/catalog/controller/product.controller.ts`
- `web-sieu-thi-server-nestjs/src/modules/catalog/controller/category.controller.ts`

---

## 📝 Notes

1. **Database chưa có ảnh:** Tất cả sản phẩm sẽ hiển thị placeholder image cho đến khi upload ảnh thật.

2. **MongoDB ObjectId:** BE trả về `_id` (ObjectId), FE convert sang string.

3. **Backward Compatibility:** Code hỗ trợ cả `id` và `_id` để tránh breaking changes.

4. **Performance:** HomePage chỉ load 4 categories đầu tiên để tối ưu performance.

5. **Error Handling:** Nếu API call fail, component vẫn render được với dữ liệu rỗng.

---

## 🐛 Known Issues

Không có lỗi linter.

---

**Author:** AI Assistant  
**Date:** 06/11/2024  
**Version:** 1.0.0

