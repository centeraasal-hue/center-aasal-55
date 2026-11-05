import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { API } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RefreshCw,
  Plus,
  Minus,
  Check,
  ArrowRight,
  Phone,
  MessageSquare,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { selectedProductId, navigate } = useStore();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    if (!selectedProductId) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await API.getProduct(selectedProductId);
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);

        // Fetch related products in same category
        const allProds = await API.getProducts({ category: data.categoryId });
        setRelated(allProds.filter((p) => p.id !== data.id).slice(0, 4));
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [selectedProductId]);

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500">جاري تحميل تفاصيل المنتج...</p>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['/src/assets/images/hero_luxury_bedding_1793871158417.jpg'];

  const handleAddToCart = (directCheckout = false) => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
    if (directCheckout) {
      navigate('checkout');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <button onClick={() => navigate('home')} className="hover:text-slate-700 cursor-pointer">
          الرئيسية
        </button>
        <span>/</span>
        <button onClick={() => navigate('products')} className="hover:text-slate-700 cursor-pointer">
          المنتجات
        </button>
        <span>/</span>
        <span className="text-slate-700 font-medium truncate max-w-xs">{product.name}</span>
      </div>

      {/* Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Gallery Column (lg: 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Frame */}
          <div className="aspect-4/3 w-full bg-[#FAF8F5] rounded-3xl overflow-hidden border border-slate-100 shadow-xs relative">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  '/src/assets/images/hero_luxury_bedding_1793871158417.jpg';
              }}
            />

            {/* Discount Badge */}
            {product.discount && product.discount > 0 && (
              <span className="absolute top-4 right-4 bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-xs">
                وفر {product.discount}%
              </span>
            )}
          </div>

          {/* Thumbnails Row if multiple */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    activeImageIndex === idx ? 'border-sky-600 shadow-xs' : 'border-slate-100 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase Module Column (lg: 5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          {/* Brand Category & Reviews */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-sky-700">{product.categoryName || 'مفروشات راقية'}</span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-800 tabular-nums">{product.rating}</span>
                <span className="text-slate-400">({product.reviewsCount} تقييم)</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {product.name}
            </h1>
          </div>

          {/* Pricing Row */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-100 flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                {product.price.toLocaleString('ar-EG')}
              </span>
              <span className="text-sm font-semibold text-slate-600 mr-1.5">جنيه مصري</span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-left">
                <span className="text-sm text-slate-400 line-through tabular-nums block">
                  {product.originalPrice.toLocaleString('ar-EG')} ج.م
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">
                  وفر {(product.originalPrice - product.price).toLocaleString('ar-EG')} ج.م
                </span>
              </div>
            )}
          </div>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>المقاس المتاح:</span>
                <span className="text-sky-700 font-normal">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>اللون / النقشة:</span>
                <span className="text-sky-700 font-normal">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedColor === col
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-800">الكمية:</label>
              <div className="flex items-center border border-slate-200 bg-white rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-bold text-slate-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="text-xs text-emerald-700 font-medium">
                متوفر في المخزون جاهز للشحن
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleAddToCart(false)}
                className="py-3.5 px-4 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs sm:text-sm rounded-xl border border-sky-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>أضف إلى السلة</span>
              </button>

              <button
                onClick={() => handleAddToCart(true)}
                className="py-3.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>شراء الآن</span>
              </button>
            </div>

            {addedNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>تمت إضافة المنتج إلى سلة المشتريات بنجاح!</span>
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-600" />
              <span>توصيل سريع لجميع المحافظات مع معاينة قبل الاستلام</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-sky-600" />
              <span>استبدال واسترجاع مجاني خلال 14 يوماً</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>ضمان أصالة القطن المصري 100% وجودة التصنيع</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Detailed Specs Section */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-xs space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
          تفاصيل وخامات المنتج
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
          {product.description}
        </p>

        {product.fabrics && product.fabrics.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 mb-2">المواصفات الفنية:</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              {product.fabrics.map((fab, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                  <span>{fab}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Related Products Grid */}
      {related.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">منتجات قد تعجبك أيضاً</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
