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

// Helper function để lấy token từ localStorage hoặc cookies
const getAccessToken = (): string | null => {
  // Ưu tiên localStorage trước
  let token = localStorage.getItem("accessToken");
  
  if (!token) {
    // Nếu không có trong localStorage, thử lấy từ cookies
    const cookies = document.cookie.split(';');
    const accessTokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('accessToken=')
    );
    
    if (accessTokenCookie) {
      token = accessTokenCookie.split('=')[1];
      // Lưu vào localStorage để sử dụng lần sau
      if (token) {
        localStorage.setItem("accessToken", token);
      }
    }
  }
  
  return token;
};

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ localStorage hoặc cookies
    const token = getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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

        // Gọi API refresh token (sử dụng cookies)
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;

        // Lưu token mới
        localStorage.setItem("accessToken", accessToken);

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
