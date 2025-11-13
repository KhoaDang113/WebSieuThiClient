import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductInventoryProps {
  formData: {
    stock_quantity: string;
    quantity: string;
  };
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProductInventory({
  formData,
  errors,
  onInputChange,
}: ProductInventoryProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Kho hàng</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stock_quantity">Số lượng tồn *</Label>
            <Input
              id="stock_quantity"
              name="stock_quantity"
              type="number"
              value={formData.stock_quantity}
              onChange={onInputChange}
              placeholder="0"
              className={errors.stock_quantity ? "border-destructive" : ""}
            />
            {errors.stock_quantity && (
              <p className="text-sm text-destructive mt-1">
                {errors.stock_quantity}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="quantity">Đơn vị / Khối lượng</Label>
            <Input
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={onInputChange}
              placeholder="VD: 1kg, 500g, 1 cái"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

