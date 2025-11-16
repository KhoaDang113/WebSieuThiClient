import { useEffect, useState } from "react";
import CategorySection from "@/components/home/CategorySection";
import Banners from "@/components/productPage/banner/Banners";
import { productService, bannerService } from "@/api";
import type { Product } from "@/types/product.type";
import type { Banner } from "@/types/banner.type";

interface CategoryProductsSectionProps {
  title: string;
  categorySlug: string;
  isPromotion?: boolean;
  page?: number;
  limit?: number;
  onAddToCart?: (product: Product) => void;
}

export default function CategoryProductsSection({
  title,
  categorySlug,
  isPromotion = false,
  page = 1,
  limit = 10,
  onAddToCart,
}: CategoryProductsSectionProps) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryBanners, setCategoryBanners] = useState<Banner[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const data = isPromotion
          ? await productService.getProductPromotions(categorySlug, { page, limit })
          : await productService.getProducts(categorySlug, { page, limit });
        if (mounted) setProducts(data);
        
        // Fetch banners cho category này
        try {          
          const banners = await bannerService.getBanners(categorySlug);
          if (mounted) {
            // Đảm bảo banners là array và có dữ liệu hợp lệ
            if (Array.isArray(banners) && banners.length > 0) {
              // Validate banners có image_url hợp lệ
              const validBanners = banners.filter(banner => 
                banner && (banner.image_url || banner.image)
              );
              
              if (validBanners.length > 0) {
                setCategoryBanners(validBanners);
              } else {
                console.warn(`[CategoryProductsSection] No valid banners (with image) for category: "${categorySlug}"`);
                setCategoryBanners([]);
              }
            } else {
              console.warn(`[CategoryProductsSection] No banners found for category: "${categorySlug}" (received: ${banners?.length || 0} banners)`);
              setCategoryBanners([]);
            }
          }
        } catch (error: Error | unknown) {
          console.error(`[CategoryProductsSection] Error fetching banners for category "${categorySlug}":`, error);
          const axiosError = error as { message?: string; response?: { data?: unknown; status?: number } };
          console.error(`[CategoryProductsSection] Error details:`, {
            message: axiosError?.message,
            response: axiosError?.response?.data,
            status: axiosError?.response?.status,
          });
          if (mounted) setCategoryBanners([]);
        }
      } catch (error) {
        console.error("Error loading products for", categorySlug, error);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [categorySlug, isPromotion, page, limit]);

  if (loading) {
    return (
      <div className="mb-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="relative bg-gradient-to-r from-green-50 to-white py-4 border-b-2 border-green-100">
            <div className="flex justify-center">
              <div className="inline-flex items-center justify-center rounded-full bg-white border-2 border-green-600 px-8 py-2.5 shadow-md">
                <h2 className="text-base font-bold text-green-700 uppercase tracking-wide">
                  {title}
                </h2>
              </div>
            </div>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-4 bg-white">
                <div className="w-full h-28 bg-gray-100 rounded animate-pulse mb-3" />
                <div className="h-4 bg-gray-100 rounded mb-2 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hiển thị banners trả về từ API (nếu có) */}
      {categoryBanners.length > 0 && (
        <div className="mb-1 sm:mb-2">
          <Banners banners={categoryBanners} />
        </div>
      )}
      
      <CategorySection
        categoryName={title}
        products={products}
        onAddToCart={onAddToCart}
      />
    </>
  );
}


