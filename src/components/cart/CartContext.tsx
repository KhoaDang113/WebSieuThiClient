"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import type { CartItem } from "@/types/cart.type"

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function CartProviderInner({ children }: { children: ReactNode }) {
  
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load từ localStorage khi khởi tạo
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return []
        }
      }
    }
    return []
  })

  // Lưu vào localStorage mỗi khi cart thay đổi
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems])

  const addToCart = useCallback((item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const addedQuantity = item.quantity || 1
    const itemId = item.id
    
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === itemId)
      
      if (existingItem) {
        // Nếu đã có trong giỏ, tăng số lượng
        const newQuantity = existingItem.quantity + addedQuantity
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: newQuantity } : i
        )
      } else {
        // Thêm mới vào giỏ
        return [...prev, { ...item, quantity: addedQuantity }]
      }
    })
  }, [])
  

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function CartProvider({ children }: { children: ReactNode }) {
  return <CartProviderInner>{children}</CartProviderInner>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
