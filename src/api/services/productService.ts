import api from "../axiosConfig";
import type { ApiResponse, PaginatedResponse, ProductQuery } from "../types";
import type { Product } from "../../types";

/**
 * Product Service - Xử lý các API liên quan đến sản phẩm
 */
class ProductService {
  private readonly basePath = "/products";

  /**
   * Lấy danh sách sản phẩm với phân trang và filter
   */
  async getProducts(
    params?: ProductQuery
  ): Promise<PaginatedResponse<Product>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Product>>>(
      this.basePath,
      { params }
    );
    return response.data.data;
  }

  /**
   * Lấy chi tiết sản phẩm theo ID
   */
  async getProductById(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(
      `${this.basePath}/${id}`
    );
    return response.data.data;
  }

  /**
   * Lấy sản phẩm theo slug
   */
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(
      `${this.basePath}/slug/${slug}`
    );
    return response.data.data;
  }

  /**
   * Tìm kiếm sản phẩm
   */
  async searchProducts(
    query: string,
    params?: Omit<ProductQuery, "search">
  ): Promise<PaginatedResponse<Product>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Product>>>(
      `${this.basePath}/search`,
      {
        params: {
          q: query,
          ...params,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Lấy sản phẩm liên quan
   */
  async getRelatedProducts(
    productId: string,
    limit: number = 10
  ): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>(
      `${this.basePath}/${productId}/related`,
      { params: { limit } }
    );
    return response.data.data;
  }

  /**
   * Lấy sản phẩm nổi bật
   */
  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>(
      `${this.basePath}/featured`,
      { params: { limit } }
    );
    return response.data.data;
  }

  /**
   * Lấy sản phẩm mới nhất
   */
  async getNewProducts(limit: number = 10): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>(
      `${this.basePath}/new`,
      { params: { limit } }
    );
    return response.data.data;
  }

  /**
   * Lấy sản phẩm bán chạy
   */
  async getBestSellingProducts(limit: number = 10): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>(
      `${this.basePath}/best-selling`,
      { params: { limit } }
    );
    return response.data.data;
  }

  /**
   * Lấy sản phẩm khuyến mãi
   */
  async getDiscountedProducts(limit?: number): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>(
      `${this.basePath}/discounted`,
      { params: { limit } }
    );
    return response.data.data;
  }
}

export default new ProductService();
