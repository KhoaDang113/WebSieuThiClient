import { DashboardOverview } from "@/components/admin/dashboard/DashboardOverview";
import { RevenueChart } from "@/components/admin/dashboard/RevenueChart";
import { RecentOrders } from "@/components/admin/dashboard/RecentOrders";
import { TopProducts } from "@/components/admin/dashboard/TopProducts";
import { LowStockAlert } from "@/components/admin/dashboard/LowStockAlert";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Tổng quan hệ thống quản lý</p>
      </div>

      {/* KPI Cards */}
      <DashboardOverview />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <TopProducts />
      </div>

      {/* Alerts and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockAlert />
        <RecentOrders />
      </div>
    </div>
  );
}
