# API Services Documentation

Cấu trúc API với Axios Interceptors cho dự án Web Siêu Thị.

## 📁 Cấu trúc thư mục

```
api/
├── axiosConfig.ts          # Axios instance với interceptors
├── types.ts                # TypeScript types cho API
├── index.ts                # Export tập trung
├── services/
│   ├── authService.ts      # Authentication APIs
│   ├── catalogService.ts   # Category/Catalog APIs
│   ├── productService.ts   # Product APIs
│   ├── cartService.ts      # Shopping Cart APIs
│   └── orderService.ts     # Order APIs
└── README.md
```

## 🚀 Cách sử dụng

### 1. Cấu hình môi trường

Tạo file `.env` trong thư mục `client/`:

```env
VITE_API_URL=http://localhost:3000/api
```

### 2. Import và sử dụng services

```typescript
import { authService, productService } from "@/api";

// Đăng nhập bằng email
const loginWithEmail = async () => {
  try {
    const response = await authService.loginEmail(
      "user@example.com",
      "password123"
    );

    // Token tự động được lưu và gắn vào request headers
    console.log("User:", response.user);
  } catch (error) {
    console.error("Login failed:", error);
  }
};

// Đăng nhập bằng phone (2 bước: gửi OTP -> xác thực)
const loginWithPhone = async () => {
  try {
    // Bước 1: Gửi OTP
    const result = await authService.loginPhone("0123456789");
    console.log("OTP sent:", result.userId);

    // Bước 2: Xác thực OTP
    const response = await authService.verifyLoginSms(result.userId, "123456");
    console.log("User:", response.user);
  } catch (error) {
    console.error("Login failed:", error);
  }
};

// Lấy danh sách sản phẩm theo category
const fetchProducts = async () => {
  try {
    const products = await productService.getProducts("thuc-pham-tuoi-song");
    console.log("Products:", products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
};

// Lấy sản phẩm khuyến mãi
const fetchPromotions = async () => {
  try {
    const products = await productService.getProductPromotions();
    console.log("Promotions:", products);
  } catch (error) {
    console.error("Failed to fetch promotions:", error);
  }
};
```

### 3. Sử dụng với React Hooks

```typescript
import { useState, useEffect } from "react";
import { productService } from "@/api";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts();
        setProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## 🔐 Authentication Flow

### Đăng nhập

**Email:**

```typescript
const response = await authService.loginEmail(
  "user@example.com",
  "password123"
);
// accessToken tự động được lưu vào localStorage (cookies)
```

**Phone (2 bước):**

```typescript
// Bước 1: Gửi OTP
const { userId } = await authService.loginPhone("0123456789");

// Bước 2: Xác thực OTP
const response = await authService.verifyLoginSms(userId, "123456");
// accessToken tự động được lưu vào localStorage (cookies)
```

### Auto Refresh Token

Khi `accessToken` hết hạn (401), interceptor sẽ tự động:

1. Gọi API refresh token
2. Lưu token mới
3. Retry request ban đầu
4. Nếu refresh thất bại → chuyển về trang login

### Đăng xuất

```typescript
await authService.logout();
// Token tự động bị xóa khỏi localStorage
```

## 📡 Axios Interceptors

### Request Interceptor

- Tự động gắn `Authorization: Bearer {token}` vào headers
- Log request trong development mode
- Xử lý request configuration

### Response Interceptor

- Log response trong development mode
- Tự động refresh token khi 401
- Xử lý các lỗi HTTP:
  - 401: Unauthorized → Auto refresh token
  - 403: Forbidden
  - 404: Not Found
  - 500: Server Error

## 🛠 Available Services

### 1. Auth Service

```typescript
// Đăng ký & Đăng nhập bằng Email
authService.registerEmail(email, password, name?);
authService.verifyEmail(email, code);
authService.resendEmailVerification(email);
authService.loginEmail(email, password);

// Đăng ký & Đăng nhập bằng Phone
authService.registerPhone(phone, name?);
authService.verifyPhoneCode(userId, code);
authService.loginPhone(phone);
authService.verifyLoginSms(userId, code);

// User Management
authService.getMe();
authService.logout();
authService.logoutAll();
authService.refreshToken();
authService.loginWithGoogle();
```

### 2. Product Service

```typescript
// Lấy sản phẩm (GET /products?category=slug)
productService.getProducts(categorySlug?);

// Lấy sản phẩm khuyến mãi (GET /products/promotions?category=slug)
productService.getProductPromotions(categorySlug?);

// Chi tiết sản phẩm (GET /products/:id)
productService.getProductById(id);
```

### 3. Category Service

```typescript
// GET /categories
categoryService.getAllCategories();

// GET /categories/root
categoryService.getRootCategories();

// GET /categories/:id
categoryService.getCategoryById(id);

// GET /categories/:id/children
categoryService.getCategoryChildren(id);

// GET /categories/slug/:slug
categoryService.getCategoryBySlug(slug);
```

### 4. Cart Service

```typescript
// GET /cart
cartService.getCart();

// POST /cart/:productId
cartService.addToCart(productId);

// DELETE /cart/:productId
cartService.removeFromCart(productId);
```

## 🎯 Best Practices

### 1. Error Handling

```typescript
try {
  const products = await productService.getProducts();
  // Success
} catch (error) {
  if (error.response?.status === 404) {
    // Handle not found
  } else if (error.response?.status === 500) {
    // Handle server error
  } else {
    // Handle other errors
  }
}
```

### 2. TypeScript Types

```typescript
import type { LoginRequest, Product, ApiResponse } from "@/api";

const loginData: LoginRequest = {
  phoneNumber: "0123456789",
  password: "password123",
};
```

### 3. Async/Await

Luôn sử dụng async/await thay vì .then()/.catch() để code dễ đọc hơn.

### 4. Loading States

Luôn handle loading và error states trong component.

## 🔍 Debugging

Trong development mode, tất cả requests và responses sẽ được log ra console với emojis:

- 🚀 Request
- ✅ Response Success
- ❌ Response Error

## 📝 Notes

1. **Token Management**: Tokens được tự động quản lý bởi interceptors
2. **Error Handling**: Lỗi được xử lý tập trung trong interceptors
3. **Type Safety**: Tất cả APIs đều có TypeScript types
4. **Reusability**: Services có thể tái sử dụng trong toàn bộ app
5. **Maintainability**: Cấu trúc rõ ràng, dễ maintain và mở rộng
