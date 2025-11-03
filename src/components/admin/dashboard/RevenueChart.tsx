import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Thứ 2", doanhthu: 4000, donhang: 24 },
  { name: "Thứ 3", doanhthu: 3000, donhang: 13 },
  { name: "Thứ 4", doanhthu: 2000, donhang: 9 },
  { name: "Thứ 5", doanhthu: 2780, donhang: 39 },
  { name: "Thứ 6", doanhthu: 1890, donhang: 23 },
  { name: "Thứ 7", doanhthu: 2390, donhang: 34 },
  { name: "Chủ nhật", doanhthu: 3490, donhang: 43 },
];

export function RevenueChart() {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Doanh thu theo tuần</h3>
        <p className="text-sm text-muted-foreground">
          Biểu đồ doanh thu 7 ngày gần nhất
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="doanhthu"
            stroke="#3b82f6"
            name="Doanh thu"
          />
          <Line
            type="monotone"
            dataKey="donhang"
            stroke="#10b981"
            name="Đơn hàng"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

