import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Star, ThumbsUp } from "lucide-react";
import type { Product } from "@/types/product.type";
import { ProductModal } from "@/components/products/ProductModal";
import Banners from "@/components/productPage/banner/Banners";
import type { Banner } from "@/types/banner.type";
import type { Review, RatingSummary } from "@/types/review.type";
import ScrollButton from "@/components/ScrollButton";
import { Link } from "react-router-dom";

// Sample product data
const productData = {
  id: 1,
  name: "Xúc xích xông khói Superwao Ponnie gói 450g",
  price: 79000,
  images: [
    "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7618/324898/bhx/xuc-xich-xong-khoi-superwao-meatdeli-goi-450g_202504150922175954.jpg",
    "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/7618/324898/bhx/xuc-xich-xong-khoi-superwao-meatdeli-goi-450g_202505281430420275.jpg",
    "https://cdn.tgdd.vn/Products/Images/7618/324898/bhx/xuc-xich-xong-khoi-superwao-meatdeli-goi-450g-202407250924276879.jpg",
    "https://cdn.tgdd.vn/Products/Images/7618/324898/bhx/xuc-xich-xong-khoi-superwao-meatdeli-goi-450g-202407250924218161.jpg",
    "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/2282/77606/bhx/fmcg_202502061015026509.jpg",
  ],
  shipping: {
    seller: "Công ty TNHH Thực phẩm ABC",
    location: "Hà Nội",
    shippingFee: "Miễn phí vận chuyển cho đơn hàng từ 300.000₫",
  },
  specifications: {
    "Loại sản phẩm": "Xúc xích xông khói",
    "Khối lượng": "450g",
    "Thành phần":
      "Thịt lợn, gia vị, chất bảo quản, chất tạo màu, chất điều vị, muối, đường, tỏi, hành, ớt",
    "Hạn sử dụng": "Thịt ướp lạnh: Dưới 4°C, Thịt đông lạnh: Dưới -18°C",
    "Cách dùng": "Rã đông trước khi chế biến, nướng, luộc, chiên đều được",
    "Bảo quản": "Để ngăn mát tủ lạnh từ 0-4°C hoặc đông lạnh dưới -18°C",
    "Thương hiệu": "Ponnie (CLAS)",
    "Xuất xứ": "Việt Nam",
  },
};

// Sample banners (dùng các link từ pages/products/index.tsx)
const productBanners: Banner[] = [
  {
    id: 1,
    name: "Banner 1",
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/7890/freecompress-trang-cate-pc_202510091649049889.jpg",
    link_url: "/ ",
  },
  {
    id: 2,
    name: "Banner 2",
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/7890/freecompress-trang-cate-pc-1_202508190846166252.jpg",
    link_url: "/ ",
  },
  {
    id: 3,
    name: "Banner 3",
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/7890/trang-cate-pc202507042338493733_202508121546495641.jpg",
    link_url: "/ ",
  },
];

// Sample rating summary
const ratingSummary: RatingSummary = {
  average_rating: 4.5,
  total_reviews: 17,
  rating_distribution: {
    5: 82,
    4: 6,
    3: 0,
    2: 0,
    1: 12,
  },
};

// Sample reviews
const reviews: Review[] = [
  {
    id: 1,
    user_name: "Hoàng Thị Quý",
    rating: 5,
    comment: "ngon và thơm",
    created_at: "2024-10-20",
    helpful_count: 0,
  },
  {
    id: 2,
    user_name: "Duyên",
    rating: 5,
    comment: "Xúc xích thơm ngon ăn 1cây lại muốn ăn nữa",
    created_at: "2024-10-18",
    helpful_count: 0,
  },
  {
    id: 3,
    user_name: "Phùng Thị Ngân",
    rating: 5,
    comment: "Trên cả tuyệt vời mn nên mua nhé",
    created_at: "2024-10-15",
    helpful_count: 0,
  },
];

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const thumbsRef = useRef<HTMLDivElement | null>(null);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [helpfulReviews, setHelpfulReviews] = useState<Set<number>>(new Set());

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
    if (!productData.images.length) return;
    setSelectedImage(
      (prev) =>
        (prev - 1 + productData.images.length) % productData.images.length
    );
  };

  const goNextImage = () => {
    if (!productData.images.length) return;
    setSelectedImage((prev) => (prev + 1) % productData.images.length);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const toSlug = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}+/gu, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  // Map dữ liệu mẫu sang kiểu Product cho ProductModal
  const productForModal: Product = {
    id: productData.id,
    name: productData.name,
    description: "",
    unit_price: productData.price,
    final_price: productData.price,
    stock_quantity: 100,
    discount_percent: 0,
    is_hot: false,
    image_url: productData.images[0] ?? "",
    slug: toSlug(productData.name),
    quantity: "1 gói",
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    // TODO: Tích hợp giỏ hàng thật; tạm thời log để kiểm tra
    console.log("Add to cart:", { product, quantity });
  };

  const handleHelpfulClick = (reviewId: number) => {
    setHelpfulReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const renderStars = (rating: number, size: "sm" | "lg" = "sm") => {
    const sizeClass = size === "lg" ? "w-6 h-6" : "w-4 h-4";
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Back button - match CartWithItems */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <Link
            to="/"
            className="mr-4 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">
            Quay Về
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4 lg:col-span-2">
            {/* Main Image */}
            <div className="relative bg-white rounded-lg overflow-hidden border h-[60vh] max-h-screen">
              <img
                src={productData.images[selectedImage] || "/placeholder.svg"}
                alt={productData.name}
                className="w-full h-full object-contain p-6"
              />
              {/* Navigation Buttons for main image */}
              <ScrollButton direction="left" onClick={goPrevImage} />
              <ScrollButton direction="right" onClick={goNextImage} />
            </div>

            {/* Thumbnail Images */}
            <div 
              className="relative group/container"
              onMouseEnter={() => setIsMouseOver(true)}
              onMouseLeave={() => setIsMouseOver(false)}
            >
              {/* Scroll buttons - hiển thị khi hover */}
              <div className="opacity-0 group-hover/container:opacity-100 transition-opacity">
                {showLeftButton && (
                  <ScrollButton direction="left" onClick={() => scroll("left")} />
                )}
                {showRightButton && (
                  <ScrollButton direction="right" onClick={() => scroll("right")} />
                )}
              </div>

              <div
                ref={thumbsRef}
                className="flex gap-2 overflow-x-auto overflow-y-hidden scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {productData.images.map((image, index) => (
                  <button
                    key={index}
                    data-thumb-index={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-40 h-40 rounded-lg overflow-hidden transition-all border-2 select-none ${
                      selectedImage === index
                        ? "border-green-500"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    style={{ userSelect: 'none' }}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${productData.name} - ${index + 1}`}
                      className={`w-full h-full object-cover transition-all select-none ${
                        selectedImage === index
                          ? "opacity-100"
                          : "opacity-50 hover:opacity-70"
                      }`}
                      style={{ userSelect: 'none', pointerEvents: 'none' }}
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Product Info (Sticky) */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="bg-white rounded-lg p-6 space-y-6">
              {/* Product Name */}
              <h1 className="text-2xl font-semibold text-gray-900">
                {productData.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(productData.price)}
                </span>
              </div>

              {/* Buy Button */}
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-semibold"
              >
                MUA
              </Button>

              {/* Special Offers */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  🎁 ƯU ĐÃI ĐẶC BIỆT
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Mua 2 tặng 1 tiền</li>
                  <li>• Giảm 10% cho đơn hàng từ 500.000₫</li>
                </ul>
              </div>

              {/* Shipping Info */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-xl">🚚</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Giao hàng</p>
                    <p className="text-sm text-gray-600">
                      {productData.shipping.shippingFee}
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
                      {productData.shipping.seller}
                    </p>
                    <p className="text-sm text-gray-500">
                      {productData.shipping.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banners dưới hình ảnh, trước thông tin sản phẩm */}
        <div className="mt-6">
          <Banners banners={productBanners} />
        </div>

        {/* Product Specifications */}
        <div className="mt-8 bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Thông tin sản phẩm
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {Object.entries(productData.specifications).map(
                  ([key, value], index) => (
                    <tr
                      key={key}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="py-3 px-4 font-medium text-gray-700 w-1/3">
                        {key}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{value}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Reviews */}
        <div className="mt-8 bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Đánh giá sản phẩm
          </h2>

          {/* Rating Summary */}
          <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center md:w-1/3 bg-gray-50 rounded-lg p-6">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {ratingSummary.average_rating.toFixed(1)}
              </div>
              {renderStars(Math.round(ratingSummary.average_rating), "lg")}
              <div className="text-sm text-gray-600 mt-2">
                <span className="text-blue-600 font-medium">
                  {ratingSummary.total_reviews} đánh giá
                </span>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const percentage = ratingSummary.rating_distribution[
                  stars as keyof typeof ratingSummary.rating_distribution
                ];
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium text-gray-700">
                        {stars}
                      </span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {review.user_name}
                    </h3>
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                <button
                  onClick={() => handleHelpfulClick(review.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    helpfulReviews.has(review.id)
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ThumbsUp
                    className={`w-4 h-4 ${
                      helpfulReviews.has(review.id) ? "fill-blue-700" : ""
                    }`}
                  />
                  Hữu ích
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Modal */}
      <ProductModal
        product={productForModal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

// Render Modal
// Lưu ý: Modal được đặt cuối cùng để không ảnh hưởng layout chính
// và được điều khiển bằng state isModalOpen
export function ProductDetailWithModalWrapper() {
  return <ProductDetail />;
}
