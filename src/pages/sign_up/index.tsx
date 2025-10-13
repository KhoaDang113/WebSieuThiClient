"use client";

import type React from "react";
import { useState } from "react";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    emailOrPhone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateEmailOrPhone = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const validatePassword = (value: string) => {
    const hasMinLength = value.length >= 8;
    const hasLetters = /[a-zA-Z]/.test(value);
    const hasNumbers = /[0-9]/.test(value);
    return hasMinLength && hasLetters && hasNumbers;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!validateEmailOrPhone(emailOrPhone)) {
      newErrors.emailOrPhone = "Email hoặc số điện thoại không hợp lệ";
    }

    if (!validatePassword(password)) {
      newErrors.password =
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && agreeToTerms) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
        console.log("Sign up successful:", { emailOrPhone });
        // In real app: redirect or show verification message
      }, 1500);
    }
  };

  const isFormValid =
    emailOrPhone &&
    password.length >= 8 &&
    confirmPassword &&
    password === confirmPassword &&
    agreeToTerms;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <span className="text-xs text-gray-500 text-center px-2">
                    Your Logo
                  </span>
                </div>
                <div className="h-6 w-32 rounded bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-xs text-gray-500">Brand Name</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-6 w-6" />
                <span className="text-lg font-semibold">
                  Đăng ký thành công!
                </span>
              </div>
              <p className="text-center text-gray-500 text-sm">
                Vui lòng kiểm tra email/SMS để xác thực tài khoản của bạn.
              </p>
              <Link
                to="/login"
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                <span className="text-xs text-gray-500 text-center px-2">
                  Your Logo
                </span>
              </div>
              <div className="h-6 w-32 rounded bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-500">Brand Name</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="emailOrPhone" className="sr-only">
                Email hoặc Số điện thoại
              </label>
              <input
                id="emailOrPhone"
                type="text"
                placeholder="Email hoặc Số điện thoại"
                value={emailOrPhone}
                onChange={(e) => {
                  setEmailOrPhone(e.target.value);
                  setErrors({ ...errors, emailOrPhone: undefined });
                }}
                className="h-12 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                aria-invalid={errors.emailOrPhone ? "true" : "false"}
              />
              {errors.emailOrPhone && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.emailOrPhone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: undefined });
                  }}
                  className="h-12 w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.password}
                </p>
              )}
              {!errors.password && password && (
                <p className="text-xs text-gray-500">
                  Ít nhất 8 ký tự, bao gồm chữ và số
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="sr-only">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  className="h-12 w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={
                    showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                  }
                  aria-pressed={showConfirmPassword}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 cursor-pointer leading-relaxed"
              >
                Tôi đồng ý với{" "}
                <a href="#" className="text-green-600 hover:underline">
                  Điều khoản
                </a>{" "}
                &{" "}
                <a href="#" className="text-green-600 hover:underline">
                  Chính sách
                </a>
              </label>
            </div>

            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
                <span>Đang xử lý...</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-12 text-base bg-[#0eb654] hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </button>

            <div className="text-center text-sm">
              <span className="text-gray-500">Đã có tài khoản? </span>
              <Link
                to="/login"
                className="text-green-600 hover:underline font-medium"
              >
                Đăng nhập
              </Link>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">
                  hoặc đăng nhập với
                </span>
              </div>
            </div>

            <div className="!mt-6 !flex !justify-center">
              <button
                type="button"
                className="!flex !h-10 !w-10 !items-center !justify-center !rounded-full !bg-gray-100 hover:!bg-gray-200 !transition-colors !p-0 !border-none"
                aria-label="Đăng nhập với Google"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="!h-6 !w-6"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.7 1.22 9.2 3.6l6.85-6.85C35.6 2.35 30.2 0 24 0 14.64 0 6.4 5.5 2.45 13.5l7.98 6.19C12.33 13.35 17.7 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.1 24.5c0-1.57-.14-3.07-.4-4.5H24v9h12.45c-.54 2.9-2.15 5.36-4.55 7.05l7.02 5.44C43.58 37.17 46.1 31.3 46.1 24.5z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M10.43 28.31a14.44 14.44 0 010-8.62l-7.98-6.19A23.93 23.93 0 000 24c0 3.88.93 7.55 2.45 10.5l7.98-6.19z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M24 48c6.2 0 11.4-2.05 15.2-5.61l-7.02-5.44C29.4 38.08 26.8 39 24 39c-6.3 0-11.67-3.85-13.57-9.69l-7.98 6.19C6.4 42.5 14.64 48 24 48z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
