import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types/order";
import { useCart } from "@/components/cart/CartContext";
import { PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/constants";

interface CustomerOrderCardProps {
  order: Order;
  onCancelOrder?: (orderId: string) => void;
  onPayOrder?: (orderId: string) => void;
}

export function CustomerOrderCard({
  order,
  onCancelOrder,
  onPayOrder,
}: CustomerOrderCardProps) {
  const { addToCart } = useCart();
  const [showAllProducts, setShowAllProducts] = useState(false);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const hours = date.getHours();
    return `${day}/${month}, trước ${hours}h`;
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Hiển thị tối đa 3 sản phẩm, phần còn lại hiện +N
  const visibleProducts = showAllProducts
    ? order.items
    : order.items.slice(0, 3);
  const remainingCount = order.items.length - 3;

  // Xử lý mua lại
  const handleBuyAgain = () => {
    order.items.forEach((item) => {
      addToCart({
        id: item.product_id.toString(),
        name: item.name,
        price: item.price,
        image: item.image,
        unit: item.unit,
        quantity: item.quantity,
      });
    });
    alert("Đã thêm tất cả sản phẩm vào giỏ hàng!");
  };

  // Xử lý hủy đơn
  const handleCancel = () => {
    if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      onCancelOrder?.(order.id);
    }
  };

  // Xử lý thanh toán
  const handlePay = () => {
    if (onPayOrder) {
      onPayOrder(order.id);
    } else {
      // fallback: redirect to payment page
      window.location.href = `/checkout?orderId=${encodeURIComponent(
        order.id
      )}`;
    }
  };

  // Kiểm tra xem có thể hủy đơn không (chỉ pending mới hủy được)
  const canCancel = order.status === "pending";

  // Kiểm tra có thể thanh toán hay không
  const canPay =
    !(order.paid || order.payment_status === "paid") &&
    order.status !== "cancelled" &&
    order.status !== "rejected";

  // Nhãn trạng thái
  const statusConfig: Record<
    Order["status"],
    { label: string; className: string }
  > = {
    pending: {
      label: "Chờ xác nhận",
      className: "bg-yellow-100 text-yellow-700",
    },
    confirmed: {
      label: "Đã xác nhận",
      className: "bg-blue-100 text-blue-700",
    },
    shipped: {
      label: "Đang giao hàng",
      className: "bg-cyan-100 text-cyan-700",
    },
    delivered: {
      label: "Đã giao hàng",
      className: "bg-green-100 text-green-700",
    },
    rejected: {
      label: "Đã từ chối",
      className: "bg-red-100 text-red-700",
    },
    cancelled: {
      label: "Đã hủy",
      className: "bg-red-100 text-red-700",
    },
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div>
          <h3 className="font-semibold text-gray-900">Đơn hàng #{order.id}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Giao lúc: {formatDate(order.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.status]?.className ?? "bg-gray-100 text-gray-700"}`}>
            {statusConfig[order.status]?.label ?? order.status}
          </span>

          {/* Payment status badge */}
          {order.paid || order.payment_status === "paid" ? (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              Đã thanh toán
            </span>
          ) : (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
              Chưa thanh toán
            </span>
          )}
        </div>
      </div>

      {/* Product Images */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          {visibleProducts.map((item) => {
            const rawImage = item.image;
            const normalizedImage =
              typeof rawImage === "string" ? rawImage.trim() : "";
            const imageSrc =
              normalizedImage !== ""
                ? normalizedImage
                : PRODUCT_PLACEHOLDER_IMAGE;
            return (
              <div key={item.id} className="relative">
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-white">
                  <img
                    src={imageSrc}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Promotion badge nếu có giảm giá */}
                {item.price < 100000 && (
                  <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-bold shadow-md">
                    -{Math.floor(Math.random() * 30 + 10)}%
                  </div>
                )}
              </div>
            );
          })}

          {/* +N nếu còn nhiều sản phẩm */}
          {!showAllProducts && remainingCount > 0 && (
            <button
              onClick={() => setShowAllProducts(true)}
              className="w-20 h-20 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <span className="text-gray-600 font-semibold text-lg">
                +{remainingCount}
              </span>
            </button>
          )}
        </div>

        {/* Product list khi expand */}
        {showAllProducts && order.items.length > 3 && (
          <div className="mt-3 space-y-2">
            {order.items.slice(3).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <span className="font-medium">{item.quantity}x</span>
                <span>{item.name}</span>
              </div>
            ))}
            <button
              onClick={() => setShowAllProducts(false)}
              className="text-[#007E42] text-sm font-medium hover:underline"
            >
              Thu gọn
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4">
          {canCancel && (
            <button
              onClick={handleCancel}
              className="px-3 py-2 text-sm font-medium rounded-lg 
               bg-gradient-to-r from-red-500 to-red-600 
               text-white shadow-sm hover:shadow-md 
               hover:brightness-110 active:scale-95
               transition-all"
            >
              Huỷ đơn hàng
            </button>
          )}

          {canPay && (
            <button
              onClick={handlePay}
              className="px-3 py-2 text-sm font-semibold rounded-lg
               bg-[#00A559] text-white
               hover:bg-[#008F4C] active:bg-[#007E42]
               shadow-sm hover:shadow-md active:scale-95
               transition-all"
            >
              Thanh toán
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Tổng đơn hàng:</p>
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(order.total_amount)}đ
            </p>
          </div>
          <Button
            onClick={handleBuyAgain}
            className="bg-[#007E42] hover:bg-[#006633] text-white rounded-lg px-6"
          >
            Mua lại
          </Button>
        </div>
      </div>
    </div>
  );
}
