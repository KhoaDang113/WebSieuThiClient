"use client"

import { useState, useCallback, useEffect } from "react"
import type { Order } from "@/types/order"
import type { CartItem } from "@/types/cart.type"
import { orderService } from "@/api"
import { useAuthStore } from "@/stores/authStore"

export function useOrders() {
  const { user, isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch orders từ API khi user đăng nhập
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user?.id) {
        setLoading(false)
        setOrders([])
        return
      }

      try {
        setLoading(true)
        setError(null)
        const fetchedOrders = await orderService.getMyOrders()
        setOrders(fetchedOrders)
      } catch (err: any) {
        console.error("Error fetching orders:", err)
        setError(err?.response?.data?.message || "Không thể tải danh sách đơn hàng")
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, user?.id])

  const confirmOrder = useCallback((orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => 
        order.id === orderId 
          ? { ...order, status: "confirmed" as const } 
          : order
      )
    )
  }, [])

  const rejectOrder = useCallback((orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => 
        order.id === orderId 
          ? { ...order, status: "rejected" as const } 
          : order
      )
    )
  }, [])

  const deliverOrder = useCallback((orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => 
        order.id === orderId 
          ? { ...order, status: "delivered" as const } 
          : order
      )
    )
  }, [])

  const cancelOrder = useCallback(async (orderId: string) => {
    try {
      // Thử gọi API cancel order
      const updatedOrder = await orderService.cancelOrder(orderId)
      setOrders((prevOrders) =>
        prevOrders.map((order) => 
          order.id === orderId 
            ? updatedOrder
            : order
        )
      )
    } catch (err) {
      // Nếu API chưa có, update local state
      console.warn("Cancel order API not available, updating local state")
      setOrders((prevOrders) =>
        prevOrders.map((order) => 
          order.id === orderId 
            ? { ...order, status: "cancelled" as const } 
            : order
        )
      )
    }
  }, [])

  // Tạo đơn hàng mới từ giỏ hàng
  const createOrder = useCallback((
    cartItems: CartItem[], 
    customerInfo: {
      name: string
      phone: string
      address: string
      notes?: string
    }
  ) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_address: customerInfo.address,
      items: cartItems.map((item, index) => ({
        id: `item-${Date.now()}-${index}`,
        product_id: parseInt(item.id),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        unit: item.unit
      })),
      total_amount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: "pending",
      created_at: new Date().toISOString(),
      notes: customerInfo.notes
    }

    setOrders((prevOrders) => [newOrder, ...prevOrders])
    return newOrder.id
  }, [])

  return { 
    orders, 
    loading,
    error,
    confirmOrder, 
    rejectOrder, 
    deliverOrder, 
    cancelOrder, 
    createOrder 
  }
}
