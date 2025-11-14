"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  User,
  Phone,
  MapPin,
  StickyNote,
  ShoppingBag,
  CheckCircle,
  Building2,
  Mail,
} from "lucide-react";
import type { CartItem } from "@/types/cart.type";
import type { CreateOrderCustomerInfo } from "@/hooks/useOrders";
import { useAddress } from "@/components/address/AddressContext";
import { useAuthStore } from "@/stores/authStore";
import PaymentService from "@/api/services/paymentService";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onCreateOrder: (
    cartItems: CartItem[],
    customerInfo: CreateOrderCustomerInfo
  ) => Promise<string>;
  onClearCart: () => void;
}

interface CustomerInfoState {
  name: string;
  phone: string;
  address: string;
  notes: string;
  addressId?: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onCreateOrder,
  onClearCart,
}: CheckoutModalProps) {
  const { address } = useAddress();
  const currentUser = useAuthStore((state) => state.user);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfoState>({
    name: "",
    phone: "",
    address: "",
    notes: "",
    addressId: "",
  });
  const [requestInvoice, setRequestInvoice] = useState(false);
  const [invoiceInfo, setInvoiceInfo] = useState({
    companyName: "",
    companyAddress: "",
    taxCode: "",
    email: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "vnpay" | "momo">(
    "cod"
  );
  const [agreedPolicy, setAgreedPolicy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = total >= 300000 ? 0 : 15000;
  const finalTotal = total + shippingFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  // Tự động điền thông tin khách hàng khi mở modal
  useEffect(() => {
    if (!isOpen) return;

    // Ưu tiên địa chỉ mặc định từ AddressContext nếu có
    if (address) {
      const fullAddress = [
        address.street,
        address.ward,
        address.district,
        address.province,
      ]
        .filter(Boolean)
        .join(", ");

      setCustomerInfo((prev) => ({
        ...prev,
        name: address.recipient || currentUser?.name || "",
        phone:
          address.phone || currentUser?.phone || currentUser?.phoneNumber || "",
        address: fullAddress,
        addressId: address.id || prev.addressId,
      }));
      return;
    }

    setCustomerInfo((prev) => ({
      ...prev,
      addressId: "",
    }));

    // Fallback: chỉ có thông tin từ tài khoản
    if (currentUser) {
      setCustomerInfo((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        phone: currentUser.phone || currentUser.phoneNumber || prev.phone,
      }));
    }
  }, [isOpen, address, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (!customerInfo.addressId) {
      alert("Vui lòng chọn địa chỉ giao hàng hợp lệ!");
      return;
    }

    if (requestInvoice) {
      if (
        !invoiceInfo.companyName ||
        !invoiceInfo.companyAddress ||
        !invoiceInfo.taxCode ||
        !invoiceInfo.email
      ) {
        alert("Vui lòng điền đầy đủ thông tin xuất hóa đơn công ty!");
        return;
      }
    }

    if (!agreedPolicy) {
      alert(
        "Vui lòng đồng ý với chính sách xử lý dữ liệu cá nhân và chính sách đổi trả, hoàn tiền."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrderId = await onCreateOrder(cartItems, {
        ...customerInfo,
        requestInvoice,
        invoiceCompanyName: invoiceInfo.companyName,
        invoiceCompanyAddress: invoiceInfo.companyAddress,
        invoiceTaxCode: invoiceInfo.taxCode,
        invoiceEmail: invoiceInfo.email,
        shippingFee,
        discount: 0,
      });

      // Nếu COD: giữ flow cũ
      if (paymentMethod === "cod") {
        setOrderId(newOrderId);
        setIsSuccess(true);
        onClearCart();
      } else {
        try {
          console.log(newOrderId);

          const paymentUrl = await PaymentService.createPayment(
            newOrderId,
            paymentMethod === "vnpay" ? "vnpay" : "momo"
          );

          if (!paymentUrl) {
            alert("Không tạo được link thanh toán. Vui lòng thử lại.");
            return;
          }

          // Clear cart trước khi rời trang (optional)
          onClearCart();
          // Redirect sang cổng thanh toán
          window.location.href = paymentUrl.data as unknown as string;
        } catch (err) {
          console.error("Error creating payment:", err);
          alert("Không tạo được giao dịch thanh toán. Vui lòng thử lại.");
        }
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Có lỗi xảy ra khi tạo đơn hàng!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setOrderId("");
    setCustomerInfo({
      name: "",
      phone: "",
      address: "",
      notes: "",
      addressId: "",
    });
    setInvoiceInfo({
      companyName: "",
      companyAddress: "",
      taxCode: "",
      email: "",
    });
    setRequestInvoice(false);
    setAgreedPolicy(false);
    onClose();
  };

  if (!isOpen) return null;

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
                  <h2 className="text-xl font-bold text-gray-800">
                    Thông Tin Đặt Hàng
                  </h2>
                  <p className="text-sm text-gray-600">
                    Vui lòng điền thông tin để hoàn tất đơn hàng
                  </p>
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
                    <span className="font-semibold">
                      {cartItems.length} sản phẩm
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Tạm tính:</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Phí vận chuyển:</span>
                    <span
                      className={`font-semibold ${
                        shippingFee === 0 ? "text-[#007E42]" : "text-gray-800"
                      }`}
                    >
                      {shippingFee === 0
                        ? "Miễn phí"
                        : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="border-t border-[#007E42]/20 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold bg-gradient-to-r from-[#007E42] to-[#00a855] bg-clip-text text-transparent">
                      <span>Tổng cộng:</span>
                      <span className="text-[#007E42]">
                        {formatPrice(finalTotal)}
                      </span>
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
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
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
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
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
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
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
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#007E42] focus:border-[#007E42] transition-all resize-none outline-none"
                      placeholder="Ghi chú thêm cho đơn hàng (thời gian giao hàng, yêu cầu đặc biệt...)"
                      rows={2}
                    />
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/80 space-y-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <input
                        type="checkbox"
                        checked={requestInvoice}
                        onChange={(e) => setRequestInvoice(e.target.checked)}
                        className="w-4 h-4 text-[#007E42] rounded border-gray-300 focus:ring-[#007E42]"
                      />
                      Xuất hóa đơn công ty
                    </label>

                    {requestInvoice && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
                            <Building2 className="w-4 h-4 text-[#007E42]" />
                            Tên công ty *
                          </label>
                          <input
                            type="text"
                            value={invoiceInfo.companyName}
                            onChange={(e) =>
                              setInvoiceInfo((prev) => ({
                                ...prev,
                                companyName: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#007E42] focus:border-[#007E42] transition-all outline-none text-sm"
                            placeholder="Nhập tên công ty"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
                            <MapPin className="w-4 h-4 text-[#007E42]" />
                            Địa chỉ công ty *
                          </label>
                          <input
                            type="text"
                            value={invoiceInfo.companyAddress}
                            onChange={(e) =>
                              setInvoiceInfo((prev) => ({
                                ...prev,
                                companyAddress: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#007E42] focus:border-[#007E42] transition-all outline-none text-sm"
                            placeholder="Nhập địa chỉ công ty"
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
                            <StickyNote className="w-4 h-4 text-[#007E42]" />
                            Mã số thuế *
                          </label>
                          <input
                            type="text"
                            value={invoiceInfo.taxCode}
                            onChange={(e) =>
                              setInvoiceInfo((prev) => ({
                                ...prev,
                                taxCode: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#007E42] focus:border-[#007E42] transition-all outline-none text-sm"
                            placeholder="Nhập mã số thuế"
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
                            <Mail className="w-4 h-4 text-[#007E42]" />
                            Email nhận hóa đơn *
                          </label>
                          <input
                            type="email"
                            value={invoiceInfo.email}
                            onChange={(e) =>
                              setInvoiceInfo((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#007E42] focus:border-[#007E42] transition-all outline-none text-sm"
                            placeholder="Nhập email nhận hóa đơn"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/80 space-y-3">
                    <p className="text-sm font-semibold text-gray-800 mb-1">
                      Phương thức thanh toán
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cod")}
                        className={`flex-1 border rounded-lg px-3 py-2 text-sm flex items-center justify-between ${
                          paymentMethod === "cod"
                            ? "border-[#007E42] bg-[#007E42]/5"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <span>Thanh toán khi nhận hàng (COD)</span>
                        {paymentMethod === "cod" && (
                          <span className="text-xs text-[#007E42] font-semibold">
                            Đã chọn
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("vnpay")}
                        className={`flex-1 border rounded-lg px-3 py-2 text-sm flex items-center justify-between ${
                          paymentMethod === "vnpay"
                            ? "border-[#007E42] bg-[#007E42]/5"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <span>Thanh toán qua VNPAY</span>
                        {paymentMethod === "vnpay" && (
                          <span className="text-xs text-[#007E42] font-semibold">
                            Đã chọn
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Nếu sau này cần MoMo thì thêm 1 button tương tự, setPaymentMethod("momo") */}
                  </div>

                  <label className="flex items-start gap-2 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={agreedPolicy}
                      onChange={(e) => setAgreedPolicy(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#007E42] rounded border-gray-300 focus:ring-[#007E42]"
                    />
                    <span>
                      Tôi đồng ý với{" "}
                      <a
                        href="#"
                        className="text-[#007E42] font-medium hover:underline"
                      >
                        Chính sách xử lý dữ liệu cá nhân
                      </a>{" "}
                      và{" "}
                      <a
                        href="#"
                        className="text-[#007E42] font-medium hover:underline"
                      >
                        Chính sách đổi trả, hoàn tiền
                      </a>
                      .
                    </span>
                  </label>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Đặt hàng thành công!
            </h2>
            <p className="text-gray-600 mb-6">
              Đơn hàng{" "}
              <span className="font-semibold bg-gradient-to-r from-[#007E42] to-[#00a855] bg-clip-text text-transparent">
                #{orderId}
              </span>{" "}
              đã được tạo thành công.
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
                onClick={() => (window.location.href = "/orders")}
                className="w-full py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all"
              >
                Xem đơn hàng của tôi
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
