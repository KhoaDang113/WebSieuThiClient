"use client";

import { useState } from "react";
import { ChevronDown, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import type { CategorySideBar as Category } from "@/types";

const categories: Category[] = [
  {
    name: "KHUYẾN MÃI SỐC",
    href: "/khuyen-mai",
    icon: <Tag className="h-5 w-5 text-red-600" />,
  },
  {
    name: "THỊT, CÁ, TRỨNG, HẢI SẢN",
    href: "/thit-ca-trung",
    subCategories: [
      { name: "Thịt heo", href: "thit-heo" },
      { name: "Thịt bò", href: "thit-bo" },
      { name: "Thịt gà, vịt", href: "thit-gia-cam" },
      { name: "Nội tạng, xương", href: "noi-tang-xuong" },
      { name: "Cá tươi", href: "ca-tuoi" },
      { name: "Hải sản tươi/đông lạnh", href: "hai-san" },
      { name: "Trứng gà/vịt/cút", href: "trung" },
      { name: "Thịt/đồ ướp sẵn", href: "do-uop-san" },
      { name: "Xúc xích, chả giò", href: "xuc-xich-cha-gio" },
    ],
  },

  // 2
  {
    name: "RAU, CỦ, NẤM, TRÁI CÂY",
    href: "/rau-cu-nam-trai-cay",
    subCategories: [
      { name: "Rau lá", href: "rau-la" },
      { name: "Củ, quả", href: "cu-qua" },
      { name: "Nấm các loại", href: "nam" },
      { name: "Rau gia vị", href: "rau-gia-vi" },
      { name: "Trái cây tươi", href: "trai-cay" },
      {
        name: "Trái cây cắt sẵn",
        href: "trai-cay-cat-san",
      },
      { name: "Rau củ sơ chế", href: "so-che" },
      { name: "Salad & mix", href: "salad" },
    ],
  },

  // 3
  {
    name: "DẦU ĂN, NƯỚC CHẤM, GIA VỊ",
    href: "/dau-an-nuoc-cham-gia-vi",
    subCategories: [
      { name: "Dầu ăn", href: "dau-an" },
      { name: "Nước mắm", href: "nuoc-mam" },
      { name: "Nước tương", href: "nuoc-tuong" },
      {
        name: "Dầu hào, xì dầu",
        href: "dau-hao-xi-dau",
      },
      {
        name: "Mayonnaise, sốt chấm",
        href: "mayonnaise-sot",
      },
      { name: "Tương ớt, tương cà", href: "tuong" },
      { name: "Giấm, sa tế", href: "giam-sa-te" },
      { name: "Muối, đường", href: "muoi-duong" },
      {
        name: "Bột ngọt, hạt nêm",
        href: "bot-ngot-hat-nem",
      },
      {
        name: "Bột canh, tiêu, ngũ vị",
        href: "bot-canh-tieu",
      },
      { name: "Bột chiên giòn/xù", href: "bot-chien" },
      {
        name: "Bột năng/bắp/mì",
        href: "bot-lam-banh",
      },
    ],
  },

  // 4
  {
    name: "GẠO, BỘT, ĐỒ KHÔ",
    href: "/gao-bot-do-kho",
    subCategories: [
      { name: "Gạo thơm, gạo dẻo", href: "gao" },
      { name: "Gạo lứt, ngũ cốc", href: "gao-lut-ngu-coc" },
      { name: "Nếp, bột nếp", href: "nep" },
      { name: "Bột mì/bột gạo", href: "bot-mi-bot-gao" },
      { name: "Bột năng, bột bắp", href: "bot-nang-bot-bap" },
      { name: "Đậu, hạt khô", href: "dau-hat" },
      { name: "Rong biển, nấm khô", href: "rong-bien-nam-kho" },
      { name: "Mè, đậu phộng", href: "me-dau-phong" },
    ],
  },

  // 5
  {
    name: "MÌ, MIẾN, CHÁO, PHỞ",
    href: "/mi-mien-chao-pho",
    subCategories: [
      { name: "Mì gói", href: "mi-goi" },
      { name: "Mì ly", href: "mi-ly" },
      { name: "Miến, bún khô", href: "mien-bun-kho" },
      { name: "Phở khô", href: "pho-kho" },
      { name: "Cháo ăn liền", href: "chao-an-lien" },
      { name: "Nui, pasta", href: "nui-pasta" },
    ],
  },

  // 6
  {
    name: "THỰC PHẨM ĐÔNG MÁT",
    href: "/thuc-pham-dong-mat",
    subCategories: [
      { name: "Thực phẩm đông lạnh", href: "dong-lanh" },
      { name: "Hải sản đông lạnh", href: "hai-san-dong" },
      { name: "Rau củ đông lạnh", href: "rau-cu-dong" },
      {
        name: "Chả giò, thịt viên",
        href: "cha-gio-thit-vien",
      },
      { name: "Đậu hũ, đồ chay mát", href: "do-chay-mat" },
      {
        name: "Xúc xích, giò chả mát",
        href: "xuc-xich-gio-cha",
      },
      {
        name: "Đồ ăn chế biến sẵn",
        href: "do-che-bien-mat",
      },
    ],
  },

  // 7
  {
    name: "SỮA CÁC LOẠI",
    href: "/sua",
    subCategories: [
      { name: "Sữa tươi/tiệt trùng", href: "sua-tuoi-tiet-trung" },
      { name: "Sữa hạt, sữa đậu nành", href: "sua-hat" },
      { name: "Sữa bột", href: "sua-bot" },
      { name: "Sữa đặc", href: "sua-dac" },
      { name: "Sữa chua uống", href: "sua-chua-uong" },
    ],
  },

  // 8
  {
    name: "KEM, SỮA CHUA",
    href: "/kem-sua-chua",
    subCategories: [
      { name: "Sữa chua ăn", href: "sua-chua-an" },
      { name: "Kem que/kem hộp", href: "kem" },
      { name: "Sữa chua uống", href: "sua-chua-uong" },
      { name: "Thạch, rau câu", href: "thach-rau-cau" },
    ],
  },

  // 9
  {
    name: "BIA, NƯỚC GIẢI KHÁT",
    href: "/bia-nuoc-giai-khat",
    subCategories: [
      { name: "Bia", href: "bia" },
      { name: "Nước ngọt", href: "nuoc-ngot" },
      { name: "Nước suối", href: "nuoc-suoi" },
      { name: "Nước tăng lực", href: "nuoc-tang-luc" },
      { name: "Trà uống liền", href: "tra-dong-chai" },
      { name: "Cà phê lon, hộp", href: "ca-phe-dong-lon" },
      { name: "Nước ép đóng chai", href: "nuoc-ep" },
      { name: "Sữa đậu nành", href: "sua-dau-nanh" },
    ],
  },

  // 10
  {
    name: "BÁNH KẸO CÁC LOẠI",
    href: "/banh-keo-cac-loai",
    subCategories: [
      { name: "Snack", href: "snack" },
      { name: "Bánh quy", href: "banh-quy" },
      {
        name: "Bánh xốp, bánh gạo",
        href: "banh-xop-banh-gao",
      },
      { name: "Bánh bông lan", href: "banh-bong-lan" },
      { name: "Bánh que/quế", href: "banh-que" },
      { name: "Sô-cô-la", href: "socola" },
      { name: "Kẹo cứng", href: "keo-cung" },
      { name: "Kẹo mềm, kẹo dẻo", href: "keo-mem-deo" },
      { name: "Kẹo gum", href: "keo-gum" },
      {
        name: "Hạt sấy, trái cây sấy",
        href: "hat-trai-cay-say",
      },
      { name: "Khô bò/khô gà", href: "kho-bo-kho-ga" },
    ],
  },

  // 11
  {
    name: "CHĂM SÓC CÁ NHÂN",
    href: "/cham-soc-ca-nhan",
    subCategories: [
      { name: "Dầu gội, dầu xả", href: "dau-goi-dau-xa" },
      { name: "Sữa tắm", href: "sua-tam" },
      { name: "Sữa rửa mặt", href: "sua-rua-mat" },
      {
        name: "Kem đánh răng, bàn chải",
        href: "kem-danh-rang-ban-chai",
      },
      { name: "Dao cạo, gel cạo râu", href: "dao-cao" },
      { name: "Khăn giấy ướt/khô", href: "khan-giay" },
      { name: "Lăn khử mùi", href: "lan-khu-mui" },
      { name: "Băng vệ sinh", href: "bang-ve-sinh" },
      { name: "Tã người lớn", href: "ta-nguoi-lon" },
    ],
  },

  // 12
  {
    name: "VỆ SINH NHÀ CỬA",
    href: "/ve-sinh-nha-cua",
    subCategories: [
      { name: "Bột giặt, nước giặt", href: "bot-nuoc-giat" },
      { name: "Nước xả vải", href: "nuoc-xa" },
      { name: "Nước rửa chén", href: "nuoc-rua-chen" },
      {
        name: "Nước lau sàn, lau kính",
        href: "nuoc-lau-san-kinh",
      },
      { name: "Tẩy rửa nhà bếp/nhà tắm", href: "tay-rua" },
      {
        name: "Giấy vệ sinh, khăn giấy",
        href: "giay-ve-sinh",
      },
      { name: "Túi rác, màng bọc", href: "tui-rac-mang-boc" },
      { name: "Diệt côn trùng", href: "diet-con-trung" },
      {
        name: "Găng tay, miếng chà",
        href: "gang-tay-mieng-cha",
      },
    ],
  },

  // 13
  {
    name: "SẢN PHẨM MẸ VÀ BÉ",
    href: "/me-va-be",
    subCategories: [
      { name: "Tã/bỉm", href: "ta-bim" },
      { name: "Khăn ướt", href: "khan-uot" },
      { name: "Sữa bột cho bé", href: "sua-bot-be" },
      { name: "Bột/cháo ăn dặm", href: "an-dam" },
      { name: "Sữa tươi cho bé", href: "sua-tuoi-be" },
      { name: "Đồ tắm gội cho bé", href: "tam-goi" },
      { name: "Dụng cụ ăn dặm", href: "dung-cu-an-dam" },
      { name: "Vệ sinh răng miệng bé", href: "ve-sinh-rang-mieng" },
    ],
  },

  // 14
  {
    name: "ĐỒ DÙNG GIA ĐÌNH",
    href: "/do-dung-gia-dinh",
    subCategories: [
      { name: "Dụng cụ nhà bếp", href: "dung-cu-nha-bep" },
      {
        name: "Chén, dĩa, muỗng, đũa",
        href: "chen-dia-muong-dua",
      },
      { name: "Ly tách, bình nước", href: "ly-binh" },
      { name: "Hộp đựng, túi zip", href: "hop-tui" },
      {
        name: "Màng bọc, giấy bạc",
        href: "mang-boc-giay-bac",
      },
      { name: "Đồ vệ sinh, cây lau", href: "do-ve-sinh" },
      { name: "Pin, bật lửa, đèn cầy", href: "pin-bat-lua" },
      { name: "Nhang – đèn", href: "nhang-den" },
    ],
  },

  // 15 (điều hướng)
  {
    name: "ƯU ĐÃI TỪ HÃNG",
    href: "/uu-dai-tu-hang",
  },

  // 16 (điều hướng)
  {
    name: "XEM CỬA HÀNG",
    href: "/cua-hang",
  },
];

export function CategorySidebar({
  isMobile = false,
  onClose,
}: {
  isMobile?: boolean;
  onClose?: () => void;
}) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleCategoryClick = (category: Category) => {
    // Nếu có subCategories thì toggle, nếu không thì navigate
    if (category.subCategories) {
      toggleCategory(category.name);
    } else {
      // Lấy category ID từ href (bỏ dấu / ở đầu)
      const categoryId = category.href.replace("/", "");
      navigate(`/products?category=${categoryId}`);
      if (isMobile) {
        onClose?.();
      }
    }
  };

  return (
    <aside
      className={cn(
        "w-64 bg-white border-r border-gray-200 flex flex-col z-10 2xl:ml-33",
        isMobile
          ? "h-full"
          : "h-[98%] fixed left-0 top-0 bottom-0 hidden lg:flex pt-[88px]"
      )}
    >
      {/* Header */}
      <div className=" text-gray-800 p-4 font-bold text-sm uppercase flex-shrink-0 flex items-center justify-between border-b-2">
        <span>Danh mục sản phẩm</span>
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="hover:bg-primary-foreground/10 rounded p-1"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Categories */}
      <nav className="py-2 overflow-y-auto flex-1 no-scrollbar">
        {categories.map((category) => (
          <div key={category.name} className="border-b border-gray-100">
            {/* Parent Category */}
            <button
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold hover:bg-gray-50 transition-colors",
                category.name === "KHUYẾN MÃI SỐC" && "text-red-600"
              )}
            >
              <div className="flex items-center gap-2">
                {category.icon}
                <span>{category.name}</span>
              </div>
              {category.subCategories && (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform text-gray-400",
                    expandedCategories.includes(category.name) && "rotate-180"
                  )}
                />
              )}
            </button>

            {/* Sub Categories */}
            {category.subCategories &&
              expandedCategories.includes(category.name) && (
                <div className="bg-gray-50 py-1">
                  {category.subCategories.map((subCategory) => (
                    <Link
                      key={subCategory.name}
                      to={`/products?category=${subCategory.href}`}
                      onClick={() => isMobile && onClose?.()}
                      className="block px-4 py-2 pl-8 text-sm text-gray-700 hover:text-primary hover:bg-white transition-colors"
                    >
                      {subCategory.name}
                    </Link>
                  ))}
                </div>
              )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
