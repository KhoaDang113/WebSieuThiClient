import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { addressService } from "@/api";
import { useAuthStore } from "@/stores/authStore";

interface AddressData {
  province: string;
  district: string;
  ward: string;
  street: string;
  recipient: string;
  phone: string;
  callAnotherPerson: boolean;
}

interface AddressContextType {
  address: AddressData | null;
  setAddress: (address: AddressData) => void;
  getAddressString: () => string;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [address, setAddressState] = useState<AddressData | null>(null);
  const { isAuthenticated } = useAuthStore();

  const loadDefaultAddress = useCallback(async () => {
    try {
      const response = await addressService.getAddresses();
      const addresses = response.addresses || [];
      
      // Tìm địa chỉ mặc định
      const defaultAddress = addresses.find((addr) => addr.is_default);
      
      if (defaultAddress) {
        // Cập nhật AddressContext với địa chỉ mặc định
        setAddressState({
          province: defaultAddress.city || "",
          district: defaultAddress.district || "",
          ward: defaultAddress.ward || "",
          street: defaultAddress.address || "",
          recipient: defaultAddress.full_name || "",
          phone: defaultAddress.phone || "",
          callAnotherPerson: false,
        });
      }
    } catch (error) {
      console.error("Error loading default address:", error);
      // Không hiển thị lỗi cho user, chỉ log
    }
  }, []);

  // Xóa localStorage và load địa chỉ mặc định từ API khi mount
  useEffect(() => {
    // Xóa dữ liệu cũ trong localStorage
    localStorage.removeItem("savedAddress");

    // Load địa chỉ mặc định từ API nếu user đã đăng nhập
    if (isAuthenticated) {
      loadDefaultAddress();
    }
  }, [isAuthenticated, loadDefaultAddress]);

  const setAddress = (newAddress: AddressData) => {
    setAddressState(newAddress);
    // Không lưu vào localStorage nữa, chỉ lưu trong state
    // localStorage.removeItem("savedAddress");
  };

  const getAddressString = () => {
    if (!address) return "Chọn địa chỉ giao hàng";
    
    const parts = [
      address.street,
      address.ward,
      address.district,
      address.province
    ].filter(Boolean);
    
    return parts.join(", ") || "Chưa nhập địa chỉ";
  };

  return (
    <AddressContext.Provider value={{ address, setAddress, getAddressString }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within AddressProvider");
  }
  return context;
}

