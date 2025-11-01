"use client"

import EmptyCart from "@/components/cart/EmptyCart"
import CartWithItems from "@/components/cart/CartWithItems"
import { useCart } from "@/components/cart/CartContext"
import { useNavigate } from "react-router-dom"

export default function ShoppingCart() {
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart()
  const navigate = useNavigate()

  // Xử lý thêm sản phẩm mẫu để test
  // const addSampleItem = () => {
  //   const sampleItem = {
  //     id: "sample-1",
  //     name: "Mặt nạ dưỡng da trắng hồng Senka Perfect Aqua Extra White Mask 25ml",
  //     price: 37400,
  //     image: "https://cdn.tgdd.vn/Products/Images/2417/92676/bhx/mat-na-duong-da-trang-hong-senka-perfect-aqua-extra-white-mask-25ml-202207151550066960.jpg",
  //     unit: "Gói",
  //     quantity: 1,
  //   }
  //   addToCart(sampleItem)
  // }

  // Render theo trạng thái giỏ hàng
  return (
    <div className="min-h-screen bg-blue-50">
      {cartItems.length === 0 ? (
        <EmptyCart onContinueShopping={() => navigate("/")} />
      ) : (
        <CartWithItems
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
        />
      )}
    </div>
  )
}
