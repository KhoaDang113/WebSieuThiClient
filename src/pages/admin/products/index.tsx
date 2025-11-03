import { useState } from "react";
import { Link } from "react-router-dom";
import { ProductFilters } from "@/components/admin/products/ProductFilters";
import { ProductTable } from "@/components/admin/products/ProductTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Product, CategoryNav as Category } from "@/types";

// Dữ liệu từ products/index.tsx
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
    id: "dau-an",
    name: "Dầu ăn",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/dau-an-final_202510031117342125.gif",
  },
  {
    id: "thit-heo",
    name: "Thịt heo",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8781/thit-heo_202509110924556310.png",
  },
  {
    id: "rau-la",
    name: "Rau lá",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
  },
];

// Dữ liệu mẫu sản phẩm từ products/index.tsx
const sampleProducts: Product[] = [
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
    id: 19,
    name: "Rau muống",
    description: "Rau muống tươi xanh, không thuốc trừ sâu",
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
    unit_price: 15000,
    final_price: 12000,
    stock_quantity: 8,
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
    stock_quantity: 5,
    discount_percent: 17,
    is_hot: false,
    slug: "rau-cai",
    quantity: "500g",
  },
  {
    id: 21,
    name: "Rau cải",
    description: "Rau cải tươi xanh, giàu vitamin",
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
    unit_price: 18000,
    final_price: 15000,
    stock_quantity: 5,
    discount_percent: 17,
    is_hot: false,
    slug: "rau-cai",
    quantity: "500g",
  },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Quản lý Sản phẩm
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý toàn bộ sản phẩm trong hệ thống
          </p>
        </div>
        <Link to="/admin/products/add">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm Sản phẩm
          </Button>
        </Link>
      </div>

      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        brandFilter={brandFilter}
        setBrandFilter={setBrandFilter}
        lowStockOnly={lowStockOnly}
        setLowStockOnly={setLowStockOnly}
        categories={sampleCategories}
      />

      <ProductTable
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        brandFilter={brandFilter}
        lowStockOnly={lowStockOnly}
        products={sampleProducts}
      />
    </div>
  );
}
