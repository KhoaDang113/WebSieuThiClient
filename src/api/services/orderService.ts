import api from "../axiosConfig";
import type {
  ApiResponse,
  PaginatedResponse,
  CreateOrderRequest,
  Order,
} from "../types";

/**
 * Order Service - Xử lý các API liên quan đến đơn hàng
 */
class OrderService {
  private readonly basePath = "/orders";

  /**
   * Tạo đơn hàng mới
   */
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>(this.basePath, data);
    return response.data.data;
  }

  /**
   * Lấy danh sách đơn hàng của user
   */
  async getMyOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Order>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Order>>>(
      `${this.basePath}/my-orders`,
      { params }
    );
    return response.data.data;
  }

  /**
   * Lấy chi tiết đơn hàng
   */
  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(
      `${this.basePath}/${id}`
    );
    return response.data.data;
  }

  /**
   * Hủy đơn hàng
   */
  async cancelOrder(id: string, reason?: string): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>(
      `${this.basePath}/${id}/cancel`,
      { reason }
    );
    return response.data.data;
  }

  /**
   * Xác nhận đã nhận hàng
   */
  async confirmDelivery(id: string): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>(
      `${this.basePath}/${id}/confirm-delivery`
    );
    return response.data.data;
  }

  /**
   * Theo dõi đơn hàng
   */
  async trackOrder(id: string): Promise<{
    order: Order;
    tracking: Array<{
      status: string;
      timestamp: string;
      note?: string;
    }>;
  }> {
    const response = await api.get<ApiResponse<any>>(
      `${this.basePath}/${id}/tracking`
    );
    return response.data.data;
  }
}

export default new OrderService();
