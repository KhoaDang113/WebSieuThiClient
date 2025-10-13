import { CategoryNav } from "@/components/CategoryNav";
import MainBanner from "@/components/home/MainBanner";
import CategorySection from "@/components/home/CategorySection";
import Banners from "@/components/productPage/banner/Banners";
import {
  mainBanners,
  sampleProductsByCategory,
  categoryBanners,
} from "@/lib/sampleData";
import type { Product } from "@/types";

export default function HomePage() {
  const handleAddToCart = (product: Product) => {
    console.log("Thêm vào giỏ hàng:", product.name);
    // TODO: Implement add to cart logic
  };

  const handleCategorySelect = (category: { id: string; name: string }) => {
    console.log("Đã chọn loại:", category.name);
  };

  return (
    <div className="min-h-screen">
      <CategoryNav />

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Main Banner */}
        <MainBanner banners={mainBanners} />

        {/* Category Sections */}
        <div className="space-y-6 sm:space-y-8">
          {/* THỊT, CÁ, TRỨNG, HẢI SẢN */}
          <CategorySection
            categoryName="THỊT, CÁ, TRỨNG, HẢI SẢN"
            products={sampleProductsByCategory["thit-ca-trung-hai-san"] || []}
            banners={categoryBanners}
            onAddToCart={handleAddToCart}
          />

          {/* Banner giữa các danh mục */}
          <div className="my-6 sm:my-8">
            <Banners banners={categoryBanners} />
          </div>

          {/* RAU, CỦ, NẤM, TRÁI CÂY */}
          <CategorySection
            categoryName="RAU, CỦ, NẤM, TRÁI CÂY"
            products={sampleProductsByCategory["rau-cu-nam-trai-cay"] || []}
            banners={categoryBanners}
            onAddToCart={handleAddToCart}
          />

          {/* DẦU ĂN, NƯỚC CHẤM, GIA VỊ */}
          <CategorySection
            categoryName="DẦU ĂN, NƯỚC CHẤM, GIA VỊ"
            products={sampleProductsByCategory["dau-an-nuoc-cham-gia-vi"] || []}
            banners={categoryBanners}
            onAddToCart={handleAddToCart}
          />

          {/* MÌ, MIẾN, CHÁO, PHỞ */}
          <CategorySection
            categoryName="MÌ, MIẾN, CHÁO, PHỞ"
            products={sampleProductsByCategory["mi-mien-chao-pho"] || []}
            banners={categoryBanners}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
}
