import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { openProduct } = useStore();

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : '/src/assets/images/hero_luxury_bedding_1793871158417.jpg';

  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'قياسي';
  const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : 'افتراضي';

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 hover:border-sky-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Image Showcase Container */}
      <div className="relative aspect-4/3 w-full bg-[#FAF8F5] overflow-hidden cursor-pointer" onClick={() => openProduct(product.id)}>
        <img
          src={primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/src/assets/images/hero_luxury_bedding_1793871158417.jpg';
          }}
        />

        {/* Minimal Tags (Unobtrusive) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 pointer-events-none">
          {product.discount && product.discount > 0 && (
            <span className="bg-sky-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              خصم {product.discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-white/95 text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs border border-slate-100">
              وصل حديثاً
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="bg-amber-50 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-amber-200">
              الأكثر طلباً
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProduct(product.id);
            }}
            className="flex-1 bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-semibold py-2 rounded-xl shadow-xs hover:bg-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>تفاصيل المنتج</span>
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="text-slate-500 font-medium">{product.categoryName || 'مفروشات راقية'}</span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-slate-700 text-xs tabular-nums">
                {product.rating || 5.0}
              </span>
              <span className="text-slate-400 text-[10px]">({product.reviewsCount || 12})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => openProduct(product.id)}
            className="font-semibold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 hover:text-sky-700 transition-colors cursor-pointer mb-2"
          >
            {product.name}
          </h3>

          {/* Size / Color brief teaser */}
          {product.fabrics && product.fabrics.length > 0 && (
            <p className="text-[11px] text-slate-500 line-clamp-1 mb-3">
              {product.fabrics[0]}
            </p>
          )}
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-slate-50 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
                {product.price.toLocaleString('ar-EG')}
              </span>
              <span className="text-xs text-slate-500 font-medium">ج.م</span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through tabular-nums block">
                {product.originalPrice.toLocaleString('ar-EG')} ج.م
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, defaultSize, defaultColor, 1)}
            disabled={!product.isAvailable}
            className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              product.isAvailable
                ? 'bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            title={product.isAvailable ? 'إضافة إلى السلة' : 'غير متوفر حالياً'}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
