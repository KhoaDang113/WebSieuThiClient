import { CategoryNav } from "@/components/category/CategoryNav";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { CategoryNav as Category } from "@/types/category.type";
import type { Product } from "@/types/product.type";
import type { Banner } from "@/types/banner.type";
import Banners from "@/components/productPage/banner/Banners";
import Article from "@/components/productPage/article/Article";
import ProductGridWithBanners from "@/components/products/ProductGridWithBanners";
import type { Article as ArticleType } from "@/types/article.type";
import FilterBar from "@/components/productPage/filter/FilterBar";
import Promotion from "@/components/productPage/promotion/Promotion";

const sampleCategories: Category[] = [
  {
    id: "mi-an-lien",
    name: "Mì ăn liền",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
    badge: "86k/thùng",
    badgeColor: "bg-green-500",
  },
  {
    id: "hu-tieu-mien",
    name: "Hủ tiếu, miến",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
  },
  {
    id: "pho-bun-an-lien",
    name: "Phở, bún ăn liền",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
  },
  {
    id: "chao-goi",
    name: "Cháo gói, ch...",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
  },
  {
    id: "mien-hu-tieu-pho",
    name: "Miến, hủ tiếu, p...",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
  },
  {
    id: "bun-cac-loai",
    name: "Bún các loại",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
  },
  {
    id: "nui-cac-loai",
    name: "Nui các loại",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
  },
  {
    id: "mi-y-mi-trung",
    name: "Mì Ý, mì trứng",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
  },
  {
    id: "banh-gao-han",
    name: "Bánh gạo Hàn Quốc",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
  },
];

// Dữ liệu mẫu sản phẩm theo category
const sampleProducts: Record<string, Product[]> = {
  "mi-an-lien": [
    {
      id: 1,
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
      quantity: "500g",
    },
    {
      id: 2,
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
      quantity: "500g",
    },
    {
      id: 3,
      name: "Kokomi - Mì lẩu",
      description: "Mì lẩu Kokomi vị tôm chua cay thơm ngon",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      unit_price: 58000,
      final_price: 52000,
      stock_quantity: 80,
      discount_percent: 10,
      is_hot: true,
      slug: "kokomi-mi-lau",
      quantity: "75g",
    },
    {
      id: 4,
      name: "Omachi - Mì tôm",
      description: "Mì tôm Omachi vị chua cay đặc biệt",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      unit_price: 42000,
      final_price: 38000,
      stock_quantity: 120,
      discount_percent: 10,
      is_hot: false,
      slug: "omachi-mi-tom",
      quantity: "75g",
    },
    {
      id: 5,
      name: "Acecook - Mì gói",
      description: "Mì gói Acecook vị tôm chua cay",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      unit_price: 35000,
      final_price: 32000,
      stock_quantity: 300,
      discount_percent: 9,
      is_hot: false,
      slug: "acecook-mi-goi",
      quantity: "65g",
    },
    {
      id: 6,
      name: "Miliket - Mì tôm",
      description: "Mì tôm Miliket vị chua cay đậm đà",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      unit_price: 48000,
      final_price: 43000,
      stock_quantity: 90,
      discount_percent: 10,
      is_hot: false,
      slug: "miliket-mi-tom",
      quantity: "75g",
    },
    {
      id: 7,
      name: "Sakura - Mì lẩu",
      description: "Mì lẩu Sakura vị tôm chua cay thơm ngon",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      unit_price: 65000,
      final_price: 58000,
      stock_quantity: 60,
      discount_percent: 11,
      is_hot: true,
      slug: "sakura-mi-lau",
      quantity: "80g",
    },
    {
      id: 8,
      name: "Vifon - Mì tôm",
      description: "Mì tôm Vifon vị chua cay đặc biệt",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      unit_price: 38000,
      final_price: 35000,
      stock_quantity: 180,
      discount_percent: 8,
      is_hot: false,
      slug: "vifon-mi-tom",
      quantity: "70g",
    },
    {
      id: 9,
      name: "Khong Guan - Mì ăn liền",
      description: "Mì ăn liền Khong Guan vị tôm chua cay",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      unit_price: 55000,
      final_price: 50000,
      stock_quantity: 70,
      discount_percent: 9,
      is_hot: false,
      slug: "khong-guan-mi-an-lien",
      quantity: "75g",
    },
    {
      id: 10,
      name: "Sapporo - Mì Nhật",
      description: "Mì Nhật Sapporo vị tôm chua cay cao cấp",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      unit_price: 75000,
      final_price: 68000,
      stock_quantity: 45,
      discount_percent: 9,
      is_hot: true,
      slug: "sapporo-mi-nhat",
      quantity: "85g",
    },
    {
      id: 11,
      name: "Maruchan - Mì Hàn",
      description: "Mì Hàn Maruchan vị tôm chua cay đặc biệt",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      unit_price: 42000,
      final_price: 38000,
      stock_quantity: 100,
      discount_percent: 10,
      is_hot: false,
      slug: "maruchan-mi-han",
      quantity: "70g",
    },
    {
      id: 12,
      name: "Nissin - Mì Nhật",
      description: "Mì Nhật Nissin vị tôm chua cay cao cấp",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      unit_price: 68000,
      final_price: 62000,
      stock_quantity: 55,
      discount_percent: 9,
      is_hot: true,
      slug: "nissin-mi-nhat",
      quantity: "85g",
    },
  ],
  "dau-an": [
    {
      id: 13,
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
      quantity: "1L",
    },
    {
      id: 14,
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
      quantity: "1L",
    },
    {
      id: 15,
      name: "Dầu ăn Tường An",
      description: "Dầu ăn Tường An tinh luyện cao cấp",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/dau-an-final_202510031117342125.gif",
      unit_price: 78000,
      final_price: 70000,
      stock_quantity: 180,
      discount_percent: 10,
      is_hot: false,
      slug: "dau-an-tuong-an",
      quantity: "900ml",
    },
  ],
  "thit-heo": [
    {
      id: 16,
      name: "Thịt heo ba chỉ",
      description: "Thịt heo ba chỉ tươi ngon, chất lượng cao",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8781/thit-heo_202509110924556310.png",
      unit_price: 120000,
      final_price: 110000,
      stock_quantity: 50,
      discount_percent: 8,
      is_hot: true,
      slug: "thit-heo-ba-chi",
      quantity: "1kg",
    },
    {
      id: 17,
      name: "Thịt heo nạc",
      description: "Thịt heo nạc tươi ngon, không mỡ",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8781/thit-heo_202509110924556310.png",
      unit_price: 135000,
      final_price: 125000,
      stock_quantity: 40,
      discount_percent: 7,
      is_hot: false,
      slug: "thit-heo-nac",
      quantity: "1kg",
    },
    {
      id: 18,
      name: "Thịt heo sườn",
      description: "Thịt heo sườn tươi ngon, nhiều thịt",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8781/thit-heo_202509110924556310.png",
      unit_price: 145000,
      final_price: 135000,
      stock_quantity: 30,
      discount_percent: 7,
      is_hot: false,
      slug: "thit-heo-suon",
      quantity: "1kg",
    },
  ],
  "rau-la": [
    {
      id: 19,
      name: "Rau muống",
      description: "Rau muống tươi xanh, không thuốc trừ sâu",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
      unit_price: 15000,
      final_price: 12000,
      stock_quantity: 100,
      discount_percent: 20,
      is_hot: false,
      slug: "rau-muong",
      quantity: "500g",
    },
    {
      id: 20,
      name: "Rau cải",
      description: "Rau cải tươi xanh, giàu vitamin",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
      unit_price: 18000,
      final_price: 15000,
      stock_quantity: 80,
      discount_percent: 17,
      is_hot: false,
      slug: "rau-cai",
      quantity: "500g",
    },
    {
      id: 21,
      name: "Rau xà lách",
      description: "Rau xà lách tươi giòn, làm salad",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
      unit_price: 22000,
      final_price: 20000,
      stock_quantity: 60,
      discount_percent: 9,
      is_hot: false,
      slug: "rau-xa-lach",
      quantity: "300g",
    },
  ],
};

const sampleBanners: Banner[] = [
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
    name: "Banner 2",
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/7890/trang-cate-pc202507042338493733_202508121546495641.jpg",
    link_url: "/ ",
  },
];

const sampleArticles: ArticleType[] = [
  {
    id: 1,
    title: "Thịt heo là gì?",
    content:
      "Thịt heo là loại thực phẩm phổ biến nhất tại Việt Nam, là loại nguyên liệu quen thuộc trong những bữa ăn hằng ngày. Bởi lẽ, giá thịt heo không chỉ phù hợp với điều kiện kinh tế của người Việt mà còn dễ dàng chế biến ra nhiều món ăn nhanh mà lại không tốn quá nhiều thời gian.\n\nThịt heo tươi chứa rất nhiều chất dinh dưỡng cung cấp cho cơ thể con người. Thông thường, phần thịt mà được ưa chuộng nhất chính là ba rọi và sườn heo. Các phần thịt này có độ mềm dai vừa phải, phần mỡ nạc xen kẽ tạo nên độ thơm ngon cho món ăn.\n\nThịt heo còn chứa nhiều protein, vitamin B12, sắt và kẽm. Đây là những chất dinh dưỡng quan trọng cho sự phát triển của cơ thể và hệ thần kinh.\n\nThành phần dinh dưỡng của thịt heo bao gồm protein, chất béo, vitamin và khoáng chất cần thiết cho cơ thể.",
  },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Lấy category từ URL query parameter
  const categoryFromUrl = searchParams.get("category");
  const brandsFromUrl = searchParams.get("brands");

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategoryId(categoryFromUrl);
      // TODO: Gọi API để lấy sản phẩm theo category
      fetchProductsByCategory(categoryFromUrl);
      fetchCategories();
    }
  }, [categoryFromUrl]);

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

  const fetchProductsByCategory = async (categoryId: string) => {
    try {
      // TODO: Thay thế bằng API call thực tế

      // Sử dụng dữ liệu mẫu
      const categoryProducts =
        sampleProducts[categoryId as keyof typeof sampleProducts] || [];
      setProducts(categoryProducts);

      // Khi có API thực tế, uncomment code bên dưới:
      // const response = await fetch(`/api/products?category=${categoryId}`);
      // const data = await response.json();
      // setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      // const response = await fetch(`/api/categories`);
      // const data = await response.json();
      setCategories(sampleCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategorySelect = (category: { id: string; name: string }) => {
    // Category selected
  };

  const handleAddToCart = (product: Product) => {
    // TODO: Implement add to cart logic
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

  return (
    <div className="min-h-screen bg-blue-50 w-full">
      <div className="w-full bg-white overflow-hidden">
        <CategoryNav
          categories={categories}
          variant="product-page"
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={handleCategorySelect}
        />
      </div>
      <div className="mt-5">
        <FilterBar
          onBrandSelect={handleBrandSelect}
          selectedBrands={selectedBrands}
        />
      </div>
      <div className="mt-5">
        <Promotion products={products} onAddToCart={handleAddToCart} />
      </div>
      <div className="mt-5">
        <Banners banners={sampleBanners} />
      </div>

      {/* Hiển thị sản phẩm với banner xen kẽ */}
      <div className="mt-8">
        <ProductGridWithBanners
          products={products}
          banners={sampleBanners}
          onAddToCart={handleAddToCart}
          rowsPerBanner={2}
        />
        <div className="mt-8">
          <Article article={sampleArticles[0]} variant="compact" />
        </div>
      </div>
    </div>
  );
}
