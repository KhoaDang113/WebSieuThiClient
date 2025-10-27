import api from "../axiosConfig";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  VerifyOtpRequest,
  ApiResponse,
  User,
} from "../types";

/**
 * Auth Service - Xử lý các API liên quan đến authentication
 */
class AuthService {
  private readonly basePath = "/auth";

  /**
   * Đăng nhập
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>(
      `${this.basePath}/login`,
      data
    );
    return response.data.data;
  }

  /**
   * Đăng ký tài khoản
   */
  async register(data: RegisterRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      `${this.basePath}/register`,
      data
    );
    return response.data;
  }

  /**
   * Gửi OTP
   */
  async sendOtp(phoneNumber: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(`${this.basePath}/send-otp`, {
      phoneNumber,
    });
    return response.data;
  }

  /**
   * Xác thực OTP
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      `${this.basePath}/verify-otp`,
      data
    );
    return response.data;
  }

  /**
   * Refresh token
   */
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await api.post<ApiResponse<RefreshTokenResponse>>(
      `${this.basePath}/refresh`,
      data
    );
    return response.data.data;
  }

  /**
   * Đăng xuất
   */
  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem("refreshToken");
    await api.post(`${this.basePath}/logout`, { refreshToken });

    // Xóa token khỏi localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  /**
   * Lấy thông tin user hiện tại
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`${this.basePath}/me`);
    return response.data.data;
  }

  /**
   * Đổi mật khẩu
   */
  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      `${this.basePath}/change-password`,
      { oldPassword, newPassword }
    );
    return response.data;
  }

  /**
   * Quên mật khẩu - gửi OTP
   */
  async forgotPassword(phoneNumber: string): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      `${this.basePath}/forgot-password`,
      { phoneNumber }
    );
    return response.data;
  }

  /**
   * Reset mật khẩu với OTP
   */
  async resetPassword(
    phoneNumber: string,
    otp: string,
    newPassword: string
  ): Promise<ApiResponse> {
    const response = await api.post<ApiResponse>(
      `${this.basePath}/reset-password`,
      { phoneNumber, otp, newPassword }
    );
    return response.data;
  }
}

export default new AuthService();
