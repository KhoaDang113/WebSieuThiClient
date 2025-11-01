"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useOrders } from "@/hooks/useOrders"
import { Search, Check, Trash2, Eye, Phone, MapPin, Calendar, User, Truck, Plus } from "lucide-react"
import type { Order } from "@/types/order"
import { OrderDetailView } from "./OrderDetailView"

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
  }

  const config = statusConfig[status]
  return (
    <span className={`${config.color} px-3 py-1 rounded text-xs font-semibold`}>
      {config.label}
    </span>
  )
}

// Component OrderListItem
function OrderListItem({ order, onConfirm, onCancel, onDeliver, onViewDetail }: {
  order: Order
  onConfirm: (orderId: string) => void
  onCancel: (orderId: string) => void
  onDeliver: (orderId: string) => void
  onViewDetail: (order: Order) => void
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Mã đơn hàng - trên cùng */}
        <div className="mb-3 pb-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">Mã đơn hàng: {order.id}</span>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="space-y-2 mb-3 pb-3 border-b border-gray-200">
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
          <div className="text-sm text-gray-700">
            <span className="font-medium">Sản phẩm:</span>
            <span className="ml-2">{order.items.map(item => `${item.name} (${item.quantity} ${item.unit})`).join(", ")}</span>
          </div>
        </div>

        {/* Tổng tiền */}
        <div className="mb-3 pb-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Tổng tiền cước:</span>
            <span className="text-base font-bold text-green-600">
              {order.total_amount.toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>

        {/* Nút xem chi tiết */}
        <div className="mb-3">
          <Button
            onClick={() => onViewDetail(order)}
            variant="outline"
            size="sm"
            className="w-full border-green-500 text-green-600 hover:bg-green-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            Xem chi tiết
          </Button>
        </div>

        {/* Các nút xác nhận, hủy, giao hàng */}
        <div className="flex gap-2">
          {order.status === "pending" && (
            <>
              <Button
                onClick={() => onConfirm(order.id)}
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-4 h-4 mr-1" />
                Xác nhận
              </Button>
          <Button
            onClick={() => onCancel(order.id)}
            size="sm"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Hủy
          </Button>
            </>
          )}
          {order.status === "confirmed" && (
            <Button
              onClick={() => onDeliver(order.id)}
              size="sm"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Truck className="w-4 h-4 mr-1" />
              Giao hàng
            </Button>
          )}
          {(order.status === "delivered" || order.status === "cancelled") && (
            <div className={`w-full text-center text-sm font-medium py-2 ${
              order.status === "delivered" 
                ? "text-green-600 bg-green-50 rounded" 
                : "text-red-600 bg-red-50 rounded"
            }`}>
              {order.status === "delivered" ? "Đơn hàng đã được giao" : "Đơn hàng đã bị hủy"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Component OrderList
function OrderList({ orders, onConfirm, onCancel, onDeliver, onViewDetail }: {
  orders: Order[]
  onConfirm: (orderId: string) => void
  onCancel: (orderId: string) => void
  onDeliver: (orderId: string) => void
  onViewDetail: (order: Order) => void
}) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">Không có đơn hàng nào</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
  )
}


export default function OrdersPage() {
  const { orders, confirmOrder, cancelOrder, deliverOrder, createOrder } = useOrders()
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "delivered" | "rejected" | "cancelled">("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Tạo đơn hàng test mới
  const createTestOrder = () => {
    const testItems = [
      {
        id: "1",
        name: "Má đùi gà cắt sẵn",
        price: 41582,
        quantity: 2,
        image: "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8781/thit-heo_202509110924556310.png",
        unit: "500g"
      },
      {
        id: "6",
        name: "Quýt Úc",
        price: 69000,
        quantity: 1,
        image: "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
        unit: "800g"
      }
    ]

    createOrder(testItems, {
      name: "Nguyễn Văn Test",
      phone: "0123456789",
      address: "123 Đường Test, Quận Test, TP.HCM",
      notes: "Đơn hàng test"
    })
  }

  const filteredOrders = orders.filter((order) => {
    if (filter !== "all" && order.status !== filter) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        order.id.toLowerCase().includes(query) ||
        order.customer_name.toLowerCase().includes(query) ||
        order.customer_phone.includes(query) ||
        order.customer_address.toLowerCase().includes(query)
      )
    }

    return true
  })

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    rejected: orders.filter((o) => o.status === "rejected").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  }

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
    )
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
            className={`text-xs ${filter === "all" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
          >
            Tất Cả ({stats.total})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => setFilter("pending")}
            size="sm"
            className={`text-xs ${filter === "pending" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
          >
            Chờ Xác Nhận ({stats.pending})
          </Button>
          <Button
            variant={filter === "confirmed" ? "default" : "outline"}
            onClick={() => setFilter("confirmed")}
            size="sm"
            className={`text-xs ${filter === "confirmed" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
          >
            Đã Xác Nhận ({stats.confirmed})
          </Button>
          <Button
            variant={filter === "delivered" ? "default" : "outline"}
            onClick={() => setFilter("delivered")}
            size="sm"
            className={`text-xs ${filter === "delivered" ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
          >
            Đã Giao Hàng ({stats.delivered})
          </Button>
          <Button
            variant={filter === "cancelled" ? "default" : "outline"}
            onClick={() => setFilter("cancelled")}
            size="sm"
            className={`text-xs ${filter === "cancelled" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
          >
            Đã Hủy ({stats.cancelled})
          </Button>
          <Button
            onClick={createTestOrder}
            size="sm"
            className="ml-auto bg-green-600 hover:bg-green-700 text-white text-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            TẠO
          </Button>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded shadow-sm border border-gray-200 p-4">
          <div className="mb-4">
            <h2 className="text-base font-bold text-gray-900">
              {filter === "all" ? "Tất cả đơn hàng" :
                filter === "pending" ? "Đơn hàng chờ xác nhận" :
                  filter === "confirmed" ? "Đơn hàng đã xác nhận" :
                    filter === "delivered" ? "Đơn hàng đã giao" :
                      filter === "rejected" ? "Đơn hàng đã từ chối" :
                        "Đơn hàng đã hủy"}
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Hiển thị {filteredOrders.length} đơn hàng
            </p>
          </div>

          <OrderList
            orders={filteredOrders}
            onConfirm={confirmOrder}
            onCancel={cancelOrder}
            onDeliver={deliverOrder}
            onViewDetail={setSelectedOrder}
          />
        </div>
      </div>
    </div>
  )
}
