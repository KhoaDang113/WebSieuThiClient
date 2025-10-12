import { CategoryNav } from "@/components/CategoryNav";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { CategoryNav as Category, Product } from "@/types";

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
const sampleProducts = {
  "mi-an-lien": [
    {
      id: 1,
      name: "Gấu Đỏ - Mì ăn liền",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      price: "96.000₫",
      discountPrice: "86.000₫",
    },
    {
      id: 2,
      name: "Hảo Hảo - Mì tôm",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      price: "50.000₫",
      discountPrice: "45.000₫",
    },
    {
      id: 3,
      name: "Kokomi - Mì lẩu",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      price: "58.000₫",
      discountPrice: "52.000₫",
    },
    {
      id: 4,
      name: "Omachi - Mì tôm",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      price: "42.000₫",
      discountPrice: "38.000₫",
    },
    {
      id: 5,
      name: "Acecook - Mì gói",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      price: "35.000₫",
      discountPrice: "32.000₫",
    },
    {
      id: 6,
      name: "Miliket - Mì tôm",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      price: "48.000₫",
      discountPrice: "43.000₫",
    },
    {
      id: 7,
      name: "Sakura - Mì lẩu",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      price: "65.000₫",
      discountPrice: "58.000₫",
    },
    {
      id: 8,
      name: "Vifon - Mì tôm",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      price: "38.000₫",
      discountPrice: "35.000₫",
    },
    {
      id: 9,
      name: "Khong Guan - Mì ăn liền",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      price: "55.000₫",
      discountPrice: "50.000₫",
    },
    {
      id: 10,
      name: "Sapporo - Mì Nhật",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      price: "75.000₫",
      discountPrice: "68.000₫",
    },
    {
      id: 11,
      name: "Maruchan - Mì Hàn",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      price: "42.000₫",
      discountPrice: "38.000₫",
    },
    {
      id: 12,
      name: "Nissin - Mì Nhật",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
      price: "68.000₫",
      discountPrice: "62.000₫",
    },
  ],
  "dau-an": [
    {
      id: 5,
      name: "Dầu ăn Neptune",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/dau-an-final_202510031117342125.gif",
      price: "85.000₫",
      discountPrice: "75.000₫",
    },
    {
      id: 6,
      name: "Dầu ăn Simply",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/dau-an-final_202510031117342125.gif",
      price: "95.000₫",
      discountPrice: "85.000₫",
    },
    {
      id: 7,
      name: "Dầu ăn Tường An",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/dau-an-final_202510031117342125.gif",
      price: "78.000₫",
      discountPrice: "70.000₫",
    },
  ],
  "thit-heo": [
    {
      id: 8,
      name: "Thịt heo ba chỉ",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8781/thit-heo_202509110924556310.png",
      price: "120.000₫",
      discountPrice: "110.000₫",
    },
    {
      id: 9,
      name: "Thịt heo nạc",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8781/thit-heo_202509110924556310.png",
      price: "135.000₫",
      discountPrice: "125.000₫",
    },
    {
      id: 10,
      name: "Thịt heo sườn",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8781/thit-heo_202509110924556310.png",
      price: "145.000₫",
      discountPrice: "135.000₫",
    },
  ],
  "rau-la": [
    {
      id: 11,
      name: "Rau muống",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
      price: "15.000₫",
      discountPrice: "12.000₫",
    },
    {
      id: 12,
      name: "Rau cải",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
      price: "18.000₫",
      discountPrice: "15.000₫",
    },
    {
      id: 13,
      name: "Rau xà lách",
      image:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
      price: "22.000₫",
      discountPrice: "20.000₫",
    },
  ],
};

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  // Lấy category từ URL query parameter
  const categoryFromUrl = searchParams.get("category");

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategoryId(categoryFromUrl);
      // TODO: Gọi API để lấy sản phẩm theo category
      fetchProductsByCategory(categoryFromUrl);
      fetchCategories();
    }
  }, [categoryFromUrl]);

  const fetchProductsByCategory = async (categoryId: string) => {
    try {
      // TODO: Thay thế bằng API call thực tế
      console.log(`Fetching products for category: ${categoryId}`);

      // Sử dụng dữ liệu mẫu
      const categoryProducts =
        sampleProducts[categoryId as keyof typeof sampleProducts] || [];
      setProducts(categoryProducts as unknown as Product[]);

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
    console.log("Đã chọn loại:", category.name);
  };

  return (
    <div>
      <CategoryNav
        categories={categories}
        variant="product-page"
        selectedCategoryId={selectedCategoryId}
        onCategorySelect={handleCategorySelect}
      />
      <div className="mt-5"></div>

      {/* Hiển thị sản phẩm theo category */}
      <div className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
          {products.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-8">
              Chưa có sản phẩm nào trong danh mục này
            </p>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
