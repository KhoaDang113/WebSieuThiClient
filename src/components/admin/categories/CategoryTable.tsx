import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Plus } from "lucide-react";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import type { CategoryNav as Category } from "@/types";

interface CategoryTableProps {
  searchTerm: string;
  categories: Category[];
}

export function CategoryTable({ searchTerm, categories }: CategoryTableProps) {
  const [localCategories, setLocalCategories] =
    useState<Category[]>(categories);
  const [editId, setEditId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const filteredCategories = localCategories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      setLocalCategories(localCategories.filter((cat) => cat.id !== id));
    }
  };

  const handleCategoryAdded = () => {
    setIsAddingNew(false);
  };

  const handleCategoryUpdated = () => {
    setEditId(null);
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Danh sách Danh mục ({filteredCategories.length})
          </h3>
          <Button
            size="sm"
            onClick={() => setIsAddingNew(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm mới
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ảnh</th>
                <th>Tên danh mục</th>
                <th>Badge</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="font-medium text-foreground">{category.id}</td>
                  <td>
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  </td>
                  <td className="text-foreground">{category.name}</td>
                  <td>
                    {category.badge ? (
                      <Badge
                        variant="outline"
                        className={category.badgeColor || ""}
                      >
                        {category.badge}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2 whitespace-nowrap flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 w-20 flex-shrink-0"
                        onClick={() => setEditId(category.id)}
                      >
                        <Edit2 className="w-4 h-4" />
                        Sửa
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-destructive hover:text-destructive w-16 flex-shrink-0"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Không tìm thấy danh mục nào</p>
          </div>
        )}
      </Card>

      {/* Add/Edit Dialog */}
      {(isAddingNew || !!editId) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </h3>
            <CategoryForm
              mode={editId ? "edit" : "add"}
              categoryId={editId || undefined}
              onSuccess={editId ? handleCategoryUpdated : handleCategoryAdded}
              onCancel={() => {
                setIsAddingNew(false);
                setEditId(null);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
