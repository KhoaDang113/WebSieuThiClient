import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import type { Category } from "@/types";
import categoryService from "@/api/services/catalogService";
import { CategoryBasicFields } from "./forms/CategoryBasicFields";
import { CategoryParentSelect } from "./forms/CategoryParentSelect";
import { CategoryMediaFields } from "./forms/CategoryMediaFields";

interface CategoryFormProps {
  mode: "add" | "edit";
  categoryId?: string;
  onSuccess: () => void;
  onCancel: () => void;
  allCategories?: Category[];
}

interface FormData {
  name: string;
  slug: string;
  image: string;
  description: string;
  parent_id: string;
  is_active: boolean;
}

const initialFormData: FormData = {
  name: "",
  slug: "",
  image: "",
  description: "",
  parent_id: "",
  is_active: true,
};

export function CategoryForm({
  mode,
  categoryId,
  onSuccess,
  onCancel,
  allCategories = [],
}: CategoryFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCategoryData = async () => {
      if (mode === "edit" && categoryId) {
        try {
          setIsLoading(true);
          const category = await categoryService.getCategoryById(categoryId);
          setFormData({
            name: category.name || "",
            slug: category.slug || "",
            image: category.image || "",
            description: category.description || "",
            parent_id: category.parent_id || "",
            is_active: category.is_active ?? true,
          });
        } catch (error) {
          console.error("Error loading category:", error);
          alert("Không thể tải dữ liệu danh mục");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadCategoryData();
  }, [mode, categoryId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Tên danh mục là bắt buộc";
    if (!formData.slug.trim()) newErrors.slug = "Slug là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Auto-generate slug from name
    if (name === "name" && !formData.slug) {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSubmit = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        image: formData.image.trim() || undefined,
        description: formData.description.trim() || undefined,
        parent_id: formData.parent_id || undefined,
        is_active: formData.is_active,
      };

      if (mode === "edit" && categoryId) {
        await categoryService.updateCategory(categoryId, dataToSubmit);
        alert("Cập nhật danh mục thành công!");
      } else {
        await categoryService.createCategory(dataToSubmit);
        alert("Thêm danh mục mới thành công!");
      }

      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Không thể lưu danh mục. Vui lòng thử lại sau.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableParentCategories = allCategories.filter(
    (cat) => cat._id !== categoryId && !cat.parent_id
  );

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">Đang tải dữ liệu...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <CategoryBasicFields
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
        />

        <CategoryParentSelect
          parentId={formData.parent_id}
          availableCategories={availableParentCategories}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
        />

        <CategoryMediaFields
          formData={formData}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleInputChange}
            className="w-4 h-4"
            disabled={isSubmitting}
          />
          <label htmlFor="is_active" className="text-sm font-medium">
            Kích hoạt danh mục
          </label>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting
              ? "Đang lưu..."
              : mode === "edit"
              ? "Cập nhật"
              : "Thêm mới"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 gap-2 bg-transparent"
            disabled={isSubmitting}
          >
            <X className="w-4 h-4" />
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  );
}
