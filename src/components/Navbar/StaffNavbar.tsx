import { User } from "lucide-react";
import { Link } from "react-router-dom";

export function StaffNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#007E42] shadow-lg">
      <div className="mx-auto max-w-7xl px-4 py-4 md:py-5">
        <div className="flex gap-4 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://media.istockphoto.com/id/2222830929/vi/anh/imge-c%E1%BB%A7a-nh%E1%BB%AFng-qu%E1%BA%A3-anh-%C4%91%C3%A0o-%C4%91%E1%BB%8F-t%C6%B0%C6%A1i-v%E1%BB%9Bi-th%C3%A2n-tr%C3%AAn-n%E1%BB%81n-%C4%91en-tr%C6%B0ng-b%C3%A0y-tr%C3%A1i-c%C3%A2y-m%C3%B9a-h%C3%A8-ngon-ng%E1%BB%8Dt.jpg?s=1024x1024&w=is&k=20&c=mDQ4JJkQ_20VVdKyoAYxLJWZJWjZcldWrpjCP2DpOXU="
              alt=""
              className="w-12 h-12 rounded-2xl object-cover shadow-md"
            />
            <div className="flex flex-col justify-center">
              <span className="text-white font-semibold text-lg">
                Bách Hóa Không Xanh
              </span>
            </div>
          </Link>

          {/* Staff Title */}
          <div className="flex-1 text-center">
            <h1 className="text-white text-xl font-bold">
              Quản Lý Đơn Hàng
            </h1>
          </div>

          {/* Login Button */}
          <div className="flex items-center">
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full bg-[#008236] px-4 py-2 text-white cursor-pointer hover:bg-green-900 transition-colors"
            >
              <User className="w-5 h-5 text-white" />
              <span className="whitespace-nowrap text-white">Đăng nhập</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
