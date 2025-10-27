"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Thông Tin Đặt Hàng</h2>
                  <p className="text-sm text-gray-600">Vui lòng điền thông tin để hoàn tất đơn hàng</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-800">Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Số lượng sản phẩm:</span>
                    <span className="font-semibold">{cartItems.length} sản phẩm</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển:</span>
                    <span className={`font-semibold ${shippingFee === 0 ? 'text-green-600' : ''}`}>
                      {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="border-t border-blue-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-blue-800">
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4" />
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Nhập họ và tên của bạn"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4" />
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4" />
                      Địa chỉ giao hàng *
                    </label>
                    <textarea
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Nhập địa chỉ giao hàng chi tiết"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <StickyNote className="w-4 h-4" />
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
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
                    className="flex-1 py-3 rounded-xl border-2"
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Đang xử lý...
                      </div>
                    ) : (
                      `Đặt hàng - ${formatPrice(finalTotal)}`
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Đặt hàng thành công!</h2>
            <p className="text-gray-600 mb-6">
              Đơn hàng <span className="font-semibold text-blue-600">#{orderId}</span> đã được tạo thành công.
              <br />
              Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold"
              >
                Tiếp tục mua sắm
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/orders'}
                className="w-full py-3 rounded-xl border-2"
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
