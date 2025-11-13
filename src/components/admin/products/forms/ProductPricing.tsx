import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductPricingProps {
  formData: {
    unit_price: string;
    final_price: string;
    discount_percent: string;
  };
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProductPricing({
  formData,
  errors,
  onInputChange,
}: ProductPricingProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Giá cả</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="unit_price">Giá gốc *</Label>
            <Input
              id="unit_price"
              name="unit_price"
              type="number"
              value={formData.unit_price}
              onChange={onInputChange}
              placeholder="0"
              className={errors.unit_price ? "border-destructive" : ""}
            />
            {errors.unit_price && (
              <p className="text-sm text-destructive mt-1">
                {errors.unit_price}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="final_price">Giá bán *</Label>
            <Input
              id="final_price"
              name="final_price"
              type="number"
              value={formData.final_price}
              onChange={onInputChange}
              placeholder="0"
              className={errors.final_price ? "border-destructive" : ""}
            />
            {errors.final_price && (
              <p className="text-sm text-destructive mt-1">
                {errors.final_price}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="discount_percent">Giảm giá (%)</Label>
            <Input
              id="discount_percent"
              name="discount_percent"
              type="number"
              value={formData.discount_percent}
              onChange={onInputChange}
              placeholder="0"
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

