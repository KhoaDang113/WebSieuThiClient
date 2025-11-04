import api from "../axiosConfig";
import type { LoginResponse, ApiResponse, User } from "../types";

/**
 * Auth Service - Xử lý các API liên quan đến authentication
 * Chỉ hỗ trợ đăng nhập/đăng ký bằng Email và Google
 */
class AuthService {
  private readonly basePath = "/auth";

  // ==================== ĐĂNG KÝ ====================

  /**
   * Đăng ký bằng email và password
   * POST /auth/register-email
   */
  async registerEmail(
    email: string,
    password: string,
    name?: string
  ): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      `${this.basePath}/register-email`,
      { email, password, name },
      { withCredentials: true } // Để nhận cookies
    );
    
    // Lưu token vào localStorage
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  /**
   * Xác thực email OTP (sau khi đăng ký)
   * POST /auth/verify-email
   */
  async verifyEmail(email: string, code: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      `${this.basePath}/verify-email`,
      { email, code }
    );
    return response.data;
  }

  /**
   * Gửi lại email verification
   * POST /auth/resend-email-verification
   */
  async resendEmailVerification(email: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      `${this.basePath}/resend-email-verification`,
      { email }
    );
    return response.data;
  }

  // ==================== ĐĂNG NHẬP ====================

  /**
   * Đăng nhập bằng email và password
   * POST /auth/login-email
   */
  async loginEmail(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      `${this.basePath}/login-email`,
      { email, password },
      { withCredentials: true } // Để nhận cookies
    );
    
    // Xử lý trường hợp cần verify email
    if (response.data.requiresEmailVerification) {
      return response.data;
    }
    
    // Lưu token vào localStorage
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  /**
   * Đăng nhập bằng Google (redirect)
   * Chuyển hướng đến trang Google OAuth
   */
  loginWithGoogle(): void {
    const baseURL = api.defaults.baseURL || "http://localhost:3000/api";
    window.location.href = `${baseURL}${this.basePath}/google`;
  }

  // ==================== TOKEN & SESSION ====================

  /**
   * Refresh access token
   * POST /auth/refresh-token
   * Note: Backend sử dụng cookie refreshToken
   */
  async refreshToken(): Promise<{ success: boolean; accessToken: string }> {
    const response = await api.post<{ success: boolean; accessToken: string }>(
      `${this.basePath}/refresh-token`,
      {},
      { withCredentials: true } // Gửi cookies
    );
    
    // Lưu token mới
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    
    return response.data;
  }

  /**
   * Đăng xuất khỏi thiết bị hiện tại
   * POST /auth/logout
   */
  async logout(): Promise<void> {
    try {
      await api.post(`${this.basePath}/logout`, {}, { withCredentials: true });
    } finally {
      // Luôn xóa token khỏi localStorage dù API có lỗi
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }

  /**
   * Đăng xuất khỏi tất cả thiết bị
   * POST /auth/logout-all
   * Yêu cầu: JWT token và email verified
   */
  async logoutAll(): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>(
        `${this.basePath}/logout-all`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } finally {
      // Xóa token khỏi localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  }

  // ==================== USER INFO ====================

  /**
   * Lấy thông tin user hiện tại
   * GET /auth/me
   * Yêu cầu: JWT token và email verified
   */
  async getMe(): Promise<User> {
    const response = await api.get<{ success: boolean; user: User }>(
      `${this.basePath}/me`
    );
    
    // Cập nhật localStorage
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response.data.user;
  }

  // ==================== PASSWORD MANAGEMENT ====================

  /**
   * Gửi OTP để reset password
   * POST /auth/forgot-password
   */
  async forgotPassword(email: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      `${this.basePath}/forgot-password`,
      { email }
    );
    return response.data;
  }

  /**
   * Xác thực OTP reset password
   * POST /auth/verify-reset-password
   */
  async verifyResetPasswordOTP(
    email: string,
    code: string
  ): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      `${this.basePath}/verify-reset-password`,
      { email, code },
      { withCredentials: true } // Để nhận resetToken cookie
    );
    return response.data;
  }

  /**
   * Reset password với token
   * POST /auth/reset-password
   */
  async resetPassword(
    email: string,
    newPassword: string,
    resetToken?: string
  ): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      `${this.basePath}/reset-password`,
      { email, newPassword, resetToken },
      { withCredentials: true } // Gửi resetToken từ cookie
    );
    return response.data;
  }

  /**
   * Đổi password (khi đã đăng nhập)
   * PUT /auth/change-password
   * Yêu cầu: JWT token
   */
  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<ApiResponse> {
    const response = await api.put<ApiResponse>(
      `${this.basePath}/change-password`,
      { oldPassword, newPassword }
    );
    return response.data;
  }

  // ==================== HELPERS ====================

  /**
   * Kiểm tra user đã đăng nhập chưa
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  }

  /**
   * Lấy user từ localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }

  /**
   * Clear tất cả auth data
   */
  clearAuthData(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
}

export default new AuthService();
