import api from "../axiosConfig";
import type { Order, OrderItem } from "@/types/order";
import { PRODUCT_PLACEHOLDER_IMAGE, getProductImage } from "@/lib/constants";

interface BackendOrderItem {
  _id?: string;
  product_id:
    | string
    | {
        _id?: string;
        id?: string;
        name?: string;
        slug?: string;
        image_primary?: string;
        images?: string[];
        image_url?: string;
        unit_price?: number;
        final_price?: number;
        discount_percent?: number;
        stock_status?: string;
        unit?: string;
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
  address_id?:
    | string
    | {
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
  is_company_invoice?: boolean;
  invoice_info?: {
    company_name?: string;
    company_address?: string;
    tax_code?: string;
    email?: string;
  } | null;
  notes?: string;
}

interface CreateOrderPayload {
  addressId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingFee?: number;
  discount?: number;
  requestInvoice?: boolean;
  invoiceInfo?: {
    companyName: string;
    companyAddress: string;
    taxCode: string;
    email: string;
  };
}

interface OrderJobCreateResponse {
  success?: boolean;
  message?: string;
  jobId?: string | number;
  estimatedTime?: string;
}

interface OrderJobStatusResponse {
  jobId: string;
  state: string;
  result?: {
    success?: boolean;
    orderId?: string;
    message?: string;
    order?: BackendOrder;
  } | null;
  error?: string | null;
  attemptsMade?: number;
  timestamp?: number;
}

class OrderService {
  private readonly basePath = "/orders";
  private transformOrderItem(item: BackendOrderItem, index: number): OrderItem {
    const product =
      typeof item.product_id === "object" ? item.product_id : null;
    const productId =
      typeof item.product_id === "string"
        ? item.product_id
        : product?._id || product?.id || "";

    let productIdNum = 0;
    if (typeof productId === "string") {
      productIdNum = Number.parseInt(productId.slice(-8), 16) || index;
    } else if (typeof productId === "number") {
      productIdNum = productId;
    }

    // Sử dụng getProductImage để lấy hình ảnh đúng cách (kiểm tra image_primary, images[0], etc.)
    const productImage = product ? getProductImage(product) : PRODUCT_PLACEHOLDER_IMAGE;
    
    return {
      id: item._id || `item-${productIdNum}-${index}`,
      product_id: productIdNum,
      product_id_string: String(productId),
      name: product?.name || "Sản phẩm",
      price:
        item.unit_price || product?.final_price || product?.unit_price || 0,
      quantity: item.quantity,
      image: productImage, // Giữ lại để backward compatibility
      images: product?.images || (product?.image_primary ? [product.image_primary] : undefined),
      image_primary: product?.image_primary,
      image_url: product?.image_primary || product?.image_url,
      unit: product?.unit || "1 sản phẩm",
    };
  }

  private transformOrder(order: BackendOrder): Order {
    const address =
      typeof order.address_id === "object" ? order.address_id : null;

    // Map status từ backend sang frontend
    let frontendStatus: Order["status"];
    switch (order.status) {
      case "delivered":
        frontendStatus = "delivered";
        break;
      case "cancelled":
        frontendStatus = "cancelled";
        break;
      case "confirmed":
        frontendStatus = "confirmed";
        break;
      case "shipped":
        frontendStatus = "shipped";
        break;
      default:
        frontendStatus = "pending";
        break;
    }

    return {
      id: order._id || order.id || "",
      customer_name: address?.full_name || "Khách hàng",
      customer_phone: address?.phone || "",
      customer_address:
        [address?.address, address?.ward, address?.district, address?.city]
          .filter(Boolean)
          .join(", ") || "",
      items: order.items.map((item, index) =>
        this.transformOrderItem(item, index)
      ),
      total_amount: order.total || order.subtotal || 0,
      status: frontendStatus,
      // Map payment fields from backend
      payment_status: order.payment_status,
      paid: order.payment_status === "paid",
      payment_method: null,
      created_at: order.created_at || new Date().toISOString(),
      notes: order.notes,
      is_company_invoice: !!order.is_company_invoice,
      invoice_info:
        order.is_company_invoice && order.invoice_info
          ? {
              company_name: order.invoice_info.company_name || "",
              company_address: order.invoice_info.company_address || "",
              tax_code: order.invoice_info.tax_code || "",
              email: order.invoice_info.email || "",
            }
          : null,
    };
  }

  private buildCreateOrderRequest(payload: CreateOrderPayload) {
    const body: {
      address_id: string;
      items: Array<{ product_id: string; quantity: number }>;
      discount?: number;
      shipping_fee?: number;
      is_company_invoice?: boolean;
      invoice_info?: {
        company_name: string;
        company_address: string;
        tax_code: string;
        email: string;
      };
    } = {
      address_id: payload.addressId,
      items: payload.items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
    };

    if (typeof payload.discount === "number") {
      body.discount = payload.discount;
    }

    if (typeof payload.shippingFee === "number") {
      body.shipping_fee = payload.shippingFee;
    }

    if (payload.requestInvoice) {
      body.is_company_invoice = true;
      if (payload.invoiceInfo) {
        body.invoice_info = {
          company_name: payload.invoiceInfo.companyName,
          company_address: payload.invoiceInfo.companyAddress,
          tax_code: payload.invoiceInfo.taxCode,
          email: payload.invoiceInfo.email,
        };
      }
    }

    return body;
  }

  private async getOrderJobStatus(
    jobId: string
  ): Promise<OrderJobStatusResponse> {
    const response = await api.get<OrderJobStatusResponse>(
      `${this.basePath}/job/${jobId}`
    );
    return response.data;
  }

  private async waitForJobCompletion(
    jobId: string,
    timeoutMs = 20000,
    intervalMs = 1000
  ): Promise<{
    jobId: string;
    orderId?: string;
    order?: Order;
  }> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      try {
        const status = await this.getOrderJobStatus(jobId);

        if (status.state === "completed" && status.result?.order) {
          const transformedOrder = this.transformOrder(status.result.order);
          return {
            jobId: status.jobId,
            orderId: status.result.orderId || transformedOrder.id,
            order: transformedOrder,
          };
        }

        if (status.state === "failed") {
          const errorMessage =
            status.error ||
            status.result?.message ||
            "Không thể tạo đơn hàng. Vui lòng thử lại.";
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error(`[OrderService] Error polling job ${jobId}:`, error);
        // Nếu time out sẽ break ở điều kiện while, nên tiếp tục loop tới khi hết thời gian
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    console.warn(
      `[OrderService] Timeout while waiting for order job ${jobId} completion`
    );

    return { jobId };
  }

  /**
   * Lấy danh sách orders của user hiện tại
   * GET /orders
   */
  async getMyOrders(): Promise<Order[]> {
    try {
      const response = await api.get<BackendOrder[]>(this.basePath);
      // Transform data từ backend format sang frontend format
      const transformed = (response.data || []).map((order) =>
        this.transformOrder(order)
      );
      return transformed;
    } catch (error) {
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
      const response = await api.get<BackendOrder>(
        `${this.basePath}/${orderId}`
      );
      return this.transformOrder(response.data);
    } catch (error) {
      console.error(`[OrderService] Error fetching order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Hủy đơn hàng
   * Backend chưa có endpoint cancel, sẽ throw error để hook xử lý local update
   */
  async cancelOrder(orderId: string, cancelReason?: string): Promise<Order> {
    try {
      const response = await api.patch<BackendOrder>(
        `${this.basePath}/${orderId}/cancel`,
        cancelReason ? { cancel_reason: cancelReason } : {}
      );
      return this.transformOrder(response.data);
    } catch (error) {
      console.error(`[OrderService] Error cancelling order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Staff/Admin: Lấy danh sách tất cả đơn hàng
   * GET /orders/admin/all
   */
  async getStaffOrders(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    orders: Order[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get<{
        orders?: BackendOrder[];
        total?: number;
        page?: number;
        totalPages?: number;
      }>(`${this.basePath}/admin/all`, {
        params: {
          status: params?.status,
          page: params?.page,
          limit: params?.limit,
        },
      });

      const backendOrders = response.data?.orders ?? [];
      return {
        orders: backendOrders.map((order) => this.transformOrder(order)),
        total: response.data?.total ?? backendOrders.length,
        page: response.data?.page ?? params?.page ?? 1,
        totalPages: response.data?.totalPages ?? 1,
      };
    } catch (error) {
      console.error(`[OrderService] Error fetching staff orders:`, error);
      throw error;
    }
  }

  /**
   * Staff/Admin: Xác nhận đơn hàng
   */
  async confirmOrderByStaff(orderId: string): Promise<Order> {
    try {
      const response = await api.patch<BackendOrder>(
        `${this.basePath}/admin/${orderId}/confirm`
      );
      return this.transformOrder(response.data);
    } catch (error) {
      console.error(`[OrderService] Error confirming order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Staff/Admin: Cập nhật trạng thái đang giao
   */
  async shipOrder(orderId: string): Promise<Order> {
    try {
      const response = await api.patch<BackendOrder>(
        `${this.basePath}/admin/${orderId}/ship`
      );
      return this.transformOrder(response.data);
    } catch (error) {
      console.error(`[OrderService] Error shipping order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Staff/Admin: Xác nhận giao hàng thành công
   */
  async deliverOrderByStaff(orderId: string): Promise<Order> {
    try {
      const response = await api.patch<BackendOrder>(
        `${this.basePath}/admin/${orderId}/deliver`
      );
      return this.transformOrder(response.data);
    } catch (error) {
      console.error(`[OrderService] Error delivering order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Staff/Admin: Hủy đơn hàng
   */
  async cancelOrderByStaff(
    orderId: string,
    cancelReason?: string
  ): Promise<Order> {
    try {
      const response = await api.patch<BackendOrder>(
        `${this.basePath}/admin/${orderId}/cancel`,
        { cancel_reason: cancelReason ?? "Cancelled by staff" }
      );
      return this.transformOrder(response.data);
    } catch (error) {
      console.error(
        `[OrderService] Error cancelling order ${orderId} by staff:`,
        error
      );
      throw error;
    }
  }
  async createOrder(
    payload: CreateOrderPayload
  ): Promise<{ jobId: string; orderId?: string; order?: Order }> {
    try {
      const requestBody = this.buildCreateOrderRequest(payload);
      const response = await api.post<OrderJobCreateResponse>(
        this.basePath,
        requestBody
      );

      const rawJobId = response.data.jobId;
      if (!rawJobId) {
        const message =
          response.data.message || "Không thể tạo đơn hàng. Thiếu jobId.";
        throw new Error(message);
      }

      const jobId =
        typeof rawJobId === "string" ? rawJobId : rawJobId.toString();
      return await this.waitForJobCompletion(jobId);
    } catch (error) {
      console.error("[OrderService] Error creating order:", error);
      throw error;
    }
  }
}

export default new OrderService();
