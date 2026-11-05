import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { API } from '../services/api';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, shippingCost, total, clearCart } = useCart();
  const { settings, navigate } = useStore();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    governorate: 'الإسكندرية',
    city: '',
    address: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'instapay' | 'wallet'>('cod');
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">سلة المشتريات فارغة</h2>
        <p className="text-xs text-slate-500 mb-6">يرجى إضافة مفروشات إلى السلة قبل متابعة إتمام الطلب</p>
        <button
          onClick={() => navigate('products')}
          className="px-6 py-3 bg-sky-600 text-white text-xs font-semibold rounded-xl hover:bg-sky-700 transition-colors cursor-pointer"
        >
          تصفح المنتجات
        </button>
      </div>
    );
  }

  const governorates = [
    'الإسكندرية',
    'القاهرة',
    'الجيزة',
    'البحيرة',
    'الغربية',
    'الدقهلية',
    'الشرقية',
    'المنوفية',
    'القليوبية',
    'دمياط',
    'كفر الشيخ',
    'بورسعيد',
    'الإسماعيلية',
    'السويس',
    'مطروح',
    'الفيوم',
    'بني سويف',
    'المنيا',
    'أسيوط',
    'سوهاج',
    'قنا',
    'الأقصر',
    'أسوان',
    'البحر الأحمر',
    'الوادي الجديد',
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت');
        return;
      }
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg('يرجى إدخال الاسم بالكامل');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMsg('يرجى إدخال رقم هاتف صحيح (11 رقم)');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMsg('يرجى إدخال عنوان التوصيل بالتفصيل');
      return;
    }

    if ((paymentMethod === 'instapay' || paymentMethod === 'wallet') && !receiptImage) {
      setErrorMsg('يرجى إرفاق صورة إيصال أو لقطة شاشة التحويل لتأكيد الطلب');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: formData.fullName.trim(),
        customerPhone: formData.phone.trim(),
        governorate: formData.governorate,
        city: formData.city.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor,
          image:
            item.product.images && item.product.images.length > 0
              ? item.product.images[0]
              : '/src/assets/images/hero_luxury_bedding_1793871158417.jpg',
        })),
        subtotal,
        shippingCost,
        discountAmount: 0,
        total,
        paymentMethod,
        paymentReceiptUrl: receiptImage || undefined,
      };

      const result = await API.createOrder(orderPayload);
      clearCart();
      navigate('order-success', { order: result.order });
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMsg(err.message || 'حدث خطأ أثناء تسجيل الطلب، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          إتمام الطلب والشحن
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          شراء مباشر كضيف دون الحاجة لتسجيل حساب مسبق
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Customer & Shipping Details (lg: 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Form Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Truck className="w-4 h-4 text-sky-600" />
              <span>بيانات التوصيل والشحن</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  الاسم بالكامل *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد محمد علي"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-600 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  رقم الهاتف (للتواصل والتوصيل) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="مثال: 01234567890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  المحافظة *
                </label>
                <select
                  value={formData.governorate}
                  onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-600 focus:bg-white transition-colors cursor-pointer"
                >
                  {governorates.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  المنطقة / الحي *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سموحة / كرموز / المعادي"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                العنوان بالتفصيل (اسم الشارع، رقم العمارة، الشقة، علامة مميزة) *
              </label>
              <textarea
                required
                rows={2}
                placeholder="مثال: 12 شارع النصر، عمارة البركة، الدور الثالث شقة 6 بجوار مسجد السلام"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-600 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ملاحظات إضافية لمندوب الشحن (اختياري)
              </label>
              <input
                type="text"
                placeholder="مثال: يرجى الاتصال قبل الوصول بنصف ساعة أو التسليم مساءً"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Payment Method Selector Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-sky-600" />
              <span>طريقة الدفع المعتمدة</span>
            </h2>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-sky-600 bg-sky-50/50 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-sky-600 focus:ring-sky-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      الدفع عند الاستلام (نقداً)
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                      متاح في جميع المحافظات
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    ادفع نقداً لمندوب الشحن بعد استلام شحنتك والتأكد من سلامتها.
                  </p>
                </div>
              </label>

              {/* Option 2: InstaPay */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === 'instapay'
                    ? 'border-purple-600 bg-purple-50/40 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'instapay'}
                  onChange={() => setPaymentMethod('instapay')}
                  className="mt-1 text-purple-600 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      تحويل عبر InstaPay (إنستاباي)
                    </span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-medium">
                      فوري وآمن
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    تحويل بنكي فوري إلى حساب سنتر العسال عبر عنوان InstaPay أو رقم الهاتف.
                  </p>
                </div>
              </label>

              {/* InstaPay Details Sub-box */}
              {paymentMethod === 'instapay' && (
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-3 mr-6 animate-in fade-in">
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-purple-950">بيانات التحويل على InstaPay:</p>
                    <p className="text-slate-700">
                      عنوان الدفع (IPA):{' '}
                      <strong className="text-purple-900 font-mono select-all">
                        {settings?.paymentSettings.instapayHandle || 'alassal.center@instapay'}
                      </strong>
                    </p>
                    <p className="text-slate-700">
                      رقم الهاتف المسجل:{' '}
                      <strong className="text-purple-900 font-mono select-all">
                        {settings?.paymentSettings.instapayPhone || '01277714100'}
                      </strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      إرفاق صورة إيصال التحويل (سكرين شوت) *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-100 file:text-purple-800 hover:file:bg-purple-200 cursor-pointer"
                    />
                    {receiptFileName && (
                      <p className="text-[11px] text-emerald-700 font-medium mt-1">
                        ✓ تم اختيار الملف: {receiptFileName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Option 3: E-Wallets */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === 'wallet'
                    ? 'border-red-500 bg-red-50/30 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'wallet'}
                  onChange={() => setPaymentMethod('wallet')}
                  className="mt-1 text-red-600 focus:ring-red-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      المحافظ الإلكترونية (فودافون كاش / أورنج / اتصالات / وي)
                    </span>
                    <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-medium">
                      محافظ ذكية
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    تحويل مباشر على رقم محفظة المتجر ورفع إيصال التحويل لمراجعته.
                  </p>
                </div>
              </label>

              {/* Wallet Details Sub-box */}
              {paymentMethod === 'wallet' && (
                <div className="p-4 bg-red-50/60 border border-red-200 rounded-2xl space-y-3 mr-6 animate-in fade-in">
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-red-950">بيانات تحويل المحفظة الإلكترونية:</p>
                    <p className="text-slate-700">
                      رقم المحفظة:{' '}
                      <strong className="text-red-900 font-mono select-all">
                        {settings?.paymentSettings.walletNumber || '01277714100'}
                      </strong>
                    </p>
                    <p className="text-slate-700">
                      اسم المستفيد:{' '}
                      <strong>{settings?.paymentSettings.walletBeneficiary || 'سنتر العسال للمفروشات'}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      إرفاق لقطة شاشة رسالة التحويل *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-100 file:text-red-800 hover:file:bg-red-200 cursor-pointer"
                    />
                    {receiptFileName && (
                      <p className="text-[11px] text-emerald-700 font-medium mt-1">
                        ✓ تم اختيار الملف: {receiptFileName}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary & Final Submit (lg: 5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            ملخص سلة المشتريات ({cart.length})
          </h2>

          <div className="space-y-3 max-h-72 overflow-y-auto divide-y divide-slate-100">
            {cart.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      item.product.images && item.product.images.length > 0
                        ? item.product.images[0]
                        : '/src/assets/images/hero_luxury_bedding_1793871158417.jpg'
                    }
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover bg-slate-50 shrink-0"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900 line-clamp-1">{item.product.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      {item.selectedSize} · الكمية: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 tabular-nums shrink-0">
                  {(item.product.price * item.quantity).toLocaleString('ar-EG')} ج.م
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>المجموع الفرعي</span>
              <span className="font-medium text-slate-800 tabular-nums">
                {subtotal.toLocaleString('ar-EG')} ج.م
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>تكلفة الشحن والتوصيل</span>
              <span className="font-medium text-slate-800 tabular-nums">
                {shippingCost === 0 ? (
                  <span className="text-emerald-700 font-semibold">شحن مجاني</span>
                ) : (
                  `${shippingCost.toLocaleString('ar-EG')} ج.م`
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
              <span>المبلغ الإجمالي المطلوب</span>
              <span className="text-sky-800 tabular-nums">
                {total.toLocaleString('ar-EG')} جنيه مصري
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700'
            }`}
          >
            {isSubmitting ? (
              <span>جاري تسجيل الطلب وتوليد الكود...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>تأكيد الطلب الآن</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-400 text-center">
            بالضغط على تأكيد الطلب، يتم إنشاء كود فريد لطلبك وتوجيهك لصفحة الفاتورة وتتبع الشحنة.
          </p>
        </div>
      </form>
    </div>
  );
};
