import type React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Camera, User as UserIcon } from "lucide-react";
import userService from "@/api/services/userService";
import type { ErrorResponse } from "@/api/types";
import { DEFAULT_AVATAR_URL } from "@/lib/constants";
import { useAuthStore } from "@/stores/authStore";

export default function AccountPage() {
  const setUser = useAuthStore((state) => state.setUser);
  const currentUser = useAuthStore((state) => state.user);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    gender: "male" as "male" | "female",
  });
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Lấy profile từ API
        const user = await userService.getProfile();
        
        // Debug: Log toàn bộ user object để xem backend trả về gì
        console.log("📌 User data from API:", user);
        console.log("📌 Avatar URL:", user.avatarUrl);
        
        setFormData({
          name: user.name || "",
          phoneNumber: user.phone || user.phoneNumber || "",
          email: user.email || "",
          gender: user.gender || "male",
        });
        
        // Set avatar nếu có (backend dùng field "avatar", không phải "avatarUrl")
        const avatarUrl = user.avatar || user.avatarUrl || DEFAULT_AVATAR_URL;
        console.log("✅ Setting avatar preview:", avatarUrl);
        setAvatarPreview(avatarUrl);
      } catch (err) {
        console.error("❌ Error loading user data:", err);
        const errorObj = err as ErrorResponse;
        setError(errorObj.response?.data?.message || "Không thể tải thông tin user");
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleGenderChange = (gender: "male" | "female") => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Vui lòng chọn file ảnh");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validation
    if (!formData.name?.trim()) {
      setError("Vui lòng nhập họ và tên");
      return;
    }
    
    if (!formData.email?.trim()) {
      setError("Vui lòng nhập email");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email không hợp lệ");
      return;
    }

    try {
      setSaving(true);
      
      // Update profile với userService
      const updatedUser = await userService.updateProfile(
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phoneNumber.trim(),
          gender: formData.gender,
        },
        avatarFile || undefined
      );
      
      // Cập nhật UI (backend trả về field "avatar")
      const newAvatar = updatedUser.avatar || updatedUser.avatarUrl;
      if (newAvatar) {
        setAvatarPreview(newAvatar);
      }
      
      // Cập nhật Zustand store để navbar cũng cập nhật
      setUser({
        ...currentUser,
        ...updatedUser,
        id: updatedUser._id || updatedUser.id || currentUser?.id || '',
      });
      
      setSuccess("Lưu thông tin thành công!");
      setAvatarFile(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorObj = err as ErrorResponse;
      const errorMessage =
        errorObj.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative" style={{ pointerEvents: 'auto' }}>
      {/* Header */}
      <div className="bg-white border-b relative z-0" style={{ pointerEvents: 'auto' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <Link 
            to="/" 
            className="mr-4 hover:bg-gray-100 p-2 rounded-full transition-colors relative z-10"
            style={{ pointerEvents: 'auto' }}
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Sửa thông tin cá nhân
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-screen bg-blue-50" style={{ pointerEvents: 'auto' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Form Card */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 bg-gray-100 flex items-center justify-center">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors"
                  title="Đổi ảnh đại diện"
                >
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Nhấn vào biểu tượng camera để đổi ảnh đại diện
              </p>
            </div>

            {/* Gender Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Giới tính
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={() => handleGenderChange("male")}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700">Anh</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={() => handleGenderChange("female")}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700">Chị</span>
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Họ và tên *
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập họ và tên"
                required
                className="w-full h-12 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
                className="w-full h-12 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập email"
                required
                className="w-full h-12 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg" role="alert">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg" role="alert">
                <p className="text-sm text-green-700 font-medium">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full h-12 text-base bg-gradient-to-r from-[#007E42] to-[#00A854] hover:from-[#006B38] hover:to-[#008F48] text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5 transform"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Đang lưu...
                </span>
              ) : (
                "Lưu chỉnh sửa"
              )}
            </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

