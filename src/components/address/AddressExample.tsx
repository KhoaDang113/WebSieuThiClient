/**
 * Address Management Example Page
 * 
 * Đây là example page để test Address components
 * Có thể sử dụng làm reference hoặc tích hợp vào app
 */

import { useState } from "react";
import { AddressListModal } from "./AddressListModal";
import type { Address } from "@/api/types";
import { addressService } from "@/api";
import { MapPin } from "lucide-react";

export function AddressExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [mode, setMode] = useState<"selection" | "management">("selection");

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Address Management Demo
          </h1>
          <p className="text-gray-600">
            Test các tính năng quản lý địa chỉ nhận hàng
          </p>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Chọn chế độ test
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setMode("selection");
                setIsModalOpen(true);
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Test Checkout Flow
              <p className="text-sm font-normal mt-1 opacity-90">
                (Chọn địa chỉ giao hàng)
              </p>
            </button>

            <button
              onClick={() => {
                setMode("management");
                setIsModalOpen(true);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Test Address Management
              <p className="text-sm font-normal mt-1 opacity-90">
                (Quản lý địa chỉ)
              </p>
            </button>
          </div>
        </div>

        {/* Selected Address Display */}
        {selectedAddress && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Địa chỉ đã chọn
            </h2>
            <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {selectedAddress.full_name}
                    </h3>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-600">{selectedAddress.phone}</span>
                  </div>
                  <p className="text-gray-700">
                    {addressService.formatFullAddress(selectedAddress)}
                  </p>
                  {selectedAddress.is_default && (
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Địa chỉ mặc định
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Thay đổi địa chỉ
            </button>
          </div>
        )}

        {/* Usage Guide */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Hướng dẫn sử dụng
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                1. Checkout Flow Mode (Chọn địa chỉ)
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Hiển thị radio button để chọn địa chỉ</li>
                <li>Nút "XÁC NHẬN" để confirm địa chỉ đã chọn</li>
                <li>Sử dụng trong trang Checkout/Thanh toán</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                2. Address Management Mode (Quản lý)
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Không có radio button</li>
                <li>Không có nút "XÁC NHẬN"</li>
                <li>Chỉ focus vào CRUD operations</li>
                <li>Sử dụng trong trang Account Settings</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                3. Features Available
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>✅ Xem danh sách địa chỉ đã lưu</li>
                <li>✅ Thêm địa chỉ mới</li>
                <li>✅ Sửa địa chỉ</li>
                <li>✅ Xóa địa chỉ</li>
                <li>✅ Set địa chỉ mặc định</li>
                <li>✅ Province/District/Ward cascading dropdowns</li>
                <li>✅ Phone validation</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">
                ⚠️ Lưu ý:
              </h3>
              <ul className="list-disc list-inside text-yellow-700 space-y-1 ml-4 text-sm">
                <li>Cần đăng nhập để sử dụng (JWT token)</li>
                <li>Backend API phải đang chạy</li>
                <li>Tất cả thao tác đều lưu vào database</li>
                <li>Không còn sử dụng localStorage</li>
              </ul>
            </div>
          </div>
        </div>

        {/* API Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Backend API Information
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="font-mono text-green-600 w-24">GET</span>
              <span className="text-gray-600">/addresses</span>
            </div>
            <div className="flex">
              <span className="font-mono text-green-600 w-24">GET</span>
              <span className="text-gray-600">/addresses/:id</span>
            </div>
            <div className="flex">
              <span className="font-mono text-blue-600 w-24">POST</span>
              <span className="text-gray-600">/addresses</span>
            </div>
            <div className="flex">
              <span className="font-mono text-yellow-600 w-24">PUT</span>
              <span className="text-gray-600">/addresses/:id</span>
            </div>
            <div className="flex">
              <span className="font-mono text-red-600 w-24">DELETE</span>
              <span className="text-gray-600">/addresses/:id</span>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AddressListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectAddress={handleSelectAddress}
        showSelection={mode === "selection"}
      />
    </div>
  );
}

export default AddressExample;

