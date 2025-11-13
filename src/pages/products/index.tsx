import { CategoryNav } from "@/components/category/CategoryNav";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { CategoryNav as Category } from "@/types/category.type";
import type { Product } from "@/types/product.type";
import type { Banner } from "@/types/banner.type";
import Banners from "@/components/productPage/banner/Banners";
import Article from "@/components/productPage/article/Article";
import ProductGridWithBanners from "@/components/products/ProductGridWithBanners";
import FilterBar from "@/components/productPage/filter/FilterBar";
import Promotion from "@/components/productPage/promotion/Promotion";
import { categoryService, productService } from "@/api";
import type { Category as CategoryType } from "@/types/category.type";
import { toCategoryNav } from "@/lib/constants";
import { useNotification } from "@/components/notification/NotificationContext";

/**
 * Helper function để map product từ backend format sang frontend format
 * Backend: _id, image_primary, quantity (số)
 * Frontend: id, image_url, quantity (có thể là số hoặc string)
 */
const mapProductFromApi = (apiProduct: any): Product => {
  return {
    _id: apiProduct._id,
    id: apiProduct._id || apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    category_id: apiProduct.category_id,
    brand_id: apiProduct.brand_id,
    unit: apiProduct.unit,
    unit_price: apiProduct.unit_price,
    discount_percent: apiProduct.discount_percent || 0,
    final_price: apiProduct.final_price || apiProduct.unit_price,
    image_url: apiProduct.image_primary || apiProduct.image_url || "",
    images: apiProduct.images || [],
    quantity: apiProduct.quantity || 0,
    stock_status: apiProduct.stock_status || "in_stock",
    is_active: apiProduct.is_active !== false,
    is_deleted: apiProduct.is_deleted || false,
    created_at: apiProduct.created_at,
    updated_at: apiProduct.updated_at,
  };
};

const sampleBanners: Banner[] = [
  {
    id: 1,
    name: "Banner 1",
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/7890/freecompress-trang-cate-pc_202510091649049889.jpg",
    link_url: "/",
  },
  {
    id: 2,
    name: "Banner 2",
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/7890/freecompress-trang-cate-pc-1_202508190846166252.jpg",
    link_url: "/",
  },
  {
    id: 3,
    name: "Banner 3",
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/7890/trang-cate-pc202507042338493733_202508121546495641.jpg",
    link_url: "/",
  },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(null);
  const [promotionProducts, setPromotionProducts] = useState<Product[]>([]);
  const { showNotification } = useNotification();

  // Lấy category từ URL query parameter
  const categoryFromUrl = searchParams.get("category");
  const brandsFromUrl = searchParams.get("brands");

  // Fetch category info và products khi categoryFromUrl thay đổi
  useEffect(() => {
    const loadCategoryData = async () => {
      if (!categoryFromUrl) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setSelectedCategoryId(categoryFromUrl);
        // Reset categories trước khi fetch mới
        setCategories([]);

        // 1. Lấy thông tin category từ slug
        console.log("=== Fetching category by slug ===", categoryFromUrl);
        const category = await categoryService.getCategoryBySlug(categoryFromUrl);
        setCurrentCategory(category);
        
        console.log("=== Category loaded ===");
        console.log("Full category object:", category);
        console.log("Category ID (id):", category.id);
        console.log("Category ID (_id):", category._id);
        console.log("Parent ID:", category.parent_id);
        console.log("Parent ID type:", typeof category.parent_id);
        console.log("Parent ID value:", JSON.stringify(category.parent_id));

        // 2. Kiểm tra xem category này là level 1 hay level 2
        // Backend transform _id thành id khi serialize JSON, nên ưu tiên id trước
        const categoryId = category.id || category._id || "";
        
        // Xử lý parent_id: có thể là string, object (populated), hoặc null
        let parentIdValue: string | null = null;
        if (category.parent_id) {
          if (typeof category.parent_id === 'string') {
            parentIdValue = category.parent_id;
          } else if (typeof category.parent_id === 'object' && category.parent_id !== null) {
            // Nếu được populate, lấy id từ object
            parentIdValue = (category.parent_id as any).id || (category.parent_id as any)._id || null;
          }
        }
        
        const isLevel1 = !parentIdValue;
        
        console.log("=== Category Analysis ===");
        console.log("Is Level 1:", isLevel1);
        console.log("Category ID to use:", categoryId);
        console.log("Parent ID value:", parentIdValue);
        console.log("Category ID type:", typeof categoryId);
        console.log("Category ID length:", categoryId?.length);

        // 3. Fetch subcategories hoặc siblings từ getAllCategories (giống CategorySidebar)
        // Sử dụng getAllCategories() vì nó đã có nested structure với subCategories
        console.log("=== Fetching all categories (nested structure) ===");
        
        try {
          const allCategories = await categoryService.getAllCategories();
          console.log("=== All Categories Response ===");
          console.log("Total categories (level 1):", allCategories?.length || 0);
          
          if (allCategories && Array.isArray(allCategories) && allCategories.length > 0) {
            // Helper function để so sánh ID (chuyển về string để so sánh)
            const compareIds = (id1: string | undefined, id2: string | undefined): boolean => {
              if (!id1 || !id2) return false;
              return String(id1) === String(id2);
            };
            
            if (isLevel1) {
              // Category level 1: Tìm category này trong allCategories và lấy subCategories
              // Tìm theo ID hoặc slug (fallback)
              const currentCategoryData = allCategories.find((cat: CategoryType & { subCategories?: CategoryType[] }) => {
                const catId = cat.id || cat._id;
                const catSlug = cat.slug;
                // So sánh theo ID hoặc slug
                return compareIds(catId, categoryId) || catSlug === categoryFromUrl;
              });
              
              if (currentCategoryData) {
                const subCategories = currentCategoryData.subCategories || [];
                console.log("=== Found current category in allCategories ===");
                console.log("Category name:", currentCategoryData.name);
                console.log("Subcategories count:", subCategories.length);
                console.log("Subcategories:", subCategories.map((c: CategoryType) => ({ id: c.id || c._id, name: c.name, slug: c.slug })));
                
                if (subCategories.length > 0) {
                  const navCategories = subCategories.map(toCategoryNav);
                  console.log("=== Nav Categories Mapped ===");
                  console.log("Nav categories:", navCategories);
                  setCategories(navCategories);
                  console.log("Categories state updated with", navCategories.length, "items");
                } else {
                  console.warn("No subcategories found in nested structure");
                  setCategories([]);
                }
              } else {
                console.warn("Current category not found in allCategories. Trying to find by slug:", categoryFromUrl);
                console.log("Available categories:", allCategories.map((c: CategoryType) => ({ id: c.id || c._id, name: c.name, slug: c.slug })));
                setCategories([]);
              }
            } else {
              // Category level 2: Tìm parent category và lấy tất cả siblings
              console.log("=== Looking for parent category in allCategories ===");
              console.log("Parent ID to find:", parentIdValue);
              
              const parentCategoryData = allCategories.find((cat: CategoryType & { subCategories?: CategoryType[] }) => {
                const catId = cat.id || cat._id;
                return compareIds(catId, parentIdValue);
              });
              
              if (parentCategoryData) {
                const siblings = parentCategoryData.subCategories || [];
                console.log("=== Found parent category in allCategories ===");
                console.log("Parent category name:", parentCategoryData.name);
                console.log("Siblings count:", siblings.length);
                console.log("Siblings:", siblings.map((c: CategoryType) => ({ id: c.id || c._id, name: c.name, slug: c.slug })));
                
                if (siblings.length > 0) {
                  const navCategories = siblings.map(toCategoryNav);
                  console.log("=== Nav Categories Mapped ===");
                  console.log("Nav categories:", navCategories);
                  setCategories(navCategories);
                  console.log("Categories state updated with", navCategories.length, "items");
                } else {
                  console.warn("No sibling categories found in nested structure");
                  setCategories([]);
                }
              } else {
                console.warn("Parent category not found in allCategories. Parent ID:", parentIdValue);
                console.log("Available categories:", allCategories.map((c: CategoryType) => ({ id: c.id || c._id, name: c.name, slug: c.slug })));
                setCategories([]);
              }
            }
          } else {
            console.warn("No categories found in getAllCategories response");
            setCategories([]);
          }
        } catch (error) {
          console.error("=== Error fetching all categories ===");
          console.error("Error object:", error);
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as any;
            console.error("Response status:", axiosError.response?.status);
            console.error("Response data:", axiosError.response?.data);
          }
          if (error instanceof Error) {
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
          }
          setCategories([]);
          // Không throw error để không block việc load products
        }

        // 4. Lấy products theo category slug (không block bởi categories)
        console.log("=== Fetching products ===");
        await fetchProductsByCategory(categoryFromUrl);
        
        // 5. Lấy promotion products
        console.log("=== Fetching promotion products ===");
        await fetchPromotionProducts(categoryFromUrl);

      } catch (error) {
        console.error("=== Error loading category data ===");
        console.error("Error object:", error);
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as any;
          console.error("Response status:", axiosError.response?.status);
          console.error("Response data:", axiosError.response?.data);
        }
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        showNotification({
          type: "error",
          title: "Lỗi",
          message: "Không thể tải dữ liệu danh mục. Vui lòng thử lại sau.",
          duration: 5000,
        });
        setCategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [categoryFromUrl, showNotification]);
  
  // Log categories state changes
  useEffect(() => {
    console.log("=== Categories State Changed ===");
    console.log("Categories count:", categories.length);
    console.log("Categories:", categories);
  }, [categories]);

  // Đồng bộ selectedBrands với URL
  useEffect(() => {
    if (brandsFromUrl) {
      const brandsArray = brandsFromUrl
        .split(",")
        .filter((brand) => brand.trim() !== "");
      setSelectedBrands(brandsArray);
    } else {
      setSelectedBrands([]);
    }
  }, [brandsFromUrl]);

  const fetchProductsByCategory = async (categorySlug: string) => {
    try {
      const apiProducts = await productService.getProducts(categorySlug);
      // Map products từ API format sang frontend format
      const mappedProducts = apiProducts.map(mapProductFromApi);
      setProducts(mappedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const fetchPromotionProducts = async (categorySlug: string) => {
    try {
      const apiProducts = await productService.getProductPromotions(categorySlug, { limit: 12 });
      // Map products từ API format sang frontend format
      const mappedProducts = apiProducts.map(mapProductFromApi);
      setPromotionProducts(mappedProducts);
    } catch (error) {
      console.error("Error fetching promotion products:", error);
      setPromotionProducts([]);
    }
  };

  const handleCategorySelect = (category: Category) => {
    // Update URL khi chọn category
    setSearchParams({ category: category.slug || category.id });
  };

  const handleAddToCart = (product: Product) => {
    // TODO: Implement add to cart logic
    console.log("Add to cart:", product);
  };

  const handleBrandSelect = (brandId: string) => {
    const newSelectedBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter((id) => id !== brandId) // Bỏ chọn nếu đã chọn
      : [...selectedBrands, brandId]; // Thêm vào nếu chưa chọn

    setSelectedBrands(newSelectedBrands);

    // Cập nhật URL với brands mới
    const newSearchParams = new URLSearchParams(searchParams);
    if (newSelectedBrands.length > 0) {
      newSearchParams.set("brands", newSelectedBrands.join(","));
    } else {
      newSearchParams.delete("brands");
    }

    setSearchParams(newSearchParams);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 w-full">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 w-full">
      {/* Category Navigation - Hiển thị subcategories (level 2) hoặc siblings */}
      {categories.length > 0 && (
        <div className="w-full bg-white overflow-hidden mb-4">
          <CategoryNav
            categories={categories}
            variant="product-page"
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={handleCategorySelect}
          />
        </div>
      )}

      <div className="mt-5">
        <FilterBar
          onBrandSelect={handleBrandSelect}
          selectedBrands={selectedBrands}
        />
      </div>

      {/* Promotion Products Section */}
      {promotionProducts.length > 0 && (
        <div className="mt-5">
          <Promotion products={promotionProducts} onAddToCart={handleAddToCart} />
        </div>
      )}

      <div className="mt-5">
        <Banners banners={sampleBanners} />
      </div>

      {/* Hiển thị sản phẩm với banner xen kẽ */}
      <div className="mt-8">
        {products.length > 0 ? (
          <>
            <ProductGridWithBanners
              products={products}
              banners={sampleBanners}
              onAddToCart={handleAddToCart}
              rowsPerBanner={2}
            />
            {currentCategory?.description && (
              <div className="mt-8">
                <Article 
                  article={{
                    id: 1,
                    title: `${currentCategory.name} là gì?`,
                    content: currentCategory.description,
                  }} 
                  variant="compact" 
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Chưa có sản phẩm nào trong danh mục này
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
