import api from "../axiosConfig";
import type { Product } from "../../types";

/**
 * Product Service - Xử lý các API liên quan đến sản phẩm (khớp với NestJS backend)
 */
class ProductService {
  private readonly basePath = "/products";

  /**
   * Lấy danh sách sản phẩm (có thể filter theo category)
   * GET /products?category=slug
   */
  async getProducts(categorySlug?: string): Promise<Product[]> {
    const response = await api.get<Product[]>(this.basePath, {
      params: categorySlug ? { category: categorySlug } : undefined,
    });
    return response.data;
  }

  /**
   * Lấy sản phẩm khuyến mãi (có thể filter theo category)
   * GET /products/promotions?category=slug
   */
  async getProductPromotions(categorySlug?: string): Promise<Product[]> {
    const response = await api.get<Product[]>(`${this.basePath}/promotions`, {
      params: categorySlug ? { category: categorySlug } : undefined,
    });
    return response.data;
  }

  /**
   * Lấy chi tiết sản phẩm theo ID
   * GET /products/:id
   */
  async getProductById(id: string): Promise<Product> {
    const response = await api.get<Product>(`${this.basePath}/${id}`);
    return response.data;
  }
}

export default new ProductService();
