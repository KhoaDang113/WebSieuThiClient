import {
  ChevronDown,
  // List,
  MapPin,
  Search,
  ShoppingCart,
  User,
  Menu,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CategorySidebar } from "./CategorySideBar";
export function Navbar() {
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

  useEffect(() => {
    if (isFocused || value) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % hints.length), 3500);
    return () => clearInterval(id);
  }, [isFocused, value, hints.length]);

  const placeholder = isFocused ? "Nhập sản phẩm cần tìm" : hints[idx];

  return (
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
          <a href="/" className="flex items-center gap-3">
            <img
              src="https://media.istockphoto.com/id/2222830929/vi/anh/imge-c%E1%BB%A7a-nh%E1%BB%AFng-qu%E1%BA%A3-anh-%C4%91%C3%A0o-%C4%91%E1%BB%8F-t%C6%B0%C6%A1i-v%E1%BB%9Bi-th%C3%A2n-tr%C3%AAn-n%E1%BB%81n-%C4%91en-tr%C6%B0ng-b%C3%A0y-tr%C3%A1i-c%C3%A2y-m%C3%B9a-h%C3%A8-ngon-ng%E1%BB%8Dt.jpg?s=1024x1024&w=is&k=20&c=mDQ4JJkQ_20VVdKyoAYxLJWZJWjZcldWrpjCP2DpOXU="
              alt=""
              className="w-12 h-12 rounded-2xl object-cover shadow-md"
            />
            <div className="hidden lg:flex flex-col justify-center">
              <span className="text-amber-300 font-semibold text-lg">
                Bách hóa không xanh
              </span>
              <p className="text-sm text-white opacity-90">
                Tươi ngon mỗi ngày
              </p>
            </div>
          </a>

          {/* Search bar */}
          <div className="flex-1 lg:ml-12">
            <div className="relative ">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="search"
                type="search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className="w-full h-12 pl-12 pr-16 rounded-full bg-white text-gray-900 placeholder:text-gray-400 outline-none shadow-sm border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-200"
              />
              <div className="cursor-pointer p-2 absolute right-2 top-1/2 -translate-y-1/2 text-green-800 hover:bg-green-50 rounded-full transition-colors duration-200">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-red-500 size-5 border-2 border-white">
                  <span className="text-white text-xs font-bold">0</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: chỗ trống cho action/user */}
          <div className="flex gap-3 items-center justify-end">
            <div className="hidden md:flex text-white h-10 w-fit min-w-[220px] max-w-[280px] bg-[#FFFFFF]/[0.15] py-2 px-3 rounded-full items-center justify-center overflow-hidden text-nowrap cursor-pointer hover:bg-[#FFFFFF]/[0.25] transition-colors duration-200 backdrop-blur-sm">
              <div className="flex gap-2 items-center min-w-0 text-sm">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="shrink-0">Giao đến:</span>
                <span className="truncate font-semibold">
                  địa chỉ 12312312321 123123212
                </span>
              </div>
              <ChevronDown className="ml-2 shrink-0 h-4 w-4" />
            </div>
            <div className="hidden md:flex items-center gap-2 rounded-full bg-green-800 px-3 py-2.5 text-white shrink-0 hover:bg-green-700 transition-colors duration-200 cursor-pointer">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
