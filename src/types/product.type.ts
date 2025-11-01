export interface Product {
  id: number;
  name: string;
  description: string;
  unit_price: number;
  final_price: number;
  stock_quantity: number;
  discount_percent: number;
  is_hot: boolean;
  product_suggestion_id?: number;
  image_url: string;
  slug: string;
  quantity?: string; // Số lượng/số gam (ví dụ: "500g", "1kg", "2 chai", "1 hộp")
}

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}
