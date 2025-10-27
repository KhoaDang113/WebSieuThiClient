"use client";

import { useRef, useState, useEffect } from "react";
import ScrollButton from "@/components/ScrollButton";
import { useNavigate } from "react-router-dom";
import type { CategoryNav as Category, CategoryNavProps } from "@/types/category.type";

const defaultCategories: Category[] = [
  {
    id: "giat-xa",
    name: "Giặt xả",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/frame-1984079259_202510011356076995.gif",
    badgeColor: "bg-red-500",
  },
  {
    id: "dau-an",
    name: "Dầu ăn",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/dau-an-final_202510031117342125.gif",
    badgeColor: "bg-green-600",
  },
  {
    id: "gao-nep",
    name: "Gạo, nếp",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gao-nep_202509272332404857.gif",
    badgeColor: "bg-purple-600",
  },
  {
    id: "mi-an-lien",
    name: "Mì ăn liền",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
  },
  {
    id: "nuoc-suoi",
    name: "Nước suối",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/nuoc-suoi1_202510010943414955.gif",
    badgeColor: "bg-red-500",
  },
  {
    id: "sua-chua",
    name: "Sữa chu...",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/nuoc-suoi1_202510010943414955.gif",
    badgeColor: "bg-green-600",
  },
  {
    id: "rau-la",
    name: "Rau lá",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/rau-la_202509272336201019.gif",
    badgeColor: "bg-red-500",
  },
  {
    id: "nuoc-tra",
    name: "Nước trà",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/tra_202510081101058749.gif",
    badgeColor: "bg-red-500",
  },
  {
    id: "banh",
    name: "Bánh snack",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3364/frame-3476166_202503191335420491.png",
  },
  {
    id: "ca-vien",
    name: "Cà viên, bò viên",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7170/1990403_202504021436547470.png",
  },
  {
    id: "cu-qua",
    name: "Củ, quả",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8785/rau-cu_202509251624277482.png",
  },
  {
    id: "thit-heo",
    name: "Thịt heo",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8781/thit-heo_202509110924556310.png",
  },
  {
    id: "xuc-xich",
    name: "Xúc xích, lạp xưởng tươi",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7618/120x120-5_202410101421040963.png",
  },
  {
    id: "keo-cung",
    name: "Kẹo cứng",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/2687/keo-cung_202508291640443457.png",
  },
  {
    id: "nam",
    name: "Nấm các loại",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8779/8779-id_202504021437339917.png",
  },
  {
    id: "trai-cay",
    name: "Trái cây",
    image:
      "https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8788/trai-cay_202509081009396955.png",
  },
];

export function CategoryNav({
  categories = defaultCategories,
  selectedCategoryId,
  onCategorySelect,
  variant = "home",
  showScrollButtons = true,
}: CategoryNavProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const navigate = useNavigate();
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

  const handleCategoryClick = (category: Category) => {
    onCategorySelect?.(category);
    navigate(`/products?category=${category.id}`);
  };

  const getContainerStyles = () => {
    switch (variant) {
      case "product-page":
        return "w-full bg-background rounded-lg";
      case "home":
      default:
        return "w-full bg-background";
    }
  };

  const getItemStyles = (category: Category) => {
    const isSelected = selectedCategoryId === category.id;

    switch (variant) {
      case "product-page":
        return `
          flex flex-col items-center gap-3 min-w-[80px] group
          ${isSelected ? "ring-1 ring-green-500 ring-offset-1 rounded-lg" : ""}
        `;
      case "home":
      default:
        return "flex flex-col items-center gap-2 min-w-[80px] group";
    }
  };

  const getImageStyles = () => {
    switch (variant) {
      case "product-page":
        return "relative";
      case "home":
      default:
        return "relative";
    }
  };

  const getImageContainerStyles = () => {
    switch (variant) {
      case "product-page":
        return "w-16 h-16 rounded-lg overflow-hidden  flex items-center justify-center transition-transform group-hover:scale-105";
      case "home":
      default:
        return "w-16 h-16 rounded-lg overflow-hidden  flex items-center justify-center transition-transform group-hover:scale-105";
    }
  };

  const getTextStyles = (category: Category) => {
    const isSelected = selectedCategoryId === category.id;

    switch (variant) {
      case "product-page":
        return `text-xs text-center leading-tight max-w-[80px] truncate ${
          isSelected ? "text-green-600 font-semibold" : "text-foreground"
        }`;
      case "home":
      default:
        return "text-xs text-center leading-tight text-foreground max-w-[80px] truncate";
    }
  };

  const getGapStyles = () => {
    switch (variant) {
      case "product-page":
        return "gap-4";
      case "home":
      default:
        return "gap-0";
    }
  };

  return (
    <div
      className={`${getContainerStyles()} relative group/container`}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      {/* Scroll buttons - hiển thị cho cả home và product-page */}
      {showScrollButtons && (
        <div className="opacity-0 group-hover/container:opacity-100 transition-opacity">
          {showLeftButton && (
            <ScrollButton direction="left" onClick={() => scroll("left")} />
          )}
          {showRightButton && (
            <ScrollButton direction="right" onClick={() => scroll("right")} />
          )}
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className={`flex p-1 ${getGapStyles()}`}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={getItemStyles(category)}
            >
              <div className={getImageStyles()}>
                <div className={getImageContainerStyles()}>
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Badge - chỉ hiển thị ở variant home */}
                {variant === "home" && category.badge && (
                  <div
                    className={`absolute -top-1 -right-1 ${category.badgeColor} text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap`}
                  >
                    {category.badge}
                  </div>
                )}
              </div>

              <span className={getTextStyles(category)}>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryNav;
