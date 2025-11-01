import api from "../axiosConfig";
import type { LoginResponse, ApiResponse, User } from "../types";

/**
 * Auth Service - Xử lý các API liên quan đến authentication (khớp với NestJS backend)
 */
class AuthService {
  private readonly basePath = "/auth";

  /**
   * Đăng ký bằng email
   */
  async registerEmail(
    email: string,
    password: string,
    name?: string
  ): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      `${this.basePath}/register-email`,
      { email, password, name }
    );
    return response.data;
  }

  /**
   * Xác thực email OTP
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
   */
  async resendEmailVerification(email: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      `${this.basePath}/resend-email-verification`,
      { email }
    );
    return response.data;
  }

  /**
   * Đăng ký bằng số điện thoại
   */
  async registerPhone(
    phone: string,
    name?: string
  ): Promise<{ success: boolean; message: string; userId: string }> {
    const response = await api.post(`${this.basePath}/register-phone`, {
      phone,
      name,
    });
    return response.data;
  }

  /**
   * Xác thực phone code (sau khi register)
   */
  async verifyPhoneCode(userId: string, code: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      `${this.basePath}/verify-code`,
      { userId, code }
    );
    return response.data;
  }

  /**
   * Đăng nhập bằng email
   */
  async loginEmail(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      `${this.basePath}/login-email`,
      { email, password }
    );
    return response.data;
  }

  /**
   * Đăng nhập bằng số điện thoại
   */
  async loginPhone(phone: string): Promise<{
    success: boolean;
    message: string;
    userId: string;
  }> {
    const response = await api.post(`${this.basePath}/login-phone`, { phone });
    return response.data;
  }

  /**
   * Xác thực SMS khi login
   */
  async verifyLoginSms(userId: string, code: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      `${this.basePath}/verify-login-sms`,
      { userId, code }
    );
    return response.data;
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<{ success: boolean; accessToken: string }> {
    const response = await api.post<{ success: boolean; accessToken: string }>(
      `${this.basePath}/refresh-token`
    );
    return response.data;
  }

  /**
   * Đăng xuất
   */
  async logout(): Promise<void> {
    await api.post(`${this.basePath}/logout`);

    // Xóa token khỏi localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }

  /**
   * Đăng xuất khỏi tất cả thiết bị
   */
  async logoutAll(): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`${this.basePath}/logout-all`);

    // Xóa token khỏi localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    return response.data;
  }

  /**
   * Lấy thông tin user hiện tại
   */
  async getMe(): Promise<User> {
    const response = await api.get<{ success: boolean; user: User }>(
      `${this.basePath}/me`
    );
    return response.data.user;
  }

  /**
   * Đăng nhập với Google (mở window)
   */
  loginWithGoogle(): void {
    window.location.href = `${api.defaults.baseURL}${this.basePath}/google`;
  }
}

export default new AuthService();
