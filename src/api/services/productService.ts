import api from "../axiosConfig";
import type { Product } from "../../types";

/**
 * Product Service - Xử lý các API liên quan đến sản phẩm (khớp với NestJS backend)
 */
class ProductService {
  private readonly basePath = "/products";

  /**
   * Lấy danh sách sản phẩm (có thể filter theo category)
   * GET /products?category=slug&page=1&limit=10
   */
  async getProducts(
    categorySlug?: string,
    params?: { page?: number; limit?: number }
  ): Promise<Product[]> {
    const response = await api.get<Product[]>(this.basePath, {
      params: {
        ...(categorySlug && { category: categorySlug }),
        ...params,
      },
    });
    return response.data;
  }

  async getProductsAdmin(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    total: number;
    page: number;
    limit: number;
    products: Product[];
  }> {
    const response = await api.get<{
      total: number;
      page: number;
      limit: number;
      products: Product[];
    }>(`${this.basePath}/products-admin`, {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * Lấy sản phẩm khuyến mãi (có thể filter theo category)
   * GET /products/promotions?category=slug
   */
  async getProductPromotions(
    categorySlug?: string,
    params?: { page?: number; limit?: number }
  ): Promise<Product[]> {
    const response = await api.get<Product[]>(`${this.basePath}/promotions`, {
      params: {
        ...(categorySlug && { category: categorySlug }),
        ...params,
      },
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

  /**
   * Xóa sản phẩm (soft delete)
   * DELETE /products/:id
   */
  async deleteProduct(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(
      `${this.basePath}/${id}`
    );
    return response.data;
  }

  /**
   * Cập nhật sản phẩm
   * PUT /products/:id
   */
  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await api.put<Product>(`${this.basePath}/${id}`, data);
    return response.data;
  }
   
  async getRelatedProducts(id: string, limit: number = 5): Promise<Product[]> {
    const response = await api.get<Product[]>(
      `${this.basePath}/${id}/related`,
      {
        params: { limit },
      }
    );
    return response.data;
  }
}

export default new ProductService();
