import { Bell, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/api";
import { toast } from "sonner";

export function AdminHeader() {
  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Đăng xuất thành công!");
      // Redirect về trang chủ
      window.location.href = "http://localhost:5173";
    } catch (error) {
      console.error("Logout error:", error);
      // Vẫn xóa token và redirect dù có lỗi
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "http://localhost:5173";
    }
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Quản lý hệ thống
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="hover:text-red-600"
          title="Đăng xuất"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
