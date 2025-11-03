import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/Header";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
