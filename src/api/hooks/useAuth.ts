import { useState } from "react";
import authService from "../services/authService";
import type { LoginRequest, RegisterRequest } from "../types";

/**
 * Hook để xử lý authentication
 */
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(data);

      // Lưu tokens vào localStorage
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));

      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Đăng nhập thất bại";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(data);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Đăng ký thất bại";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();

      // Xóa user data
      localStorage.removeItem("user");

      // Chuyển về trang chủ
      window.location.href = "/";
    } catch (err: any) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("accessToken");
  };

  return {
    login,
    register,
    logout,
    getCurrentUser,
    isAuthenticated,
    loading,
    error,
  };
};
