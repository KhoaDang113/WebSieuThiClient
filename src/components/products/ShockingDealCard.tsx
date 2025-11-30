import type { Product } from "@/types/product.type";
import { getProductImage, getProductId } from "@/lib/constants";
import { Link } from "react-router-dom";

interface ShockingDealCardProps {
    product: Product;
    onBuyClick?: (product: Product) => void;
}

export default function ShockingDealCard({
    product,
    onBuyClick,
}: ShockingDealCardProps) {
    // Calculate discount percentage
    const discount =
        product.discount_percent ||
        (product.unit_price && product.final_price
            ? Math.round(
                ((product.unit_price - product.final_price) / product.unit_price) *
                100
            )
            : 0);

    const handleBuyClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent navigation when clicking buy button
        if (onBuyClick) {
            onBuyClick(product);
        }
    };

    const productId = getProductId(product);

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 h-full relative group border border-transparent hover:border-green-200 flex flex-row gap-4 items-center">
            <Link to={`/products-detail/${productId}`} className="flex flex-row gap-4 items-center w-full h-full">
                {/* Product Image - Left Side */}
                <div className="relative w-1/3 aspect-square flex-shrink-0">
                    <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Product Info - Right Side */}
                <div className="flex flex-col flex-grow justify-between h-full w-2/3">

                    {/* Top Section: Price & Discount */}
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-red-600 font-bold text-lg">
                                    {product.final_price?.toLocaleString("vi-VN")}₫
                                </span>
                                {discount > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                        -{discount}%
                                    </span>
                                )}
                            </div>
                            {product.unit_price && product.unit_price > (product.final_price || 0) && (
                                <div className="text-gray-400 text-xs line-through">
                                    {product.unit_price.toLocaleString("vi-VN")}₫
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Name */}
                    <h3 className="text-sm font-medium text-gray-700 line-clamp-2 mb-2" title={product.name}>
                        {product.name}
                    </h3>

                    {/* Buy Button */}
                    <button
                        onClick={handleBuyClick}
                        className="w-full bg-[#e5f9ed] text-[#008848] font-bold py-2 rounded-md hover:bg-[#d0f5dd] transition-colors uppercase text-xs tracking-wide mt-auto"
                    >
                        MUA
                    </button>
                </div>
            </Link>
        </div>
    );
}
