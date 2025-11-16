import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "./CustomSelect";
import { addressService } from "@/api";
import type { Address, CreateAddressDto } from "@/api/types";
import { useAuthStore } from "@/stores/authStore";
import { useNotification } from "@/hooks/useNotification";

interface Province {
  code: string;
  name: string;
}

interface Ward {
  code: string;
  name: string;
}

interface ProvinceApiResponse {
  code: string | number;
  name: string;
}

interface WardApiResponse {
  code: string | number;
  name: string;
}

interface ProvinceDetailApiResponse {
  wards?: WardApiResponse[];
  districts?: {
    wards?: WardApiResponse[];
  }[];
}

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingAddress?: Address | null;
}

// Helper function để tạo timeout cho fetch
const createTimeoutSignal = (timeoutMs: number): AbortSignal => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
};

export function AddressFormModal({
  isOpen,
  onClose,
  onSave,
  editingAddress,
}: AddressFormModalProps) {
  const { user: currentUser } = useAuthStore();
  const { showNotification } = useNotification();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchProvinces = useCallback(async () => {
    try {
      setLoading(true);
      // API v2 - Danh sách tỉnh thành sau sát nhập
      const response = await fetch("https://provinces.open-api.vn/api/v2/", {
        signal: createTimeoutSignal(10000),
      });

      if (response.ok) {
        const data = (await response.json()) as ProvinceApiResponse[];
        if (Array.isArray(data)) {
          // Map data từ v2 format sang format cũ
          const mappedProvinces = data.map((p: ProvinceApiResponse) => ({
            code: p.code.toString(), // Convert code to string
            name: p.name,
          }));
          setProvinces(mappedProvinces);
        }
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
      showNotification({
        type: "error",
        title: "Lỗi",
        message: "Không thể tải danh sách tỉnh/thành phố. Vui lòng thử lại sau.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const fetchWards = useCallback(async (provinceCode: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`,
        {
          signal: createTimeoutSignal(10000),
        }
      );

      if (response.ok) {
        const data = (await response.json()) as ProvinceDetailApiResponse;
        
        const allWards: Ward[] = [];
        
        if (data.wards && Array.isArray(data.wards)) {
          data.wards.forEach((ward: WardApiResponse) => {
            allWards.push({
              code: ward.code.toString(),
              name: ward.name,
            });
          });
        } else if (data.districts && Array.isArray(data.districts)) {
          // Fallback: nếu có districts (API khác)
          data.districts.forEach((district) => {
            if (district.wards && Array.isArray(district.wards)) {
              district.wards.forEach((ward: WardApiResponse) => {
                allWards.push({
                  code: ward.code.toString(),
                  name: ward.name,
                });
              });
            }
          });
        }
        
        setWards(allWards);
      }
    } catch {
      setWards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchProvinces();
    }
  }, [isOpen, fetchProvinces]);

  useEffect(() => {
    if (isOpen && editingAddress) {
      setFullName(editingAddress.full_name);
      setPhone(editingAddress.phone);
      setStreet(editingAddress.address);
      setIsDefault(editingAddress.is_default);

      const provinceObj = provinces.find(p => p.name === editingAddress.city);
      if (provinceObj) {
        setSelectedProvince(provinceObj.code);
      } else {
        setSelectedProvince("");
      }
      
      setSelectedWard(editingAddress.ward);
    } else if (isOpen) {
      setSelectedProvince("");
      setSelectedWard("");
      setStreet("");
      setIsDefault(false);
      
      if (currentUser) {
        setFullName(currentUser.name || "");
        setPhone(currentUser.phone || currentUser.phoneNumber || "");
      } else {
        setFullName("");
        setPhone("");
      }
    }
  }, [isOpen, editingAddress, provinces, currentUser]);

  useEffect(() => {
    if (selectedProvince && !editingAddress) {
      fetchWards(selectedProvince);
      setSelectedWard("");
    }
  }, [selectedProvince, editingAddress, fetchWards]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showNotification({
        type: "warning",
        title: "Thông báo",
        message: "Vui lòng nhập họ tên người nhận",
        duration: 3000,
      });
      return;
    }

    if (!phone.trim()) {
      showNotification({
        type: "warning",
        title: "Thông báo",
        message: "Vui lòng nhập số điện thoại",
        duration: 3000,
      });
      return;
    }

    if (!addressService.validatePhone(phone)) {
      showNotification({
        type: "warning",
        title: "Thông báo",
        message: "Số điện thoại không hợp lệ",
        duration: 3000,
      });
      return;
    }

    if (!selectedProvince || !selectedWard) {
      showNotification({
        type: "warning",
        title: "Thông báo",
        message: "Vui lòng chọn đầy đủ Tỉnh/Thành phố và Phường/Xã",
        duration: 3000,
      });
      return;
    }

    if (!street.trim()) {
      showNotification({
        type: "warning",
        title: "Thông báo",
        message: "Vui lòng nhập số nhà, tên đường",
        duration: 3000,
      });
      return;
    }

    try {
      setSubmitting(true);

      const provinceName =
        provinces.find((p) => p.code === selectedProvince)?.name || selectedProvince;
      const wardName =
        wards.find((w) => w.code === selectedWard)?.name || selectedWard;

      const addressData: CreateAddressDto = {
        full_name: fullName.trim(),
        phone: phone.trim(),
        address: street.trim(),
        ward: wardName,
        // Không gửi district - mô hình 2 cấp: Chỉ có Tỉnh và Xã
        city: provinceName,
        is_default: isDefault,
        is_active: true,
      };

      if (editingAddress) {
        await addressService.updateAddress(editingAddress._id, addressData);
        showNotification({
          type: "success",
          title: "Thành công",
          message: "Cập nhật địa chỉ thành công!",
          duration: 3000,
        });
      } else {
        await addressService.createAddress(addressData);
        showNotification({
          type: "success",
          title: "Thành công",
          message: "Thêm địa chỉ mới thành công!",
          duration: 3000,
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
      const errorMessage = 
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
        "Có lỗi xảy ra. Vui lòng thử lại.";
      showNotification({
        type: "error",
        title: "Lỗi",
        message: errorMessage,
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-green-50 to-green-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={submitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto px-6 py-6 flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Info message */}
            <p className="text-sm text-gray-600 mb-4">
              Thông tin vị trí giúp Bách hoá XANH giao hàng đúng giờ và tính phí giao chính xác hơn.
            </p>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ tên người nhận <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ tên người nhận"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                required
                disabled={submitting}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                required
                disabled={submitting}
              />
            </div>

            {/* Province dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tỉnh/Thành phố <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                value={selectedProvince}
                onChange={setSelectedProvince}
                options={provinces.map((p) => ({ value: p.code, label: p.name }))}
                placeholder="Chọn Tỉnh/Thành phố"
                required
                disabled={submitting}
              />
            </div>

            {/* Ward dropdown - Mô hình 2 cấp: Phường/Xã trực thuộc Tỉnh */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phường/Xã <span className="text-red-500">*</span>
                {wards.length > 0 && (
                  <span className="text-xs text-gray-500 ml-2">({wards.length} phường/xã)</span>
                )}
              </label>
              <CustomSelect
                value={selectedWard}
                onChange={setSelectedWard}
                options={wards.map((w) => ({ value: w.code, label: w.name }))}
                placeholder={wards.length === 0 ? "Vui lòng chọn Tỉnh/Thành phố trước" : "Chọn Phường/Xã"}
                disabled={!selectedProvince || loading || submitting}
                required
                openUp={true}
              />
              {wards.length === 0 && selectedProvince && !loading && (
                <p className="text-xs text-red-500 mt-1">
                  ⚠️ Không tải được danh sách. Vui lòng kiểm tra console (F12)
                </p>
              )}
            </div>

            {/* Street address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số nhà, tên đường <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Nhập số nhà, tên đường"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                required
                disabled={submitting}
              />
            </div>

            {/* Set as default checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_default"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                disabled={submitting}
              />
              <label
                htmlFor="is_default"
                className="text-sm text-gray-700 cursor-pointer"
              >
                Đặt làm địa chỉ mặc định
              </label>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 mt-4 disabled:bg-gray-400"
              disabled={submitting || loading}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang lưu...
                </span>
              ) : editingAddress ? (
                "Cập nhật"
              ) : (
                "Thêm địa chỉ"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

