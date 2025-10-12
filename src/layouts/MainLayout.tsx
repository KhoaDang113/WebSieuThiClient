import { CategorySidebar } from "@/components/CategorySideBar";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="main-layout w-full bg-[#e9edf0] pb-4">
      <Navbar />
      <div className="flex flex-row">
        <CategorySidebar />
        <main className="flex flex-col w-full mx-auto sm:px-3 lg:ml-62 2xl:ml-95 2xl:mr-34 overflow-hidden gap-5 mt-2">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
}
