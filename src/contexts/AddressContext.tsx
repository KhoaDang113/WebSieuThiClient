import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

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

  // Load saved address from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("savedAddress");
    if (saved) {
      try {
        setAddressState(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading saved address:", e);
      }
    }
  }, []);

  const setAddress = (newAddress: AddressData) => {
    setAddressState(newAddress);
    // Lưu vào localStorage
    localStorage.setItem("savedAddress", JSON.stringify(newAddress));
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

