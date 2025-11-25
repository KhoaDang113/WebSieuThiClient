import api from "../axiosConfig";
import type { OrderRating, CreateOrderRatingDto } from "@/types/order-rating.type";

class OrderRatingService {
  private readonly basePath = "/order-rating";

  async createRating(data: CreateOrderRatingDto): Promise<OrderRating> {
    try {
      const response = await api.post<OrderRating>(this.basePath, data);
      return response.data;
    } catch (error) {
      console.error("[OrderRatingService] Error creating rating:", error);
      throw error;
    }
  }

  async getRatingById(ratingId: string): Promise<OrderRating> {
    try {
      const response = await api.get<OrderRating>(`${this.basePath}/${ratingId}`);
      return response.data;
    } catch (error) {
      console.error(`[OrderRatingService] Error fetching rating ${ratingId}:`, error);
      throw error;
    }
  }

  async getRatingByOrderId(orderId: string): Promise<OrderRating | null> {
    try {
      const response = await api.get<OrderRating>(`${this.basePath}/${orderId}`);
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      console.error(`[OrderRatingService] Error fetching rating for order ${orderId}:`, error);
      throw error;
    }
  }

  async updateRating(
    ratingId: string,
    data: Partial<CreateOrderRatingDto>
  ): Promise<OrderRating> {
    try {
      const response = await api.patch<OrderRating>(
        `${this.basePath}/${ratingId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(`[OrderRatingService] Error updating rating ${ratingId}:`, error);
      throw error;
    }
  }
}

export default new OrderRatingService();
