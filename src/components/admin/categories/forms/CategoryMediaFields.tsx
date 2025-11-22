import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon } from "lucide-react";

interface CategoryMediaFieldsProps {
  formData: {
    image: string;
    description: string;
  };
  isSubmitting: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  onImageFileChange: (file: File | null) => void;
}

export function CategoryMediaFields({
  formData,
  isSubmitting,
  onInputChange,
  onImageFileChange,
}: CategoryMediaFieldsProps) {
  const [imagePreview, setImagePreview] = useState<string>(formData.image || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      onImageFileChange(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    onImageFileChange(null);
    // Reset file input
    const fileInput = document.getElementById("category-image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <>
      {/* Image Upload */}
      <div className="space-y-3">
        <label htmlFor="category-image" className="block text-sm font-medium">
          Ảnh danh mục
        </label>
        
        <Input
          id="category-image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isSubmitting}
          className="cursor-pointer"
        />
        
        <p className="text-xs text-muted-foreground">
          Chọn ảnh từ máy tính để upload. Khi sửa, có thể giữ nguyên hoặc thay ảnh mới.
        </p>

        {/* Image Preview */}
        {imagePreview ? (
          <div className="relative w-full h-48 border border-border rounded-lg overflow-hidden group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-contain bg-muted"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemoveImage}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="w-full h-48 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Chưa có ảnh
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
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
