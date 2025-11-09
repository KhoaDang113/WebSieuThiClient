import { useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "./CustomSelect";

interface Province {
  code: string;
  name: string;
}

interface Ward {
  code: string;
  name: string;
}

interface AddressData {
  province: string;
  district: string; // Giữ lại để tương thích, nhưng sẽ = ""
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
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>("");
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
      // Tìm province code từ tên (vì currentAddress lưu tên)
      const provinceObj = provinces.find(p => p.name === currentAddress.province);
      if (provinceObj) {
        setSelectedProvince(provinceObj.code);
      } else {
        setSelectedProvince("");
      }
      
      setSelectedWard(currentAddress.ward);
      setStreet(currentAddress.street);
      setRecipient(currentAddress.recipient);
      setPhone(currentAddress.phone);
      setCallAnotherPerson(currentAddress.callAnotherPerson);
    } else if (isOpen) {
      resetForm();
    }
  }, [isOpen, currentAddress, provinces]);

  // Load wards when province changes (2 cấp: Tỉnh → Xã)
  useEffect(() => {
    if (selectedProvince) {
      fetchWards(selectedProvince);
      setSelectedWard("");
    }
  }, [selectedProvince]);

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      
      let response: Response;
      let data: any;
      
      // Thử API v2 - Danh sách tỉnh thành sau sát nhập
      try {
        response = await fetch("https://provinces.open-api.vn/api/v2/", {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: createTimeoutSignal(10000), // Timeout 10 giây
        });
        
        if (response.ok) {
          data = await response.json();
          if (Array.isArray(data)) {
            // Map data từ v2 format
            setProvinces(data.map((p: any) => ({
              code: p.code.toString(),
              name: p.name,
            })));
            return;
          }
        }
      } catch (primaryError: any) {
        // Nếu API chính lỗi (timeout, network error, etc.), thử API dự phòng
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
      } catch {
        // Silent error - không hiện thông báo
      }
    } catch (error) {
      // Silent error - không hiện thông báo
      console.error("Error fetching provinces:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async (provinceCode: string) => {
    try {
      setLoading(true);
      
      let response: Response;
      let data: any;
      
      // Thử API v2 - Lấy wards trực tiếp từ tỉnh (2 cấp)
      try {
        response = await fetch(`https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: createTimeoutSignal(10000),
        });
        
        if (response.ok) {
          data = await response.json();
          
          // API v2 depth=2 trả về wards trực tiếp, không có districts
          const allWards: Ward[] = [];
          
          if (data.wards && Array.isArray(data.wards)) {
            data.wards.forEach((ward: any) => {
              allWards.push({
                code: ward.code.toString(),
                name: ward.name,
              });
            });
          } else if (data.districts && Array.isArray(data.districts)) {
            // Fallback: nếu có districts (API khác)
            data.districts.forEach((district: any) => {
              if (district.wards && Array.isArray(district.wards)) {
                district.wards.forEach((ward: any) => {
                  allWards.push({
                    code: ward.code.toString(),
                    name: ward.name,
                  });
                });
              }
            });
          }
          
          if (allWards.length > 0) {
            setWards(allWards);
            return;
          }
        }
      } catch (primaryError: any) {
        // API chính không phản hồi, đang thử API dự phòng
      }
      
      // Thử API dự phòng - lấy districts rồi flatten wards
      try {
        // Lấy danh sách districts trước
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
        const allWards: Ward[] = [];
        
        if (data.results && Array.isArray(data.results)) {
          // Lấy wards từ tất cả districts
          for (const district of data.results) {
            try {
              const wardResponse = await fetch(
                `https://vapi.vnappmob.com/api/province/ward/${district.district_id}`,
                {
                  method: 'GET',
                  headers: { 'Accept': 'application/json' },
                  signal: createTimeoutSignal(5000),
                }
              );
              
              if (wardResponse.ok) {
                const wardData = await wardResponse.json();
                if (wardData.results && Array.isArray(wardData.results)) {
                  wardData.results.forEach((w: any) => {
                    allWards.push({
                      code: w.ward_id,
                      name: w.ward_name,
                    });
                  });
                }
              }
            } catch {
              // Silent error - không hiện thông báo
            }
          }
        }
        
        setWards(allWards);
      } catch {
        // Silent error - không hiện thông báo
        setWards([]);
      }
    } catch {
      // Silent error - không hiện thông báo
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
    
    if (!selectedProvince || !selectedWard) {
      alert("Vui lòng chọn đầy đủ Tỉnh/Thành phố và Phường/Xã");
      return;
    }

    const addressData: AddressData = {
      province: provinces.find(p => p.code === selectedProvince)?.name || "",
      district: "", // Mô hình 2 cấp: Không còn cấp huyện
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
              disabled={!selectedProvince || loading}
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

