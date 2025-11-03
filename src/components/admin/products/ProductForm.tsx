import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/admin/products/ImageUpload";
import { ArrowLeft, Save } from "lucide-react";

interface ProductFormProps {
  mode: "add" | "edit";
  productId?: string;
}

interface FormData {
  name: string;
  description: string;
  image_url: string;
  category_id: string;
  brand_id: string;
  unit_price: string;
  final_price: string;
  discount_percent: string;
  stock_quantity: string;
  quantity: string;
  is_hot: boolean;
}

const initialFormData: FormData = {
  name: "",
  description: "",
  image_url: "",
  category_id: "",
  brand_id: "",
  unit_price: "",
  final_price: "",
  discount_percent: "",
  stock_quantity: "",
  quantity: "",
  is_hot: false,
};

export function ProductForm({ mode }: ProductFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Tên sản phẩm là bắt buộc";
    if (!formData.description.trim())
      newErrors.description = "Mô tả là bắt buộc";
    if (!formData.category_id) newErrors.category_id = "Danh mục là bắt buộc";
    if (!formData.brand_id) newErrors.brand_id = "Thương hiệu là bắt buộc";
    if (!formData.unit_price) newErrors.unit_price = "Giá gốc là bắt buộc";
    if (!formData.final_price) newErrors.final_price = "Giá bán là bắt buộc";
    if (!formData.stock_quantity)
      newErrors.stock_quantity = "Số lượng tồn là bắt buộc";

    if (formData.unit_price && formData.final_price) {
      if (
        Number.parseFloat(formData.final_price) >
        Number.parseFloat(formData.unit_price)
      ) {
        newErrors.final_price = "Giá bán không được lớn hơn giá gốc";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image_url: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Form submitted:", formData);

      // Redirect to products list
      navigate("/admin/products");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-2">
        <Link to="/admin/products">
          <Button variant="outline" className="gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
        </Link>
      </div>

      {/* Basic Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Tên sản phẩm *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
                onChange={(e) =>
                  handleSelectChange("category_id", e.target.value)
                }
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
                onChange={(e) => handleSelectChange("brand_id", e.target.value)}
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

      {/* Image Upload */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ảnh sản phẩm</h3>
        <ImageUpload
          onImageUpload={handleImageUpload}
          currentImage={formData.image_url}
        />
      </Card>

      {/* Pricing */}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Inventory */}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                placeholder="VD: 1kg, 500g, 1 cái"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Status */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Trạng thái</h3>
        <div className="flex items-center gap-2">
          <Checkbox
            id="is_hot"
            checked={formData.is_hot}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, is_hot: checked as boolean }))
            }
          />
          <Label htmlFor="is_hot" className="cursor-pointer">
            Đánh dấu sản phẩm nổi bật
          </Label>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Link to="/admin/products">
          <Button variant="outline">Hủy</Button>
        </Link>
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          <Save className="w-4 h-4" />
          {isSubmitting
            ? "Đang lưu..."
            : mode === "add"
            ? "Thêm sản phẩm"
            : "Cập nhật sản phẩm"}
        </Button>
      </div>
    </form>
  );
}



