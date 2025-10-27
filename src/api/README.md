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

// Đăng nhập
const login = async () => {
  try {
    const response = await authService.login({
      phoneNumber: "0123456789",
      password: "password123",
    });

    // Token tự động được lưu và gắn vào request headers
    console.log("User:", response.user);
  } catch (error) {
    console.error("Login failed:", error);
  }
};

// Lấy danh sách sản phẩm
const fetchProducts = async () => {
  try {
    const products = await productService.getProducts({
      page: 1,
      limit: 20,
      category: "thuc-pham-tuoi-song",
    });

    console.log("Products:", products.data);
  } catch (error) {
    console.error("Failed to fetch products:", error);
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

```typescript
const response = await authService.login({
  phoneNumber: "0123456789",
  password: "password123",
});

// accessToken và refreshToken tự động được lưu vào localStorage
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
authService.login(data);
authService.register(data);
authService.sendOtp(phoneNumber);
authService.verifyOtp(data);
authService.logout();
authService.getCurrentUser();
authService.changePassword(oldPassword, newPassword);
authService.forgotPassword(phoneNumber);
authService.resetPassword(phoneNumber, otp, newPassword);
```

### 2. Product Service

```typescript
productService.getProducts(params);
productService.getProductById(id);
productService.getProductBySlug(slug);
productService.searchProducts(query, params);
productService.getRelatedProducts(productId, limit);
productService.getFeaturedProducts(limit);
productService.getNewProducts(limit);
productService.getBestSellingProducts(limit);
productService.getDiscountedProducts(limit);
```

### 3. Catalog Service

```typescript
catalogService.getCategories(params);
catalogService.getCategoryById(id);
catalogService.getCategoryBySlug(slug);
catalogService.getSubcategories(parentId);
catalogService.getProductsByCategory(categoryId, params);
```

### 4. Cart Service

```typescript
cartService.getCart();
cartService.addToCart(data);
cartService.updateCartItem(productId, data);
cartService.removeFromCart(productId);
cartService.clearCart();
cartService.syncCart(items);
```

### 5. Order Service

```typescript
orderService.createOrder(data);
orderService.getMyOrders(params);
orderService.getOrderById(id);
orderService.cancelOrder(id, reason);
orderService.confirmDelivery(id);
orderService.trackOrder(id);
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
