import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Sản phẩm A", soluong: 400 },
  { name: "Sản phẩm B", soluong: 300 },
  { name: "Sản phẩm C", soluong: 200 },
  { name: "Sản phẩm D", soluong: 278 },
  { name: "Sản phẩm E", soluong: 189 },
];

export function TopProducts() {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Sản phẩm bán chạy</h3>
        <p className="text-sm text-muted-foreground">
          Top 5 sản phẩm bán chạy nhất
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="soluong" fill="#8b5cf6" name="Số lượng bán" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

