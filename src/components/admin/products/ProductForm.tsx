import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/products/ImageUpload";
import { ArrowLeft, Save } from "lucide-react";
import { ProductBasicInfo } from "./forms/ProductBasicInfo";
import { ProductPricing } from "./forms/ProductPricing";
import { ProductInventory } from "./forms/ProductInventory";
import { ProductStatus } from "./forms/ProductStatus";

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

  const handleIsHotChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_hot: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", formData);
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

      <ProductBasicInfo
        formData={formData}
        errors={errors}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
      />

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ảnh sản phẩm</h3>
        <ImageUpload
          onImageUpload={handleImageUpload}
          currentImage={formData.image_url}
        />
      </Card>

      <ProductPricing
        formData={formData}
        errors={errors}
        onInputChange={handleInputChange}
      />

      <ProductInventory
        formData={formData}
        errors={errors}
        onInputChange={handleInputChange}
      />

      <ProductStatus is_hot={formData.is_hot} onIsHotChange={handleIsHotChange} />

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
