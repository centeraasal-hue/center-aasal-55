import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Copy,
  Printer,
  MessageSquare,
  Truck,
  ArrowRight,
  Clock,
  MapPin,
  Phone,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { lastOrder, navigate } = useStore();

  useEffect(() => {
    // Fire celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284C7', '#38BDF8', '#D4AF37', '#10B981'],
      });
    } catch {
      // ignore
    }
  }, []);

  if (!lastOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">لا توجد تفاصيل لطلب حديث</h2>
        <p className="text-xs text-slate-500 mb-6">يمكنك مراجعة جميع المنتجات أو تتبع طلبك بكود الشحنة</p>
        <button
          onClick={() => navigate('products')}
          className="px-6 py-2.5 bg-sky-600 text-white text-xs font-semibold rounded-xl hover:bg-sky-700 transition-colors"
        >
          العودة للمتجر
        </button>
      </div>
    );
  }

  const copyOrderCode = () => {
    navigator.clipboard.writeText(lastOrder.orderCode);
    alert('تم نسخ كود الطلب بنجاح: ' + lastOrder.orderCode);
  };

  const paymentLabels: Record<string, string> = {
    cod: 'الدفع عند الاستلام (نقداً)',
    instapay: 'تحويل عبر تطبيق InstaPay',
    wallet: 'تحويل محفظة إلكترونية ذكية',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          تم استلام طلبك بنجاح!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          شكراً لتسوقكم من سنتر العسال للمفروشات. تم تسجيل طلبك في نظامنا وسيتم تجهيز المفروشات وشحنها إليك في أسرع وقت.
        </p>

        {/* Unique Order Code Box */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-3 p-3 sm:px-6 sm:py-3.5 bg-sky-50 border border-sky-200 rounded-2xl">
            <div className="text-right">
              <span className="text-[10px] text-sky-800 font-semibold block uppercase">
                كود الطلب الفريد (احتفظ به للتتبع)
              </span>
              <span className="text-xl sm:text-2xl font-black text-sky-950 font-mono tracking-wider select-all">
                {lastOrder.orderCode}
              </span>
            </div>
            <button
              onClick={copyOrderCode}
              className="p-2 hover:bg-sky-100 text-sky-700 rounded-xl transition-colors cursor-pointer"
              title="نسخ كود الطلب"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate('track')}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>تتبع حالة هذا الطلب</span>
          </button>

          <a
            href={`https://wa.me/201277714100?text=${encodeURIComponent(
              `مرحباً سنتر العسال، أود المتابعة بخصوص طلبي ذو الكود: ${lastOrder.orderCode} باسم ${lastOrder.customerName}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>متابعة مع خدمة العملاء (واتساب)</span>
          </a>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>طباعة الفاتورة</span>
          </button>
        </div>
      </div>

      {/* Invoice Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
          <span>تفاصيل الفاتورة والمنتجات</span>
          <span className="text-xs text-slate-400 font-normal">
            التاريخ: {new Date(lastOrder.createdAt).toLocaleDateString('ar-EG')}
          </span>
        </h2>

        {/* Customer & Address Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#FAF8F5] p-4 rounded-2xl border border-slate-100">
          <div className="space-y-1.5">
            <p className="text-slate-500">اسم العميل:</p>
            <p className="font-bold text-slate-900">{lastOrder.customerName}</p>
            <p className="text-slate-500 mt-2">رقم الهاتف:</p>
            <p className="font-bold text-slate-900 font-mono">{lastOrder.customerPhone}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-slate-500">عنوان التوصيل:</p>
            <p className="font-bold text-slate-900">
              {lastOrder.governorate} – {lastOrder.city}
            </p>
            <p className="text-slate-600 text-[11px] leading-relaxed">{lastOrder.address}</p>
            <p className="text-slate-500 mt-2">طريقة الدفع:</p>
            <p className="font-bold text-sky-800">{paymentLabels[lastOrder.paymentMethod] || lastOrder.paymentMethod}</p>
          </div>
        </div>

        {/* Items List */}
        <div className="divide-y divide-slate-100">
          {lastOrder.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover bg-slate-50 shrink-0"
                />
                <div>
                  <h4 className="font-semibold text-slate-900">{item.productName}</h4>
                  <p className="text-[11px] text-slate-400">
                    المقاس: {item.size} · اللون: {item.color} · الكمية: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-bold text-slate-900 tabular-nums">
                {(item.price * item.quantity).toLocaleString('ar-EG')} ج.م
              </span>
            </div>
          ))}
        </div>

        {/* Total Price Calculation */}
        <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>المجموع الفرعي:</span>
            <span className="tabular-nums font-medium text-slate-800">
              {lastOrder.subtotal.toLocaleString('ar-EG')} ج.م
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>رسوم الشحن:</span>
            <span className="tabular-nums font-medium text-slate-800">
              {lastOrder.shippingCost === 0 ? 'مجاني' : `${lastOrder.shippingCost.toLocaleString('ar-EG')} ج.م`}
            </span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
            <span>الإجمالي الكلي:</span>
            <span className="tabular-nums text-sky-800">
              {lastOrder.total.toLocaleString('ar-EG')} جنيه مصري
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
