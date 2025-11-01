"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Flame } from "lucide-react";
import { ProductModal } from "@/components/products/ProductModal";
import type { ProductCardProps, Product } from "@/types/product.type";
import { useNavigate } from "react-router-dom";

export function HoriztionPromotion({ product, onAddToCart }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasDiscount = product.discount_percent > 0;
  const isOutOfStock = product.stock_quantity === 0;
  const navigate = useNavigate();
  const productId = product.id;
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    // Tạo một sản phẩm với số lượng đã chọn
    const productWithQuantity = { ...product, selectedQuantity: quantity };
    onAddToCart?.(productWithQuantity);
  };

  return (
    <>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-white transition-all hover:shadow-lg">
        {/* White Content Area */}
        <div className="flex h-full flex-row rounded-lg bg-white">
          {/* Product Image */}
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-t-lg cursor-pointer"
            onClick={() => {
              // Add your click handler here - could be navigation to product detail page
              console.log("Product image clicked:", product.name);
            }}
          >
            <img
              onClick={() => {
                if (productId) {
                  navigate(`/products-detail/${productId}`);
                }
              }}
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground">
                  Hết hàng
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col p-4 relative">
            {/* Badges Container */}
            <div className="absolute right-0 top-0 z-10 flex flex-col gap-1">
              {product.is_hot && (
                <Badge className="bg-red-500 text-white shadow-md">
                  <Flame className="mr-1 h-3 w-3" />
                  Hot
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col ">
              {/* Product Name */}
              <h3 className="mb-1 text-base font-bold leading-tight text-gray-700 sm:text-lg line-clamp-2 min-h-[2.5rem]">
                {product.name}
              </h3>

              {/* Price Section */}
              <div className="mb-2 flex flex-col gap-1">
                {/* Current Price with Unit */}
                <span className="text-lg font-bold text-red-600 sm:text-xl">
                  {formatPrice(product.final_price)}
                  {product.quantity && (
                    <span className="text-sm font-normal text-red-600">
                      /{product.quantity}
                    </span>
                  )}
                </span>

                {/* Original Price and Discount */}
                {hasDiscount && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      <span className="line-through">
                        {formatPrice(product.unit_price)}
                      </span>
                      {product.quantity && (
                        <span className="text-xs text-gray-400">
                          /{product.quantity}
                        </span>
                      )}
                    </span>
                    <div className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      -{product.discount_percent}%
                    </div>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              {!isOutOfStock && product.stock_quantity < 10 && (
                <p className="mb-2 text-xs text-destructive sm:text-sm">
                  Chỉ còn {product.stock_quantity} sản phẩm
                </p>
              )}

              {/* Add to Cart Button */}
              <Button
                className="w-full bg-green-600 text-white hover:bg-green-700"
                size="sm"
                disabled={isOutOfStock}
                onClick={() => setIsModalOpen(true)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal - Rendered outside card */}
      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}
