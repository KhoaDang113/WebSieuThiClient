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
}

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}
