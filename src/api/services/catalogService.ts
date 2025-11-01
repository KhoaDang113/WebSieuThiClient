import api from "../axiosConfig";
import type { Category } from "../../types/category.type";

/**
 * Category Service - Xử lý các API liên quan đến danh mục (khớp với NestJS backend)
 */
class CategoryService {
  private readonly basePath = "/categories";

  /**
   * Lấy tất cả danh mục
   * GET /categories
   */
  async getAllCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>(this.basePath);
    return response.data;
  }

  /**
   * Lấy danh mục gốc (root categories)
   * GET /categories/root
   */
  async getRootCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>(`${this.basePath}/root`);
    return response.data;
  }

  /**
   * Lấy danh mục theo ID
   * GET /categories/:id
   */
  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get<Category>(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * Lấy danh mục con (children)
   * GET /categories/:id/children
   */
  async getCategoryChildren(id: string): Promise<Category[]> {
    const response = await api.get<Category[]>(
      `${this.basePath}/${id}/children`
    );
    return response.data;
  }

  /**
   * Lấy danh mục theo slug
   * GET /categories/slug/:slug
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await api.get<Category>(`${this.basePath}/slug/${slug}`);
    return response.data;
  }
}

export default new CategoryService();
