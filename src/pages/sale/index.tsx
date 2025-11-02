"use client";

import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CategorySection from "@/components/home/CategorySection";
import { useCart } from "@/components/cart/CartContext";
import { sampleCategories } from "@/lib/sampleData";
import type { Product } from "@/types/product.type";
import type { Banner } from "@/types/banner.type";
import { ChevronLeft } from "lucide-react";
import ScrollButton from "@/components/ScrollButton";
import Banners from "@/components/productPage/banner/Banners";

// Dữ liệu mẫu cho các danh mục cấp 1 với sản phẩm khuyến mãi
const promotionCategories = sampleCategories;

// Dữ liệu sản phẩm khuyến mãi theo danh mục (lấy từ sampleData và bổ sung thêm)
const promotionProductsByCategory: Record<string, Product[]> = {
  "thit-ca-trung-hai-san": [
    {
      id: 1,
      name: "Má đùi gà cắt sẵn",
      description: "Má đùi gà tươi ngon, đã cắt sẵn",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8781/thit-heo_202509110924556310.png",
      unit_price: 46000,
      final_price: 41582,
      stock_quantity: 50,
      discount_percent: 10,
      is_hot: true,
      slug: "ma-dui-ga-cat-san",
      quantity: "500g",
    },
    {
      id: 2,
      name: "Sườn que heo nhập khẩu",
      description: "Sườn que heo nhập khẩu tươi ngon",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8781/thit-heo_202509110924556310.png",
      unit_price: 42000,
      final_price: 38000,
      stock_quantity: 30,
      discount_percent: 10,
      is_hot: false,
      slug: "suon-que-heo-nhap-khau",
      quantity: "500g",
    },
    {
      id: 3,
      name: "Sườn cốt lết C.P",
      description: "Sườn cốt lết C.P tươi ngon",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8781/thit-heo_202509110924556310.png",
      unit_price: 44700,
      final_price: 37530,
      stock_quantity: 25,
      discount_percent: 10,
      is_hot: true,
      slug: "suon-cot-let-cp",
      quantity: "300g",
    },
  ],
  "rau-cu-nam-trai-cay": [
    {
      id: 6,
      name: "Quýt Úc",
      description: "Quýt Úc nhập khẩu tươi ngon",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
      unit_price: 81900,
      final_price: 69000,
      stock_quantity: 100,
      discount_percent: 16,
      is_hot: false,
      slug: "quyt-uc",
      quantity: "800g",
    },
    {
      id: 7,
      name: "Chuối già giống Nam Mỹ",
      description: "Chuối già giống Nam Mỹ tươi ngon",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
      unit_price: 30000,
      final_price: 24000,
      stock_quantity: 80,
      discount_percent: 20,
      is_hot: false,
      slug: "chuoi-gia-giong-nam-my",
      quantity: "1kg",
    },
    {
      id: 8,
      name: "Dưa lưới tròn ruột cam",
      description: "Dưa lưới tròn ruột cam tươi ngon",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
      unit_price: 65000,
      final_price: 53300,
      stock_quantity: 60,
      discount_percent: 18,
      is_hot: true,
      slug: "dua-luoi-tron-ruot-cam",
      quantity: "1.3kg",
    },
  ],
  "dau-an-nuoc-cham-gia-vi": [
    {
      id: 11,
      name: "Dầu ăn Neptune",
      description: "Dầu ăn Neptune tinh luyện cao cấp",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/dau-an-final_202510031117342125.gif",
      unit_price: 85000,
      final_price: 75000,
      stock_quantity: 200,
      discount_percent: 12,
      is_hot: true,
      slug: "dau-an-neptune",
      quantity: "1 chai",
    },
    {
      id: 12,
      name: "Dầu ăn Simply",
      description: "Dầu ăn Simply tinh luyện cao cấp",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/dau-an-final_202510031117342125.gif",
      unit_price: 95000,
      final_price: 85000,
      stock_quantity: 150,
      discount_percent: 11,
      is_hot: false,
      slug: "dau-an-simply",
      quantity: "1 chai",
    },
    {
      id: 14,
      name: "Nước mắm Phú Quốc",
      description: "Nước mắm Phú Quốc đặc sản",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/dau-an-final_202510031117342125.gif",
      unit_price: 45000,
      final_price: 40000,
      stock_quantity: 120,
      discount_percent: 11,
      is_hot: true,
      slug: "nuoc-mam-phu-quoc",
      quantity: "500ml",
    },
  ],
  "gao-bot-do-kho": [
    {
      id: 101,
      name: "Gạo Jasmine thơm 5kg",
      description: "Gạo Jasmine thơm ngon đóng gói 5kg",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 120000,
      final_price: 105000,
      stock_quantity: 100,
      discount_percent: 12,
      is_hot: true,
      slug: "gao-jasmine-5kg",
      quantity: "5kg",
    },
    {
      id: 102,
      name: "Gạo ST25 cao cấp 5kg",
      description: "Gạo ST25 cao cấp đóng gói 5kg",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 180000,
      final_price: 155000,
      stock_quantity: 80,
      discount_percent: 14,
      is_hot: false,
      slug: "gao-st25-5kg",
      quantity: "5kg",
    },
    {
      id: 103,
      name: "Bột mì số 8 500g",
      description: "Bột mì số 8 đa dụng 500g",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 25000,
      final_price: 22000,
      stock_quantity: 200,
      discount_percent: 12,
      is_hot: true,
      slug: "bot-mi-so8-500g",
      quantity: "500g",
    },
  ],
  "mi-mien-chao-pho": [
    {
      id: 16,
      name: "Gấu Đỏ - Mì ăn liền",
      description: "Mì ăn liền Gấu Đỏ vị tôm chua cay thơm ngon",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      unit_price: 96000,
      final_price: 86000,
      stock_quantity: 150,
      discount_percent: 10,
      is_hot: true,
      slug: "gau-do-mi-an-lien",
      quantity: "1 thùng",
    },
    {
      id: 17,
      name: "Hảo Hảo - Mì tôm",
      description: "Mì tôm Hảo Hảo vị chua cay đậm đà",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      unit_price: 50000,
      final_price: 45000,
      stock_quantity: 200,
      discount_percent: 10,
      is_hot: false,
      slug: "hao-hao-mi-tom",
      quantity: "1 gói",
    },
  ],
  "sua-cac-loai": [
    {
      id: 201,
      name: "Sữa tươi Vinamilk 1L",
      description: "Sữa tươi tiệt trùng Vinamilk 1 lít",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 29000,
      final_price: 26000,
      stock_quantity: 150,
      discount_percent: 10,
      is_hot: true,
      slug: "sua-tuoi-vinamilk-1l",
      quantity: "1 lít",
    },
    {
      id: 202,
      name: "Sữa đặc Ông Thọ 380g",
      description: "Sữa đặc có đường Ông Thọ 380g",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 28000,
      final_price: 25000,
      stock_quantity: 200,
      discount_percent: 11,
      is_hot: false,
      slug: "sua-dac-ong-tho-380g",
      quantity: "380g",
    },
  ],
  "kem-sua-chua": [
    {
      id: 301,
      name: "Sữa chua Vinamilk dâu 100g",
      description: "Sữa chua Vinamilk vị dâu 100g",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 8500,
      final_price: 7500,
      stock_quantity: 300,
      discount_percent: 12,
      is_hot: true,
      slug: "sua-chua-vinamilk-dau-100g",
      quantity: "100g",
    },
    {
      id: 302,
      name: "Kem Tràng Tiền que",
      description: "Kem Tràng Tiền que truyền thống",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 15000,
      final_price: 13500,
      stock_quantity: 150,
      discount_percent: 10,
      is_hot: false,
      slug: "kem-trang-tien-que",
      quantity: "1 que",
    },
  ],
  "thuc-pham-dong-mat": [
    {
      id: 401,
      name: "Chả giò C.P 500g",
      description: "Chả giò C.P đông lạnh 500g",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 65000,
      final_price: 58000,
      stock_quantity: 80,
      discount_percent: 11,
      is_hot: true,
      slug: "cha-gio-cp-500g",
      quantity: "500g",
    },
    {
      id: 402,
      name: "Cá basa đông lạnh 500g",
      description: "Cá basa fillet đông lạnh 500g",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 85000,
      final_price: 75000,
      stock_quantity: 60,
      discount_percent: 12,
      is_hot: false,
      slug: "ca-basa-dong-lanh-500g",
      quantity: "500g",
    },
  ],
  "bia-nuoc-giai-khat": [
    {
      id: 501,
      name: "Coca Cola 1.5L",
      description: "Coca Cola chai 1.5 lít",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 25000,
      final_price: 22000,
      stock_quantity: 300,
      discount_percent: 12,
      is_hot: true,
      slug: "coca-cola-15l",
      quantity: "1.5 lít",
    },
    {
      id: 502,
      name: "Pepsi 1.5L",
      description: "Pepsi chai 1.5 lít",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 24000,
      final_price: 21500,
      stock_quantity: 280,
      discount_percent: 10,
      is_hot: false,
      slug: "pepsi-15l",
      quantity: "1.5 lít",
    },
  ],
  "banh-keo-cac-loai": [
    {
      id: 601,
      name: "Bánh quy Richy 200g",
      description: "Bánh quy kem Richy 200g",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 25000,
      final_price: 22000,
      stock_quantity: 200,
      discount_percent: 12,
      is_hot: true,
      slug: "banh-quy-richy-200g",
      quantity: "200g",
    },
    {
      id: 602,
      name: "Bánh Kinh Đô 500g",
      description: "Bánh ngọt Kinh Đô 500g",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 120000,
      final_price: 105000,
      stock_quantity: 100,
      discount_percent: 12,
      is_hot: false,
      slug: "banh-kinh-do-500g",
      quantity: "500g",
    },
  ],
  "cham-soc-ca-nhan": [
    {
      id: 701,
      name: "Dầu gội Sunsilk 400ml",
      description: "Dầu gội Sunsilk suôn mượt 400ml",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 65000,
      final_price: 58000,
      stock_quantity: 150,
      discount_percent: 11,
      is_hot: true,
      slug: "dau-goi-sunsilk-400ml",
      quantity: "400ml",
    },
    {
      id: 702,
      name: "Kem đánh răng Colgate 180g",
      description: "Kem đánh răng Colgate 180g",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 45000,
      final_price: 40000,
      stock_quantity: 200,
      discount_percent: 11,
      is_hot: false,
      slug: "kem-danh-rang-colgate-180g",
      quantity: "180g",
    },
  ],
  "ve-sinh-nha-cua": [
    {
      id: 801,
      name: "Nước rửa chén Sunlight 750ml",
      description: "Nước rửa chén Sunlight chanh 750ml",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 55000,
      final_price: 49000,
      stock_quantity: 180,
      discount_percent: 11,
      is_hot: true,
      slug: "nuoc-rua-chen-sunlight-750ml",
      quantity: "750ml",
    },
    {
      id: 802,
      name: "Giấy vệ sinh Pulppy 8 cuộn",
      description: "Giấy vệ sinh Pulppy 8 cuộn",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 65000,
      final_price: 58000,
      stock_quantity: 120,
      discount_percent: 11,
      is_hot: false,
      slug: "giay-ve-sinh-pulppy-8-cuon",
      quantity: "8 cuộn",
    },
  ],
  "san-pham-me-va-be": [
    {
      id: 901,
      name: "Tã Bobby size M 56 miếng",
      description: "Tã Bobby siêu thấm size M 56 miếng",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 450000,
      final_price: 400000,
      stock_quantity: 80,
      discount_percent: 11,
      is_hot: true,
      slug: "ta-bobby-size-m-56",
      quantity: "56 miếng",
    },
    {
      id: 902,
      name: "Khăn ướt Bobby 80 tờ",
      description: "Khăn ướt Bobby 80 tờ",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
      unit_price: 95000,
      final_price: 85000,
      stock_quantity: 150,
      discount_percent: 11,
      is_hot: false,
      slug: "khan-uot-bobby-80-to",
      quantity: "80 tờ",
    },
  ],
};

const categoryBanners: Banner[] = [
  {
    id: 1,
    name: "Banner danh mục",
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/7890/freecompress-trang-cate-pc_202510091649049889.jpg",
    link_url: "/",
  },
];

// Dữ liệu banner cho phần khuyến mãi sốc
const promotionBanners: Banner[] = [
  {
    id: 1,
    name: "Banner khuyến mãi sốc",
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/7890/freecompress-trang-cate-pc_202510091649049889.jpg",
    link_url: "/",
  },
  {
    id: 2,
    name: "Banner khuyến mãi sốc 2",
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/7890/freecompress-trang-cate-pc-1_202508190846166252.jpg",
    link_url: "/",
  },
];

export default function KhuyenMaiPage() {
  const { addToCart } = useCart();
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleAddToCart = (
    product: Product & { selectedQuantity?: number }
  ) => {
    addToCart({
      id: product.id.toString(),
      name: product.name,
      price: product.final_price,
      image: product.image_url,
      unit: product.quantity || "1 sản phẩm",
      quantity: product.selectedQuantity || 1,
    });

    console.log(
      "Đã thêm vào giỏ hàng:",
      product.name,
      "x",
      product.selectedQuantity || 1
    );
  };

  const handleCategoryClick = (categoryId: string) => {
    const section = sectionRefs.current[categoryId];
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftButton(scrollLeft > 1);
      const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 1;
      setShowRightButton(!isAtEnd);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
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

  return (
    <div className="min-h-screen bg-blue-50 w-full">
      {/* Page Header - giống EmptyCart */}
      <div className="bg-white border-b mb-3 w-full">
        <div className="w-full px-3 sm:px-4 py-4 flex items-center">
          <Link to="/" className="mr-4 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Khuyến mãi sốc
          </h1>
        </div>
      </div>

      {/* Container chung với spacing đều nhau - Full width */}
      <div className="w-full">
        <div className="space-y-1 sm:space-y-2 w-full">
          {/* Thanh danh mục ngang */}
          <div className="w-full bg-white overflow-hidden">
            <div
              className="w-full bg-background relative group/container"
              onMouseEnter={() => setIsMouseOver(true)}
              onMouseLeave={() => setIsMouseOver(false)}
            >
              {/* Scroll buttons */}
              <div className="opacity-0 group-hover/container:opacity-100 transition-opacity">
                {showLeftButton && (
                  <ScrollButton direction="left" onClick={() => scroll("left")} />
                )}
                {showRightButton && (
                  <ScrollButton direction="right" onClick={() => scroll("right")} />
                )}
              </div>

              <div
                ref={scrollContainerRef}
                className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                <div className="flex p-1 gap-4">
                  {promotionCategories.map((category) => (
                    <div key={category.id} className="flex items-center flex-shrink-0">
                      <button
                        onClick={() => handleCategoryClick(category.id)}
                        className="flex flex-col items-center gap-2 min-w-[80px] max-w-[80px] group"
                      >
                        <div className="relative">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
                            <img
                              src={category.image || "/placeholder.svg"}
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <span className="text-xs text-center leading-tight max-w-[80px] truncate text-foreground">
                          {category.name}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Banners khuyến mãi sốc */}
          <div className="w-full">
            <Banners banners={promotionBanners} />
          </div>

          {/* Category Sections with Products */}
          {promotionCategories.map((category) => {
            const products = promotionProductsByCategory[category.id] || [];
            
            if (products.length === 0) return null;

            const sectionId = category.id;
            
            return (
              <div
                key={category.id}
                ref={(el) => {
                  sectionRefs.current[sectionId] = el;
                }}
                id={sectionId}
                className="w-full [&>div]:mb-0"
              >
                <CategorySection
                  categoryName={category.name}
                  products={products}
                  banners={categoryBanners}
                  onAddToCart={handleAddToCart}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

}

