"use client"

import { useState, useCallback, useEffect } from "react"
import type { Order } from "@/types/order"
import type { CartItem } from "@/types/cart.type"
import { sampleOrders } from "@/lib/sampleData"

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(() => {
    // Load từ localStorage khi khởi tạo
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("orders")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return sampleOrders
        }
      }
    }
    return sampleOrders
  })

  // Lưu vào localStorage mỗi khi orders thay đổi
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("orders", JSON.stringify(orders))
    }
  }, [orders])

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

  const cancelOrder = useCallback((orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => 
        order.id === orderId 
          ? { ...order, status: "cancelled" as const } 
          : order
      )
    )
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
    confirmOrder, 
    rejectOrder, 
    deliverOrder, 
    cancelOrder, 
    createOrder 
  }
}
