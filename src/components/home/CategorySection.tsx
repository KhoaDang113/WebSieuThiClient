import { ProductCard } from "@/components/products/ProductCard";
import Banners from "@/components/productPage/banner/Banners";
import type { Product, Banner } from "@/types";

interface CategorySectionProps {
  categoryName: string;
  products: Product[];
  banners?: Banner[];
  onAddToCart?: (product: Product) => void;
}

export default function CategorySection({
  categoryName,
  products,
  banners,
  onAddToCart,
}: CategorySectionProps) {
  // Chia sản phẩm thành các nhóm 5 sản phẩm
  const productGroups = [];
  for (let i = 0; i < products.length; i += 5) {
    productGroups.push(products.slice(i, i + 5));
  }

  return (
    <div className="mb-6 sm:mb-8">
      {/* Category Header */}
      <div className="mb-3 sm:mb-4">
        <div className="inline-flex items-center justify-center rounded-full bg-green-600 px-4 sm:px-6 py-2">
          <h2 className="text-sm sm:text-lg font-bold text-white text-center">
            {categoryName}
          </h2>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-4 sm:space-y-6">
        {productGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Product Row */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {group.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>

            {/* Banner after each group (except the last one) */}
            {banners && groupIndex < productGroups.length - 1 && (
              <div className="mt-4 sm:mt-6">
                <Banners banners={banners} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View More Link */}
      {products.length > 5 && (
        <div className="mt-3 sm:mt-4 text-center">
          <a
            href={`/products?category=${categoryName
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
            className="text-green-600 hover:text-green-700 font-medium text-sm sm:text-base"
          >
            Xem thêm {categoryName} &gt;
          </a>
        </div>
      )}
    </div>
  );
}
