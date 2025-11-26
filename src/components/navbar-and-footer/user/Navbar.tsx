import {
  ChevronDown,
  MapPin,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Clock,
  Package,
  LogOut,
  Phone,
} from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CategorySidebar } from "@/components/category/CategorySideBar";
import { useCart } from "@/components/cart/CartContext";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useAddress } from "@/components/address/AddressContext";
import { AddressListModal } from "@/components/address/AddressListModal";
import authService from "@/api/services/authService";
import { useAuthStore } from "@/stores/authStore";
import { DEFAULT_AVATAR_URL } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotification } from "@/hooks/useNotification";
import { NotificationDrawer } from "../../notification/NotificationDrawer";

export function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const location = useLocation();
  const { searchHistory, addToHistory, removeFromHistory, clearHistory } =
    useSearchHistory();
  const { setAddress, getAddressString } = useAddress();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const { showNotification } = useNotification();

  // Sử dụng Zustand store để quản lý auth state
  const {
    user: currentUser,
    isAuthenticated,
    setUser,
    logout: clearAuth,
  } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    // Kiểm tra và đồng bộ auth state khi component mount
    const checkAuth = async () => {
      const isAuth = authService.isAuthenticated();

      if (!isAuth) {
        if (currentUser) {
          clearAuth();
        }
        return;
      }

      try {
        // Đồng bộ tạm thời bằng dữ liệu localStorage (nếu có)
        const cachedUser = authService.getCurrentUser();
        if (cachedUser && (!currentUser || currentUser.id !== cachedUser.id)) {
          setUser(cachedUser);
        }

        // Luôn gọi getMe để lấy dữ liệu mới nhất (avatar, tên, ...)
        const freshUser = await authService.getMe();
        if (!isMounted) return;

        const hasChanged =
          !currentUser ||
          currentUser.id !== freshUser.id ||
          currentUser.avatar !== freshUser.avatar ||
          currentUser.name !== freshUser.name ||
          currentUser.gender !== freshUser.gender;

        if (hasChanged) {
          setUser(freshUser);
        }
      } catch (error) {
        console.error("Failed to get user info:", error);
        if (isMounted) {
          clearAuth();
          authService.clearAuthData();
        }
      }
    };

    checkAuth();

    // Thêm listener để check auth khi window focus (user quay lại tab)
    const handleFocus = () => {
      checkAuth();
    };

    // Thêm listener cho custom event 'auth-changed' để force update
    const handleAuthChanged = () => {
      checkAuth();
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("auth-changed", handleAuthChanged);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("auth-changed", handleAuthChanged);
    };
  }, [currentUser, setUser, clearAuth]);

  const hints = useMemo(
    () => [
      "Thịt ngon hôm nay",
      "Cá tươi giảm giá",
      "Rau củ sạch mỗi ngày",
      "Sữa và đồ uống",
    ],
    []
  );

  const [idx, setIdx] = useState<number>(0);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFocused || value) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % hints.length), 3500);
    return () => clearInterval(id);
  }, [isFocused, value, hints.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const placeholder = isFocused ? "Nhập sản phẩm cần tìm" : hints[idx];

  useEffect(() => {
    if (location.pathname === "/search") {
      const params = new URLSearchParams(location.search);
      const query = params.get("q") || "";
      setValue(query);
    }
  }, [location]);

  const navigateToSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      return;
    }
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      addToHistory(trimmed);
      setShowHistory(false);
      setIsFocused(false);
      navigateToSearch(trimmed);
    } else {
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (searchTerm: string) => {
    setValue(searchTerm);
    addToHistory(searchTerm);
    setShowHistory(false);
    setIsFocused(false);
    navigateToSearch(searchTerm);
  };

  const handleRemoveHistoryItem = (e: React.MouseEvent, searchTerm: string) => {
    e.stopPropagation();
    removeFromHistory(searchTerm);
  };

  const handleAddressClick = () => {
    if (!isAuthenticated) {
      showNotification({
        type: "warning",
        title: "Yêu cầu đăng nhập",
        message:
          "Bạn phải đăng nhập để quản lý địa chỉ giao hàng. Vui lòng đăng nhập để tiếp tục.",
        duration: 4000,
      });
      // Tùy chọn: redirect đến trang login sau 1 giây
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }
    setIsAddressModalOpen(true);
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      showNotification({
        type: "warning",
        title: "Yêu cầu đăng nhập",
        message:
          "Bạn phải đăng nhập để xem giỏ hàng. Vui lòng đăng nhập để tiếp tục.",
        duration: 4000,
      });
      // Redirect đến trang login sau 1.5 giây
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }
    navigate("/cart");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#007E42] shadow-lg">
        <div className="mx-auto max-w-7xl md:px-4 py-4 md:py-5">
          <div className="flex gap-4 items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden flex-shrink-0"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <CategorySidebar
                  isMobile
                  onClose={() => setMobileMenuOpen(false)}
                />
              </SheetContent>
            </Sheet>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src="https://media.istockphoto.com/id/2222830929/vi/anh/imge-c%E1%BB%A7a-nh%E1%BB%AFng-qu%E1%BA%A3-anh-%C4%91%C3%A0o-%C4%91%E1%BB%8F-t%C6%B0%C6%A1i-v%E1%BB%9Bi-th%C3%A2n-tr%C3%AAn-n%E1%BB%81n-%C4%91en-tr%C6%B0ng-b%C3%A0y-tr%C3%A1i-c%C3%A2y-m%C3%B9a-h%C3%A8-ngon-ng%E1%BB%8Dt.jpg?s=1024x1024&w=is&k=20&c=mDQ4JJkQ_20VVdKyoAYxLJWZJWjZcldWrpjCP2DpOXU="
                alt=""
                className="w-12 h-12 rounded-2xl object-cover shadow-md"
              />
              <div className="hidden lg:flex flex-col justify-center">
                <span className="text-white font-semibold text-lg">
                  Bách Hóa Không Xanh
                </span>
                <p className="text-sm text-white opacity-90">
                  Khách Hàng Là Trên Hết
                </p>
              </div>
            </Link>
            {/* Search bar */}
            <div className="flex-1 lg:ml-2" ref={searchContainerRef}>
              <form onSubmit={handleSearch} className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                <input
                  id="search"
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onFocus={() => {
                    setIsFocused(true);
                    setShowHistory(true);
                  }}
                  placeholder={placeholder}
                  autoComplete="off"
                  className="w-full h-12 pl-12 pr-4 rounded-full bg-white text-gray-900 placeholder:text-gray-400 outline-none shadow-sm border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
                />
                {/* Dropdown lịch sử tìm kiếm */}
                {showHistory && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Clock className="w-4 h-4" />
                        <span>Lịch sử tìm kiếm</span>
                      </div>
                      {searchHistory.length > 0 && (
                        <button
                          type="button"
                          onClick={clearHistory}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          Xóa tất cả
                        </button>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {searchHistory.length > 0 ? (
                        searchHistory.map((term, index) => (
                          <div
                            key={index}
                            onClick={() => handleHistoryClick(term)}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors group"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-sm text-gray-700 truncate">
                                {term}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => handleRemoveHistoryItem(e, term)}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full transition-all flex-shrink-0"
                              aria-label="Xóa"
                            >
                              <X className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <div className="flex flex-col items-center gap-2 text-gray-400">
                            <Search className="w-8 h-8" />
                            <p className="text-sm">Chưa có lịch sử tìm kiếm</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </div>
            {/* Shopping cart - Hidden on mobile */}
            <button
              onClick={handleCartClick}
              className="hidden md:flex relative cursor-pointer p-2 text-white hover:bg-white/10 rounded-full transition-colors duration-200 flex-shrink-0"
              aria-label="Giỏ hàng"
              data-cart-icon
            >
              <ShoppingCart className="w-6 h-6" />
              {isAuthenticated && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-red-500 w-5 h-5 border-2 border-white min-w-[20px]">
                  <span className="text-white text-xs font-bold leading-none">
                    {totalItems}
                  </span>
                </span>
              )}
            </button>
            {/* Hiển thị thông báo (comment reply và order update) - Hidden on mobile */}
            <div className="hidden md:block">
              <NotificationDrawer
                filter={(n) =>
                  n.type === "comment_reply" || n.type === "order_update"
                }
              />
            </div>
            {/* Actions */}
            <div className="flex gap-3 items-center justify-end md:gap-2">
              {/* 🟢 Tooltip cho địa chỉ (Desktop) */}
              <div
                onClick={handleAddressClick}
                className="hidden md:flex text-white h-10 w-fit min-w-[220px] max-w-[280px] bg-[#FFFFFF]/[0.15] py-2 px-3 rounded-full items-center justify-center overflow-hidden text-nowrap cursor-pointer hover:bg-[#FFFFFF]/[0.25] transition-colors duration-200 backdrop-blur-sm"
                title={getAddressString()} // ✅ Tooltip hiển thị địa chỉ
              >
                <div className="flex gap-2 items-center min-w-0 text-sm">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="shrink-0">Giao đến:</span>
                  <span className="truncate font-semibold">
                    {getAddressString()}
                  </span>
                </div>
                <ChevronDown className="ml-2 shrink-0 h-4 w-4" />
              </div>

              {isAuthenticated ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="hidden md:flex items-center gap-2 rounded-full bg-[#008236] px-3 py-2 text-white shrink-0 cursor-pointer hover:bg-green-900 transition-colors">
                        <img
                          src={
                            currentUser?.avatar ||
                            currentUser?.avatarUrl ||
                            DEFAULT_AVATAR_URL
                          }
                          alt="Avatar"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="whitespace-nowrap text-white">
                          {currentUser?.name || "Tài khoản"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-white" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72 p-0">
                      {/* Header */}
                      <div className="px-4 py-3 border-b bg-gray-50">
                        <div className="font-semibold text-sm text-gray-900">
                          {currentUser?.gender === "female" ? "Chị" : "Anh"}{" "}
                          {currentUser?.name || "Khách hàng"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          CHƯA CÓ HẠNG 0 điểm
                        </div>
                      </div>

                      {/* Thông tin cá nhân */}
                      <div className="px-2 py-2 border-b">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                          Thông tin cá nhân
                        </div>
                        <DropdownMenuItem asChild className="px-4">
                          <Link to="/account" className="cursor-pointer w-full">
                            <User className="mr-2 h-4 w-4" />
                            <span>Thông tin cá nhân</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handleAddressClick}
                          className="cursor-pointer px-4"
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>
                            Địa chỉ nhận hàng
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="px-4">
                          <Link
                            to="/my-orders"
                            className="cursor-pointer w-full"
                          >
                            <Package className="mr-2 h-4 w-4" />
                            <span>Đơn hàng từng mua</span>
                          </Link>
                        </DropdownMenuItem>
                      </div>

                      {/* Hỗ trợ khách hàng */}
                      <div className="px-2 py-2 border-b">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                          Hỗ trợ khách hàng
                        </div>
                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer px-4"
                        >
                          <a
                            href="tel:19001908"
                            className="flex items-center w-full"
                          >
                            <Phone className="mr-2 h-4 w-4 shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-sm">
                                Tư vấn: 0386.740.043
                              </span>
                              <span className="text-xs text-gray-500">
                                (08:00 - 22:00) Miễn phí
                              </span>
                            </div>
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer px-4"
                        >
                          <a
                            href="tel:18001067"
                            className="flex items-center w-full"
                          >
                            <Phone className="mr-2 h-4 w-4 shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-sm">
                                Khiếu nại: 0386.740.043
                              </span>
                              <span className="text-xs text-gray-500">
                                (08:00 - 22:00) Miễn phí
                              </span>
                            </div>
                          </a>
                        </DropdownMenuItem>
                      </div>

                      {/* Đăng xuất */}
                      <div className="px-2 py-1">
                        <DropdownMenuItem
                          onClick={async () => {
                            // Xóa cart của user hiện tại trước khi logout
                            if (
                              currentUser?.id &&
                              typeof window !== "undefined"
                            ) {
                              localStorage.removeItem(`cart_${currentUser.id}`);
                            }
                            localStorage.removeItem("cart_guest");

                            await authService.logout();
                            clearAuth();
                            // Dispatch event để notify các components khác
                            window.dispatchEvent(new Event("auth-changed"));
                            // navigate("/login");
                            window.location.href = "/login";
                          }}
                          className="cursor-pointer text-red-600 px-4"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Đăng xuất</span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Mobile Account Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="md:hidden flex items-center gap-2 rounded-full bg-[#008236] px-3 py-2 text-white shrink-0 cursor-pointer hover:bg-green-900 transition-colors">
                        <img
                          src={
                            currentUser?.avatar ||
                            currentUser?.avatarUrl ||
                            DEFAULT_AVATAR_URL
                          }
                          alt="Avatar"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-0">
                      {/* Header */}
                      <div className="px-4 py-3 border-b bg-gray-50">
                        <div className="font-semibold text-sm text-gray-900">
                          {currentUser?.gender === "female" ? "Chị" : "Anh"}{" "}
                          {currentUser?.name || "Khách hàng"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          CHƯA CÓ HẠNG 0 điểm
                        </div>
                      </div>

                      {/* Thông tin cá nhân */}
                      <div className="px-2 py-2 border-b">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                          Thông tin cá nhân
                        </div>
                        <DropdownMenuItem asChild className="px-4">
                          <Link to="/account" className="cursor-pointer w-full">
                            <User className="mr-2 h-4 w-4" />
                            <span>Thông tin cá nhân</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handleAddressClick}
                          className="cursor-pointer px-4"
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>Địa chỉ nhận hàng</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="px-4">
                          <Link
                            to="/my-orders"
                            className="cursor-pointer w-full"
                          >
                            <Package className="mr-2 h-4 w-4" />
                            <span>Đơn hàng từng mua</span>
                          </Link>
                        </DropdownMenuItem>
                      </div>

                      {/* Hỗ trợ khách hàng */}
                      <div className="px-2 py-2 border-b">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                          Hỗ trợ khách hàng
                        </div>
                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer px-4 text-xs"
                        >
                          <a
                            href="tel:0386740043"
                            className="flex items-center w-full"
                          >
                            <Phone className="mr-2 h-4 w-4 shrink-0" />
                            <div className="flex flex-col">
                              <span>Tư vấn: 0386.740.043</span>
                              <span className="text-gray-500">(08:00 - 22:00)</span>
                            </div>
                          </a>
                        </DropdownMenuItem>
                      </div>

                      {/* Đăng xuất */}
                      <div className="px-2 py-1">
                        <DropdownMenuItem
                          onClick={async () => {
                            // Xóa cart của user hiện tại trước khi logout
                            if (
                              currentUser?.id &&
                              typeof window !== "undefined"
                            ) {
                              localStorage.removeItem(`cart_${currentUser.id}`);
                            }
                            localStorage.removeItem("cart_guest");

                            await authService.logout();
                            clearAuth();
                            // Dispatch event để notify các components khác
                            window.dispatchEvent(new Event("auth-changed"));
                            window.location.href = "/login";
                          }}
                          className="cursor-pointer text-red-600 px-4"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Đăng xuất</span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden md:flex items-center gap-2 rounded-full bg-[#008236] px-3 py-2 text-white shrink-0 cursor-pointer hover:bg-green-900"
                  >
                    <User className="w-5 h-5 text-white" />
                    <span className="whitespace-nowrap text-white">
                      Đăng nhập
                    </span>
                  </Link>
                  <Link
                    to="/login"
                    className="md:hidden flex items-center gap-2 rounded-full bg-[#008236] px-3 py-2 text-white shrink-0 cursor-pointer hover:bg-green-900"
                  >
                    <User className="w-4 h-4 text-white" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 🟢 Mobile Bottom Menu */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/"
            className="flex flex-col items-center justify-center h-full flex-1 text-gray-700 hover:text-[#007E42] hover:bg-gray-50 transition-colors text-xs"
          >
            <ShoppingCart className="w-5 h-5 mb-1" />
            <span>Trang chủ</span>
          </Link>
          <div className="flex flex-col items-center justify-center h-full flex-1 text-gray-700">
            <NotificationDrawer
              mobile={true}
              filter={(n) =>
                n.type === "comment_reply" || n.type === "order_update"
              }
            />
          </div>
          <button
            onClick={handleAddressClick}
            className="flex flex-col items-center justify-center h-full flex-1 text-gray-700 hover:text-[#007E42] hover:bg-gray-50 transition-colors text-xs"
          >
            <MapPin className="w-5 h-5 mb-1" />
            <span>Địa chỉ</span>
          </button>
          <Link
            to="/cart"
            className="flex flex-col items-center justify-center h-full flex-1 text-gray-700 hover:text-[#007E42] hover:bg-gray-50 transition-colors text-xs relative"
          >
            <ShoppingCart className="w-5 h-5 mb-1" />
            {isAuthenticated && totalItems > 0 && (
              <span className="absolute top-1 right-2 flex items-center justify-center rounded-full bg-red-500 w-4 h-4 text-white text-xs font-bold">
                {totalItems}
              </span>
            )}
            <span>Giỏ hàng</span>
          </Link>
          <Link
            to="/my-orders"
            className="flex flex-col items-center justify-center h-full flex-1 text-gray-700 hover:text-[#007E42] hover:bg-gray-50 transition-colors text-xs"
          >
            <Package className="w-5 h-5 mb-1" />
            <span>Đơn hàng</span>
          </Link>
        </div>
      </div>


      {/* Address List Modal - Quản lý địa chỉ và lưu vào database */}
      <AddressListModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSelectAddress={(selectedAddress) => {
          // Cập nhật AddressContext khi chọn địa chỉ
          if (selectedAddress) {
            setAddress({
              id: selectedAddress._id,
              province: selectedAddress.city || "",
              district: selectedAddress.district || "",
              ward: selectedAddress.ward || "",
              street: selectedAddress.address || "",
              recipient: selectedAddress.full_name || "",
              phone: selectedAddress.phone || "",
              callAnotherPerson: false,
            });
          }
        }}
        showSelection={false}
      />
    </>
  );
}
