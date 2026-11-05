import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, CustomerReview } from '../types';
import { API } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Truck,
  RefreshCw,
  Phone,
  MapPin,
  Star,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { settings, categories, navigate, openCategory } = useStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prods, revs] = await Promise.all([
          API.getProducts({ featured: true }),
          API.getReviews(),
        ]);
        setFeaturedProducts(prods);
        setReviews(revs);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const heroImage =
    settings?.heroImageUrl || '/src/assets/images/hero_luxury_bedding_1793871158417.jpg';

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Campaign Focal Point */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5] pt-6 sm:pt-10 pb-12 sm:pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left/Start Column: Typography & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-right">
              {/* Brand Super-title */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-200/60 rounded-full text-xs font-semibold text-sky-800">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>سنتر العسال لتجارة المفروشات · تشكيلة 2026 الحصرية</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.18] tracking-tight text-balance">
                {settings?.heroHeadline || 'الفخامة العصرية لراحة منزلك'}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {settings?.heroSubheadline ||
                  'تشكيلة راقية من أرقى المفروشات، الملايات القطنية، والبطاطين الفاخرة بجودة عالمية وتصاميم تواكب أحدث صيحات الديكور العصري.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('products')}
                  className="px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>تسوق المجموعة الكاملة</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('contact')}
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-sky-600" />
                  <span>زيارة معارضنا</span>
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>قطن مصري 100% أصيل</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>معاينة المنتجات قبل الاستلام</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>دفع عند الاستلام أو InstaPay</span>
                </span>
              </div>
            </div>

            {/* Right/End Column: High-Fidelity Editorial Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 border-4 border-white bg-white">
                <img
                  src={heroImage}
                  alt="سنتر العسال للمفروشات"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      '/src/assets/images/category_bedsheets_1793871159128.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />

                {/* Floating Showcase Pill on Image */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-md border border-white/60 text-right">
                  <p className="text-[10px] text-slate-400 font-medium">المنتج الأكثر طلباً</p>
                  <p className="text-xs font-bold text-slate-800">طقم ملاية ملكي قطن مصري مطرز</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Explore Collections (الأقسام) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-sky-700 tracking-wider uppercase mb-1 block">
              تصفح حسب الفئة
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              أقسام المفروشات الفاخرة
            </h2>
          </div>
          <button
            onClick={() => navigate('categories')}
            className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
          >
            <span>عرض جميع الأقسام</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.slice(0, 5).map((cat) => (
            <div
              key={cat.id}
              onClick={() => openCategory(cat.id)}
              className="group bg-white rounded-2xl border border-slate-100 hover:border-sky-200 p-3 sm:p-4 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col text-center"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] mb-3 relative">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/src/assets/images/category_bedsheets_1793871159128.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sky-400 font-bold text-xl">
                    {cat.name.slice(0, 2)}
                  </div>
                )}
              </div>
              <h3 className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-sky-700 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{cat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured & Best Seller Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-sky-700 tracking-wider uppercase mb-1 block">
              اختيارات متميزة
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              أحدث المنتجات والأكثر مبيعاً
            </h2>
          </div>
          <button
            onClick={() => navigate('products')}
            className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
          >
            <span>تصفح كل المعروضات ({featuredProducts.length})</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-slate-100 animate-pulse h-80" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Seasonal Campaign Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 text-white overflow-hidden p-8 sm:p-12 shadow-lg">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-amber-200">
              عروض تجهيز العرائس 2026
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              خصومات حصرية تصل إلى 35% على أطقم المفارش والألحفة
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
              جهّزي منزلك بأرقى المفروشات القطنية بأسعار خاصة جداً من سنتر العسال. إمكانية الشحن لجميع المحافظات والدفع عند الاستلام.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => navigate('products')}
                className="px-6 py-3 bg-white text-sky-800 hover:bg-sky-50 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                تسوق العروض الآن
              </button>
              <a
                href="https://wa.me/201277714100"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-colors"
              >
                استفسار عبر واتساب
              </a>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute -left-12 -bottom-12 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* 5. Why Choose Center Al Assal */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-sky-700 tracking-wider uppercase mb-1 block">
              الجودة أولاً
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              لماذا يختار عملاؤنا سنتر العسال؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              نلتزم بأعلى معايير تصنيع وتوريد المفروشات لنمنحكم تجربة نوم استثنائية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-slate-100 text-right space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">خامات قطن مصري 100% نقية</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                نستخدم خيوط القطن المصري طويل التيلة المنسوجة بكثافة غرز عالية لنعومة تدوم غسلة بعد غسلة دون أن تتأثر الألوان أو تنكمش الخامات.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-slate-100 text-right space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">معارض حقيقية لمعاينة المنتجات</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                لسنا مجرد متجر إلكتروني، بل نمتلك معارض كبرى (فرع أنور السادات وفرع عمود السواري بكرموز) تتيح لكم لمس الخامات والتأكد من جودتها بأنفسكم.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-slate-100 text-right space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">أمان ومرونة تامة في الدفع والشحن</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                ادفع نقداً عند استلام طلبك بعد المعاينة، أو ادفع بكل سهولة عبر تطبيق InstaPay والمحافظ الإلكترونية، مع إمكانية الاستبدال خلال 14 يوماً.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-sky-700 tracking-wider uppercase mb-1 block">
            آراء موثقة
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ماذا يقول عملاؤنا الكرام؟
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{rev.author}</h4>
                  <p className="text-slate-400 text-[11px]">{rev.city}</p>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                  شراء مؤكد
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Branches and Store Locations Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-sky-700 uppercase">مواقع المعارض</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                فروع سنتر العسال ترحب بكم
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                يسعدنا استقبالكم يومياً في معارضنا لمشاهدة التشكيلة الكاملة على الطبيعة، واختيار ما يناسب ذوقكم بمساعدة مستشاري المبيعات لدينا.
              </p>
              <div className="pt-2">
                <a
                  href="tel:01277714100"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>اتصل بنا مباشرة: 01277714100</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Branch 1 */}
              <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md">
                    المعرض الرئيسي
                  </span>
                  <MapPin className="w-4 h-4 text-sky-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">الفرع الأول – أنور السادات</h3>
                <p className="text-xs text-slate-500">8 شارع أنور السادات</p>
                <p className="text-xs text-slate-500 font-medium">ساعات العمل: 10:00 ص – 11:00 م</p>
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href="tel:01277714100"
                    className="flex-1 py-1.5 text-center bg-slate-50 hover:bg-sky-50 text-sky-700 font-medium text-xs rounded-lg border border-slate-100 transition-colors"
                  >
                    اتصال
                  </a>
                  <a
                    href="https://maps.google.com/?q=8+Anwar+El+Sadat+Street"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 text-center bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs rounded-lg transition-colors"
                  >
                    الخريطة
                  </a>
                </div>
              </div>

              {/* Branch 2 */}
              <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md">
                    فرع كرموز
                  </span>
                  <MapPin className="w-4 h-4 text-sky-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">الفرع الثاني – عمود السواري</h3>
                <p className="text-xs text-slate-500">95 عمود السواري – كرموز</p>
                <p className="text-xs text-slate-500 font-medium">ساعات العمل: 11:00 ص – 11:30 م</p>
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href="tel:01279207793"
                    className="flex-1 py-1.5 text-center bg-slate-50 hover:bg-sky-50 text-sky-700 font-medium text-xs rounded-lg border border-slate-100 transition-colors"
                  >
                    اتصال
                  </a>
                  <a
                    href="https://maps.google.com/?q=95+Pompeys+Pillar+Karmouz"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 text-center bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs rounded-lg transition-colors"
                  >
                    الخريطة
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
