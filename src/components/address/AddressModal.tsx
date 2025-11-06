import { useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "./CustomSelect";

interface Province {
  code: string;
  name: string;
}

interface District {
  code: string;
  name: string;
}

interface Ward {
  code: string;
  name: string;
}

interface AddressData {
  province: string;
  district: string;
  ward: string;
  street: string;
  recipient: string;
  phone: string;
  callAnotherPerson: boolean;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: AddressData) => void;
  currentAddress?: AddressData | null;
}

// Helper function để tạo timeout cho fetch
const createTimeoutSignal = (timeoutMs: number): AbortSignal => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
};

export function AddressModal({ isOpen, onClose, onSave, currentAddress }: AddressModalProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [callAnotherPerson, setCallAnotherPerson] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Load provinces
  useEffect(() => {
    if (isOpen) {
      fetchProvinces();
    }
  }, [isOpen]);

  // Reset form when opening
  useEffect(() => {
    if (isOpen && currentAddress) {
      setSelectedProvince(currentAddress.province);
      setSelectedDistrict(currentAddress.district);
      setSelectedWard(currentAddress.ward);
      setStreet(currentAddress.street);
      setRecipient(currentAddress.recipient);
      setPhone(currentAddress.phone);
      setCallAnotherPerson(currentAddress.callAnotherPerson);
    } else if (isOpen) {
      resetForm();
    }
  }, [isOpen, currentAddress]);

  // Load districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince);
      setSelectedDistrict("");
      setSelectedWard("");
    }
  }, [selectedProvince]);

  // Load wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      fetchWards(selectedDistrict);
      setSelectedWard("");
    }
  }, [selectedDistrict]);

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      
      let response: Response;
      let data: any;
      
      // Thử API chính trước
      try {
        response = await fetch("https://provinces.open-api.vn/api/p/", {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: createTimeoutSignal(10000), // Timeout 10 giây
        });
        
        if (response.ok) {
          data = await response.json();
          if (Array.isArray(data)) {
            setProvinces(data);
            return;
          }
        }
      } catch (primaryError: any) {
        // Nếu API chính lỗi (timeout, network error, etc.), thử API dự phòng
        console.warn("API chính không phản hồi, đang thử API dự phòng...", primaryError);
      }
      
      // Thử API dự phòng
      try {
        response = await fetch("https://vapi.vnappmob.com/api/province/", {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: createTimeoutSignal(10000),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        data = await response.json();
        
        // Xử lý format từ vnappmob API
        if (data.results && Array.isArray(data.results)) {
          setProvinces(data.results.map((p: any) => ({
            code: p.province_id,
            name: p.province_name
          })));
        } else if (Array.isArray(data)) {
          setProvinces(data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (fallbackError) {
        throw new Error("Cả hai API đều không phản hồi");
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
      alert("Không thể tải danh sách tỉnh/thành phố. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async (provinceCode: string) => {
    try {
      setLoading(true);
      
      let response: Response;
      let data: any;
      
      // Thử API chính trước
      try {
        response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: createTimeoutSignal(10000),
        });
        
        if (response.ok) {
          data = await response.json();
          if (data.districts && Array.isArray(data.districts)) {
            setDistricts(data.districts);
            return;
          } else if (Array.isArray(data)) {
            setDistricts(data);
            return;
          }
        }
      } catch (primaryError: any) {
        console.warn("API chính không phản hồi, đang thử API dự phòng...", primaryError);
      }
      
      // Thử API dự phòng
      try {
        response = await fetch(`https://vapi.vnappmob.com/api/province/district/${provinceCode}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: createTimeoutSignal(10000),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        data = await response.json();
        
        // Xử lý format từ vnappmob API
        if (data.results && Array.isArray(data.results)) {
          setDistricts(data.results.map((d: any) => ({
            code: d.district_id,
            name: d.district_name
          })));
        } else if (Array.isArray(data)) {
          setDistricts(data);
        } else {
          setDistricts([]);
        }
      } catch (fallbackError) {
        console.error("Cả hai API đều không phản hồi cho districts");
        setDistricts([]);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      setDistricts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async (districtCode: string) => {
    try {
      setLoading(true);
      
      let response: Response;
      let data: any;
      
      // Thử API chính trước
      try {
        response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: createTimeoutSignal(10000),
        });
        
        if (response.ok) {
          data = await response.json();
          if (data.wards && Array.isArray(data.wards)) {
            setWards(data.wards);
            return;
          } else if (Array.isArray(data)) {
            setWards(data);
            return;
          }
        }
      } catch (primaryError: any) {
        console.warn("API chính không phản hồi, đang thử API dự phòng...", primaryError);
      }
      
      // Thử API dự phòng
      try {
        response = await fetch(`https://vapi.vnappmob.com/api/province/ward/${districtCode}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: createTimeoutSignal(10000),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        data = await response.json();
        
        // Xử lý format từ vnappmob API
        if (data.results && Array.isArray(data.results)) {
          setWards(data.results.map((w: any) => ({
            code: w.ward_id,
            name: w.ward_name
          })));
        } else if (Array.isArray(data)) {
          setWards(data);
        } else {
          setWards([]);
        }
      } catch (fallbackError) {
        console.error("Cả hai API đều không phản hồi cho wards");
        setWards([]);
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
      setWards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          alert(`Vị trí hiện tại: ${position.coords.latitude}, ${position.coords.longitude}`);
          // Bạn có thể thêm logic để reverse geocoding tại đây
        },
        (error) => {
          alert("Không thể lấy vị trí hiện tại");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      alert("Trình duyệt không hỗ trợ Geolocation API");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      alert("Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã");
      return;
    }

    const addressData: AddressData = {
      province: provinces.find(p => p.code === selectedProvince)?.name || "",
      district: districts.find(d => d.code === selectedDistrict)?.name || "",
      ward: wards.find(w => w.code === selectedWard)?.name || "",
      street,
      recipient,
      phone,
      callAnotherPerson
    };

    onSave(addressData);
    onClose();
  };

  const resetForm = () => {
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setStreet("");
    setRecipient("");
    setPhone("");
    setCallAnotherPerson(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">Địa chỉ nhận hàng</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
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

          {/* Get current location button */}
          <Button
            type="button"
            onClick={handleGetCurrentLocation}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Lấy vị trí hiện tại
          </Button>

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
            />
          </div>

          {/* District dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quận/Huyện <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              value={selectedDistrict}
              onChange={setSelectedDistrict}
              options={districts.map((d) => ({ value: d.code, label: d.name }))}
              placeholder="Chọn Quận/Huyện"
              disabled={!selectedProvince || loading}
              required
            />
          </div>

          {/* Ward dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phường/Xã <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              value={selectedWard}
              onChange={setSelectedWard}
              options={wards.map((w) => ({ value: w.code, label: w.name }))}
              placeholder="Chọn Phường/Xã"
              disabled={!selectedDistrict || loading}
              required
              openUp={true}
            />
          </div>

          {/* Street address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số nhà, tên đường
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Nhập số nhà, tên đường"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 mt-4"
          >
            Tiếp tục
          </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

