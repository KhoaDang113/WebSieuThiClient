"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import type { CartItem } from "@/types/cart.type"
import { useAuthStore } from "@/stores/authStore"

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
  const { user } = useAuthStore()
  
  // Lấy cart key dựa trên userId
  const getCartKey = useCallback(() => {
    if (user?.id) {
      return `cart_${user.id}`
    }
    return "cart_guest" // Cart cho guest user
  }, [user?.id])

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load từ localStorage khi khởi tạo
    if (typeof window !== "undefined") {
      const cartKey = user?.id ? `cart_${user.id}` : "cart_guest"
      const saved = localStorage.getItem(cartKey)
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

  // Khi user thay đổi, clear cart cũ và load cart của user mới
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Clear cart ngay lập tức khi user thay đổi
      setCartItems([])
      
      // Sau đó load cart của user mới (nếu có)
      // Sử dụng user?.id trực tiếp để tránh race condition
      const currentUserId = user?.id
      const cartKey = currentUserId ? `cart_${currentUserId}` : "cart_guest"
      const saved = localStorage.getItem(cartKey)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // Chỉ load nếu có items và là array hợp lệ
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Double check user vẫn còn (tránh load cart của user khác)
            const checkUserId = user?.id
            const checkCartKey = checkUserId ? `cart_${checkUserId}` : "cart_guest"
            if (cartKey === checkCartKey) {
              setCartItems(parsed)
            }
          }
        } catch {
          setCartItems([])
        }
      }
    }
  }, [user?.id, getCartKey, user])

  // Lưu vào localStorage mỗi khi cart thay đổi
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cartKey = getCartKey()
      localStorage.setItem(cartKey, JSON.stringify(cartItems))
    }
  }, [cartItems, getCartKey])

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
