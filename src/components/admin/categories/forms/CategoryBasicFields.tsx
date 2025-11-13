import { Input } from "@/components/ui/input";

interface CategoryBasicFieldsProps {
  formData: {
    name: string;
    slug: string;
  };
  errors: Record<string, string>;
  isSubmitting: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
}

export function CategoryBasicFields({
  formData,
  errors,
  isSubmitting,
  onInputChange,
}: CategoryBasicFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Tên danh mục *
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          placeholder="Nhập tên danh mục"
          className={errors.name ? "border-destructive" : ""}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium mb-1">
          Slug *
        </label>
        <Input
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={onInputChange}
          placeholder="ten-danh-muc"
          className={errors.slug ? "border-destructive" : ""}
          disabled={isSubmitting}
        />
        {errors.slug && (
          <p className="text-sm text-destructive mt-1">{errors.slug}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Tự động tạo từ tên danh mục
        </p>
      </div>
    </>
  );
}

