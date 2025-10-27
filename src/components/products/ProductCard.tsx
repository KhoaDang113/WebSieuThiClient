"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Flame } from "lucide-react";
import { ProductModal } from "../products/ProductModal";
import type { ProductCardProps, Product } from "@/types/product.type";

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
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
    const productWithQuantity = { ...product, selectedQuantity: quantity };
    onAddToCart?.(productWithQuantity);
  };

  return (
    <>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:border-green-300 hover:shadow-2xl">
        {/* Badges Container */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1.5">
          {product.is_hot && (
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg border-0 px-2.5 py-1 animate-pulse">
              <Flame className="mr-1 h-3.5 w-3.5 animate-bounce" />
              Hot
            </Badge>
          )}
        </div>

        {/* Product Image */}
        <div
          className="relative overflow-hidden cursor-pointer"
          onClick={() => {
            if (productId) {
              navigate(`/products-detail/${productId}`);
            }
          }}
        >
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <span className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg">
                Hết hàng
              </span>
            </div>
          )}
        </div>

        {/* Product Info - Fixed Height Bottom Section */}
        <div className="flex flex-col p-2.5 sm:p-3">
          {/* Product Name - Fixed Height */}
          <h3
            className="mb-2 text-sm font-semibold leading-snug text-gray-800 line-clamp-2 min-h-[2.5rem] cursor-pointer hover:text-green-600 transition-colors"
            onClick={() => {
              if (productId) {
                navigate(`/products-detail/${productId}`);
              }
            }}
          >
            {product.name}
          </h3>

          {/* Price Section - Always above button */}
          <div className="mb-2 flex flex-col gap-1">
            {/* Current Price with Unit */}
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-red-600 sm:text-xl">
                {formatPrice(product.final_price)}
              </span>
              {product.quantity && (
                <span className="text-xs font-medium text-gray-500">
                  /{product.quantity}
                </span>
              )}
            </div>

            {/* Original Price with Discount Badge */}
            {hasDiscount && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.unit_price)}
                  {product.quantity && (
                    <span className="text-xs">/{product.quantity}</span>
                  )}
                </span>
                <div className="rounded bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white">
                  -{product.discount_percent}%
                </div>
              </div>
            )}

            {/* Stock Warning */}
            {!isOutOfStock && product.stock_quantity < 10 && (
              <p className="text-xs text-orange-600 font-medium">
                Chỉ còn {product.stock_quantity} sản phẩm
              </p>
            )}
          </div>

          {/* Add to Cart Button - Always at bottom */}
          <Button
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 shadow-md hover:shadow-lg transition-all duration-300 font-semibold rounded-full"
            size="sm"
            disabled={isOutOfStock}
            onClick={() => setIsModalOpen(true)}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
          </Button>
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