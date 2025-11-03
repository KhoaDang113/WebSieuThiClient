import { Card } from "@/components/ui/card";
import { Users, Package, ShoppingCart, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Tổng User",
    value: "1,234",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Tổng Sản phẩm",
    value: "5,678",
    icon: Package,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Đơn hàng hôm nay",
    value: "89",
    icon: ShoppingCart,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Doanh thu tháng",
    value: "125.5M",
    icon: TrendingUp,
    color: "bg-orange-100 text-orange-600",
  },
];

export function DashboardOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </h3>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +12% so với tháng trước
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

