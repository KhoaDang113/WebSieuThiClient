"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Flame } from "lucide-react";
import type { ProductCardProps } from "@/types";

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const hasDiscount = product.discount_percent > 0;
  const isOutOfStock = product.stock_quantity === 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Card className="group relative overflow-hidden border border-border bg-card transition-all hover:shadow-lg">
      {/* Badges Container */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {product.is_hot && (
          <Badge className="bg-accent text-accent-foreground shadow-md">
            <Flame className="mr-1 h-3 w-3" />
            Hot
          </Badge>
        )}
      </div>

      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute right-2 top-2 z-10">
          <div className="rounded-lg bg-accent px-2 py-1 text-xs font-bold text-accent-foreground shadow-md">
            -{product.discount_percent}%
          </div>
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image_url || "/placeholder.svg"}
          alt={product.name}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-md bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Product Name */}
        <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-tight text-card-foreground">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="mb-3 flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-accent">
              {formatPrice(product.final_price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.unit_price)}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        {!isOutOfStock && product.stock_quantity < 10 && (
          <p className="mb-2 text-xs text-destructive">
            Chỉ còn {product.stock_quantity} sản phẩm
          </p>
        )}

        {/* Add to Cart Button */}
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="sm"
          disabled={isOutOfStock}
          onClick={() => onAddToCart?.(product)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
        </Button>
      </div>
    </Card>
  );
}
