export interface OrderRating {
  _id: string;
  order_id: string;
  user_id: string;
  rating_overall: number;
  rating_product_quality?: number;
  rating_packaging?: number;
  rating_delivery_time?: number;
  rating_shipper?: number;
  comment?: string;
  images?: string[];
  addmin_respone?: string;
  addmin_respone_time?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRatingDto {
  order_id: string;
  rating_overall: number;
  rating_product_quality?: number;
  rating_packaging?: number;
  rating_delivery_time?: number;
  rating_shipper?: number;
  comment?: string;
  images?: string[];
}
