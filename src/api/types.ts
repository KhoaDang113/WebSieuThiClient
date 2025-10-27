// API Response Types

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    phoneNumber: string;
    name?: string;
    email?: string;
    role: string;
  };
}

export interface RegisterRequest {
  phoneNumber: string;
  password: string;
  name?: string;
  email?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  otp: string;
}

// User Types
export interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Product Types (mở rộng từ types hiện tại)
export interface ProductQuery {
  category?: string;
  subcategory?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: "price" | "name" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// Category Types
export interface CategoryQuery {
  includeSubcategories?: boolean;
}

// Cart Types
export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// Order Types
export interface CreateOrderRequest {
  items: CartItem[];
  shippingAddress: {
    fullName: string;
    phoneNumber: string;
    address: string;
    ward: string;
    district: string;
    province: string;
  };
  paymentMethod: "cod" | "online";
  note?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
  shippingAddress: any;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}
