import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import type { Product } from "@/types"
import { ProductModal } from "@/components/products/ProductModal"
import Banners from "@/components/productPage/Banners"
import type { Banner } from "@/types/banner.type"
import ScrollButton from "@/components/ScrollButton"
import { Link } from "react-router-dom"

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
    "Thành phần": "Thịt lợn, gia vị, chất bảo quản, chất tạo màu, chất điều vị, muối, đường, tỏi, hành, ớt",
    "Hạn sử dụng": "Thịt ướp lạnh: Dưới 4°C, Thịt đông lạnh: Dưới -18°C",
    "Cách dùng": "Rã đông trước khi chế biến, nướng, luộc, chiên đều được",
    "Bảo quản": "Để ngăn mát tủ lạnh từ 0-4°C hoặc đông lạnh dưới -18°C",
    "Thương hiệu": "Ponnie (CLAS)",
    "Xuất xứ": "Việt Nam",
  },
}

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
]

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const thumbsRef = useRef<HTMLDivElement | null>(null)

  // Auto-rotate main image every 3s
  useEffect(() => {
    if (!productData.images || productData.images.length === 0) return
    const intervalId = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % productData.images.length)
    }, 3000)
    return () => clearInterval(intervalId)
  }, [])

  // Keep active thumbnail in view (only scroll horizontally to avoid page jump)
  useEffect(() => {
    const container = thumbsRef.current
    if (!container) return
    const activeThumb = container.querySelector(
      `[data-thumb-index="${selectedImage}"]`
    ) as HTMLElement | null
    if (!activeThumb) return
    // Center the active thumbnail horizontally within the container
    const targetLeft =
      activeThumb.offsetLeft - (container.clientWidth - activeThumb.clientWidth) / 2
    container.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" })
  }, [selectedImage])

  const goPrevImage = () => {
    if (!productData.images.length) return
    setSelectedImage((prev) => (prev - 1 + productData.images.length) % productData.images.length)
  }

  const goNextImage = () => {
    if (!productData.images.length) return
    setSelectedImage((prev) => (prev + 1) % productData.images.length)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const toSlug = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}+/gu, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")

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
  }

  const handleAddToCart = (product: Product, quantity: number) => {
    // TODO: Tích hợp giỏ hàng thật; tạm thời log để kiểm tra
    console.log("Add to cart:", { product, quantity })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button - match CartWithItems */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <Link to="/" className="mr-4 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Quay Về Trang Chủ</h1>
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
            <div className="relative">
              <div ref={thumbsRef} className="flex gap-2 overflow-x-auto overflow-y-hidden scroll-smooth no-scrollbar">
                {productData.images.map((image, index) => (
                  <button
                    key={index}
                    data-thumb-index={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-40 h-40 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-green-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${productData.name} - ${index + 1}`}
                      className="w-full h-full object-contain p-3"
                    />
                  </button>
                ))}
              </div>
              {/* Navigation Buttons for thumbnails */}
              <ScrollButton direction="left" onClick={goPrevImage} />
              <ScrollButton direction="right" onClick={goNextImage} />
            </div>
          </div>

          {/* Right Column - Product Info (Sticky) */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="bg-white rounded-lg p-6 space-y-6">
              {/* Product Name */}
              <h1 className="text-2xl font-semibold text-gray-900">{productData.name}</h1>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-red-600">{formatPrice(productData.price)}</span>
              </div>

              {/* Buy Button */}
              <Button onClick={() => setIsModalOpen(true)} className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-semibold">
                MUA
              </Button>

              {/* Special Offers */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">🎁 ƯU ĐÃI ĐẶC BIỆT</h3>
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
                    <p className="text-sm text-gray-600">{productData.shipping.shippingFee}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-xl">🏪</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Đơn vị bán</p>
                    <p className="text-sm text-gray-600">{productData.shipping.seller}</p>
                    <p className="text-sm text-gray-500">{productData.shipping.location}</p>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin sản phẩm</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {Object.entries(productData.specifications).map(([key, value], index) => (
                  <tr key={key} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-3 px-4 font-medium text-gray-700 w-1/3">{key}</td>
                    <td className="py-3 px-4 text-gray-600">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  )
}

// Render Modal
// Lưu ý: Modal được đặt cuối cùng để không ảnh hưởng layout chính
// và được điều khiển bằng state isModalOpen
export function ProductDetailWithModalWrapper() {
  return <ProductDetail />
}
