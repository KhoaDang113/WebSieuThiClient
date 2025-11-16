"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import { Search, ChevronLeft, Phone, MapPin, Calendar, User } from "lucide-react";
import type { Order } from "@/types/order";
import { OrderList } from "@/components/order/OrderList";
import { OrderStatusBadge } from "@/components/order/OrderStatusBadge";
import { useNotification } from "@/hooks/useNotification";

export default function OrdersPage() {
  const { orders, loading, error, confirmOrder, cancelOrder, deliverOrder } =
    useOrders();
  const { showNotification } = useNotification();
  const [filter, setFilter] = useState<
    "all" | "pending" | "confirmed" | "delivered" | "rejected" | "cancelled"
  >("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleConfirmOrder = async (orderId: string) => {
    try {
      await confirmOrder(orderId);
      showNotification({
        type: "success",
        title: "Xác nhận đơn hàng",
        message: `Đơn hàng ${orderId} đã được xác nhận.`,
        duration: 4000,
      });
    } catch (err: Error | unknown) {
      let message = "Không thể xác nhận đơn hàng.";
      if (err && typeof err === "object" && "response" in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response;
        if (response?.data?.message) {
          message = response.data.message;
        }
      }
      showNotification({
        type: "error",
        title: "Lỗi xác nhận",
        message,
        duration: 4000,
      });
      throw err;
    }
  };

  const handleDeliverOrder = async (orderId: string) => {
    try {
      await deliverOrder(orderId);
      showNotification({
        type: "success",
        title: "Giao hàng",
        message: `Đã cập nhật đơn hàng ${orderId} sang trạng thái giao thành công.`,
        duration: 4000,
      });
    } catch (err: Error | unknown) {
      let message = "Không thể cập nhật trạng thái giao hàng.";
      if (err && typeof err === "object" && "response" in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response;
        if (response?.data?.message) {
          message = response.data.message;
        }
      }
      showNotification({
        type: "error",
        title: "Lỗi giao hàng",
        message,
        duration: 4000,
      });
      throw err;
    }
  };

  const handleCancelOrder = async (orderId: string, reason?: string) => {
    try {
      await cancelOrder(orderId, reason);
      showNotification({
        type: "info",
        title: "Hủy đơn hàng",
        message: `Đơn hàng ${orderId} đã được hủy.`,
        duration: 4000,
      });
    } catch (err: Error | unknown) {
      let message = "Không thể hủy đơn hàng.";
      if (err && typeof err === "object" && "response" in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response;
        if (response?.data?.message) {
          message = response.data.message;
        }
      }
      showNotification({
        type: "error",
        title: "Lỗi hủy đơn",
        message,
        duration: 4000,
      });
      throw err;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter !== "all") {
      if (filter === "confirmed") {
        if (!["confirmed", "shipped"].includes(order.status)) return false;
      } else if (order.status !== filter) {
        return false;
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.customer_name.toLowerCase().includes(query) ||
        order.customer_phone.includes(query) ||
        order.customer_address.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter(
      (o) => o.status === "confirmed" || o.status === "shipped"
    ).length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    rejected: orders.filter((o) => o.status === "rejected").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  // Component OrderDetailView
  const OrderDetailView = ({ order, onBack }: { order: Order; onBack: () => void }) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div className="space-y-4">
        {/* Header với mã đơn hàng và status */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
              <span className="text-sm font-bold text-gray-900">Mã đơn hàng: {order.id}</span>
              <OrderStatusBadge status={order.status} />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-2 h-2" />
            Quay lại
          </Button>
        </div>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-sm font-bold mb-3 pb-3 border-b border-gray-200 text-gray-900">
              Thông tin khách hàng
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Ngày tạo:</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Tên người nhận:</span>
                <span>{order.customer_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Số điện thoại:</span>
                <span>{order.customer_phone}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <span className="font-medium">Địa chỉ:</span>
                <span className="flex-1">{order.customer_address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-sm font-bold mb-3 pb-3 border-b border-gray-200 text-gray-900">
              Sản phẩm đã đặt
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/64x64?text=No+Image";
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600">
                      {item.quantity} {item.unit} × {item.price.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Tổng tiền cước:</span>
              <span className="text-base font-bold text-green-600">
                {order.total_amount.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
        <div className="max-w-4xl mx-auto p-4">
          <OrderDetailView
            order={selectedOrder}
            onBack={() => setSelectedOrder(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Search Box */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Mã đơn hàng ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-white rounded shadow-sm border border-gray-200">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
            className={`text-xs ${
              filter === "all"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : ""
            }`}
          >
            Tất Cả ({stats.total})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
            size="sm"
            className={`text-xs ${
              filter === "pending"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : ""
            }`}
          >
            Chờ Xác Nhận ({stats.pending})
          </Button>
          <Button
            variant={filter === "confirmed" ? "default" : "outline"}
            onClick={() => setFilter("confirmed")}
            size="sm"
            className={`text-xs ${
              filter === "confirmed"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : ""
            }`}
          >
            Đã Xác Nhận ({stats.confirmed})
          </Button>
          <Button
            variant={filter === "delivered" ? "default" : "outline"}
            onClick={() => setFilter("delivered")}
            size="sm"
            className={`text-xs ${
              filter === "delivered"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : ""
            }`}
          >
            Đã Giao Hàng ({stats.delivered})
          </Button>
          <Button
            variant={filter === "cancelled" ? "default" : "outline"}
            onClick={() => setFilter("cancelled")}
            size="sm"
            className={`text-xs ${
              filter === "cancelled"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : ""
            }`}
          >
            Đã Hủy ({stats.cancelled})
          </Button>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded shadow-sm border border-gray-200 p-4">
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-900">
              {filter === "all"
                ? "Tất cả đơn hàng"
                : filter === "pending"
                ? "Đơn hàng chờ xác nhận"
                : filter === "confirmed"
                ? "Đơn hàng đã xác nhận"
                : filter === "delivered"
                ? "Đơn hàng đã giao"
                : filter === "rejected"
                ? "Đơn hàng đã từ chối"
                : "Đơn hàng đã hủy"}
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Hiển thị {filteredOrders.length} đơn hàng
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-500">
              Đang tải danh sách đơn hàng...
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-600 text-sm">
              {error}
            </div>
          ) : (
            <OrderList
              orders={filteredOrders}
              onConfirm={handleConfirmOrder}
              onCancel={handleCancelOrder}
              onDeliver={handleDeliverOrder}
              onViewDetail={setSelectedOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
}
