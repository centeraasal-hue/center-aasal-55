import React, { useState } from 'react';
import { API } from '../services/api';
import { useStore } from '../context/StoreContext';
import { Search, Package, Clock, CheckCircle2, Truck, AlertCircle, Phone, ArrowLeft } from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const { lastOrder, navigate } = useStore();
  const [orderCode, setOrderCode] = useState(lastOrder ? lastOrder.orderCode : '');
  const [phone, setPhone] = useState(lastOrder ? lastOrder.customerPhone : '');
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setOrderData(null);

    if (!orderCode.trim()) {
      setErrorMsg('يرجى إدخال كود الطلب');
      return;
    }

    setIsLoading(true);
    try {
      const data = await API.trackOrder(orderCode.trim(), phone.trim());
      setOrderData(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'لم نتمكن من العثور على الطلب. يرجى التأكد من كود الطلب ورقم الهاتف.');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { key: 'new', label: 'تم استلام الطلب', desc: 'تم تسجيل الطلب في النظام' },
    { key: 'processing', label: 'قيد التجهيز والتغليف', desc: 'جاري إعداد المفروشات وفحص الجودة' },
    { key: 'shipped', label: 'خرج مع مندوب التوصيل', desc: 'في الطريق إلى عنوانك' },
    { key: 'delivered', label: 'تم التسليم بنجاح', desc: 'تم استلام الطلب والمعاينة' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'new':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = orderData ? getStepIndex(orderData.orderStatus) : 0;
  const isCancelled = orderData?.orderStatus === 'cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto">
          <Truck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          تتبع حالة طلبك وشحنتك
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          أدخل كود الطلب الفريد (مثال: CAA-2026-00001) ورقم الهاتف المسجل لمعرفة المرحلة الحالية لتجهيز وشحن المفروشات.
        </p>

        <form onSubmit={handleTrack} className="max-w-xl mx-auto pt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="كود الطلب (مثال: CAA-2026-00001)"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-600 focus:bg-white text-center font-mono font-bold tracking-wider"
            />
            <input
              type="tel"
              placeholder="رقم الهاتف للتأكيد (اختياري)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-600 focus:bg-white text-center font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'جاري البحث في السجلات...' : 'استعلام عن حالة الطلب'}</span>
          </button>
        </form>

        {errorMsg && (
          <div className="max-w-md mx-auto p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Tracking Result View */}
      {orderData && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-8 animate-in fade-in">
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs text-slate-400">طلب برقم:</span>
              <h2 className="text-xl font-black text-sky-950 font-mono tracking-wider">
                {orderData.orderCode}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                تاريخ الطلب: {new Date(orderData.createdAt).toLocaleDateString('ar-EG')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isCancelled ? (
                <span className="px-3.5 py-1.5 bg-red-50 text-red-700 font-bold text-xs rounded-xl border border-red-200">
                  تم إلغاء الطلب
                </span>
              ) : (
                <span className="px-3.5 py-1.5 bg-sky-50 text-sky-800 font-bold text-xs rounded-xl border border-sky-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>{steps[currentStep].label}</span>
                </span>
              )}
            </div>
          </div>

          {/* Stepper Timeline */}
          {!isCancelled && (
            <div className="py-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                {steps.map((step, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div
                      key={step.key}
                      className={`p-4 rounded-2xl border text-right transition-all ${
                        isCurrent
                          ? 'bg-sky-50/70 border-sky-300 shadow-xs'
                          : isDone
                          ? 'bg-white border-emerald-200'
                          : 'bg-slate-50/50 border-slate-100 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-400">مرحلة {idx + 1}</span>
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                        )}
                      </div>
                      <h4
                        className={`text-xs font-bold ${
                          isCurrent ? 'text-sky-900' : isDone ? 'text-slate-900' : 'text-slate-500'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">{step.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details & Items Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
            {/* Customer & Address Details */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] space-y-2 border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">بيانات المستلم:</h3>
              <p>
                الاسم: <strong className="text-slate-900">{orderData.customerName}</strong>
              </p>
              <p>
                الوجهة:{' '}
                <strong className="text-slate-900">
                  {orderData.governorate} – {orderData.city}
                </strong>
              </p>
              <p>
                طريقة الدفع: <strong className="text-slate-900">{orderData.paymentMethod}</strong>
              </p>
              <p>
                حالة الدفع:{' '}
                <strong
                  className={orderData.paymentStatus === 'verified' ? 'text-emerald-700' : 'text-amber-700'}
                >
                  {orderData.paymentStatus === 'verified' ? 'مؤكد ومعتمد' : 'قيد المراجعة والتحقق'}
                </strong>
              </p>
            </div>

            {/* Total */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] flex flex-col justify-between border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">إجمالي الطلب:</h3>
              <div className="space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>الشحن:</span>
                  <span className="tabular-nums font-medium text-slate-800">
                    {orderData.shippingCost === 0 ? 'مجاني' : `${orderData.shippingCost} ج.م`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>المبلغ المستحق:</span>
                  <span className="text-sky-800 tabular-nums">
                    {orderData.total.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              </div>
              <div className="pt-3 mt-2">
                <a
                  href={`https://wa.me/201277714100?text=${encodeURIComponent(
                    `مرحباً سنتر العسال، أستعلم عن الطلب رقم: ${orderData.orderCode}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-center rounded-xl font-medium block transition-colors"
                >
                  تواصل عبر واتساب لمتابعة الشحن
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
