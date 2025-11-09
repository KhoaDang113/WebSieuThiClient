"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, User, Phone, MapPin, StickyNote, ShoppingBag, CheckCircle } from "lucide-react"
import type { CartItem } from "@/types/cart.type"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onCreateOrder: (cartItems: CartItem[], customerInfo: {
    name: string
    phone: string
    address: string
    notes?: string
  }) => string
  onClearCart: () => void
}

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cartItems, 
  onCreateOrder, 
  onClearCart 
}: CheckoutModalProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderId, setOrderId] = useState("")

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shippingFee = total >= 300000 ? 0 : 15000
  const finalTotal = total + shippingFee

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Vui lòng điền đầy đủ thông tin!")
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newOrderId = onCreateOrder(cartItems, customerInfo)
      setOrderId(newOrderId)
      setIsSuccess(true)
      onClearCart()
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Có lỗi xảy ra khi tạo đơn hàng!")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsSuccess(false)
    setOrderId("")
    setCustomerInfo({ name: "", phone: "", address: "", notes: "" })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-[#007E42]/10 to-[#00a855]/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#007E42] to-[#00a855] rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Thông Tin Đặt Hàng</h2>
                  <p className="text-sm text-gray-600">Vui lòng điền thông tin để hoàn tất đơn hàng</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
              >
                <X className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-colors" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Order Summary */}
              <div className="bg-gradient-to-r from-[#007E42]/5 to-[#00a855]/5 border border-[#007E42]/20 rounded-xl p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#007E42]" />
                  Tóm tắt đơn hàng
                </h3>
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Số lượng sản phẩm:</span>
                    <span className="font-semibold">{cartItems.length} sản phẩm</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Tạm tính:</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Phí vận chuyển:</span>
                    <span className={`font-semibold ${shippingFee === 0 ? 'text-[#007E42]' : 'text-gray-800'}`}>
                      {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="border-t border-[#007E42]/20 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold bg-gradient-to-r from-[#007E42] to-[#00a855] bg-clip-text text-transparent">
                      <span>Tổng cộng:</span>
                      <span className="text-[#007E42]">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 text-[#007E42]" />
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#007E42] focus:border-[#007E42] transition-all outline-none"
                      placeholder="Nhập họ và tên của bạn"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 text-[#007E42]" />
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#007E42] focus:border-[#007E42] transition-all outline-none"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 text-[#007E42]" />
                      Địa chỉ giao hàng *
                    </label>
                    <textarea
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#007E42] focus:border-[#007E42] transition-all resize-none outline-none"
                      placeholder="Nhập địa chỉ giao hàng chi tiết"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <StickyNote className="w-4 h-4 text-[#007E42]" />
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#007E42] focus:border-[#007E42] transition-all resize-none outline-none"
                      placeholder="Ghi chú thêm cho đơn hàng (thời gian giao hàng, yêu cầu đặc biệt...)"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 py-3 rounded-xl border-2 border-gray-300 hover:bg-red-50 hover:border-red-500 hover:text-red-600 transition-all"
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#007E42] to-[#00a855] hover:from-[#005a2f] hover:to-[#007E42] text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                    disabled={isSubmitting}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    <span className="relative flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Đang xử lý...
                        </>
                      ) : (
                        `Đặt hàng - ${formatPrice(finalTotal)}`
                      )}
                    </span>
                  </Button>
                </div>
              </form>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-[#007E42]/10 to-[#00a855]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-[#007E42]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Đặt hàng thành công!</h2>
            <p className="text-gray-600 mb-6">
              Đơn hàng <span className="font-semibold bg-gradient-to-r from-[#007E42] to-[#00a855] bg-clip-text text-transparent">#{orderId}</span> đã được tạo thành công.
              <br />
              Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-[#007E42] to-[#00a855] hover:from-[#005a2f] hover:to-[#007E42] text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Tiếp tục mua sắm
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/orders'}
                className="w-full py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all"
              >
                Xem đơn hàng của tôi
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
