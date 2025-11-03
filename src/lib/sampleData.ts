import type { Product } from "@/types/product.type";
import type { Banner } from "@/types/banner.type";
import type { CategoryNav } from "@/types/category.type";
import type { Order } from "@/types/order";

// Dữ liệu mẫu cho các danh mục
export const sampleCategories: CategoryNav[] = [
  {
    id: "thit-ca-trung-hai-san",
    name: "THỊT, CÁ, TRỨNG, HẢI SẢN",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8781/thit-heo_202509110924556310.png",
  },
  {
    id: "rau-cu-nam-trai-cay",
    name: "RAU, CỦ, NẤM, TRÁI CÂY",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
  },
  {
    id: "dau-an-nuoc-cham-gia-vi",
    name: "DẦU ĂN, NƯỚC CHẤM, GIA VỊ",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7148/1990379_202410101528079106.png",
  },
  {
    id: "gao-bot-do-kho",
    name: "GẠO, BỘT, ĐỒ KHÔ",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7149/gao-nep_202510022130564969.gif",
  },
  {
    id: "mi-mien-chao-pho",
    name: "MÌ, MIẾN, CHÁO, PHỞ",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7147/image-523_202410101609435656.png",
  },
  {
    id: "sua-cac-loai",
    name: "SỮA CÁC LOẠI",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7091/7091_202410101515241537.png",
  },
  {
    id: "kem-sua-chua",
    name: "KEM, SỮA CHUA",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/13578/1873233362_202503141313074938.png",
  },
  {
    id: "thuc-pham-dong-mat",
    name: "THỰC PHẨM ĐÔNG MÁT",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/10798/274201_202503141313392000.png",
  },
  {
    id: "bia-nuoc-giai-khat",
    name: "BIA, NƯỚC GIẢI KHÁT",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/2282/frame-3476163_202503181613016838.png",
  },
  {
    id: "banh-keo-cac-loai",
    name: "BÁNH KẸO CÁC LOẠI",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7143/7143_202410110835348807.png",
  },
  {
    id: "cham-soc-ca-nhan",
    name: "CHĂM SÓC CÁ NHÂN",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
  },
  {
    id: "ve-sinh-nha-cua",
    name: "VỆ SINH NHÀ CỬA",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
  },
  {
    id: "san-pham-me-va-be",
    name: "SẢN PHẨM MẸ VÀ BÉ",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
  },
];

// Dữ liệu mẫu cho sản phẩm theo danh mục
export const sampleProductsByCategory: Record<string, Product[]> = {
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
    {
      id: 4,
      name: "Đầu cá hồi salar làm sạch",
      description: "Đầu cá hồi salar nhập khẩu đã làm sạch",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8781/thit-heo_202509110924556310.png",
      unit_price: 98000,
      final_price: 49000,
      stock_quantity: 15,
      discount_percent: 50,
      is_hot: false,
      slug: "dau-ca-hoi-salar-lam-sach",
      quantity: "500g",
    },
    {
      id: 5,
      name: "Thịt heo xay C.P",
      description: "Thịt heo xay C.P tươi ngon",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8781/thit-heo_202509110924556310.png",
      unit_price: 35000,
      final_price: 28000,
      stock_quantity: 40,
      discount_percent: 20,
      is_hot: true,
      slug: "thit-heo-xay-cp",
      quantity: "200g",
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
    {
      id: 9,
      name: "Táo Gala mini nhập khẩu",
      description: "Táo Gala mini nhập khẩu tươi ngon",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
      unit_price: 35000,
      final_price: 27000,
      stock_quantity: 45,
      discount_percent: 23,
      is_hot: false,
      slug: "tao-gala-mini-nhap-khau",
      quantity: "400g",
    },
    {
      id: 10,
      name: "Táo Nam Phi giòn ngọt",
      description: "Táo Nam Phi giòn ngọt nhập khẩu",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
      unit_price: 55000,
      final_price: 45000,
      stock_quantity: 35,
      discount_percent: 18,
      is_hot: true,
      slug: "tao-nam-phi-gion-ngot",
      quantity: "1kg",
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
      id: 13,
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
    {
      id: 15,
      name: "Tương ớt Chin-su",
      description: "Tương ớt Chin-su cay nồng",
      image_url:
        "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/dau-an-final_202510031117342125.gif",
      unit_price: 25000,
      final_price: 22000,
      stock_quantity: 300,
      discount_percent: 12,
      is_hot: false,
      slug: "tuong-ot-chin-su",
      quantity: "250g",
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
    {
      id: 18,
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
      quantity: "1 gói",
    },
    {
      id: 19,
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
      quantity: "1 gói",
    },
    {
      id: 20,
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
      quantity: "1 gói",
    },
  ],
};

// Dữ liệu mẫu cho gia vị (sử dụng trong modal nguyên liệu món ăn)
export const spicesData = [
  {
    id: 101,
    name: "Nước mắm Nam Ngư",
    quantity: "Chai 500ml",
    unit: "chai",
    price: 39500,
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8271/96424/bhx/xot-gia-vi-suon-xao-chua-ngot-barona-goi-80g-20_202507071357019093.jpg",
    available: true,
  },
  {
    id: 102,
    name: "Hạt nêm Knorr",
    quantity: "Gói 170g",
    unit: "gói",
    price: 18500,
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8271/96424/bhx/xot-gia-vi-suon-xao-chua-ngot-barona-goi-80g-20_202507071357019093.jpg",
    available: true,
  },
  {
    id: 103,
    name: "Đường kính trắng",
    quantity: "Gói 1kg",
    unit: "gói",
    price: 30500,
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8271/96424/bhx/xot-gia-vi-suon-xao-chua-ngot-barona-goi-80g-20_202507071357019093.jpg",
    available: true,
  },
  {
    id: 104,
    name: "Muối i-ốt",
    quantity: "Gói 500g",
    unit: "gói",
    price: 8900,
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8271/96424/bhx/xot-gia-vi-suon-xao-chua-ngot-barona-goi-80g-20_202507071357019093.jpg",
    available: true,
  },
  {
    id: 105,
    name: "Dầu ăn Neptune",
    quantity: "Chai 1 lít",
    unit: "chai",
    price: 52000,
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8271/96424/bhx/xot-gia-vi-suon-xao-chua-ngot-barona-goi-80g-20_202507071357019093.jpg",
    available: true,
  },
  {
    id: 106,
    name: "Tương ớt Chin-su",
    quantity: "Chai 250g",
    unit: "chai",
    price: 22000,
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8271/96424/bhx/xot-gia-vi-suon-xao-chua-ngot-barona-goi-80g-20_202507071357019093.jpg",
    available: true,
  },
  {
    id: 107,
    name: "Hạt tiêu đen",
    quantity: "Gói 50g",
    unit: "gói",
    price: 28500,
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8271/96424/bhx/xot-gia-vi-suon-xao-chua-ngot-barona-goi-80g-20_202507071357019093.jpg",
    available: true,
  },
  {
    id: 108,
    name: "Ớt bột Hàn Quốc",
    quantity: "Gói 100g",
    unit: "gói",
    price: 35000,
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8271/96424/bhx/xot-gia-vi-suon-xao-chua-ngot-barona-goi-80g-20_202507071357019093.jpg",
    available: true,
  },
  {
    id: 109,
    name: "Nước tương Maggi",
    quantity: "Chai 300ml",
    unit: "chai",
    price: 15800,
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8271/96424/bhx/xot-gia-vi-suon-xao-chua-ngot-barona-goi-80g-20_202507071357019093.jpg",
    available: true,
  },
  {
    id: 110,
    name: "Bột ngọt Ajinomoto",
    quantity: "Gói 200g",
    unit: "gói",
    price: 19500,
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8271/96424/bhx/xot-gia-vi-suon-xao-chua-ngot-barona-goi-80g-20_202507071357019093.jpg",
    available: true,
  },
];

// Dữ liệu mẫu cho banner chính
export const mainBanners: Banner[] = [
  {
    id: 1,
    name: "Banner chính 1",
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/7890/freecompress-trang-cate-pc_202510091649049889.jpg",
    link_url: "/",
  },
  {
    id: 2,
    name: "Banner chính 2",
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/7890/freecompress-trang-cate-pc-1_202508190846166252.jpg",
    link_url: "/",
  },
  {
    id: 3,
    name: "Banner chính 3",
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/7890/trang-cate-pc202507042338493733_202508121546495641.jpg",
    link_url: "/",
  },
];

// Dữ liệu mẫu cho banner phụ (giữa các danh mục)
export const categoryBanners: Banner[] = [
  {
    id: 4,
    name: "Banner danh mục 1",
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/7890/freecompress-trang-cate-pc_202510091649049889.jpg",
    link_url: "/",
  },
  {
    id: 5,
    name: "Banner danh mục 2",
    image_url:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/7890/freecompress-trang-cate-pc-1_202508190846166252.jpg",
    link_url: "/",
  },
];

// Dữ liệu mẫu cho đơn hàng
export const sampleOrders: Order[] = [
  {
    id: "ORD-001",
    customer_name: "Nguyễn Văn A",
    customer_phone: "0123456789",
    customer_address: "123 Đường ABC, Quận 1, TP.HCM",
    items: [
      {
        id: "item-1",
        product_id: 1,
        name: "Má đùi gà cắt sẵn",
        price: 41582,
        quantity: 2,
        image:
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8781/thit-heo_202509110924556310.png",
        unit: "500g",
      },
      {
        id: "item-2",
        product_id: 6,
        name: "Quýt Úc",
        price: 69000,
        quantity: 1,
        image:
          "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
        unit: "800g",
      },
    ],
    total_amount: 152164,
    status: "pending",
    created_at: "2024-01-15T10:30:00Z",
    notes: "Giao hàng vào buổi chiều",
  },
  {
    id: "ORD-002",
    customer_name: "Trần Thị B",
    customer_phone: "0987654321",
    customer_address: "456 Đường XYZ, Quận 3, TP.HCM",
    items: [
      {
        id: "item-3",
        product_id: 11,
        name: "Dầu ăn Neptune",
        price: 75000,
        quantity: 1,
        image:
          "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/dau-an-final_202510031117342125.gif",
        unit: "1 chai",
      },
      {
        id: "item-4",
        product_id: 16,
        name: "Gấu Đỏ - Mì ăn liền",
        price: 86000,
        quantity: 1,
        image:
          "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
        unit: "1 thùng",
      },
    ],
    total_amount: 161000,
    status: "confirmed",
    created_at: "2024-01-15T09:15:00Z",
  },
  {
    id: "ORD-003",
    customer_name: "Lê Văn C",
    customer_phone: "0369258147",
    customer_address: "789 Đường DEF, Quận 5, TP.HCM",
    items: [
      {
        id: "item-5",
        product_id: 3,
        name: "Sườn cốt lết C.P",
        price: 37530,
        quantity: 3,
        image:
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8781/thit-heo_202509110924556310.png",
        unit: "300g",
      },
    ],
    total_amount: 112590,
    status: "pending",
    created_at: "2024-01-15T11:45:00Z",
    notes: "Khách yêu cầu giao nhanh",
  },
  {
    id: "ORD-004",
    customer_name: "Phạm Thị D",
    customer_phone: "0741852963",
    customer_address: "321 Đường GHI, Quận 7, TP.HCM",
    items: [
      {
        id: "item-6",
        product_id: 8,
        name: "Dưa lưới tròn ruột cam",
        price: 53300,
        quantity: 2,
        image:
          "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
        unit: "1.3kg",
      },
      {
        id: "item-7",
        product_id: 14,
        name: "Nước mắm Phú Quốc",
        price: 40000,
        quantity: 1,
        image:
          "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/dau-an-final_202510031117342125.gif",
        unit: "500ml",
      },
    ],
    total_amount: 146600,
    status: "cancelled",
    created_at: "2024-01-15T08:20:00Z",
    notes: "Khách hủy do thay đổi ý định",
  },
  {
    id: "03CD2510639147854C4",
    customer_name: "Anh Linh",
    customer_phone: "0912345678",
    customer_address: "Ký Túc Xá Khu B, Phường Đông Hòa, TP. Dĩ An",
    items: [
      {
        id: "item-8",
        product_id: 20,
        name: "Bánh quy Hương Phèn",
        price: 40000,
        quantity: 1,
        image:
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/3438/332313/bhx/banh-quy-huong-phen-cosy-100g-202407230903180968.jpg",
        unit: "100g",
      },
    ],
    total_amount: 40000,
    status: "delivered",
    created_at: "2024-10-01T10:00:00Z",
  },
  {
    id: "03CD2510639082038B4",
    customer_name: "Anh Linh",
    customer_phone: "0912345678",
    customer_address: "Ký Túc Xá Khu B, Phường Đông Hòa, TP. Dĩ An",
    items: [
      {
        id: "item-9",
        product_id: 1,
        name: "Má đùi gà cắt sẵn",
        price: 41582,
        quantity: 3,
        image:
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8785/306132/bhx/ma-dui-ga-khay-500g-3-5-mieng-202411141059213688.jpg",
        unit: "500g",
      },
      {
        id: "item-10",
        product_id: 3,
        name: "Sườn cốt lết C.P",
        price: 37530,
        quantity: 2,
        image:
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8781/306155/bhx/suon-cot-let-cp-khay-300g-202409161023285467.jpg",
        unit: "300g",
      },
      {
        id: "item-11",
        product_id: 2,
        name: "Thịt heo xay C.P",
        price: 35600,
        quantity: 2,
        image:
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8781/306066/bhx/thit-heo-xay-cp-khay-300g-202409161009478669.jpg",
        unit: "300g",
      },
      {
        id: "item-12",
        product_id: 4,
        name: "Ba chỉ bò Úc",
        price: 89000,
        quantity: 2,
        image:
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8782/306143/bhx/ba-chi-bo-uc-khay-300g-202410161101541773.jpg",
        unit: "300g",
      },
    ],
    total_amount: 232090,
    status: "delivered",
    created_at: "2024-10-01T10:00:00Z",
  },
  {
    id: "ORD-006",
    customer_name: "Hoàng Văn E",
    customer_phone: "0968741258",
    customer_address: "654 Đường JKL, Quận 10, TP.HCM",
    items: [
      {
        id: "item-13",
        product_id: 6,
        name: "Quýt Úc",
        price: 69000,
        quantity: 2,
        image:
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8788/329280/bhx/quyt-uc-tui-800g-6-8-trai-202410020919403536.jpg",
        unit: "800g",
      },
      {
        id: "item-14",
        product_id: 7,
        name: "Chuối sứ",
        price: 18800,
        quantity: 3,
        image:
          "https://cdnv2.tgdd.vn/bhx-static/bhx/Products/Images/8788/272137/bhx/chuoi-su-tui-1kg-202410020916374743.jpg",
        unit: "1kg",
      },
    ],
    total_amount: 194400,
    status: "delivered",
    created_at: "2024-01-14T16:30:00Z",
  },
];
