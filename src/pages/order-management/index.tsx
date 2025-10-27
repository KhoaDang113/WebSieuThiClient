"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useOrders } from "@/hooks/useOrders"
import { Clock, Package, Plus, Search, Check, Trash2, Eye, ChevronLeft, Phone, MapPin, Calendar, User, TrendingUp, CheckCircle2, XCircle, Truck } from "lucide-react"
import type { Order } from "@/types/order"

// Component OrderStatus
function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const statusConfig = {
    pending: {
      label: "Chờ Xác Nhận",
      color: "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-md",
      icon: Clock,
    },
    confirmed: {
      label: "Đã Xác Nhận",
      color: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-md",
      icon: CheckCircle2,
    },
    delivered: {
      label: "Đã Giao Hàng",
      color: "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-md",
      icon: Truck,
    },
    rejected: {
      label: "Đã Từ Chối",
      color: "bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-md",
      icon: XCircle,
    },
    cancelled: {
      label: "Đã Hủy",
      color: "bg-gradient-to-r from-gray-400 to-gray-600 text-white border-0 shadow-md",
      icon: XCircle,
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon
  return (
    <Badge className={`${config.color} font-semibold px-4 py-2 text-sm flex items-center gap-2`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </Badge>
  )
}

// Component OrderListItem
function OrderListItem({ order, onConfirm, onCancel, onViewDetail }: {
  order: Order
  onConfirm: (orderId: string) => void
  onCancel: (orderId: string) => void
  onViewDetail: (order: Order) => void
}) {
  const firstItem = order.items[0]
  const otherItemsCount = order.items.length - 1

  return (
    <Card className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0 bg-white hover:-translate-y-1">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-lg font-bold text-gray-900">Mã đơn: {order.id}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-blue-200 shadow-md group-hover:scale-105 transition-transform duration-300">
            <img 
              src={firstItem.image} 
              alt={firstItem.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/96x96?text=No+Image"
              }}
            />
            {otherItemsCount > 0 && (
              <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                +{otherItemsCount}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="font-bold text-gray-900 truncate text-lg">{firstItem.name}</h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-200">
                {firstItem.quantity} × {firstItem.price.toLocaleString("vi-VN")}đ/{firstItem.unit}
              </span>
              {otherItemsCount > 0 && (
                <span className="text-blue-600 font-semibold flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {otherItemsCount} sản phẩm khác
                </span>
              )}
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{order.customer_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{order.customer_phone}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right space-y-2">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Tổng tiền</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {order.total_amount.toLocaleString("vi-VN")}đ
              </p>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => onViewDetail(order)} 
                size="sm"
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Eye className="w-4 h-4 mr-2" />
                Chi tiết
              </Button>
              {order.status === "pending" && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => onConfirm(order.id)} 
                    size="sm"
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Xác nhận
                  </Button>
                  <Button 
                    onClick={() => onCancel(order.id)} 
                    size="sm"
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Hủy
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Component OrderList
function OrderList({ orders, onConfirm, onCancel, onViewDetail }: {
  orders: Order[]
  onConfirm: (orderId: string) => void
  onCancel: (orderId: string) => void
  onViewDetail: (order: Order) => void
}) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center animate-pulse">
              <Package className="w-16 h-16 text-blue-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 animate-ping"></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Không có đơn hàng nào</h3>
            <p className="text-gray-500 text-lg">Chưa có đơn hàng nào trong danh sách này</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderListItem 
          key={order.id} 
          order={order} 
          onConfirm={onConfirm} 
          onCancel={onCancel}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  )
}

// Component OrderDetail
function OrderDetailView({ order, onBack }: { order: Order, onBack: () => void }) {
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
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack} 
            className="mr-4 hover:bg-gray-100 p-2 rounded-full transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="text-gray-700 font-medium">Quay lại trang quản lý</span>
          </button>
          <OrderStatusBadge status={order.status} />
        </div>

      <Card className="shadow-2xl border-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-6 pt-8">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
              Thông tin khách hàng
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Tên khách hàng</p>
                <p className="font-bold text-gray-900 text-lg">{order.customer_name}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Số điện thoại</p>
                <p className="font-bold text-gray-900 text-lg">{order.customer_phone}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 md:col-span-2">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium mb-1">Địa chỉ giao hàng</p>
                <p className="font-bold text-gray-900 text-lg">{order.customer_address}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 md:col-span-2">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Ngày đặt hàng</p>
                <p className="font-bold text-gray-900 text-lg">{formatDate(order.created_at)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xl border-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"></div>
        <CardHeader className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 pb-6 pt-8">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent font-bold">
              Sản phẩm đã đặt
            </span>
            <Badge className="ml-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-base px-4 py-2 shadow-md">
              {order.items.length} sản phẩm
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={item.id} className="group relative flex items-center gap-6 p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
                <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {index + 1}
                </div>
                <div className="w-28 h-28 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl overflow-hidden shadow-lg border-2 border-blue-200 flex-shrink-0 ml-6 group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/112x112?text=No+Image"
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                  <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                      SL: {item.quantity} {item.unit}
                    </span>
                    <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-200">
                      Đơn giá: {item.price.toLocaleString("vi-VN")}đ/{item.unit}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Thành tiền</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <CardContent className="p-8">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <TrendingUp className="w-8 h-8" />
              </div>
              <span className="text-3xl font-bold tracking-tight">Tổng cộng:</span>
            </div>
            <span className="text-5xl font-black tracking-tight">
              {order.total_amount.toLocaleString("vi-VN")}đ
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function OrdersPage() {
  const { orders, confirmOrder, cancelOrder, createOrder } = useOrders()
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-5xl mx-auto p-8">
          <OrderDetailView 
            order={selectedOrder}
            onBack={() => setSelectedOrder(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold opacity-90 flex items-center gap-2 uppercase tracking-wide">
                <Package className="w-5 h-5" />
                Tổng Đơn Hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-black">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold opacity-90 flex items-center gap-2 uppercase tracking-wide">
                <Clock className="w-5 h-5" />
                Chờ Xác Nhận
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-black">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold opacity-90 uppercase tracking-wide">Đã Xác Nhận</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-black">{stats.confirmed}</div>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-500 to-gray-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold opacity-90 uppercase tracking-wide">Đã Hủy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-black">{stats.cancelled}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Box */}
        <div className="mb-8">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng (Mã đơn, tên khách, SĐT, địa chỉ)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg shadow-lg"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-10 p-6 bg-white rounded-2xl shadow-xl border-0">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            onClick={() => setFilter("all")}
            className={`rounded-xl font-bold text-base px-6 py-6 transition-all duration-300 ${
              filter === "all" 
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:shadow-xl" 
                : "hover:bg-gray-50"
            }`}
          >
            Tất Cả ({stats.total})
          </Button>
          <Button 
            variant={filter === "pending" ? "default" : "outline"} 
            onClick={() => setFilter("pending")}
            className={`rounded-xl font-bold text-base px-6 py-6 transition-all duration-300 ${
              filter === "pending" 
                ? "bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg hover:shadow-xl" 
                : "hover:bg-gray-50"
            }`}
          >
            <Clock className="w-5 h-5 mr-2" />
            Chờ Xác Nhận ({stats.pending})
          </Button>
          <Button 
            variant={filter === "confirmed" ? "default" : "outline"} 
            onClick={() => setFilter("confirmed")}
            className={`rounded-xl font-bold text-base px-6 py-6 transition-all duration-300 ${
              filter === "confirmed" 
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg hover:shadow-xl" 
                : "hover:bg-gray-50"
            }`}
          >
            Đã Xác Nhận ({stats.confirmed})
          </Button>
          <Button 
            variant={filter === "cancelled" ? "default" : "outline"} 
            onClick={() => setFilter("cancelled")}
            className={`rounded-xl font-bold text-base px-6 py-6 transition-all duration-300 ${
              filter === "cancelled" 
                ? "bg-gradient-to-r from-gray-500 to-gray-700 shadow-lg hover:shadow-xl" 
                : "hover:bg-gray-50"
            }`}
          >
            Đã Hủy ({stats.cancelled})
          </Button>
          <Button 
            onClick={createTestOrder}
            className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-base px-6 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tạo đơn test
          </Button>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-xl border-0 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 flex items-center gap-3">
              <div className="w-2 h-10 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              {filter === "all" ? "Tất cả đơn hàng" : 
               filter === "pending" ? "Đơn hàng chờ xác nhận" :
               filter === "confirmed" ? "Đơn hàng đã xác nhận" :
               filter === "delivered" ? "Đơn hàng đã giao" :
               filter === "rejected" ? "Đơn hàng đã từ chối" :
               "Đơn hàng đã hủy"}
            </h2>
            <p className="text-gray-600 text-lg font-medium">
              Hiển thị <span className="text-blue-600 font-bold">{filteredOrders.length}</span> đơn hàng
            </p>
          </div>
          
          <OrderList 
            orders={filteredOrders} 
            onConfirm={confirmOrder} 
            onCancel={cancelOrder}
            onViewDetail={setSelectedOrder}
          />
        </div>
      </div>
    </div>
  )
}