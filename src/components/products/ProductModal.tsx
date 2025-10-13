"use client";


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";
import type { Product } from "@/types";


interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

// Dữ liệu mẫu sản phẩm liên quan
const relatedProducts: Product[] = [
  {
    id: 2,
    name: "Hảo Hảo - Mì tôm",
    description: "Mì tôm Hảo Hảo vị chua cay đậm đà",
    image_url: "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
    unit_price: 50000,
    final_price: 45000,
    stock_quantity: 200,
    discount_percent: 10,
    is_hot: false,
    slug: "hao-hao-mi-tom",
    quantity: "1 gói",
  },
  {
    id: 3,
    name: "Kokomi - Mì lẩu",
    description: "Mì lẩu Kokomi vị tôm chua cay thơm ngon",
    image_url: "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
    unit_price: 58000,
    final_price: 52200,
    stock_quantity: 80,
    discount_percent: 10,
    is_hot: true,
    slug: "kokomi-mi-lau",
    quantity: "1 gói",
  },
  {
    id: 4,
    name: "Omachi - Mì tôm",
    description: "Mì tôm Omachi vị chua cay đặc biệt",
    image_url: "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
    unit_price: 42000,
    final_price: 38000,
    stock_quantity: 120,
    discount_percent: 10,
    is_hot: false,
    slug: "omachi-mi-tom",
    quantity: "1 gói",
  },
  {
    id: 5,
    name: "Acecook - Mì gói",
    description: "Mì gói Acecook vị tôm chua cay",
    image_url: "https://cdnv2.tgdd.vn/bhx-static/bhx/menuheader/gau-do_202510031119471876.gif",
    unit_price: 35000,
    final_price: 32000,
    stock_quantity: 300,
    discount_percent: 9,
    is_hot: false,
    slug: "acecook-mi-goi",
    quantity: "1 gói",
  },
];


export function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [relatedQuantities, setRelatedQuantities] = useState<Record<number, number>>({});


  if (!isOpen) return null;


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };


  const hasDiscount = product.discount_percent > 0;
  const maxQuantity = Math.min(10, product.stock_quantity);


  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };




  const handleComplete = () => {
    onAddToCart(product, quantity);
    onClose();
    setQuantity(1);
  };

  const handleRelatedQuantityChange = (productId: number, newQuantity: number) => {
    const relatedProduct = relatedProducts.find(p => p.id === productId);
    if (relatedProduct && newQuantity >= 1 && newQuantity <= relatedProduct.stock_quantity) {
      setRelatedQuantities(prev => ({
        ...prev,
        [productId]: newQuantity
      }));
    }
  };

  const handleAddRelatedToCart = (relatedProduct: Product) => {
    const qty = relatedQuantities[relatedProduct.id] || 1;
    onAddToCart(relatedProduct, qty);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative mx-4 w-full max-w-3xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {product.name}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>


        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Product Info */}
          <div className="flex gap-6 p-6">
            {/* Product Image */}
            <div className="flex-shrink-0">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="h-32 w-32 rounded-lg object-contain"
              />
            </div>


            {/* Product Details */}
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                {product.name}
              </h3>


              {/* Price Section */}
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-red-600">
                    {formatPrice(product.final_price)}
                    {product.quantity && (
                      <span className="text-base font-normal text-red-600">
                        /{product.quantity}
                      </span>
                    )}
                  </span>
                 
                  {hasDiscount && (
                    <>
                      <span className="text-base text-gray-400 line-through">
                        {formatPrice(product.unit_price)}
                      </span>
                      {product.quantity && (
                        <span className="text-xs text-gray-400">
                          /{product.quantity}
                        </span>
                      )}
                      <Badge className="bg-red-600 text-white">
                        -{product.discount_percent}%
                      </Badge>
                    </>
                  )}
                </div>


                <p className="mt-2 text-sm text-gray-600">
                  Tối đa {maxQuantity} sp/đơn
                </p>
                <p className="text-sm text-gray-600">
                  Còn {product.stock_quantity} suất
                </p>
              </div>


              {/* Quantity Selector */}
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Số lượng:</span>
                  <div className="flex items-center gap-2 rounded-lg border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="h-7 w-7 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="min-w-[2.5rem] text-center font-medium text-sm">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= maxQuantity}
                      className="h-7 w-7 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="border-t bg-gray-50 p-4">
          <h3 className="mb-3 text-base font-semibold text-gray-900">Sản phẩm liên quan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={relatedProduct.image_url || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    className="w-full h-24 object-contain bg-gray-50"
                  />
                  {relatedProduct.is_hot && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                      HOT
                    </Badge>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-2">
                  <h4 className="text-xs font-medium text-green-600 mb-1 line-clamp-2">
                    {relatedProduct.name}
                  </h4>
                  
                  {/* Price */}
                  <div className="mb-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-red-600">
                        {formatPrice(relatedProduct.final_price)}
                      </span>
                      {relatedProduct.discount_percent > 0 && (
                        <>
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(relatedProduct.unit_price)}
                          </span>
                          <Badge className="bg-red-600 text-white text-xs px-1 py-0">
                            -{relatedProduct.discount_percent}%
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">Số lượng:</span>
                    <div className="flex items-center gap-1 rounded border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRelatedQuantityChange(relatedProduct.id, (relatedQuantities[relatedProduct.id] || 1) - 1)}
                        disabled={(relatedQuantities[relatedProduct.id] || 1) <= 1}
                        className="h-5 w-5 p-0"
                      >
                        <Minus className="h-2 w-2" />
                      </Button>
                      <span className="min-w-[1.5rem] text-center text-xs font-medium">
                        {relatedQuantities[relatedProduct.id] || 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRelatedQuantityChange(relatedProduct.id, (relatedQuantities[relatedProduct.id] || 1) + 1)}
                        disabled={(relatedQuantities[relatedProduct.id] || 1) >= relatedProduct.stock_quantity}
                        className="h-5 w-5 p-0"
                      >
                        <Plus className="h-2 w-2" />
                      </Button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={() => handleAddRelatedToCart(relatedProduct)}
                    className="w-full bg-green-600 text-white hover:bg-green-700 text-xs py-1"
                    size="sm"
                  >
                    <ShoppingCart className="mr-1 h-3 w-3" />
                    Thêm vào giỏ
                  </Button>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <Button
            onClick={handleComplete}
            className="w-full bg-green-600 text-white hover:bg-green-700"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            HOÀN TẤT
          </Button>
        </div>
      </div>
    </div>
  );
}
