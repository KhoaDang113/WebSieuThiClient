import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import type { CategoryNav as Category } from "@/types";

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  brandFilter: string;
  setBrandFilter: (brand: string) => void;
  lowStockOnly: boolean;
  setLowStockOnly: (value: boolean) => void;
  categories: Category[];
}

export function ProductFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  brandFilter,
  setBrandFilter,
  lowStockOnly,
  setLowStockOnly,
  categories,
}: ProductFiltersProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">Tất cả thương hiệu</option>
            <option value="brand-a">Brand A</option>
            <option value="brand-b">Brand B</option>
            <option value="brand-c">Brand C</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="low-stock"
            checked={lowStockOnly}
            onCheckedChange={(checked) => setLowStockOnly(checked as boolean)}
          />
          <label htmlFor="low-stock" className="cursor-pointer text-sm">
            Chỉ hiển thị sản phẩm sắp hết hàng (dưới 10 sản phẩm)
          </label>
        </div>
      </div>
    </Card>
  );
}

