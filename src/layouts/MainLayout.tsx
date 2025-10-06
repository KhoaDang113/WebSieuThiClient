import { Navbar } from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="main-layout w-full bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-3 lg:px-42">
        <Outlet />
      </main>
    </div>
  );
}
