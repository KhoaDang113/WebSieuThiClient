import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Outlet } from "react-router-dom";
import { StaffNavbar } from "@/components/Navbar/StaffNavbar";

export default function StaffLayout() {
  return (
    <div className="staff-layout w-full bg-[#e9edf0] pb-4">
      <ScrollToTop />
      <StaffNavbar />
      <main className="flex flex-col w-full mx-auto px-3 overflow-hidden gap-5 mt-2">
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}
