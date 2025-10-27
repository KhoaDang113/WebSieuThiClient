import { useState, useEffect } from "react";
import cartService, { type Cart } from "../services/cartService";
import type { AddToCartRequest } from "../types";

/**
 * Hook để quản lý giỏ hàng
 */
export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart khi mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getCart();
      setCart(data);
    } catch (err: any) {
      // Nếu user chưa đăng nhập, tạo cart rỗng
      if (err.response?.status === 401) {
        setCart({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      } else {
        setError(err.response?.data?.message || "Không thể tải giỏ hàng");
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (data: AddToCartRequest) => {
    try {
      setError(null);
      const updatedCart = await cartService.addToCart(data);
      setCart(updatedCart);
      return updatedCart;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Thêm vào giỏ hàng thất bại";
      setError(errorMessage);
      throw err;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setError(null);
      const updatedCart = await cartService.updateCartItem(productId, {
        quantity,
      });
      setCart(updatedCart);
      return updatedCart;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Cập nhật giỏ hàng thất bại";
      setError(errorMessage);
      throw err;
    }
  };

  const removeItem = async (productId: string) => {
    try {
      setError(null);
      const updatedCart = await cartService.removeFromCart(productId);
      setCart(updatedCart);
      return updatedCart;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Xóa sản phẩm thất bại";
      setError(errorMessage);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await cartService.clearCart();
      setCart({
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Xóa giỏ hàng thất bại";
      setError(errorMessage);
      throw err;
    }
  };

  return {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
};
