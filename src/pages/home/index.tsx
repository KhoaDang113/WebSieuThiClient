import { useState, useEffect } from "react";
import { CategoryNav } from "@/components/category/CategoryNav";
import MainBanner from "@/components/home/MainBanner";
import CategoryProductsSection from "@/components/category/CategoryProductsSection";
import { useCart } from "@/components/cart/CartContext";
import DailyMarket from "@/components/home/DailyMarket";
import { categoryService } from "@/api";
import { mainBanners } from "@/lib/sampleData";
import { getProductId, getProductImage } from "@/lib/constants";
import type { Product } from "@/types";

export default function HomePage() {
  const { addToCart } = useCart();
  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories (products được fetch trong CategoryProductsSection)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Lấy danh sách categories
        const categoriesData = await categoryService.getRootCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (
    product: Product & { selectedQuantity?: number }
  ) => {
    // Chuyển đổi Product sang CartItem
    addToCart({
      id: getProductId(product),
      name: product.name,
      price: product.final_price || product.unit_price,
      image: getProductImage(product),
      unit: product.unit || "1 sản phẩm",
      quantity: product.selectedQuantity || 1,
    });

    // TODO: Hiển thị thông báo đã thêm vào giỏ hàng
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // const handleCategorySelect = (category: { id: string; name: string }) => {
  //   console.log("Đã chọn loại:", category.name);
  // };

  return (
    <div className="min-h-screen bg-blue-50 w-full">
      <div className="w-full">
        <div className="w-full bg-white overflow-hidden mb-1">
          <CategoryNav />
        </div>
      </div>

      <div className="w-full">
        {/* Main Banner */}
        <MainBanner banners={mainBanners} />

        {/* Daily Market Section - Đi chợ mỗi ngày */}
        <DailyMarket />

        {/* Category Sections - Hiển thị TẤT CẢ danh mục cấp 1 từ API */}
        <div className="space-y-1 sm:space-y-2">
          {categories.map((category) => (
            <CategoryProductsSection
              key={category._id || category.id}
              title={category.name}
              categorySlug={category.slug}
            onAddToCart={handleAddToCart}
          />
          ))}
          
          {/* Hiển thị message nếu chưa có categories */}
          {categories.length === 0 && (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-500">
                Chưa có danh mục sản phẩm. Vui lòng thêm danh mục trong trang quản trị.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
