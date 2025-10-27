import api from "../axiosConfig";
import type { ApiResponse, CategoryQuery } from "../types";
import type { Category } from "../../types/category.type";

/**
 * Catalog Service - Xử lý các API liên quan đến danh mục sản phẩm
 */
class CatalogService {
  private readonly basePath = "/catalog";

  /**
   * Lấy tất cả danh mục
   */
  async getCategories(params?: CategoryQuery): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>(
      `${this.basePath}/categories`,
      { params }
    );
    return response.data.data;
  }

  /**
   * Lấy chi tiết một danh mục
   */
  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(
      `${this.basePath}/categories/${id}`
    );
    return response.data.data;
  }

  /**
   * Lấy danh mục theo slug
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(
      `${this.basePath}/categories/slug/${slug}`
    );
    return response.data.data;
  }

  /**
   * Lấy danh mục con
   */
  async getSubcategories(parentId: string): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>(
      `${this.basePath}/categories/${parentId}/subcategories`
    );
    return response.data.data;
  }

  /**
   * Lấy sản phẩm theo danh mục
   */
  async getProductsByCategory(
    categoryId: string,
    params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }
  ) {
    const response = await api.get(
      `${this.basePath}/categories/${categoryId}/products`,
      { params }
    );
    return response.data.data;
  }
}

export default new CatalogService();
