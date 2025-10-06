import {
  ChevronDown,
  List,
  MapPin,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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

  useEffect(() => {
    if (isFocused || value) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % hints.length), 3500);
    return () => clearInterval(id);
  }, [isFocused, value, hints.length]);

  const placeholder = isFocused ? "Nhập sản phẩm cần tìm" : hints[idx];

  return (
    <header className="sticky md:h-24 top-0 z-50 w-full bg-green-700 xl:px-42">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img
                src="https://media.istockphoto.com/id/2222830929/vi/anh/imge-c%E1%BB%A7a-nh%E1%BB%AFng-qu%E1%BA%A3-anh-%C4%91%C3%A0o-%C4%91%E1%BB%8F-t%C6%B0%C6%A1i-v%E1%BB%9Bi-th%C3%A2n-tr%C3%AAn-n%E1%BB%81n-%C4%91en-tr%C6%B0ng-b%C3%A0y-tr%C3%A1i-c%C3%A2y-m%C3%B9a-h%C3%A8-ngon-ng%E1%BB%8Dt.jpg?s=1024x1024&w=is&k=20&c=mDQ4JJkQ_20VVdKyoAYxLJWZJWjZcldWrpjCP2DpOXU="
                alt=""
                className="w-8 h-8 rounded-2xl object-cover"
              />
              <span className="text-amber-300 font-medium">
                Bách hóa không xanh
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 rounded-t-md bg-green-800 px-3 py-2 text-white shrink-0">
              <List className="w-5 h-5" />
              <span className="whitespace-nowrap">Danh mục sản phẩm</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden sm:block flex-1">
            <div className="relative ">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                id="search"
                type="search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className="w-full h-10 pl-10 pr-4 rounded-full bg-white text-gray-900 placeholder:text-gray-400 outline-none"
              />
              <div className=" cursor-pointer  p-2 absolute right-3 top-1/2 -translate-y-1/2 text-green-800">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-0 -right-0 flex items-center justify-center rounded-full p-0.5 bg-green-800 size-3.5  ">
                  <span className="z-30 text-white text-xs font-semibold">
                    0
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: chỗ trống cho action/user */}
          <div className="flex flex-col gap-2 items-end justify-end">
            <div className="hidden md:flex text-white border-amber-50  h-[36px] w-fit min-w-[200px]  max-w-[250px] bg-[#FFFFFF]/[0.15] py-3px pl-6px pr-[8px] rounded-3xl items-center justify-center overflow-hidden text-nowrap px-2 cursor-pointer">
              <div className="flex gap-1 items-center min-w-0 text-sm">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="shrink-0 ">Giao đến:</span>
                <span className="truncate font-semibold">
                  địa chỉ 12312312321 123123212
                </span>
              </div>
              <ChevronDown className="ml-2 shrink-0 h-4 w-4 " />
            </div>

            <div className="hidden md:flex items-center gap-2 rounded-t-md bg-green-800 px-3 py-2 text-white shrink-0">
              <User className="w-5 h-5" />
              <span className="whitespace-nowrap">Tài khoản của Bạn</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
