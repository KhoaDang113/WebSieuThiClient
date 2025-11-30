import { useState } from "react";
import type { Product } from "@/types/product.type";
import ShockingDealCard from "./ShockingDealCard";
import { ProductModal } from "./ProductModal";
import ScrollButton from "@/components/scroll/ScrollButton";

interface ShockingDealProps {
    products: Product[];
    onAddToCart: (product: Product, quantity?: number) => void;
}

export default function ShockingDeal({
    products,
    onAddToCart,
}: ShockingDealProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startIndex, setStartIndex] = useState(0);

    if (!products || products.length === 0) return null;

    const ITEMS_PER_PAGE = 3;

    const handleBuyClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleAddToCartFromModal = (product: Product, quantity: number) => {
        onAddToCart(product, quantity);
    };

    const nextSlide = () => {
        if (startIndex + ITEMS_PER_PAGE < products.length) {
            setStartIndex(startIndex + ITEMS_PER_PAGE);
        }
    };

    const prevSlide = () => {
        if (startIndex - ITEMS_PER_PAGE >= 0) {
            setStartIndex(startIndex - ITEMS_PER_PAGE);
        }
    };

    const visibleProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const isFirstPage = startIndex === 0;
    const isLastPage = startIndex + ITEMS_PER_PAGE >= products.length;

    return (
        <>
            <div className="w-full bg-[#d1f2e5] rounded-xl overflow-hidden shadow-sm mb-6 border border-green-100 relative group">
                {/* Header */}
                <div className="bg-[#008848] px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-white font-bold text-lg uppercase tracking-wide drop-shadow-sm">
                            KHUYẾN MÃI SỐC
                        </h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-3 relative">
                    {/* Navigation Buttons */}
                    {!isFirstPage && (
                        <ScrollButton
                            direction="left"
                            onClick={prevSlide}
                            color="bg-white hover:bg-gray-100 shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                    )}

                    {!isLastPage && (
                        <ScrollButton
                            direction="right"
                            onClick={nextSlide}
                            color="bg-white hover:bg-gray-100 shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                    )}

                    {/* Grid showing exactly 3 items */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {visibleProducts.map((product) => (
                            <ShockingDealCard
                                key={product._id || product.id}
                                product={product}
                                onBuyClick={handleBuyClick}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Modal */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onAddToCart={handleAddToCartFromModal}
                />
            )}
        </>
    );
}
