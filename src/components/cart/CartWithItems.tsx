"use client"

import { useState } from "react"
import { ChevronLeft, X, Minus, Plus, Truck, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import type { CartItem } from "@/types/cart.type"
import CheckoutModal from "./CheckoutModal"
import { useOrders } from "@/hooks/useOrders"

interface CartWithItemsProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onClearCart: () => void
}

export default function CartWithItems({ items, onUpdateQuantity, onRemoveItem, onClearCart }: CartWithItemsProps) {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const { createOrder } = useOrders()
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = subtotal >= 300000 ? 0 : 15000
  const discount = 0
  const total = subtotal + shippingFee - discount
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫"
  }
  const handleCheckout = () => {
    setIsCheckoutModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="mr-2 hover:bg-gray-100 p-2 rounded-full transition-all duration-200 hover:scale-105">
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                Giỏ Hàng Của Bạn
              </h1>
              <p className="text-xs text-gray-500">{items.length} sản phẩm</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {/* Clear Cart Button - Top Section */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  Danh Sách Sản Phẩm
                  <span className="bg-[#007E42] text-white text-xs px-2.5 py-1 rounded-full">{items.length}</span>
                </h2>
                <button 
                  onClick={onClearCart} 
                  className="group flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                >
                  <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                  Xóa giỏ hàng
                </button>
              </div>
              
              {/* Cart Items List */}
              <div className="divide-y divide-gray-100">
                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="p-6 flex gap-6 hover:bg-gradient-to-r hover:from-green-50/30 hover:to-transparent transition-all duration-300 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Product Image */}
                    <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 shadow-md group-hover:shadow-xl transition-shadow duration-300 ring-2 ring-gray-100 group-hover:ring-[#007E42]/20">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#007E42] transition-colors">{item.name}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{item.unit}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold bg-gradient-to-r from-[#007E42] to-[#00a855] bg-clip-text text-transparent">
                          {formatPrice(item.price)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Tổng: <span className="font-semibold text-gray-700">{formatPrice(item.price * item.quantity)}</span>
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end justify-between gap-3">
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-white hover:bg-red-500 p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:rotate-90"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="flex items-center bg-gradient-to-r from-[#007E42]/10 to-[#00a855]/10 border-2 border-[#007E42] rounded-xl overflow-hidden shadow-md">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="flex items-center justify-center px-4 py-2.5 min-h-[44px] hover:bg-[#007E42] hover:text-white transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4 text-[#007E42] group-hover:text-white group-disabled:text-gray-400" />
                        </button>
                        <span className="px-5 py-2.5 text-base font-bold text-gray-800 min-w-[50px] text-center bg-white min-h-[44px] flex items-center justify-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="flex items-center justify-center px-4 py-2.5 min-h-[44px] hover:bg-[#007E42] hover:text-white transition-all duration-200 group"
                        >
                          <Plus className="w-4 h-4 text-[#007E42] group-hover:text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24 self-start border border-gray-100 overflow-hidden">
              {/* Decorative gradient background */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#007E42]/5 to-transparent"></div>
              
              <div className="relative">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Gift className="w-6 h-6 text-[#007E42]" />
                  Tóm Tắt Đơn Hàng
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-sm text-gray-600">Tạm tính:</span>
                    <span className="font-semibold text-gray-800">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Phí vận chuyển
                    </span>
                    <span className={`font-semibold ${shippingFee === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                      {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      Khuyến mại
                    </span>
                    <span className="font-semibold text-gray-800">{formatPrice(discount)}</span>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4"></div>
                  
                  <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-[#007E42]/10 to-[#00a855]/10">
                    <span className="text-base font-bold text-gray-800">Thành tiền:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#007E42] to-[#00a855] bg-clip-text text-transparent">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-6 text-center bg-gray-50 py-2 rounded-lg">
                  (Giá đã bao gồm VAT)
                </p>

                {/* Checkout Button */}
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-[#007E42] to-[#00a855] hover:from-[#005a2f] hover:to-[#007E42] text-white py-7 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <span className="relative flex flex-col items-center gap-1">
                    <span className="text-base tracking-wide">ĐẶT HÀNG NGAY</span>
                    <span className="text-sm font-semibold opacity-90">{formatPrice(total)}</span>
                  </span>
                </Button>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Thanh toán an toàn & bảo mật</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={items}
        onCreateOrder={createOrder}
        onClearCart={onClearCart}
      />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
