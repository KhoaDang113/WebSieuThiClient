import api from "../axiosConfig";

interface ShippingFeeResponse {
  distance: number;
  duration: number;
  shippingFee: number;
  estimatedDeliveryTime: string;
}

class ShippingService {
  private readonly basePath = "/shipping";

  async calculateShippingFee(
    addressId: string,
    orderTotal: number
  ): Promise<ShippingFeeResponse> {
    const response = await api.post<ShippingFeeResponse>(
      `${this.basePath}/calculate-fee`,
      {
        addressId,
        orderTotal,
      }
    );
    return response.data;
  }
}

export default new ShippingService();
