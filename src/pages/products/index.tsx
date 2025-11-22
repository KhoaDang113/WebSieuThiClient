import { CategoryNav } from "@/components/category/CategoryNav";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type {
  CategoryNav as Category,
  Category as CategoryType,
} from "@/types/category.type";
import type { Product } from "@/types/product.type";
import type { Banner } from "@/types/banner.type";
import type { Brand } from "@/types/brand.type";
import Banners from "@/components/productPage/banner/Banners";
import Article from "@/components/productPage/article/Article";
import ProductGridWithBanners from "@/components/products/ProductGridWithBanners";
import { bannerService, categoryService, productService, brandService } from "@/api";
import { toCategoryNav } from "@/lib/constants";
import { useNotification } from "@/hooks/useNotification";
import { mapProductFromApi } from "@/lib/utils/productMapper";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(
    null
  );
  const [promotionProducts, setPromotionProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const { showNotification } = useNotification();

  // Lấy parameters từ URL
  const categoryFromUrl = searchParams.get("category");
  const brandsFromUrl = searchParams.get("brands");
  const sortParam = searchParams.get("sort") || "";

  // States for advanced filters
  const [allCategories, setAllCategories] = useState<(CategoryType & { subCategories?: CategoryType[] })[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  // Fetch category info và products khi categoryFromUrl thay đổi
  useEffect(() => {
    const loadCategoryData = async () => {
      if (!categoryFromUrl) {
        setLoading(false);
        setBanners([]);
        return;
      }

      try {
        setLoading(true);
        setSelectedCategoryId(categoryFromUrl);
        setCategories([]);

        const category = await categoryService.getCategoryBySlug(
          categoryFromUrl
        );
        setCurrentCategory(category);

        // 2. Kiểm tra xem category này là level 1 hay level 2
        // Backend transform _id thành id khi serialize JSON, nên ưu tiên id trước
        const categoryId = category.id || category._id || "";

        // Xử lý parent_id: có thể là string, object (populated), hoặc null
        let parentIdValue: string | null = null;
        if (category.parent_id) {
          if (typeof category.parent_id === "string") {
            parentIdValue = category.parent_id;
          } else if (
            typeof category.parent_id === "object" &&
            category.parent_id !== null
          ) {
            // Nếu được populate, lấy id từ object
            parentIdValue =
              (category.parent_id as any).id ||
              (category.parent_id as any)._id ||
              null;
          }
        }

        const isLevel1 = !parentIdValue;

        // 3. Fetch subcategories hoặc siblings từ getAllCategories (giống CategorySidebar)
        // Sử dụng getAllCategories() vì nó đã có nested structure với subCategories

        try {
          const allCategories = await categoryService.getAllCategories();
          if (
            allCategories &&
            Array.isArray(allCategories) &&
            allCategories.length > 0
          ) {
            // Helper function để so sánh ID (chuyển về string để so sánh)
            const compareIds = (
              id1: string | undefined | null,
              id2: string | undefined | null
            ): boolean => {
              if (!id1 || !id2) return false;
              return String(id1) === String(id2);
            };

            if (isLevel1) {
              // Category level 1: Tìm category này trong allCategories và lấy subCategories
              // Tìm theo ID hoặc slug (fallback)
              const currentCategoryData = allCategories.find(
                (cat: CategoryType & { subCategories?: CategoryType[] }) => {
                  const catId = cat.id || cat._id;
                  const catSlug = cat.slug;
                  // So sánh theo ID hoặc slug
                  return (
                    compareIds(catId, categoryId) || catSlug === categoryFromUrl
                  );
                }
              );

              if (currentCategoryData) {
                const subCategories = currentCategoryData.subCategories || [];
                if (subCategories.length > 0) {
                  const navCategories = subCategories.map(toCategoryNav);
                  setCategories(navCategories);
                } else {
                  setCategories([]);
                }
              } else {
                setCategories([]);
              }
            } else {
              const parentCategoryData = allCategories.find(
                (cat: CategoryType & { subCategories?: CategoryType[] }) => {
                  const catId = cat.id || cat._id;
                  return compareIds(catId, parentIdValue);
                }
              );

              if (parentCategoryData) {
                const siblings = parentCategoryData.subCategories || [];

                if (siblings.length > 0) {
                  const navCategories = siblings.map(toCategoryNav);
                  setCategories(navCategories);
                } else {
                  setCategories([]);
                }
              } else {
                setCategories([]);
              }
            }
          } else {
            setCategories([]);
          }
        } catch (error) {
          console.error("=== Error fetching all categories ===");
          console.error("Error object:", error);
          if (error && typeof error === "object" && "response" in error) {
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

        // 4. Lấy banners cho category hiện tại
        await fetchBanners(categoryFromUrl);

        // 5. Lấy products theo category slug (không block bởi categories)
        await fetchProductsByCategory(categoryFromUrl);

        // 6. Lấy promotion products
        await fetchPromotionProducts(categoryFromUrl);
      } catch (error) {
        console.error("=== Error loading category data ===");
        console.error("Error object:", error);
        if (error && typeof error === "object" && "response" in error) {
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
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryData();
  }, [categoryFromUrl, showNotification]);

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

  // Load all categories and brands for filters
  useEffect(() => {
    const loadFilters = async () => {
      try {
        setLoadingFilters(true);
        const [categoriesData, brandsData] = await Promise.all([
          categoryService.getAllCategories(),
          brandService.getAllBrands(),
        ]);

        // Filter active parent categories (level 1)
        const activeCategories = categoriesData.filter((cat) => {
          const isActive = cat.is_active !== undefined ? cat.is_active : true;
          const isDeleted = cat.is_deleted !== undefined ? cat.is_deleted : false;
          const isParent = !cat.parent_id || cat.parent_id === null;
          return isActive && !isDeleted && isParent;
        });

        // Filter active brands
        const activeBrands = brandsData.filter(
          (b) => (b.is_active !== undefined ? b.is_active : true) && !(b.is_deleted !== undefined ? b.is_deleted : false)
        );

        setAllCategories(activeCategories);
        setBrands(activeBrands);
      } catch (error) {
        console.error("Error loading filters:", error);
        setAllCategories([]);
        setBrands([]);
      } finally {
        setLoadingFilters(false);
      }
    };
    loadFilters();
  }, []);

  // Helper function to get selected category display name
  const getSelectedCategoryName = () => {
    if (!categoryFromUrl) return "Tất cả danh mục";
    // Find category in nested structure
    for (const cat of allCategories) {
      if (cat.slug === categoryFromUrl) {
        return cat.name;
      }
      const subCats = cat.subCategories || [];
      for (const subCat of subCats) {
        if (subCat.slug === categoryFromUrl) {
          return subCat.name;
        }
      }
    }
    return currentCategory?.name || "Tất cả danh mục";
  };

  // Helper function to get selected brand display name
  const getSelectedBrandName = () => {
    if (!brandsFromUrl) return "Tất cả thương hiệu";
    const brand = brands.find(b => b.slug === brandsFromUrl);
    return brand?.name || "Tất cả thương hiệu";
  };

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

  const fetchBanners = async (categorySlug: string) => {
    try {
      const categoryBanners = await bannerService.getBanners(categorySlug);

      if (categoryBanners.length > 0) {
        setBanners(categoryBanners);
        return;
      }
      const defaultBanners = await bannerService.getBanners();
      setBanners(defaultBanners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setBanners([]);
    }
  };

  const fetchPromotionProducts = async (categorySlug: string) => {
    try {
      const apiProducts = await productService.getProductPromotions(
        categorySlug,
        { limit: 12 }
      );
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

  // Handler for advanced filter changes
  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Keep category param if exists
    if (categoryFromUrl && key !== "category") {
      newParams.set("category", categoryFromUrl);
    }
    setSearchParams(newParams);
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

      {/* Advanced Filters */}
      {categoryFromUrl && (
        <div className="mb-4">
          <div className="bg-white shadow-sm border-t border-b border-gray-200 p-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Danh mục
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    disabled={loadingFilters}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                  >
                    <span className="truncate">
                      {loadingFilters ? "Đang tải..." : getSelectedCategoryName()}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50 ml-2 flex-shrink-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto">
                    <DropdownMenuItem
                      onClick={() => handleFilterChange("category", "")}
                      className={!categoryFromUrl ? "bg-green-50 text-green-700" : ""}
                    >
                      Tất cả danh mục
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {allCategories.length > 0 ? (
                      allCategories.map((cat) => {
                        const subCats = cat.subCategories || [];
                        const hasSubCategories = subCats.length > 0;

                        if (hasSubCategories) {
                          return (
                            <DropdownMenuSub key={cat._id || cat.id}>
                              <DropdownMenuSubTrigger>
                                {cat.name}
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                {subCats.map((subCat) => (
                                  <DropdownMenuItem
                                    key={subCat._id || subCat.id}
                                    onClick={() => handleFilterChange("category", subCat.slug || "")}
                                    className={categoryFromUrl === subCat.slug ? "bg-green-50 text-green-700" : ""}
                                  >
                                    {subCat.name}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          );
                        } else {
                          return (
                            <DropdownMenuItem
                              key={cat._id || cat.id}
                              onClick={() => handleFilterChange("category", cat.slug || "")}
                              className={categoryFromUrl === cat.slug ? "bg-green-50 text-green-700" : ""}
                            >
                              {cat.name}
                            </DropdownMenuItem>
                          );
                        }
                      })
                    ) : (
                      <DropdownMenuItem disabled>Không có danh mục</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Brand Dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Thương hiệu
                </label>
                <select
                  value={brandsFromUrl || ""}
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={loadingFilters}
                >
                  <option value="">Tất cả thương hiệu</option>
                  {brands.length > 0 ? (
                    brands.map((brand) => (
                      <option key={brand._id || brand.id} value={brand.slug || ""}>
                        {brand.name || "Unnamed Brand"}
                      </option>
                    ))
                  ) : (
                    <option disabled>Đang tải thương hiệu...</option>
                  )}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Sắp xếp
                </label>
                <select
                  value={sortParam}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Mặc định</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="hot">Khuyến mãi nhiều</option>
                  <option value="new">Mới nhất</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {banners.length > 0 && (
        <div className="mt-5">
          <Banners banners={banners} />
        </div>
      )}

      {/* Hiển thị sản phẩm với banner xen kẽ */}
      <div className="mt-8">
        {products.length > 0 ? (
          <>
            <ProductGridWithBanners
              products={products}
              banners={banners}
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
