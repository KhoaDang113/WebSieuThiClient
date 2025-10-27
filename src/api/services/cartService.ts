import api from "../axiosConfig";
import type {
  ApiResponse,
  AddToCartRequest,
  UpdateCartItemRequest,
  CartItem,
} from "../types";

export interface Cart {
  items: Array<{
    product: any;
    quantity: number;
    price: number;
  }>;
  totalItems: number;
  totalPrice: number;
}

/**
 * Cart Service - Xử lý các API liên quan đến giỏ hàng
 */
class CartService {
  private readonly basePath = "/cart";

  /**
   * Lấy giỏ hàng hiện tại
   */
  async getCart(): Promise<Cart> {
    const response = await api.get<ApiResponse<Cart>>(this.basePath);
    return response.data.data;
  }

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  async addToCart(data: AddToCartRequest): Promise<Cart> {
    const response = await api.post<ApiResponse<Cart>>(
      `${this.basePath}/items`,
      data
    );
    return response.data.data;
  }

  /**
   * Cập nhật số lượng sản phẩm trong giỏ hàng
   */
  async updateCartItem(
    productId: string,
    data: UpdateCartItemRequest
  ): Promise<Cart> {
    const response = await api.put<ApiResponse<Cart>>(
      `${this.basePath}/items/${productId}`,
      data
    );
    return response.data.data;
  }

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   */
  async removeFromCart(productId: string): Promise<Cart> {
    const response = await api.delete<ApiResponse<Cart>>(
      `${this.basePath}/items/${productId}`
    );
    return response.data.data;
  }

  /**
   * Xóa toàn bộ giỏ hàng
   */
  async clearCart(): Promise<void> {
    await api.delete(this.basePath);
  }

  /**
   * Đồng bộ giỏ hàng từ localStorage lên server
   */
  async syncCart(items: CartItem[]): Promise<Cart> {
    const response = await api.post<ApiResponse<Cart>>(
      `${this.basePath}/sync`,
      { items }
    );
    return response.data.data;
  }
}

export default new CartService();
