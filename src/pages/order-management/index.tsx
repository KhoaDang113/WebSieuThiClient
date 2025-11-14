"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import {
  Search,
  Check,
  Trash2,
  Eye,
  Phone,
  MapPin,
  Calendar,
  User,
  Truck,
} from "lucide-react";
import type { Order } from "@/types/order";
import { OrderDetailView } from "./OrderDetailView";
import { useNotification } from "@/components/notification/NotificationContext";

// Component OrderStatusBadge
function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const statusConfig = {
    pending: {
      label: "Chờ Xác Nhận",
      color: "bg-amber-500 text-white",
    },
    confirmed: {
      label: "Đã Xác Nhận",
      color: "bg-blue-500 text-white",
    },
    shipped: {
      label: "Đang Giao Hàng",
      color: "bg-cyan-500 text-white",
    },
    delivered: {
      label: "Đã Giao Hàng",
      color: "bg-green-500 text-white",
    },
    rejected: {
      label: "Đã Từ Chối",
      color: "bg-red-500 text-white",
    },
    cancelled: {
      label: "Đã Hủy",
      color: "bg-red-500 text-white",
    },
  };

  const config = statusConfig[status] ?? statusConfig.pending;
  return (
    <span className={`${config.color} px-3 py-1 rounded text-xs font-semibold`}>
      {config.label}
    </span>
  );
}

// Component OrderListItem
function OrderListItem({
  order,
  onConfirm,
  onCancel,
  onDeliver,
  onViewDetail,
}: {
  order: Order;
  onConfirm: (orderId: string) => Promise<void>;
  onCancel: (orderId: string, reason?: string) => Promise<void>;
  onDeliver: (orderId: string) => Promise<void>;
  onViewDetail: (order: Order) => void;
}) {
  const [actionLoading, setActionLoading] = useState<
    null | "confirm" | "cancel" | "deliver"
  >(null);

  const handleConfirm = async () => {
    if (actionLoading) return;
    try {
      setActionLoading("confirm");
      await onConfirm(order.id);
    } catch (error) {
      console.error("Confirm order failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async () => {
    if (actionLoading) return;
    let reason: string | undefined;
    if (order.status === "pending") {
      reason = undefined;
    } else {
      const promptValue = window.prompt(
        "Nhập lý do hủy đơn hàng",
        "Hủy bởi nhân viên"
      );
      if (promptValue === null) {
        return;
      }
      reason = promptValue || undefined;
    }
    try {
      setActionLoading("cancel");
      await onCancel(order.id, reason);
    } catch (error) {
      console.error("Cancel order failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeliver = async () => {
    if (actionLoading) return;
    try {
      setActionLoading("deliver");
      await onDeliver(order.id);
    } catch (error) {
      console.error("Deliver order failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

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
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
      <CardContent className="p-3 sm:p-4 flex flex-col h-full">
        <div className="space-y-3 flex-1">
          {/* Mã đơn hàng - trên cùng */}
          <div className="pb-2 border-b border-gray-200 flex items-center justify-between gap-3">
            <div>
              <span className="text-sm font-bold text-gray-900 truncate max-w-[65%]">
                {order.id}
              </span>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          {/* Thông tin đơn hàng */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="font-medium">Ngày tạo:</span>
              <span>{formatDate(order.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="font-medium">Người nhận:</span>
              <span className="truncate" title={order.customer_name}>
                {order.customer_name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="font-medium">Số điện thoại:</span>
              <span>{order.customer_phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="font-medium">Địa chỉ:</span>
              <span className="truncate flex-1" title={order.customer_address}>
                {order.customer_address}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="font-medium">Sản phẩm:</span>
              <span
                className="truncate flex-1"
                title={order.items
                  .map((item) => `${item.name} (${item.quantity} ${item.unit})`)
                  .join(", ")}
              >
                {order.items
                  .map((item) => `${item.name} (${item.quantity} ${item.unit})`)
                  .join(", ")}
              </span>
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Tổng tiền cước:
              </span>
              <span className="text-base font-bold text-green-600">
                {order.total_amount.toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>

          {/* Nút xem chi tiết */}
        </div>

        {/* Các nút xác nhận, hủy, giao hàng */}
        <div className="mt-3 pt-2 border-t border-dashed border-gray-200 flex flex-col gap-2">
          {order.status === "pending" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleConfirm}
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  disabled={actionLoading !== null}
                >
                  <Check className="w-4 h-4 mr-1" />
                  {actionLoading === "confirm"
                    ? "Đang xác nhận..."
                    : "Xác nhận"}
                </Button>
                <Button
                  onClick={handleCancel}
                  size="sm"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={actionLoading !== null}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {actionLoading === "cancel" ? "Đang hủy..." : "Hủy"}
                </Button>
              </div>
              <Button
                onClick={() => onViewDetail(order)}
                variant="outline"
                size="sm"
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem chi tiết
              </Button>
            </>
          )}
          {order.status === "confirmed" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleDeliver}
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  disabled={actionLoading !== null}
                >
                  <Truck className="w-4 h-4 mr-1" />
                  {actionLoading === "deliver" ? "Đang giao..." : "Giao hàng"}
                </Button>
                <Button
                  onClick={handleCancel}
                  size="sm"
                  variant="outline"
                  className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                  disabled={actionLoading !== null}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {actionLoading === "cancel" ? "Đang hủy..." : "Hủy"}
                </Button>
              </div>
              <Button
                onClick={() => onViewDetail(order)}
                variant="outline"
                size="sm"
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem chi tiết
              </Button>
            </>
          )}
          {order.status === "shipped" && (
            <>
              <div className="w-full text-center text-sm font-medium py-2 text-blue-600 bg-blue-50 rounded">
                Đơn hàng đang được giao
              </div>
              <Button
                onClick={() => onViewDetail(order)}
                variant="outline"
                size="sm"
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem chi tiết
              </Button>
            </>
          )}
          {order.status === "delivered" && (
            <>
              <div className="w-full text-center text-sm font-medium py-2 text-green-600 bg-green-50 rounded">
                Đơn hàng đã được giao
              </div>
              <Button
                onClick={() => onViewDetail(order)}
                variant="outline"
                size="sm"
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem chi tiết
              </Button>
            </>
          )}
          {order.status === "cancelled" && (
            <>
              <div className="w-full text-center text-sm font-medium py-2 text-red-600 bg-red-50 rounded">
                Đơn hàng đã bị hủy
              </div>
              <Button
                onClick={() => onViewDetail(order)}
                variant="outline"
                size="sm"
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem chi tiết
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Component OrderList
function OrderList({
  orders,
  onConfirm,
  onCancel,
  onDeliver,
  onViewDetail,
}: {
  orders: Order[];
  onConfirm: (orderId: string) => Promise<void>;
  onCancel: (orderId: string, reason?: string) => Promise<void>;
  onDeliver: (orderId: string) => Promise<void>;
  onViewDetail: (order: Order) => void;
}) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">Không có đơn hàng nào</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
      {orders.map((order) => (
        <OrderListItem
          key={order.id}
          order={order}
          onConfirm={onConfirm}
          onCancel={onCancel}
          onDeliver={onDeliver}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
}

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
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Không thể xác nhận đơn hàng.";
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
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Không thể cập nhật trạng thái giao hàng.";
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
    } catch (err: any) {
      const message = err?.response?.data?.message || "Không thể hủy đơn hàng.";
      showNotification({
        type: "error",
        title: "Lỗi hủy đơn",
        message,
        duration: 4000,
      });
      throw err;
    }
  };

  // Tạo đơn hàng test mới
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
