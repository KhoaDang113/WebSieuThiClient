import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProductBasicInfoProps {
  formData: {
    name: string;
    description: string;
    category_id: string;
    brand_id: string;
  };
  errors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSelectChange: (name: string, value: string) => void;
}

export function ProductBasicInfo({
  formData,
  errors,
  onInputChange,
  onSelectChange,
}: ProductBasicInfoProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Tên sản phẩm *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="Nhập tên sản phẩm"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Mô tả *</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="Nhập mô tả sản phẩm"
            rows={4}
            className={errors.description ? "border-destructive" : ""}
          />
          {errors.description && (
            <p className="text-sm text-destructive mt-1">
              {errors.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category_id">Danh mục *</Label>
            <select
              value={formData.category_id}
              onChange={(e) => onSelectChange("category_id", e.target.value)}
              className={`w-full px-3 py-2 border bg-background rounded-md text-sm ${
                errors.category_id ? "border-destructive" : "border-input"
              }`}
            >
              <option value="">Chọn danh mục</option>
              <option value="mi-an-lien">Mì ăn liền</option>
              <option value="dau-an">Dầu ăn</option>
              <option value="thit-heo">Thịt heo</option>
              <option value="rau-la">Rau lá</option>
            </select>
            {errors.category_id && (
              <p className="text-sm text-destructive mt-1">
                {errors.category_id}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="brand_id">Thương hiệu *</Label>
            <select
              value={formData.brand_id}
              onChange={(e) => onSelectChange("brand_id", e.target.value)}
              className={`w-full px-3 py-2 border bg-background rounded-md text-sm ${
                errors.brand_id ? "border-destructive" : "border-input"
              }`}
            >
              <option value="">Chọn thương hiệu</option>
              <option value="brand-a">Brand A</option>
              <option value="brand-b">Brand B</option>
              <option value="brand-c">Brand C</option>
            </select>
            {errors.brand_id && (
              <p className="text-sm text-destructive mt-1">
                {errors.brand_id}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

