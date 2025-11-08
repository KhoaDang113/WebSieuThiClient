import api from "../axiosConfig";
import type { Banner } from "../../types";

/**
 * Banner Service - Xử lý các API liên quan đến banners (khớp với NestJS backend)
 */
class BannerService {
  private readonly basePath = "/banners";

  /**
   * Lấy danh sách banners (có thể filter theo category)
   * GET /banners?category=slug
   */
  async getBanners(categorySlug?: string): Promise<Banner[]> {
    const response = await api.get<Banner[]>(this.basePath, {
      params: categorySlug ? { category: categorySlug } : undefined,
    });
    return response.data;
  }

  /**
   * Lấy tất cả banners
   * GET /banners
   */
  async getAllBanners(): Promise<Banner[]> {
    const response = await api.get<Banner[]>(this.basePath);
    return response.data;
  }
}

export default new BannerService();

