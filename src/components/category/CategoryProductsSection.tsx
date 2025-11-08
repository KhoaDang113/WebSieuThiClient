import { useEffect, useState } from "react";
import CategorySection from "@/components/home/CategorySection";
import Banners from "@/components/productPage/banner/Banners";
import { productService } from "@/api";
import { categoryBanners } from "@/lib/sampleData";
import type { Product } from "@/types/product.type";

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

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = isPromotion
          ? await productService.getProductPromotions(categorySlug, { page, limit })
          : await productService.getProducts(categorySlug, { page, limit });
        if (mounted) setProducts(data);
      } catch (error) {
        console.error("Error loading products for", categorySlug, error);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
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
      {/* Banners bên trên mỗi section - Dùng dữ liệu mẫu */}
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


