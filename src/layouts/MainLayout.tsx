import { useEffect } from "react";
import { CategorySidebar } from "@/components/category/CategorySideBar";
import { Footer } from "@/components/navbar-and-footer/user/Footer";
import { Navbar } from "@/components/navbar-and-footer/user/Navbar";
import { ScrollToTop } from "@/components/scroll/ScrollToTop";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  useEffect(() => {
    const role = user?.role?.toLowerCase?.();
    if (role === "staff" && !location.pathname.startsWith("/staff")) {
      navigate("/staff/orders", { replace: true });
    }
  }, [user, navigate, location.pathname]);

  return (
    <div className="main-layout w-full bg-[#e9edf0] pb-4">
      <ScrollToTop />
      <Navbar />
      <div className="flex flex-row">
        <CategorySidebar />
        <main className="flex flex-col w-full mx-auto sm:px-3 lg:ml-62 2xl:ml-95 2xl:mr-31 overflow-hidden gap-5 mt-2 pb-20 md:pb-0">
          <Outlet />
          <Footer />
        </main>
      </div>
      {/* Chat Widget - Fixed position at bottom right */}
      <ChatWidget />
    </div>
  );
}
