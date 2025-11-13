import { Input } from "@/components/ui/input";

interface CategoryMediaFieldsProps {
  formData: {
    image: string;
    description: string;
  };
  isSubmitting: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
}

export function CategoryMediaFields({
  formData,
  isSubmitting,
  onInputChange,
}: CategoryMediaFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="image" className="block text-sm font-medium mb-1">
          URL Ảnh (Tùy chọn)
        </label>
        <Input
          id="image"
          name="image"
          value={formData.image}
          onChange={onInputChange}
          placeholder="https://example.com/image.jpg"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium mb-1"
        >
          Mô tả (Tùy chọn)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder="Nhập mô tả danh mục"
          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm min-h-[80px]"
          disabled={isSubmitting}
        />
      </div>
    </>
  );
}

