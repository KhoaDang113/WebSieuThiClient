import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, X } from "lucide-react";

interface CategoryFormProps {
  mode: "add" | "edit";
  categoryId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  image: string;
  badge: string;
  badgeColor: string;
}

const initialFormData: FormData = {
  name: "",
  image: "",
  badge: "",
  badgeColor: "",
};

export function CategoryForm({ onSuccess, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Tên danh mục là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("Form submitted:", formData);
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Tên danh mục *
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nhập tên danh mục"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            URL Ảnh
          </label>
          <Input
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label htmlFor="badge" className="block text-sm font-medium mb-1">
            Badge (tùy chọn)
          </label>
          <Input
            id="badge"
            name="badge"
            value={formData.badge}
            onChange={handleInputChange}
            placeholder="Ví dụ: 86k/thùng"
          />
        </div>

        <div>
          <label
            htmlFor="badgeColor"
            className="block text-sm font-medium mb-1"
          >
            Badge Color (tùy chọn)
          </label>
          <Input
            id="badgeColor"
            name="badgeColor"
            value={formData.badgeColor}
            onChange={handleInputChange}
            placeholder="Ví dụ: bg-green-500"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 gap-2 bg-transparent"
          >
            <X className="w-4 h-4" />
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  );
}
