import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

// Tạo axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Quan trọng: Để gửi và nhận cookies từ backend
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem("accessToken");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request (chỉ trong development)
    if (import.meta.env.DEV) {
      console.log("🚀 Request:", {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response (chỉ trong development)
    if (import.meta.env.DEV) {
      console.log("✅ Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Log error
    console.error("❌ Response Error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
    });

    // Xử lý token hết hạn (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Lấy refresh token
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          // Không có refresh token, chuyển về trang login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Gọi API refresh token
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Lưu token mới
        localStorage.setItem("accessToken", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // Retry request với token mới
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token thất bại, chuyển về trang login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Xử lý các lỗi khác
    if (error.response?.status === 403) {
      console.error("🚫 Forbidden: Bạn không có quyền truy cập");
    }

    if (error.response?.status === 404) {
      console.error("🔍 Not Found: Không tìm thấy tài nguyên");
    }

    if (error.response?.status === 500) {
      console.error("💥 Server Error: Lỗi máy chủ");
    }

    return Promise.reject(error);
  }
);

export default api;
