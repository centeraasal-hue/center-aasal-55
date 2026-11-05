import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { API } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { categories, selectedCategoryId, openCategory, searchQuery, setSearchQuery } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'popular'>('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await API.getProducts({
          category: selectedCategoryId || undefined,
          search: searchQuery || undefined,
        });
        setProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategoryId, searchQuery]);

  // Sort logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'popular') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const activeCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Header */}
      <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-slate-100">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
            {activeCategory ? 'تصفح القسم' : 'معرض المنتجات'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {activeCategory ? activeCategory.name : 'جميع مفروشات سنتر العسال'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {activeCategory
              ? activeCategory.description
              : 'استعرض أحدث تشكيلة من أطقم الملايات القطنية، البطاطين، الألحفة الفندقية، والمفارش الراقية بأعلى معايير الجودة المصرية.'}
          </p>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        {/* Category Filter Pills / Segmented Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <button
            onClick={() => openCategory('')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0 ${
              !selectedCategoryId
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
            }`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => openCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0 ${
                selectedCategoryId === cat.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort and Search Summary */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>ترتيب حسب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-hidden focus:border-sky-500 cursor-pointer"
            >
              <option value="newest">الأحدث وصولاً</option>
              <option value="popular">الأكثر طلباً</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Search Tag if any */}
      {searchQuery && (
        <div className="flex items-center gap-2 text-xs bg-sky-50 text-sky-800 px-3 py-1.5 rounded-lg w-fit">
          <span>نتائج البحث عن: "{searchQuery}"</span>
          <button onClick={() => setSearchQuery('')} className="p-0.5 hover:text-sky-950 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-80 border border-slate-100 animate-pulse" />
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">لا توجد منتجات مطابقة</h3>
          <p className="text-xs text-slate-500 mb-6">
            جرب اختيار قسم آخر أو تعديل كلمة البحث، أو تواصل معنا للطلب المخصص
          </p>
          <button
            onClick={() => {
              openCategory('');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 bg-sky-600 text-white text-xs font-semibold rounded-xl hover:bg-sky-700 transition-colors cursor-pointer"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
