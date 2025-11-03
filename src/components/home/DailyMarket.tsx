import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { MenuComboWithIngredients, Ingredient } from "@/types/menu.type";
import { menuCombos } from "@/pages/menu";
import { getIngredientsForDish } from "@/lib/geminiService";
import { spicesData } from "@/lib/sampleData";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DailyMarket() {
  const navigate = useNavigate();
  const [selectedCombo, setSelectedCombo] =
    useState<MenuComboWithIngredients | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const spicesScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Danh sách các tab món ăn
  const tabs = [
    { id: "all", name: "Món măn" },
    { id: "appetizer", name: "Món xào, lược" },
    { id: "fish", name: "Món canh" },
    { id: "vegetable", name: "Rau sống, nêm" },
    { id: "fruit", name: "Trái cây" },
    { id: "dessert", name: "Đồ ăn nhanh" },
    { id: "drink", name: "Tráng miệng" },
  ];

  const handleBuyIngredients = async (combo: MenuComboWithIngredients) => {
    setSelectedCombo(combo);
    setIsModalOpen(true);
    setIsLoadingIngredients(true);
    setError(null);
    setIngredients([]);

    try {
      const fetchedIngredients = await getIngredientsForDish(combo.name);
      setIngredients(fetchedIngredients);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setIsLoadingIngredients(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCombo(null);
    setIngredients([]);
    setError(null);
    setQuantities({});
  };

  const handleQuantityChange = (itemId: number, delta: number) => {
    setQuantities((prev) => {
      const current = prev[itemId] || 0;
      const newQty = Math.max(0, current + delta);
      return { ...prev, [itemId]: newQty };
    });
  };

  const handleBuyClick = (itemId: number) => {
    setQuantities((prev) => ({ ...prev, [itemId]: 1 }));
  };

  const checkScrollButtons = () => {
    if (spicesScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = spicesScrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const scrollContainer = spicesScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
      return () => {
        scrollContainer.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, [ingredients]);

  const scrollSpices = (direction: "left" | "right") => {
    if (spicesScrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        spicesScrollRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      spicesScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const calculateTotalPrice = () => {
    let total = 0;

    // Tính tổng nguyên liệu chính
    ingredients.forEach((item) => {
      const qty = quantities[item.id] || 0;
      total += item.price * qty;
    });

    // Tính tổng gia vị
    spicesData.forEach((spice) => {
      const qty = quantities[spice.id] || 0;
      total += spice.price * qty;
    });

    return total;
  };

  return (
    <div className="mb-6 sm:mb-8">
      {/* Section Header */}
      <div className="mb-4">
        <h2 className="text-lg sm:text-2xl font-bold text-green-700 uppercase mb-3">
          ĐI CHỢ MỖI NGÀY
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-3 sm:px-4 py-2 rounded-full whitespace-nowrap text-xs sm:text-sm font-medium transition-colors ${
                tab.id === "all"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {menuCombos.map((combo) => (
          <div
            key={combo.id}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={combo.image_url}
                alt={combo.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="p-3">
              <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-1 line-clamp-2">
                {combo.name}
              </h3>

              {/* Button */}
              <button
                onClick={() => handleBuyIngredients(combo)}
                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium py-2 rounded-md transition-colors"
              >
                MUA NGUYÊN LIỆU
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Ingredients */}
      {isModalOpen && selectedCombo && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="duration-400 overflow-hidden max-w-[640px] no-scrollbar max-h-[80vh] transition-all ease-in-out bg-white rounded-lg shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-green-600 text-white p-3 flex justify-between items-center flex-shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-bold">
                  Nguyên liệu món {selectedCombo.name}
                </h3>
                <p className="text-xs opacity-90">
                  Lựa chọn loại nguyên liệu chính
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-3 overflow-y-auto flex-1">
              {isLoadingIngredients ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                  <p className="text-gray-600">
                    Đang tải danh sách nguyên liệu...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={() => handleBuyIngredients(selectedCombo)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
                  >
                    Thử lại
                  </button>
                </div>
              ) : ingredients.length > 0 ? (
                <>
                  {/* Main Ingredients Section */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold px-2 text-gray-800">
                      Lựa chọn loại nguyên liệu chính
                    </h4>

                    {/* Group ingredients into rows of 3 */}
                    {Array.from({
                      length: Math.ceil(ingredients.length / 3),
                    }).map((_, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="rounded-8px pt-[6px] px-[8px] lg:px-0 pb-2px !bg-white"
                      >
                        <div className="grid grid-cols-3 gap-2">
                          {ingredients
                            .slice(rowIndex * 3, rowIndex * 3 + 3)
                            .map((ingredient) => {
                              const qty = quantities[ingredient.id] || 0;
                              return (
                                <div
                                  key={ingredient.id}
                                  className="px-1px w-full h-full overflow-hidden border border-[#F2F5F9] !rounded-lg bg-white hover:border-green-400 transition-colors group"
                                >
                                  {/* Image with badges */}
                                  <div
                                    className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
                                    onClick={() =>
                                      navigate(
                                        `/products-detail/${ingredient.id}`
                                      )
                                    }
                                  >
                                    <img
                                      src={ingredient.image_url}
                                      alt={ingredient.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                    {/* Badges */}
                                    <div className="absolute top-1 left-1">
                                      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                                        -20%
                                      </span>
                                    </div>
                                  </div>

                                  {/* Content */}
                                  <div className="p-1.5">
                                    <h5 className="text-[11px] font-medium text-gray-800 line-clamp-2 mb-0.5 min-h-[28px] leading-tight">
                                      {ingredient.name}
                                    </h5>
                                    <p className="text-[9px] text-gray-500 mb-1">
                                      {ingredient.quantity}
                                    </p>

                                    {/* Price with discount */}
                                    <div className="mb-1.5">
                                      <div className="flex items-center gap-1 flex-wrap">
                                        <p className="text-xs font-bold text-red-600">
                                          {ingredient.price.toLocaleString()}đ
                                        </p>
                                        <p className="text-[9px] text-gray-400 line-through">
                                          {Math.round(
                                            ingredient.price * 1.25
                                          ).toLocaleString()}
                                          đ
                                        </p>
                                      </div>
                                    </div>

                                    {/* Quantity controls or Buy button */}
                                    {qty === 0 ? (
                                      <button
                                        onClick={() =>
                                          handleBuyClick(ingredient.id)
                                        }
                                        className="w-full bg-green-600 hover:bg-green-700 text-white text-[11px] py-1 rounded font-medium transition-colors"
                                      >
                                        MUA
                                      </button>
                                    ) : (
                                      <div className="flex items-center justify-between bg-gray-100 rounded px-1 py-0.5">
                                        <button
                                          onClick={() =>
                                            handleQuantityChange(
                                              ingredient.id,
                                              -1
                                            )
                                          }
                                          className="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-white rounded transition-colors text-sm"
                                        >
                                          −
                                        </button>
                                        <span className="text-xs font-medium">
                                          {qty}
                                        </span>
                                        <button
                                          onClick={() =>
                                            handleQuantityChange(
                                              ingredient.id,
                                              1
                                            )
                                          }
                                          className="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-white rounded transition-colors text-sm"
                                        >
                                          +
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Spices Section */}
                  <div className="mt-3 border-t pt-3">
                    <h4 className="text-sm font-semibold px-2 text-gray-800 mb-2">
                      Mua thêm gia vị
                    </h4>

                    <div className="relative">
                      {/* Left Arrow */}
                      {showLeftArrow && (
                        <button
                          onClick={() => scrollSpices("left")}
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full p-1.5 transition-all"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-700" />
                        </button>
                      )}

                      {/* Scroll Container */}
                      <div
                        ref={spicesScrollRef}
                        className="overflow-x-auto no-scrollbar scroll-smooth"
                        style={{
                          paddingLeft: showLeftArrow ? "32px" : "0",
                          paddingRight: showRightArrow ? "32px" : "0",
                        }}
                      >
                        <div className="flex gap-2 pb-2">
                          {spicesData.map((spice) => {
                            const qty = quantities[spice.id] || 0;
                            return (
                              <div
                                key={spice.id}
                                className="flex-shrink-0 w-[120px] px-1px overflow-hidden border border-[#F2F5F9] !rounded-lg bg-white hover:border-green-400 transition-colors"
                              >
                                {/* Image */}
                                <div
                                  className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
                                  onClick={() =>
                                    navigate(`/products-detail/${spice.id}`)
                                  }
                                >
                                  <img
                                    src={spice.image_url}
                                    alt={spice.name}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                  />
                                  {/* Badge */}
                                  <div className="absolute top-1 left-1">
                                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                                      -20%
                                    </span>
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="p-1.5">
                                  <h5 className="text-[11px] font-medium text-gray-800 line-clamp-2 mb-0.5 min-h-[28px] leading-tight">
                                    {spice.name}
                                  </h5>
                                  <p className="text-[9px] text-gray-500 mb-1">
                                    {spice.quantity}
                                  </p>

                                  {/* Price with discount */}
                                  <div className="mb-1.5">
                                    <div className="flex items-center gap-1 flex-wrap">
                                      <p className="text-xs font-bold text-red-600">
                                        {spice.price.toLocaleString()}đ
                                      </p>
                                      <p className="text-[9px] text-gray-400 line-through">
                                        {Math.round(
                                          spice.price * 1.25
                                        ).toLocaleString()}
                                        đ
                                      </p>
                                    </div>
                                  </div>

                                  {/* Quantity controls or Buy button */}
                                  {qty === 0 ? (
                                    <button
                                      onClick={() => handleBuyClick(spice.id)}
                                      className="w-full bg-green-600 hover:bg-green-700 text-white text-[11px] py-1 rounded font-medium transition-colors"
                                    >
                                      MUA
                                    </button>
                                  ) : (
                                    <div className="flex items-center justify-between bg-gray-100 rounded px-1 py-0.5">
                                      <button
                                        onClick={() =>
                                          handleQuantityChange(spice.id, -1)
                                        }
                                        className="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-white rounded transition-colors text-sm"
                                      >
                                        −
                                      </button>
                                      <span className="text-xs font-medium">
                                        {qty}
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleQuantityChange(spice.id, 1)
                                        }
                                        className="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-white rounded transition-colors text-sm"
                                      >
                                        +
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right Arrow */}
                      {showRightArrow && (
                        <button
                          onClick={() => scrollSpices("right")}
                          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full p-1.5 transition-all"
                        >
                          <ChevronRight className="w-4 h-4 text-gray-700" />
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    Không tìm thấy nguyên liệu phù hợp
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!isLoadingIngredients && !error && ingredients.length > 0 && (
              <div className="border-t bg-white p-3 flex justify-between items-center flex-shrink-0">
                <div>
                  <p className="text-[10px] text-gray-600">Tổng tiền</p>
                  <p className="text-lg font-bold text-green-600">
                    {calculateTotalPrice().toLocaleString()}đ
                  </p>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-lg text-sm">
                  HOÀN TẤT
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
