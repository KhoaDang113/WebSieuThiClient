import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { Product } from "@/types/product.type";
import { ProductModal } from "@/components/products/ProductModal";
import Banners from "@/components/productPage/banner/Banners";
import type { Banner } from "@/types/banner.type";
import ScrollButton from "@/components/scroll/ScrollButton";
import { Link, useParams } from "react-router-dom";
import ProductComments from "@/components/products/ProductComments";
import ProductRatings from "@/components/products/ProductRatings";
import { productService, bannerService } from "@/api";
import { PRODUCT_PLACEHOLDER_IMAGE, getProductId, getProductImage } from "@/lib/constants";
import { useCart } from "@/components/cart/CartContext";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const { addToCart } = useCart();

  // Get product ID from URL params
  const productId = id || "";

  // Load product data
  useEffect(() => {
    const loadProductData = async () => {
      if (!productId) {
        console.log("❌ No productId provided");
        return;
      }

      console.log("🔍 Loading product with ID:", productId);

      try {
        setLoading(true);
        const [productData, bannersData] = await Promise.all([
          productService.getProductById(productId),
          bannerService.getAllBanners(),
        ]);

              console.log("✅ Product loaded:", productData);
              console.log("✅ Banners loaded:", bannersData);

              setProduct(productData);
              setBanners(bannersData || []);
              setImageErrors({}); // Reset image errors khi load product mới
      } catch (error: any) {
        console.error("❌ Error loading product:", error);
        console.error("❌ Error response:", error.response?.data);
        console.error("❌ Error status:", error.response?.status);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [productId]);

  // Check scroll position for navigation buttons
  const checkScroll = () => {
    const container = thumbsRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftButton(scrollLeft > 1);
      const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 1;
      setShowRightButton(!isAtEnd);
    }
  };

  // Scroll function for navigation buttons
  const scroll = (direction: "left" | "right") => {
    if (thumbsRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      thumbsRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Get product images
  // LƯU Ý: Backend có thể trả về image_primary là mảng [String] hoặc string
  const getFirstImage = (img: string | string[] | undefined): string | undefined => {
    if (!img) return undefined;
    if (Array.isArray(img)) return img[0];
    return img;
  };

  const productImages = product
    ? [
        getFirstImage(product.image_primary) || getFirstImage(product.image_url),
        // Thêm các ảnh phụ từ mảng images
        ...(product.images || []),
      ].filter(Boolean) as string[]
    : [];

  // Keep active thumbnail in view (only scroll horizontally to avoid page jump)
  useEffect(() => {
    const container = thumbsRef.current;
    if (!container) return;
    const activeThumb = container.querySelector(
      `[data-thumb-index="${selectedImage}"]`
    ) as HTMLElement | null;
    if (!activeThumb) return;
    // Center the active thumbnail horizontally within the container
    const targetLeft =
      activeThumb.offsetLeft -
      (container.clientWidth - activeThumb.clientWidth) / 2;
    container.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
  }, [selectedImage]);

  // Setup scroll event listeners and wheel handling
  useEffect(() => {
    const container = thumbsRef.current;
    if (!container) return;

    checkScroll();
    window.addEventListener("resize", checkScroll);
    container.addEventListener("scroll", checkScroll);

    const handleWheel = (e: WheelEvent) => {
      if (isMouseOver) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("resize", checkScroll);
      container.removeEventListener("scroll", checkScroll);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [isMouseOver]);

  const goPrevImage = () => {
    if (!productImages.length) return;
    setSelectedImage(
      (prev) => (prev - 1 + productImages.length) % productImages.length
    );
  };

  const goNextImage = () => {
    if (!productImages.length) return;
    setSelectedImage((prev) => (prev + 1) % productImages.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    // Chuyển đổi Product sang CartItem và thêm vào giỏ hàng
    addToCart({
      id: getProductId(product),
      name: product.name,
      price: product.final_price || product.unit_price,
      image: getProductImage(product),
      unit: product.unit || "1 sản phẩm",
      quantity: quantity,
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007E42] mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!product) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-gray-600 mb-4">
            Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Link to="/">
            <Button className="bg-[#007E42] hover:bg-[#005a2f]">
              Quay về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Back button - match CartWithItems */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-1 py-2 flex items-center">
          <Link
            to="/"
            className="mr-2 hover:bg-gray-100 p-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            <ChevronLeft className="w-3 h-3 text-gray-700" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">
            Quay Về
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-1 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Images */}
          <div className="space-y-2 lg:col-span-2">
            {/* Main Image */}
            {productImages.length > 0 && (
            <div className="relative bg-white rounded-lg overflow-hidden border h-[60vh] max-h-screen">
              <img
                  src={imageErrors[selectedImage] ? PRODUCT_PLACEHOLDER_IMAGE : (productImages[selectedImage] || PRODUCT_PLACEHOLDER_IMAGE)}
                  alt={product.name}
                className="w-full h-full object-contain p-6"
                onError={() => {
                  setImageErrors(prev => ({ ...prev, [selectedImage]: true }));
                }}
              />
              {/* Navigation Buttons for main image */}
                {productImages.length > 1 && (
                  <>
              <ScrollButton direction="left" onClick={goPrevImage} />
              <ScrollButton direction="right" onClick={goNextImage} />
                  </>
                )}
            </div>
            )}

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
            <div 
              className="relative group/container"
              onMouseEnter={() => setIsMouseOver(true)}
              onMouseLeave={() => setIsMouseOver(false)}
            >
              {/* Scroll buttons - hiển thị khi hover */}
              <div className="opacity-0 group-hover/container:opacity-100 transition-opacity">
                {showLeftButton && (
                    <ScrollButton
                      direction="left"
                      onClick={() => scroll("left")}
                    />
                )}
                {showRightButton && (
                    <ScrollButton
                      direction="right"
                      onClick={() => scroll("right")}
                    />
                )}
              </div>

              <div
                ref={thumbsRef}
                className="flex gap-2 overflow-x-auto overflow-y-hidden scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                  {productImages.map((image, index) => (
                  <button
                    key={index}
                    data-thumb-index={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-40 h-40 rounded-lg overflow-hidden transition-all border-2 select-none ${
                      selectedImage === index
                        ? "border-green-500"
                        : "border-transparent hover:border-gray-300"
                    }`}
                      style={{ userSelect: "none" }}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <img
                      src={imageErrors[index] ? PRODUCT_PLACEHOLDER_IMAGE : (image || PRODUCT_PLACEHOLDER_IMAGE)}
                        alt={`${product.name} - ${index + 1}`}
                      className={`w-full h-full object-cover transition-all select-none ${
                        selectedImage === index
                          ? "opacity-100"
                          : "opacity-50 hover:opacity-70"
                      }`}
                        style={{ userSelect: "none", pointerEvents: "none" }}
                      draggable={false}
                      onError={() => {
                        setImageErrors(prev => ({ ...prev, [index]: true }));
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
            )}
          </div>

          {/* Right Column - Product Info (Sticky) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 p-5 space-y-4">
              {/* Product Name */}
              <h1 className="text-2xl font-semibold text-gray-900">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(product.final_price || product.unit_price)}
                </span>
                {product.discount_percent > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.unit_price)}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                      -{product.discount_percent}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {product.stock_status === "in_stock" && product.quantity > 0 ? (
                  <span className="text-green-600 font-medium">
                    ✓ Còn hàng ({product.quantity} sản phẩm)
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">✗ Hết hàng</span>
                )}
              </div>

              {/* Buy Button */}
              <Button
                onClick={() => setIsModalOpen(true)}
                disabled={
                  product.stock_status !== "in_stock" || product.quantity <= 0
                }
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {product.stock_status === "in_stock" && product.quantity > 0
                  ? "MUA"
                  : "HẾT HÀNG"}
              </Button>

              {/* Special Offers */}
              {product.discount_percent > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">
                  🎁 ƯU ĐÃI ĐẶC BIỆT
                </h3>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li>• Mua 2 tặng 1 tiền</li>
                  <li>• Giảm 10% cho đơn hàng từ 500.000₫</li>
                </ul>
              </div>
              )}

              {/* Shipping Info */}
              <div className="border-t pt-3 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-xl">🚚</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Giao hàng</p>
                    <p className="text-sm text-gray-600">
                      Miễn phí vận chuyển cho đơn hàng từ 300.000₫
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-xl">🏪</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Đơn vị bán</p>
                    <p className="text-sm text-gray-600">
                      Công ty TNHH Thực phẩm ABC
                    </p>
                    <p className="text-sm text-gray-500">Hà Nội</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banners */}
        {banners.length > 0 && (
        <div className="mt-4">
            <Banners banners={banners} />
        </div>
        )}

        {/* Product Specifications */}
        <div className="mt-4 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Thông tin sản phẩm
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-700 w-1/3">
                    Tên sản phẩm
                  </td>
                  <td className="py-3 px-4 text-gray-600">{product.name}</td>
                </tr>
                {product.unit && (
                  <tr className="bg-white">
                    <td className="py-3 px-4 font-medium text-gray-700 w-1/3">
                      Đơn vị
                    </td>
                    <td className="py-3 px-4 text-gray-600">{product.unit}</td>
                  </tr>
                )}
                <tr className={product.unit ? "bg-gray-50" : "bg-white"}>
                  <td className="py-3 px-4 font-medium text-gray-700 w-1/3">
                    Giá
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {formatPrice(product.unit_price)}
                  </td>
                </tr>
                {product.discount_percent > 0 && (
                  <tr className={product.unit ? "bg-white" : "bg-gray-50"}>
                      <td className="py-3 px-4 font-medium text-gray-700 w-1/3">
                      Giảm giá
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {product.discount_percent}%
                      </td>
                    </tr>
                )}
                <tr
                  className={
                    product.discount_percent > 0
                      ? product.unit
                        ? "bg-gray-50"
                        : "bg-white"
                      : product.unit
                        ? "bg-white"
                        : "bg-gray-50"
                  }
                >
                  <td className="py-3 px-4 font-medium text-gray-700 w-1/3">
                    Trạng thái
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {product.stock_status === "in_stock"
                      ? "Còn hàng"
                      : product.stock_status === "out_of_stock"
                        ? "Hết hàng"
                        : "Đặt trước"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Ratings (với form đánh giá) */}
        <div className="mt-4">
          <ProductRatings productId={productId} />
        </div>

        {/* Product Comments (bình luận 2 cấp) */}
        <div className="mt-4">
          <ProductComments productId={productId} />
        </div>
      </div>

      {/* Product Modal */}
      {product && (
      <ProductModal
          product={{
            ...product,
            // Compatibility fields
            image_url: product.image_primary || product.image_url,
            stock_quantity: product.quantity,
            price: product.unit_price,
          }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
      )}
    </div>
  );
}
