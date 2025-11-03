import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Star } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import type { Product } from "@/types";

interface ProductTableProps {
  searchTerm: string;
  categoryFilter: string;
  brandFilter: string;
  lowStockOnly: boolean;
  products: Product[];
}

export function ProductTable({
  searchTerm,
  categoryFilter,
  brandFilter,
  lowStockOnly,
  products,
}: ProductTableProps) {
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = localProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || true; // Need category info in product
    const matchesBrand = brandFilter === "all" || true; // Need brand info in product
    const matchesStock = !lowStockOnly || product.stock_quantity < 10;

    return matchesSearch && matchesCategory && matchesBrand && matchesStock;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, brandFilter, lowStockOnly]);

  const handleDelete = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      setLocalProducts(localProducts.filter((product) => product.id !== id));
    }
  };

  const handleToggleHot = (id: number) => {
    setLocalProducts(
      localProducts.map((product) =>
        product.id === id ? { ...product, is_hot: !product.is_hot } : product
      )
    );
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Danh sách Sản phẩm ({filteredProducts.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá gốc</th>
              <th>Giá bán</th>
              <th>Giảm giá</th>
              <th>Tồn kho</th>
              <th>Nổi bật</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id}>
                <td className="font-medium text-foreground">{product.id}</td>
                <td>
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                </td>
                <td className="text-foreground font-medium">{product.name}</td>
                <td className="text-muted-foreground">
                  {product.quantity || "-"}
                </td>
                <td className="text-muted-foreground">
                  ₫ {product.unit_price.toLocaleString()}
                </td>
                <td className="text-foreground font-semibold">
                  ₫ {product.final_price.toLocaleString()}
                </td>
                <td>
                  <Badge variant="outline">{product.discount_percent}%</Badge>
                </td>
                <td>
                  <Badge
                    className={
                      product.stock_quantity < 10
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {product.stock_quantity}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleHot(product.id)}
                    className={
                      product.is_hot
                        ? "text-yellow-500"
                        : "text-muted-foreground"
                    }
                  >
                    <Star
                      className="w-4 h-4"
                      fill={product.is_hot ? "currentColor" : "none"}
                    />
                  </Button>
                </td>
                <td>
                  <div className="flex gap-2">
                    <Link to={`/admin/products/edit/${product.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Edit2 className="w-4 h-4" />
                        Sửa
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(product.id)}
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

      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Không tìm thấy sản phẩm nào</p>
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    currentPage > 1 && handlePageChange(currentPage - 1)
                  }
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => handlePageChange(page as number)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage + 1)
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
}
