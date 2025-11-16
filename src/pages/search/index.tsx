import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, PackageSearch, ChevronLeft, Filter, X, ChevronDown } from "lucide-react";
import { productService, categoryService, brandService } from "@/api";
import type { Product } from "@/types/product.type";
import type { Category } from "@/types/category.type";
import type { Brand } from "@/types/brand.type";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/CartContext";
import { getProductId, getProductImage } from "@/lib/constants";
import { mapProductsFromApi } from "@/lib/utils/productMapper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = (searchParams.get("q") || "").trim();
  const categoryParam = searchParams.get("category") || "";
  const brandParam = searchParams.get("brand") || "";
  const sortParam = searchParams.get("sort") || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [skip, setSkip] = useState(0);
  const [lastBatchSize, setLastBatchSize] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [categories, setCategories] = useState<(Category & { subCategories?: Category[]; children?: Category[] })[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const { addToCart } = useCart();

  const debouncedQuery = useMemo(() => queryParam, [queryParam]);

  // Get selected category name for display
  const getSelectedCategoryName = () => {
    if (!categoryParam) return "Tất cả danh mục";
    // Find category in nested structure
    for (const cat of categories) {
      if (cat.slug === categoryParam) {
        return cat.name;
      }
      const subCats = cat.subCategories || cat.children || [];
      for (const subCat of subCats) {
        if (subCat.slug === categoryParam) {
          return subCat.name;
        }
      }
    }
    return "Tất cả danh mục";
  };

  // Load categories and brands
  useEffect(() => {
    const loadFilters = async () => {
      try {
        setLoadingFilters(true);
        const [categoriesData, brandsData] = await Promise.all([
          categoryService.getAllCategories(),
          brandService.getAllBrands(),
        ]);
        
        console.log("Categories data from API:", categoriesData);
        
        // Keep nested structure for hierarchical dropdown
        // Chỉ lấy parent categories (cấp 1) - backend đã filter parent_id: null
        const activeCategories = categoriesData.filter((cat) => {
          const isActive = cat.is_active !== undefined ? cat.is_active : true;
          const isDeleted = cat.is_deleted !== undefined ? cat.is_deleted : false;
          // Đảm bảo chỉ lấy parent categories (không có parent_id hoặc parent_id là null)
          const isParent = !cat.parent_id || cat.parent_id === null;
          return isActive && !isDeleted && isParent;
        });
        
        console.log("Active parent categories (cấp 1):", activeCategories);
        
        // Filter active brands
        const activeBrands = brandsData.filter(
          (b) => (b.is_active !== undefined ? b.is_active : true) && !(b.is_deleted !== undefined ? b.is_deleted : false)
        );
        
        setCategories(activeCategories);
        setBrands(activeBrands);
      } catch (error) {
        console.error("Error loading filters:", error);
        // Set empty arrays on error to prevent undefined issues
        setCategories([]);
        setBrands([]);
      } finally {
        setLoadingFilters(false);
      }
    };
    loadFilters();
  }, []);

  useEffect(() => {
    setProducts([]);
    setSkip(0);
    setLastBatchSize(0);
    setHasMore(false);
    setError(null);
    setHasSearched(false);
  }, [queryParam, categoryParam, brandParam, sortParam]);

  useEffect(() => {
    if (!debouncedQuery) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let isCancelled = false;
    setLoading(true);
    setError(null);

    const searchParams: { skip: number; category?: string; brand?: string; sortOrder?: string } = { skip };
    if (categoryParam) searchParams.category = categoryParam;
    if (brandParam) searchParams.brand = brandParam;
    if (sortParam) searchParams.sortOrder = sortParam;

    productService
      .searchProducts(debouncedQuery, searchParams)
      .then((response) => {
        if (isCancelled) return;

        const rawProducts = response?.products ?? [];
        const mappedProducts = mapProductsFromApi(rawProducts);

        setProducts((prev) => (skip === 0 ? mappedProducts : [...prev, ...mappedProducts]));
        setLastBatchSize(rawProducts.length);
        setHasMore(rawProducts.length > 0 && rawProducts.length === (response.actualLimit ?? rawProducts.length));
        setHasSearched(true);
      })
      .catch((err: unknown) => {
        if (isCancelled) return;

        let message = "Không thể tìm kiếm sản phẩm ngay lúc này. Vui lòng thử lại sau.";
        if (typeof err === "object" && err !== null && "response" in err) {
          const serverMessage =
            (err as { response?: { data?: { message?: string } } }).response?.data?.message;
          if (typeof serverMessage === "string" && serverMessage.trim().length > 0) {
            message = serverMessage;
          }
        } else if (err instanceof Error && err.message) {
          message = err.message;
        }

        setError(message);
        if (skip === 0) {
          setProducts([]);
        }
        setHasMore(false);
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, skip, categoryParam, brandParam, sortParam]);

  const handleLoadMore = () => {
    if (!hasMore || loading || lastBatchSize === 0) {
      return;
    }
    setSkip((prev) => prev + lastBatchSize);
  };

  const handleAddToCart = (product: Product & { selectedQuantity?: number }) => {
    const productId = getProductId(product);
    if (!productId) {
      return;
    }

    addToCart({
      id: productId,
      name: product.name,
      price: product.final_price || product.unit_price,
      image: getProductImage(product),
      unit: product.unit || "1 sản phẩm",
      quantity: product.selectedQuantity || 1,
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("category");
    newParams.delete("brand");
    newParams.delete("sort");
    setSearchParams(newParams);
  };

  const hasActiveFilters = categoryParam || brandParam || sortParam;

  const isInitialLoading = loading && skip === 0;
  const isLoadingMore = loading && skip > 0;
  const shouldShowEmptyState = !queryParam && !loading;
  const shouldShowNoResults = hasSearched && products.length === 0 && !loading && !error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 w-full">
      <div className="bg-white border-b border-gray-200/60 shadow-sm sticky top-0 z-10">
        <div className="w-full px-3 sm:px-6 py-3 flex items-center">
          <Link to="/" className="mr-4 hover:bg-gray-100 p-2 rounded-full transition-colors" aria-label="Quay lại trang chủ">
            <ChevronLeft className="w-3 h-3 text-gray-700" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Tìm Kiếm</h1>
        </div>
      </div>

      <div className="w-full py-4 lg:py-6">
        {error && (
          <div className="px-3 sm:px-6 mb-4">
            <div className="rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-700 shadow-sm">
              {error}
            </div>
          </div>
        )}

        {/* Filters */}
        {queryParam && (
          <div className="mb-4 px-3 sm:px-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                        className={!categoryParam ? "bg-green-50 text-green-700" : ""}
                      >
                        Tất cả danh mục
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {categories.length > 0 ? (
                        categories.map((cat) => {
                          const subCats = cat.subCategories || cat.children || [];
                          const hasSubCategories = subCats.length > 0;
                          
                          // Chỉ hiển thị parent categories (cấp 1) trong menu chính
                          // Nếu có subcategories, hiển thị với SubMenu
                          // Nếu không có subcategories, hiển thị như item thường
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
                                      className={categoryParam === subCat.slug ? "bg-green-50 text-green-700" : ""}
                                    >
                                      {subCat.name}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                            );
                          } else {
                            // Parent category không có subcategories
                            return (
                              <DropdownMenuItem
                                key={cat._id || cat.id}
                                onClick={() => handleFilterChange("category", cat.slug || "")}
                                className={categoryParam === cat.slug ? "bg-green-50 text-green-700" : ""}
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
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Thương hiệu
                  </label>
                  <select
                    value={brandParam}
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

        {shouldShowEmptyState && (
          <div className="px-3 sm:px-6 rounded-2xl border border-dashed border-green-100 bg-green-50/60 py-10 text-center shadow-inner">
            <PackageSearch className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-lg font-semibold text-gray-800">
              Nhập từ khóa vào thanh tìm kiếm phía trên
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Ví dụ: “cá hộp”, “sữa tươi”, “nước mắm”, hoặc tên thương hiệu bạn yêu thích.
            </p>
          </div>
        )}

        {isInitialLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-green-600">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Đang tìm kiếm sản phẩm...</span>
            </div>
          </div>
        )}

        {shouldShowNoResults && (
          <div className="px-3 sm:px-6 rounded-2xl border border-gray-200 bg-gray-50 py-10 text-center shadow-inner">
            <PackageSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-lg font-semibold text-gray-800">
              Không tìm thấy sản phẩm phù hợp
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Thử nhập từ khóa khác hoặc xem các ngành hàng trong menu bên trái.
            </p>
            <Button
              variant="outline"
              className="mt-6 rounded-full border-green-500 text-green-600 hover:bg-green-50"
              onClick={() => setSearchParams({})}
            >
              Xóa từ khóa tìm kiếm
            </Button>
          </div>
        )}

        {!isInitialLoading && products.length > 0 && (
          <div className="px-3 sm:px-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative bg-gradient-to-r from-green-50 to-white py-4 sm:py-5 border-b-2 border-green-100">
                <div className="flex justify-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-white border-2 border-green-600 px-6 sm:px-10 py-2.5 shadow-md max-w-full">
                    <h2 className="text-base sm:text-xl font-bold text-green-700 text-center uppercase tracking-wide max-w-full truncate px-2">
                      {queryParam || "Kết quả tìm kiếm"}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-4">
                <div className="text-sm text-gray-500">
                  {`Đang hiển thị ${products.length} sản phẩm${queryParam ? ` cho từ khóa "${queryParam}"` : ""}.`}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id || product._id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {isLoadingMore && (
                  <div className="flex items-center justify-center py-4 text-green-600">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Đang tải thêm sản phẩm...</span>
                  </div>
                )}

                {hasMore && !isLoadingMore && (
                  <div className="flex justify-center pt-2">
                    <Button
                      onClick={handleLoadMore}
                      className="rounded-full bg-green-600 hover:bg-green-700 text-white px-6 shadow-md"
                    >
                      Xem thêm sản phẩm
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

