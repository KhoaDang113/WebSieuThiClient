import { CategoryNav } from "@/components/category/CategoryNav";
import MainBanner from "@/components/home/MainBanner";
import CategorySection from "@/components/home/CategorySection";
import { mainBanners, sampleProductsByCategory, categoryBanners } from "@/lib/sampleData";
import type { Product } from "@/types/product.type";
import { useCart } from "@/components/cart/CartContext";

export default function HomePage() {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product & { selectedQuantity?: number }) => {
    // Chuyển đổi Product sang CartItem
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.final_price,
      image: product.image_url,
      unit: product.quantity || "1 sản phẩm",
      quantity: product.selectedQuantity || 1,
    });
    
    // Hiển thị thông báo đã thêm vào giỏ hàng
    console.log("Đã thêm vào giỏ hàng:", product.name, "x", product.selectedQuantity || 1);
  };

  // const handleCategorySelect = (category: { id: string; name: string }) => {
  //   console.log("Đã chọn loại:", category.name);
  // };



  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="w-full bg-white rounded-lg overflow-hidden mb-1">
          <CategoryNav />
        </div>
      </div>

      <div className="container mx-auto py-1">


        {/* Main Banner */}
        <MainBanner banners={mainBanners} />

        {/* Category Sections */}
        <div className="space-y-1 sm:space-y-2">
          {/* THỊT, CÁ, TRỨNG, HẢI SẢN */}
          <CategorySection
            categoryName="THỊT, CÁ, TRỨNG, HẢI SẢN"
            products={sampleProductsByCategory["thit-ca-trung-hai-san"] || []}
            banners={categoryBanners}
            onAddToCart={handleAddToCart}
          />

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