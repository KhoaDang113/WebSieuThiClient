import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const lowStockItems = [
  { id: 1, name: "Sản phẩm X", stock: 5, threshold: 10 },
  { id: 2, name: "Sản phẩm Y", stock: 3, threshold: 10 },
  { id: 3, name: "Sản phẩm Z", stock: 8, threshold: 10 },
];

export function LowStockAlert() {
  return (
    <Card className="p-6 border-orange-200 bg-orange-50">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-orange-900">
          <AlertCircle className="w-5 h-5" />
          Cảnh báo hàng tồn thấp
        </h3>
        <p className="text-sm text-orange-700">Các sản phẩm sắp hết hàng</p>
      </div>
      <div className="space-y-3">
        {lowStockItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
          >
            <div>
              <p className="font-medium text-foreground">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                Tồn kho: {item.stock} cái
              </p>
            </div>
            <span className="text-sm font-semibold text-orange-600">
              Cảnh báo
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

