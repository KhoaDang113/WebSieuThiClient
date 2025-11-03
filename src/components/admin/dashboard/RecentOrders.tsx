import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recentOrders = [
  {
    id: "ĐH001",
    customer: "Nguyễn Văn A",
    total: "₫ 250,000",
    status: "Đã giao",
  },
  {
    id: "ĐH002",
    customer: "Trần Thị B",
    total: "₫ 180,000",
    status: "Đang giao",
  },
  {
    id: "ĐH003",
    customer: "Lê Văn C",
    total: "₫ 320,000",
    status: "Chờ xác nhận",
  },
  {
    id: "ĐH004",
    customer: "Phạm Thị D",
    total: "₫ 150,000",
    status: "Đã giao",
  },
  {
    id: "ĐH005",
    customer: "Hoàng Văn E",
    total: "₫ 420,000",
    status: "Đang giao",
  },
];

const statusColors: Record<string, string> = {
  "Đã giao": "bg-green-100 text-green-800",
  "Đang giao": "bg-blue-100 text-blue-800",
  "Chờ xác nhận": "bg-yellow-100 text-yellow-800",
};

export function RecentOrders() {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Đơn hàng gần đây</h3>
        <p className="text-sm text-muted-foreground">5 đơn hàng mới nhất</p>
      </div>
      <div className="space-y-3">
        {recentOrders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium text-foreground">{order.id}</p>
              <p className="text-sm text-muted-foreground">{order.customer}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">{order.total}</p>
              <Badge className={statusColors[order.status]}>
                {order.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

