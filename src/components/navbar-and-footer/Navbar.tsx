import { ChevronDown, MapPin, Search, ShoppingCart, User, Menu, X, Clock, Package, LogOut } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CategorySidebar } from "@/components/category/CategorySideBar";
import { useCart } from "@/components/cart/CartContext";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useAddress } from "@/contexts/AddressContext";
import { AddressModal } from "@/components/address/AddressModal";
import authService from "@/api/services/authService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { searchHistory, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
  const { address, setAddress, getAddressString } = useAddress();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  
  // Check authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      const user = authService.getCurrentUser();
      setIsAuthenticated(isAuth);
      setCurrentUser(user);
    };

    checkAuth();
    // Re-check on storage change (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);
  
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
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const placeholder = isFocused ? "Nhập sản phẩm cần tìm" : hints[idx];

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim()) {
      addToHistory(value.trim());
      console.log("Tìm kiếm:", value);
      setShowHistory(false);
    }
  };

  const handleHistoryClick = (searchTerm: string) => {
    setValue(searchTerm);
    addToHistory(searchTerm);
    setShowHistory(false);
    console.log("Tìm kiếm từ lịch sử:", searchTerm);
  };

  const handleRemoveHistoryItem = (e: React.MouseEvent, searchTerm: string) => {
    e.stopPropagation();
    removeFromHistory(searchTerm);
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
                  type="search"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onFocus={() => {
                    setIsFocused(true);
                    setShowHistory(true);
                  }}
                  placeholder={placeholder}
                  className="w-full h-12 pl-12 pr-4 rounded-full bg-white text-gray-900 placeholder:text-gray-400 outline-none shadow-sm border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200"
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
                              <span className="text-sm text-gray-700 truncate">{term}</span>
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

            {/* Shopping cart */}
            <Link
              to="/cart"
              className="relative cursor-pointer p-2 text-white hover:bg-white/10 rounded-full transition-colors duration-200 flex-shrink-0"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-red-500 w-5 h-5 border-2 border-white min-w-[20px]">
                  <span className="text-white text-xs font-bold leading-none">
                    {totalItems}
                  </span>
                </span>
              )}
            </Link>

            {/* Actions */}
            <div className="flex gap-3 items-center justify-end">
              {/* 🟢 Tooltip cho địa chỉ (Desktop) */}
              <div
                onClick={() => setIsAddressModalOpen(true)}
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
                  <Link
                    to="/my-orders"
                    className="hidden md:flex items-center gap-2 rounded-full bg-[#008236] px-3 py-2 text-white shrink-0 cursor-pointer hover:bg-green-900 transition-colors"
                  >
                    <Package className="w-5 h-5 text-white" />
                    <span className="whitespace-nowrap text-white">Đơn hàng</span>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="hidden md:flex items-center gap-2 rounded-full bg-[#008236] px-3 py-2 text-white shrink-0 cursor-pointer hover:bg-green-900 transition-colors">
                        {(currentUser?.avatar || currentUser?.avatarUrl) ? (
                          <img 
                            src={currentUser.avatar || currentUser.avatarUrl} 
                            alt="Avatar" 
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                        <span className="whitespace-nowrap text-white">
                          {currentUser?.name || "Tài khoản"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-white" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link to="/account" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Thông tin cá nhân</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/my-orders" className="cursor-pointer">
                          <Package className="mr-2 h-4 w-4" />
                          <span>Đơn hàng của tôi</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={async () => {
                          await authService.logout();
                          setIsAuthenticated(false);
                          setCurrentUser(null);
                          navigate('/');
                        }}
                        className="cursor-pointer text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Đăng xuất</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-2 rounded-full bg-[#008236] px-3 py-2 text-white shrink-0 cursor-pointer hover:bg-green-900"
                >
                  <User className="w-5 h-5 text-white" />
                  <span className="whitespace-nowrap text-white">Đăng nhập</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 🟢 Tooltip cho địa chỉ (Mobile) */}
      <div className="md:hidden px-4 py-2 bg-[#007E42] border-b border-green-700">
        <button
          onClick={() => setIsAddressModalOpen(true)}
          className="flex items-center justify-between w-full text-white text-sm py-2 px-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          title={getAddressString()} // ✅ Tooltip hiển thị địa chỉ
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">Giao đến:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="truncate max-w-[150px]">
              {getAddressString()}
            </span>
            <ChevronDown className="w-4 h-4 flex-shrink-0" />
          </div>
        </button>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={setAddress}
        currentAddress={address}
      />
    </>
  );
}
