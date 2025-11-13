import api from "../axiosConfig";
import type { Order, OrderItem } from "@/types/order";

/**
 * Backend Order format (từ API)
 */
interface BackendOrderItem {
  _id?: string;
  product_id: string | {
    _id?: string;
    id?: string;
    name?: string;
    slug?: string;
    image_primary?: string;
    unit_price?: number;
    final_price?: number;
    discount_percent?: number;
    stock_status?: string;
  };
  quantity: number;
  unit_price: number;
  discount_percent?: number;
  total_price: number;
}

interface BackendOrder {
  _id?: string;
  id?: string;
  user_id?: string;
  address_id?: string | {
    _id?: string;
    id?: string;
    full_name?: string;
    phone?: string;
    address?: string;
    ward?: string;
    district?: string;
    city?: string;
    zip_code?: string;
  };
  items: BackendOrderItem[];
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  discount?: number;
  shipping_fee?: number;
  total: number;
  payment_status?: "pending" | "paid" | "failed";
  created_at?: string;
  updated_at?: string;
}

/**
 * Order Service - Xử lý các API liên quan đến orders (khớp với NestJS backend)
 */
class OrderService {
  private readonly basePath = "/orders";

  /**
   * Transform OrderItem từ backend format sang frontend format
   */
  private transformOrderItem(item: BackendOrderItem, index: number): OrderItem {
    const product = typeof item.product_id === 'object' ? item.product_id : null;
    const productId = typeof item.product_id === 'string' 
      ? item.product_id 
      : (product?._id || product?.id || "");
    
    // Lấy product ID dạng string hoặc number
    let productIdNum = 0;
    if (typeof productId === 'string') {
      // Nếu là MongoDB ObjectId, lấy số từ string hoặc hash
      productIdNum = parseInt(productId.slice(-8), 16) || index;
    } else if (typeof productId === 'number') {
      productIdNum = productId;
    }
    
    return {
      id: item._id || `item-${productIdNum}-${index}`,
      product_id: productIdNum,
      name: product?.name || "Sản phẩm",
      price: item.unit_price || product?.final_price || product?.unit_price || 0,
      quantity: item.quantity,
      image: product?.image_primary || "",
      unit: product?.unit_price ? "1 sản phẩm" : "1 sản phẩm", // Backend không có unit trong product
    };
  }

  /**
   * Transform Order từ backend format sang frontend format
   */
  private transformOrder(order: BackendOrder): Order {
    const address = typeof order.address_id === 'object' ? order.address_id : null;
    
    // Map status từ backend sang frontend
    let frontendStatus: Order["status"] = "pending";
    if (order.status === "delivered") {
      frontendStatus = "delivered";
    } else if (order.status === "cancelled") {
      frontendStatus = "cancelled";
    } else if (order.status === "confirmed" || order.status === "shipped") {
      frontendStatus = "confirmed";
    } else {
      frontendStatus = "pending";
    }

    return {
      id: order._id || order.id || "",
      customer_name: address?.full_name || "Khách hàng",
      customer_phone: address?.phone || "",
      customer_address: [
        address?.address,
        address?.ward,
        address?.district,
        address?.city,
      ].filter(Boolean).join(", ") || "",
      items: order.items.map((item, index) => this.transformOrderItem(item, index)),
      total_amount: order.total || order.subtotal || 0,
      status: frontendStatus,
      created_at: order.created_at || new Date().toISOString(),
      notes: undefined,
    };
  }

  /**
   * Lấy danh sách orders của user hiện tại
   * GET /orders
   */
  async getMyOrders(): Promise<Order[]> {
    try {
      const response = await api.get<BackendOrder[]>(this.basePath);
      
      // Transform data từ backend format sang frontend format
      const transformed = (response.data || []).map(order => this.transformOrder(order));
      
      console.log(`[OrderService] Fetched ${transformed.length} orders`);
      return transformed;
    } catch (error: any) {
      console.error(`[OrderService] Error fetching orders:`, error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết order theo ID
   * GET /orders/:id
   */
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await api.get<BackendOrder>(`${this.basePath}/${orderId}`);
      return this.transformOrder(response.data);
    } catch (error: any) {
      console.error(`[OrderService] Error fetching order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Hủy đơn hàng
   * Backend chưa có endpoint cancel, sẽ throw error để hook xử lý local update
   */
  async cancelOrder(orderId: string): Promise<Order> {
    // Backend chưa có endpoint cancel order
    // Có thể thêm sau: PATCH /orders/:id/cancel hoặc PATCH /orders/:id với body { status: 'cancelled' }
    throw new Error("Cancel order endpoint not implemented in backend");
  }
}

export default new OrderService();

