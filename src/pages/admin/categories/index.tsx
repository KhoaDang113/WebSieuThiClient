import * as React from "react";
import { useState } from "react";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { CategoryNav as Category } from "@/types";

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

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản lý Danh mục</h1>
        <p className="text-muted-foreground mt-1">Quản lý danh mục sản phẩm</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên danh mục..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="pl-10"
          />
        </div>
      </div>

      <CategoryTable searchTerm={searchTerm} categories={sampleCategories} />
    </div>
  );
}
