import React from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, MessageSquare, ShieldCheck, RefreshCw, Truck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, navigate } = useStore();

  return (
    <footer className="bg-white border-t border-slate-100 mt-20 text-slate-600">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-slate-100 bg-[#FAF8F5]/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/70 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">شحن سريع ومجاني</h4>
                <p className="text-xs text-slate-500">للطلبات فوق {settings?.freeShippingThreshold || 1200} جنيه</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/70 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">قطن مصري أصيل 100%</h4>
                <p className="text-xs text-slate-500">جودة خامات تدوم لسنوات طوال</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/70 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">معاينة واسترجاع</h4>
                <p className="text-xs text-slate-500">استبدال واسترجاع خلال 14 يوماً</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/70 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">دعم مباشر وواتساب</h4>
                <p className="text-xs text-slate-500">متواجدون دائماً لخدمتكم</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center text-white font-bold text-lg shadow-xs">
                ع
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">CENTER AL ASSAL</h3>
                <p className="text-xs text-slate-500">{settings?.storeNameArabic || 'سنتر العسال لتجارة المفروشات'}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              علامة تجارية متخصصة في أرقى المفروشات المنزلية وأطقم الملايات الفاخرة، نجمع بين فخامة القطن المصري وأحدث تصاميم الديكور العصري لراحة نومكم.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://wa.me/201277714100"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>واتساب 01277714100</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-sky-700 transition-colors cursor-pointer">
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => navigate('products')} className="hover:text-sky-700 transition-colors cursor-pointer">
                  جميع المنتجات والمفروشات
                </button>
              </li>
              <li>
                <button onClick={() => navigate('categories')} className="hover:text-sky-700 transition-colors cursor-pointer">
                  تصفح حسب الأقسام
                </button>
              </li>
              <li>
                <button onClick={() => navigate('track')} className="hover:text-sky-700 transition-colors cursor-pointer">
                  تتبع حالة طلبك برقم الكود
                </button>
              </li>
              <li>
                <button onClick={() => navigate('faqs')} className="hover:text-sky-700 transition-colors cursor-pointer">
                  الأسئلة الشائعة
                </button>
              </li>
              <li>
                <button onClick={() => navigate('policies')} className="hover:text-sky-700 transition-colors cursor-pointer">
                  سياسة الاستبدال والاسترجاع
                </button>
              </li>
            </ul>
          </div>

          {/* Branches */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-4">معارض وفروع سنتر العسال</h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  <span>الفرع الأول – المعرض الرئيسي</span>
                </p>
                <p className="text-slate-500 text-[11px]">8 شارع أنور السادات</p>
                <a href="tel:01277714100" className="text-sky-700 font-medium text-[11px] block mt-1 hover:underline">
                  01277714100
                </a>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  <span>الفرع الثاني – فرع كرموز</span>
                </p>
                <p className="text-slate-500 text-[11px]">95 عمود السواري – كرموز</p>
                <a href="tel:01279207793" className="text-sky-700 font-medium text-[11px] block mt-1 hover:underline">
                  01279207793
                </a>
              </div>
            </div>
          </div>

          {/* Payment & Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-4">طرق الدفع المعتمدة</h4>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              نوفر خيارات دفع آمنة تشمل الدفع عند الاستلام بعد معاينة المنتج، وخدمة InstaPay والمحافظ الإلكترونية.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-slate-100 rounded text-slate-700 font-medium">الدفع عند الاستلام</span>
              <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200/50 rounded font-medium">
                InstaPay
              </span>
              <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200/50 rounded font-medium">
                Vodafone Cash
              </span>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200/50 rounded font-medium">
                محافظ بنكية
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
              <p className="text-slate-400">ساعات العمل في الفروع:</p>
              <p className="text-slate-700 font-medium mt-0.5">يومياً من 10:00 صباحاً حتى 11:30 مساءً</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 CENTER AL ASSAL – سنتر العسال لتجارة المفروشات. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('policies')} className="hover:text-slate-600">
              سياسة الخصوصية
            </button>
            <span>·</span>
            <button onClick={() => navigate('policies')} className="hover:text-slate-600">
              الشروط والأحكام
            </button>
            <span>·</span>
            <button onClick={() => navigate('admin')} className="text-sky-600 hover:text-sky-800 font-medium">
              دخول الإدارة
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
